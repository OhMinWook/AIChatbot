from typing import List
from urllib.request import Request

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.admin.answer.exception import ReportNotFoundException, ReportException
from src.api.admin.answer.repository import admin_answer_repository
from src.api.admin.answer.request import UpdateAnswerRequest, AnswerSearchParam
from src.api.admin.answer.response import ReportResponse, ReportDetailResponse, AnswerResponse
from src.api.admin.answer.schemas import UpdateBOAnswerSchema
from src.api.admin.auth.constants import Permission
from src.api.admin.auth.utils import permission
from src.api.chatbot.models import Chatbot
from src.api.report.models import Report
from src.api.report.repository import report_repository
from src.api.user.models import User
from src.api.vectordb.models import VectorDB
from src.core.constants import OrderBy
from src.core.database import transactional


# report table의 정보들 pagination으로 get해오기
@transactional
@permission(Permission.ANSWER.value)
async def get_all_reports(
        db: AsyncSession,
        request: Request,
        request_body: AnswerSearchParam
) -> List[ReportResponse]:
    join_models = [
        (Chatbot, Report.chatbot_id == Chatbot.id),
        (User, Chatbot.user_id == User.id),
        (VectorDB, Chatbot.vectordb_id == VectorDB.id)
    ]

    reports = await report_repository.get_all_filter_with_joins(
        db, join_models=join_models, pageable=request_body, order_by=OrderBy.DESC.value
    )

    return [ReportResponse.of(report) for report in reports]


# report table의 정보들중 delete 해오기
@transactional
@permission(Permission.ANSWER.value)
async def delete_report(
        db: AsyncSession,
        request: Request,
        id_list: str
) -> None:
    # id_list를 쉼표로 나누고 각 ID를 정수로 변환
    id_list = list(map(str.strip, id_list.split(',')))

    # 숫자가 아닌 값이 포함되어 있으면 예외 처리
    if not all(report_id.isdigit() for report_id in id_list):
        raise ReportException("id list's element is not number")

    # ID를 정수로 변환
    id_list = list(map(int, id_list))
    await report_repository.bulk_delete(db, id_list=id_list)


# report table의 정보들중 detail get해오기
@transactional
@permission(Permission.ANSWER.value)
async def get_report_detail(
        db: AsyncSession,
        request: Request,
        report_id: int,
) -> ReportDetailResponse:
    join_models = [
        (Chatbot, Report.chatbot_id == Chatbot.id),
        (User, Chatbot.user_id == User.id),
        (VectorDB, Chatbot.vectordb_id == VectorDB.id)
    ]
    filters = [Report.id == report_id]

    query_data = await report_repository.get_with_joins(
        db, join_models=join_models, filters=filters
    )
    if not query_data:
        raise ReportNotFoundException()

    return ReportDetailResponse.of(query_data[0])


@transactional
@permission(Permission.ANSWER.value)
async def get_answer(
        db: AsyncSession,
        request: Request,
        answer_id: int
) -> AnswerResponse:
    answer = await admin_answer_repository.get_by_id(db, id=answer_id)
    return AnswerResponse.of(answer)


# 답변 table update하기
@transactional
@permission(Permission.ANSWER.value)
async def update_answer(
        db: AsyncSession,
        request: Request,
        answer_id: int,
        request_body: UpdateAnswerRequest
):
    # 현재 사용자 ID 가져오기
    current_user_id = request.session.get("current_user")

    # answer_id로 Answer 데이터 조회
    answer = await admin_answer_repository.get_by_id(db, id=answer_id)

    # 업데이트된 answer를 저장
    await admin_answer_repository.update(
        db, db_obj=answer, obj_in=UpdateBOAnswerSchema.of(answer, request_body.answer_content, current_user_id)
    )
