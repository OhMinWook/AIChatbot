import asyncio
import logging

import openai
import wrapt

import secrets
import hashlib
import numpy as np
import json
import re

from chromadb.utils import embedding_functions
from langchain.chains.question_answering import load_qa_chain
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_core.documents import Document

from src.core.chroma_client import ChromaDBClient
from collections import defaultdict
from src.core.config import config
from src.core.exception import OpenAIRateLimitError
from src.core.prompts import instruction
from src.core.prompts import query_rewrite
from src.core.prompts import base_answer
from sklearn.metrics.pairwise import cosine_similarity

# 전역 변수 : 각 uid에 대한 메모리 관리
global_memory = {}


def get_secure_global_memory(uid):
    if not uid:
        uid = secrets.token_urlsafe(16)

    uid_str = str(uid)
    salt = "a_secret_salt_value"  # 보안을 위한 고정 salt (안전하게 관리 필요)
    secure_id = hashlib.sha256((uid_str + salt).encode("utf-8")).hexdigest()

    if secure_id not in global_memory:
        global_memory[secure_id] = ConversationBufferWindowMemory(
            k=2, return_messages=True
        )

    return global_memory[secure_id]


@wrapt.patch_function_wrapper(
    "langchain_community.chat_models", "ChatOpenAI.completion_with_retry"
)
def log_tokens(wrapped, model_kwargs, args, kwargs):
    cb_instance = kwargs.pop("instance", None)
    response = wrapped(*args, **kwargs)
    cb_instance.completion_tokens = response.usage.completion_tokens
    cb_instance.prompt_tokens = response.usage.prompt_tokens
    return response


