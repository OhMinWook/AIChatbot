import base64
import io
import logging
from typing import Optional

from pydantic import BaseModel
import json
import fitz
import wrapt

from openai import OpenAI

from src.api.admin.manual.exception import ManualException, DuplicatePatternException
from src.api.preprocessing.constants import ChatResponseFormat, Pattern
from src.core import utils
from src.core.exception import OpenAIRateLimitError
from src.core.exponential_backoff import retry_with_exponential_backoff
from src.core.prompts import pattern1, pattern1_1, pattern2, response_prompt
from src.core.config import config


class ResponseJsonFormat(BaseModel):
    source: str
    subject: str
    content: str


def preprocess_request_parser(range_str: str):
    ranges = range_str.split(",")
    result = []
    for r in ranges:
        if "~" in r:
            start, end = map(int, r.split("~"))
            result.extend(range(start, end + 1))
        else:
            result.append(int(r))
    return result


def manual_pattern_changer(pattern: dict):
    """

    :param pattern:
        {
            "manual_name": "~~",
            "pattern1": "페이지~페이지",
            "pattern1_1": "페이지~페이지",
            "pattern2": "페이지~페이지",
            "Exclude": "페이지~페이지"
        }
    :return:
        {
            "페이지": "pattern1",
            ....
        }
    """
    result = {}
    message = []

    for pattern, range_str in pattern.items():
        if not range_str:
            continue

        keys = preprocess_request_parser(range_str)

        for key in keys:
            if key in result:
                message.append(str(key))
            result[key] = pattern

    if len(message) != 0:
        raise DuplicatePatternException(f"{','.join(message)} 페이지에 중복 패턴이 있습니다.")

    return result


def extract_text_from_region(
        page: fitz.Page,
        rect: list
):
    """
    Parameters:
    page (fitz.Page): PDF 페이지 객체
    """

    rect = fitz.Rect(rect)
    text = page.get_text("text", clip=rect)

    return text


def extract_text(page: fitz.Page, pattern: str):
    """
    Parameters:
    page (fitz.Page): PDF 페이지 객체
    pattern    (str): 페이지 패턴
    """
    source: Optional[str] = None

    if pattern == 'pattern1' or pattern == 'pattern1_1':
        source = extract_text_from_region(page, [25, 45, 700, 70])
    elif pattern == 'pattern2':
        source = extract_text_from_region(page, [0, 0, 780, 62])

    page_text = '화면 이름 : ' + source
    page_text += '\n\n'
    page_text += page.get_text()

    return page_text


def extract_image(page: fitz.Page):
    """
    Parameters:
    page (fitz.Page): PDF 페이지 객체
    """
    pix = page.get_pixmap()
    image = io.BytesIO(pix.tobytes())

    return image


# JSON_MODE로 생성한 response_json 형태 체크하는 용도
def check_response_json(response_json: dict):
    """
    Parameters
    response_json : JSON MODE로 생성한 response_json
    """
    for key in ["source", "subject", "content"]:
        if key not in response_json:
            response_json[key] = ""
    return response_json


@retry_with_exponential_backoff
def beta_chat_completions_parse_with_backoff(client, **kwargs):
    client.beta.chat.completions.parse = wrapt.FunctionWrapper(client.beta.chat.completions.parse, log_tokens)
    response = client.beta.chat.completions.parse(**kwargs)
    if isinstance(client.beta.chat.completions.parse, wrapt.FunctionWrapper):
        client.beta.chat.completions.parse = client.beta.chat.completions.parse.__wrapped__
    return response


@retry_with_exponential_backoff
def chat_completions_create_with_backoff(client, **kwargs):
    client.chat.completions.create = wrapt.FunctionWrapper(client.chat.completions.create, log_tokens)
    response = client.chat.completions.create(**kwargs)
    if isinstance(client.chat.completions.create, wrapt.FunctionWrapper):
        client.chat.completions.create = client.chat.completions.create.__wrapped__
    return response


# 토큰 계산
# @wrapt.patch_function_wrapper('openai', 'client.chat.completions.create')
# @wrapt.patch_function_wrapper('openai', 'ChatCompletion.create')
def log_tokens(wrapped, instance, args, kwargs):
    dp_instance = kwargs.pop('dp_instance', None)
    response = wrapped(*args, **kwargs)
    if kwargs.get('stream', False):
        def token_counter():
            completion_tokens = 0
            prompt_tokens = 0
            for chunk in response:
                if chunk is None:
                    break
                if len(chunk.choices) > 0:
                    yield chunk
                else:
                    completion_tokens = chunk.usage['completion_tokens']
                    prompt_tokens = chunk.usage['prompt_tokens']
                    yield chunk
            # Stream 일 경우
            dp_instance.completion_tokens = completion_tokens
            dp_instance.prompt_tokens = prompt_tokens

        return token_counter()
    else:
        # Stream 이 아닐 경우..
        completion_tokens = response.usage.completion_tokens
        prompt_tokens = response.usage.prompt_tokens
        dp_instance.completion_tokens = completion_tokens
        dp_instance.prompt_tokens = prompt_tokens
        return response


def get_completion_from_messages(
        dp_instance,
        client,
        messages: list,
        model: str,
        temperature: int = 0
):
    """
    Parameters
    client           : OpenAI API 클라이언트 인스턴스
    messages   (list): 대화 메세지 목록
    model       (str): LLM 모델 이름
    temperature (int): 출력의 무작위성 제어 변수
    """
    response_json: dict = dict()

    if model in ChatResponseFormat.STRUCTURED_OUTPUT.value:
        response = beta_chat_completions_parse_with_backoff(
            client=client,
            model=model,
            messages=messages,
            temperature=temperature,
            response_format=ResponseJsonFormat,
            dp_instance=dp_instance
        )
        response_parsed = response.choices[0].message.parsed
        response_json = {
            'source': response_parsed.source,
            'subject': response_parsed.subject,
            'content': response_parsed.content
        }

    elif model in ChatResponseFormat.JSON_MODE.value:
        response = chat_completions_create_with_backoff(
            client=client,
            model=model,
            messages=messages,
            temperature=temperature,
            response_format={"type": "json_object"},
            dp_instance=dp_instance
        )
        response_json = json.loads(response.choices[0].message.content)
        response_json = check_response_json(response_json)

    return response_json


