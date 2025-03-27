import json
import logging
import os
import time
import traceback
from typing import Optional, List, Dict

import openai
import wrapt
from chromadb.utils import embedding_functions
from fastapi import UploadFile

from langchain.schema import Document
from requests import Response
from pydantic import ValidationError

from src.api.admin.manual.exception import ManualException
from src.api.admin.manual.request import PageModificationRequest
from src.core.chroma_client import ChromaDBClient
from src.core.config import config
from src.core.exception import OpenAIRateLimitError
from src.core.exponential_backoff import retry_with_exponential_backoff


@retry_with_exponential_backoff
def openai_embeddings_create_with_backoff(**kwargs):
    # message = "You have exceeded the rate limit."
    # body = '{"error": {"message": "Rate limit exceeded", "type": "rate_limit_error"}}'
    # response = Response()
    # response.status_code = 429  # HTTP 429 Too Many Requests
    # response._content = body.encode('utf-8')  # 바디 내용을 설정
    # raise openai.RateLimitError(message=message, body=body, response=response)

    return openai.embeddings.create(**kwargs)


# 이미지 수정/추가하는 경우 이미지 리스트를 받아
# 추가 이미지 dict, 수정 이미지 dict 반환
def image_list_to_dict(image_files: Optional[List[UploadFile]]) -> [dict, dict]:
    added_image_dict, updated_image_dict = dict(), dict()

    if image_files:
        for image_file in image_files:
            name, extension = os.path.splitext(image_file.filename)
            separated_name = name.split("_")
            # add_{id}_{name}.{ext}
            if image_file.filename.startswith('added_'):
                index = int(separated_name[1])
                added_image_dict[index] = {
                    "file": image_file,
                    "name": extension,
                }
            # {id}_{name}.{ext}
            else:
                index = int(separated_name[0])
                updated_image_dict[index] = {
                    "file": image_file,
                    "name": separated_name[0] + extension,
                }

    return added_image_dict, updated_image_dict


# 추가/수정 페이지 form 데이터 형식 검증 및 리스트로 변환하여 반환
def modify_and_validate_page_data(pages: Optional[str], page_key: str) -> Optional[dict]:
    if pages:
        try:
            page_json = json.loads(pages)
            page_list = page_json.get(page_key, [])

            # PageModificationRequest.model_validate: 업데이트/추가 된 페이지의 form 데이터 형식이 올바른 지 validation 체크 용
            [PageModificationRequest.model_validate(page) for page in page_list]

            page_dict = {page['id']: page for page in page_list}

            return page_dict

        # json 변환 도중 발생한 에러
        except json.JSONDecodeError as e:
            raise ManualException(str(e))

        # pydantic 모델 validate 중 발생한 에러
        except ValidationError as e:
            raise ManualException(str(e))


@wrapt.patch_function_wrapper('openai', 'embeddings.create')
def log_tokens(wrapped, instance, args, kwargs):
    response = wrapped(*args, **kwargs)
    total_tokens = response.usage.total_tokens
    logging.info(f" Wrapped : No Streaming Total tokens used : {total_tokens}")
    return response, total_tokens


class VectorDBEmbeddings:
    def __init__(self):
        self.api_key = config.OPENAI_API_KEY
        self.model = config.EMBEDDING_MODEL
        self.client = ChromaDBClient.get_client()

        self.document_dict = {}
        self.token_dict = {}

    def make_document(self, preprocessed_dict: dict):
        """
        :param preprocessed_dict:
            {
                "페이지": {
                    "source": "",
                    "subject": "",
                    "content": ""
                },
                ....
            }
        """
        self.document_dict = {}
        for hash_id, data in preprocessed_dict.items():
            page_content = '{source}\n{subject}\n{content}'.format(**data)
            doc = Document(
                page_content=page_content,
                metadata={
                    'source': data["source"],
                    'doc_id': hash_id
                }
            )
            self.document_dict[hash_id] = doc

    def embedding(self):
        try:
            self.token_dict = {}
            embedding_function = embedding_functions.OpenAIEmbeddingFunction(
                api_key=self.api_key,
                model_name=self.model
            )
            collection = self.client.get_or_create_collection(
                name=config.COLLECTION_NAME,
                embedding_function=embedding_function
            )
            for hash_id, page in self.document_dict.items():
                response, total_tokens = openai_embeddings_create_with_backoff(
                    input=page.page_content,
                    model=self.model
                )
                embedding = response.data[0].embedding
                self.token_dict[hash_id] = total_tokens
                collection.add(
                    documents=[page.page_content],
                    metadatas=[{'source': page.metadata['source'] if page.metadata['source'] else ""}],
                    ids=[str(hash_id)],
                    embeddings=[embedding]
                )

            return self.token_dict

        except Exception:
            return self.token_dict

    def upsert_collection(self):
        try:
            self.token_dict = {}
            embedding_function = embedding_functions.OpenAIEmbeddingFunction(
                api_key=self.api_key,
                model_name=self.model
            )
            collection = self.client.get_or_create_collection(
                name=config.COLLECTION_NAME,
                embedding_function=embedding_function
            )
            for hash_id, page in self.document_dict.items():
                response, total_tokens = openai_embeddings_create_with_backoff(
                    input=page.page_content,
                    model=self.model
                )
                new_embedding = response.data[0].embedding
                self.token_dict[hash_id] = total_tokens
                collection.upsert(
                    documents=[page.page_content],
                    metadatas=[{'source': page.metadata['source'] if page.metadata['source'] else ""}],
                    ids=[str(hash_id)],
                    embeddings=[new_embedding]
                )
            return self.token_dict

        except Exception:
            logging.error(traceback.format_exc())
            print(traceback.format_exc())
            return self.token_dict

    def delete_from_collection(self, hash_id_list: list):
        collection = self.client.get_collection(name=config.COLLECTION_NAME)
        collection.delete(ids=[str(hash_id) for hash_id in hash_id_list])
