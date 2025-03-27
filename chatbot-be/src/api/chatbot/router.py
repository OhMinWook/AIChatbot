from typing import Optional

from fastapi import APIRouter, Request, BackgroundTasks

from src.api.chatbot import service
from src.api.chatbot.request import QuestionRequest, RateRequest
from src.api.report.request import ReportRequest
from src.core.database import db_session
from src.core.response import ApiResponse
from src.core.utils import ratelimit

chatbot = APIRouter()


@chatbot.get("")
async def get_all(
        db: db_session,
        request: Request,
        last_id: Optional[int] = 0
):
    """
    ## 대화 내역 가져 오기
    ## 무한 스크롤 방식 (요청마다 5개씩)

    ### Args:
        last_id: Optional[int] = 첫 요청일 때는 아예 값 안주셔도 되고
        나머지 요청 시에는 이전 response의 가장 작은 id 값 넣어주시면 됩니다

    ### Raises:


    ### Returns:
        status: (200, 'OK')
        data: [
            {
                "id": 1,
                "question_content": "~~",
                "answer_content": "~~",
                "screen_id": "~~",
                "hash_id_list": ["~~", ...],
                "manual_path": "~~",
                "dgstfn": "4.5"
            },
            ...
        ]
    """
    data = await service.get_all(db, request, last_id)
    return ApiResponse.of(data=data)


@chatbot.post("/answer")
@ratelimit
async def answer(
        db: db_session,
        request: Request,
        background_tasks: BackgroundTasks,
        request_body: QuestionRequest
):
    """
    ## 답변 생성에 참조한 매뉴얼 정보 반환

    ### Args:
        인자는 위의 POST /chatbot/와 동일하게 주시면 됩니다!
        question_content: str = 질문 내용
        call_path: str = user | api 둘 중 하나 값 (호출 경로 분리해야 해서 & default 값 api라서 )

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: {
            "id": 1,
            "question_content": "~~",
            "answer_content": "~~",
            "screen_id": "~~",
            "hash_id_list": ["~~", ...],
            "manual_path": "~~",
            "dgstfn": 4.5
            "date": unix time 형태 날짜..
        }
    """
    data = await service.answer(db, request, background_tasks, request_body)
    return ApiResponse.of(data=data)


@chatbot.post("/cancel")
@ratelimit
async def cancel(
        db: db_session,
        request: Request
):
    """
    ## 취소 요청

    ### Args:

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    data = await service.cancel(db, request)
    return ApiResponse.of(data=data)


@chatbot.get('/image')
async def get_image(
        db: db_session,
        request: Request,
        doc_id: str
):
    """
    ## doc_id에 해당하는 이미지의 presigned url 반환

    ### Args:
        doc_id: str
        POST /answer, GET /chatbot/ 요청의 response 중
        hash_id_list에서 사용자가 클릭한 hash_id의 값

    ### Raises:


    ### Returns:
        status: (200, 'OK')
        data: "presigned url"
    """
    data = await service.get_image(db, request, doc_id)
    return ApiResponse.of(data=data)


@chatbot.patch("/rate")
async def rate(
        db: db_session,
        request: Request,
        request_body: RateRequest
):
    """
    ## 답변 만족도 등록

    ### Args:
        id: int = 채팅 id
        dgstfn: Decimal = 0 ~ 5 사이 별점. 소숫점은 .5만 가능

    ### Raises:
        RateValueException: Rate must be in 0 ~ 5 and decimal point must .0 or .5 = 별점 범위가 이상할 때 (400, "Bad Request")
        ChatNotFoundException: Chat Id Not Found. = 잘못된 id 값 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.rate(db, request, request_body)
    return ApiResponse.of()


@chatbot.post("/report")
@ratelimit
async def report(
        db: db_session,
        request: Request,
        request_body: ReportRequest
):
    """
    ## 답변 불만족 시 report 제출

    ### Args:
        id: int = 채팅 id
        report_content: str = report 내용

    ### Raises:
        ChatNotFoundException: Chat id Not Found. = 잘못된 id 값 (404, "Not Found")
        이미 답변에 report 제출한 후 또 제출하려는 경우

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.report(db, request, request_body)
    return ApiResponse.of()