def create_message(
        preprocessing_model: str,
        prompt: str,
        page_text: Optional[str] = None,
        page_image: Optional[bytes] = None
):
    """
    Parameters

    preprocessing_model (str):      LLM 모델 이름
    prompt              (str):      프롬프트 메세지
    page_text           (str):      pdf에서 추출한 text 데이터
    page_image          (bytes):    pdf에서 추출한 bytes 객체
    """

    message = list()

    # JSON mode 사용 시
    if preprocessing_model in ChatResponseFormat.JSON_MODE.value:
        message = [{'role': 'system', 'content': f'{response_prompt}'}]
    # Structured Output 사용 시
    elif preprocessing_model in ChatResponseFormat.STRUCTURED_OUTPUT.value:
        message = []

    content = [{'type': 'text', 'text': f'{prompt}'}]

    if page_text:
        content.append({'type': 'text', 'text': f'{page_text}'})

    if page_image:
        encoded_image = base64.b64encode(page_image.getvalue()).decode('utf-8')
        content.append({'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{encoded_image}'}})

    message.append({'role': 'user', 'content': content})

    return message


# 패턴별 데이터 전처리 함수
def preprocess_data(dp_instance, client, pattern, **kwargs):
    """
    Parameters
    client       : OpenAI API 클라이언트 인스턴스
    pattern (str): pdf 페이지 패턴
    text    (str): pdf에서 추출한 텍스트 데이터
    """
    model: str = ""
    messages: list = list()

    if pattern == Pattern.PATTERN_1.value:
        model = config.PATTERN_1_MODEL
        messages = create_message(
            preprocessing_model=model,
            prompt=pattern1,
            page_text=kwargs.get('text')
        )
    elif pattern == Pattern.PATTERN_1_1.value:
        model = config.PATTERN_1_1_MODEL
        messages = create_message(
            preprocessing_model=model,
            prompt=pattern1_1,
            page_text=kwargs.get('text'),
            page_image=kwargs.get('image')
        )
    elif pattern == Pattern.PATTERN_2.value:
        model = config.PATTERN_2_MODEL
        messages = create_message(
            preprocessing_model=model,
            prompt=pattern2,
            page_text=kwargs.get('text')
        )
    elif pattern == 'etc':
        return {}

    result = get_completion_from_messages(dp_instance, client, messages, model)

    return result


class DataPreprocess:
    def __init__(self, manual_file: bytes, pattern_dict: dict):
        self.api_key = config.OPENAI_API_KEY
        self.model = config.GPT_MODEL
        self.client = OpenAI(api_key=self.api_key)

        self.manual_file = manual_file
        self.pattern_dict = {k: v for k, v in pattern_dict.items()}

        self.text_dict = {}
        self.image_dict = {}
        self.data_dict = {}

        self.completion_tokens = 0
        self.prompt_tokens = 0
        self.tokens_dict = {}
        self.preprocess_dict = {}

    def extract(self):
        manual = fitz.open(stream=self.manual_file, filetype="pdf")
        if manual.page_count != len(self.pattern_dict.items()):
            raise ManualException("누락 되거나 파일에 없는 페이지의 패턴 값이 있습니다")

        for page_index, pattern in self.pattern_dict.items():
            page = manual[int(page_index) - 1]

            if pattern in [
                Pattern.PATTERN_1.value,
                Pattern.PATTERN_1_1.value,
                Pattern.PATTERN_2.value
            ]:
                text = extract_text(page=page, pattern=pattern)
                image = extract_image(page)
                self.text_dict[page_index] = text
                self.image_dict[page_index] = image

        manual.close()

    def preprocess_txt(self):
        try:
            result: dict = dict()

            for page_index, text in self.text_dict.items():
                now = utils.now()
                page_pattern = self.pattern_dict[page_index]

                if page_pattern in [Pattern.PATTERN_1.value, Pattern.PATTERN_2.value]:
                    result = preprocess_data(dp_instance=self, client=self.client, pattern=page_pattern, text=text)

                elif page_pattern == Pattern.PATTERN_1_1.value:
                    image = self.image_dict[page_index]
                    result = preprocess_data(dp_instance=self, client=self.client, pattern=page_pattern, text=text,
                                             image=image)

                elif page_pattern == 'etc':
                    image = self.image_dict[page_index]
                    result = preprocess_data(dp_instance=self, client=self.client, pattern=page_pattern, image=image)

                if result != {}:
                    self.tokens_dict[page_index] = {
                        'completion_tokens': self.completion_tokens,
                        'prompt_tokens': self.prompt_tokens
                    }
                    self.data_dict[page_index] = {
                        'source': result['source'],
                        'subject': result['subject'],
                        'content': result['content']
                    }
                logging.debug(f'#{page_index} page PREPROCESS DONE! {utils.now() - now}')

                self.preprocess_dict[page_index] = {
                    **self.data_dict[page_index],
                    "images": self.image_dict[page_index],
                    "pattern": self.pattern_dict[page_index]
                }

            return self.preprocess_dict, self.tokens_dict

        except OpenAIRateLimitError:
            return self.preprocess_dict, self.tokens_dict