class ChatModule:
    def __init__(self):
        self.api_key = config.OPENAI_API_KEY
        self.model = config.GPT_MODEL
        self.embeddings = OpenAIEmbeddings(openai_api_key=self.api_key)

        self.memories = {}
        self.chain_type = "stuff"

        self.client = ChromaDBClient.get_client()
        self.openai_ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key=self.api_key, model_name=config.EMBEDDING_MODEL
        )
        self.collection = self.client.get_or_create_collection(
            name=config.COLLECTION_NAME, embedding_function=self.openai_ef
        )

        self.relevant_docs = []
        self.candidates = []
        self.completion_tokens = 0
        self.prompt_tokens = 0
        self.tokens_dict = {}
        self.llm = ChatOpenAI(
            model_name=self.model,
            openai_api_key=self.api_key,
            temperature=0,
            model_kwargs={"instance": self},
        )

    def retrieve_docs(self, query, num_retrieval=config.DEFAULT_NUM_RETRIEVAL):
        similarity_dict = dict()
        results = self.collection.query(query_texts=[query], n_results=num_retrieval)

        # results['ids'][0] == []인 경우
        # -> chroma 내부에 문서가 없는 경우
        if not results["ids"][0]:
            return None

        # {hash_id: 유사도, hash_id: 유사도, ...} dictionary 생성
        for i in range(num_retrieval):
            hash_id = results["ids"][0][i]
            distance = results["distances"][0][i]
            similarity_dict[hash_id] = distance

        grouped_results = defaultdict(list)  # source별 문서를 저장할 딕셔너리 생성
        self.relevant_docs = []  # 기존 리스트 초기화

        for index, page_content in enumerate(results["documents"][0]):
            source_value = "No source"  # 기본값 설정
            if "metadatas" in results and len(results["metadatas"]) > 0:
                metadata_list = results["metadatas"][0]  # 첫 번째 리스트 가져오기
            if index < len(metadata_list):  # 인덱스 범위 체크
                source_value = metadata_list[index].get("source", "No source")

            # Document 객체 생성
            page = Document(
                page_content=f"[DOC_ID: {results['ids'][0][index]}]\n{page_content}",
                metadata={
                    "doc_id": results["ids"][0][index],
                    "source": source_value,
                },
            )
            # source별로 문서 그룹화
            grouped_results[source_value].append(page)

        # 각 그룹에서 가장 관련성이 높은 문서 선택(유사도가 높은 순으로 정렬)
        for source, docs in grouped_results.items():
            top_doc = max(docs, key=lambda x: x.metadata.get("doc_id", 0))
            self.relevant_docs.append(top_doc)

        return similarity_dict

    # 유사어 & 동의어 생성
    def generate_synonyms(self, query) -> dict:
        llm = self.llm

        prompt = (
            "당신은 한국어 전문가입니다."
            "다음 사용자의 질문에서 가장 중요한 키워드를 추출하고, 동의어 또는 유사어를 제공하세요.\n\n"
            f"문장: {query}\n\n"
            "오직 순수한 JSON 데이터만 반환하세요.\n"
            "설명이나 추가 텍스트 없이 오직 JSON 객체만 출력하세요.\n"
            "결과는 JSON 형식으로 제공되어야 합니다. 형식 예시는 다음과 같습니다:\n"
            '{"로그인": ["로그온", "접속", "인증"], "회원가입": ["가입", "계정 생성"]}\n\n'
            "주의: 설명을 추가하지 말고 JSON 데이터만 제공하세요."
        )
        try:
            response = llm.predict(prompt)
            if response is None:
                raise ValueError("GPT 응답이 Noen입니다.")

            match = re.search(r"({.*})", response, re.DOTALL)
            if match:
                json_str = match.group(1)
            else:
                raise ValueError("GPT 응답이 JSON 형식이 아닙니다.")
            generate_synonyms = json.loads(json_str)

            # print(f"GPT 생성 동의어: {generate_synonyms}")
        except Exception as e:
            print(f"GPT를 활용한 유사어 생성 실패 : {e}")
            generate_synonyms = {}

        return generate_synonyms

    # 질문 재생성
    def regenerate_question(self, query: str) -> str:
        llm = self.llm
        synonyms_dict = self.generate_synonyms(query)

        prompt = (
            "You are a professional question rewriting assistant. "
            "Rewrite the following user question and {query_rewrite} by replacing the key terms with the provided synonyms."
            f"Original question: {query}\n\n"
            f"Synonyms (JSON): {synonyms_dict}\n\n"
            "Rewritten question:"
        )

        regen_question = llm.predict(prompt)

        return regen_question

    # 문서 relevance_check
    def relevant_document(self, query, threshold: float = 0.2):
        relevant_content = []
        docs = self.relevant_docs or []
        if not docs:
            query = self.regenerate_question(query)
            docs = self.retrieve_docs(query)
            return docs

        # 문서 텍스트 리스트 생성
        docs_texts = [doc.page_content for doc in docs]

        # 문서 벡터 생성(임베딩 모델 활용)
        embedding_model = self.embeddings
        docs_texts = [doc.page_content for doc in docs]
        docs_vector = embedding_model.embed_documents(docs_texts)

        # 쿼리 벡터화
        query_vector = np.array(embedding_model.embed_query(query)).reshape(1, -1)

        # 코사인 유사도 계산
        similarities = cosine_similarity(query_vector, docs_vector)[0]

        if len(similarities) == 0:
            return []

        sorted_docs = sorted(zip(docs, similarities), key=lambda x: x[1], reverse=True)

        # 임계값 높은 문서만 필터링
        relevant_content = [doc for doc, sim in sorted_docs if sim >= threshold]

        return relevant_content

    def answer(self, query, uid):
        try:
            llm = self.llm
            memory = get_secure_global_memory(uid)

            # 이전 대화 메모리 불러오기
            past_conversation = memory.load_memory_variables({})

            context = past_conversation.get("history", "")

            # prompt + history + query
            query = f"{instruction}\n\nPrevious conversation:\n{context}\n\nUser’s question: {query}"

            relevant_content = self.relevant_document(query)

            # 관련 문서를 못찾을 시 질문 재생성
            if relevant_content == []:
                query = self.regenerate_question(query)
                docs = self.retrieve_docs(query)
                relevant_content = self.relevant_document(query)
                return relevant_content, docs

            chain = load_qa_chain(llm, chain_type=self.chain_type, memory=None)

            output = chain.run(input_documents=relevant_content, question=query)

            # 메모리에 저장하는 별도 함수 호출
            self.save_to_memory(memory, query, output)

            self.tokens_dict = {
                "completion_tokens": self.completion_tokens,
                "prompt_tokens": self.prompt_tokens,
            }

            return output, self.tokens_dict

        except asyncio.CancelledError:
            logging.error("작업이 중단되었습니다. 중단 시점까지의 내용을 반환합니다.")
            memory = self.memories.get(uid)
            if memory is None:
                memory = ConversationBufferWindowMemory(k=2, return_message=True)
            partial_output = memory.load_memory()
            self.tokens_dict = {
                "completion_tokens": self.completion_tokens,
                "prompt_tokens": self.prompt_tokens,
            }
            return partial_output, self.tokens_dict

        except openai.RateLimitError:
            raise OpenAIRateLimitError

    def save_to_memory(self, memory, query, output):
        """메모리 저장을 별도로 관리"""
        memory.save_context({"input": query}, {"output": output})
