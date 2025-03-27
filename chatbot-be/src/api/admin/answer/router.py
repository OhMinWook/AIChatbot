from fastapi import APIRouter, Depends, Request, Query
from starlette.responses import JSONResponse

from src.api.admin.answer import service
from src.api.admin.answer.request import UpdateAnswerRequest, AnswerSearchParam
from src.core.database import db_session
from src.core.response import ApiResponse

admin_answer = APIRouter()


# report table의 정보들 pagination으로 get해오기
@admin_answer.get("")
async def get_all_reports(
        db: db_session,
        request: Request,
        request_body: AnswerSearchParam = Depends()
) -> JSONResponse:
    """
    # 날짜안넣으면 전체조회
    ## status: (200, 'OK')
    ## data : [
        {
        "report_id": 1,
        "question_content": "로그인 어떻게 해?",
        "answer_content": "로그인을 하려면 먼저 화면에 나타난 사번과 비밀번호란에 각각 사용자의 사번과 비밀번호를 입력해야 합니다. 그리고 \"LOGIN\" 버튼을 클릭하면 시스템에 인증이 됩니다.",
        "report_content": "이건",
        "creation_dt": 1727265550
      },
      ###...
     ### parameter 로 start_dt와 end_dt 있고 unix_time으로 입력가능
      ### report_content 통해서 검색가능
    ]
    """
    data = await service.get_all_reports(db, request, request_body)
    return ApiResponse.of(data=data)


# report table의 정보들중 delete 해오기
@admin_answer.delete("/report")
async def delete_report(
        db: db_session,
        request: Request,
        report_id: str = Query(..., description="Comma separated report IDs to delete")
) -> JSONResponse:
    """
        # report 다중 삭제
        ## status: (200, 'OK')
        ## parameter : report_id (1,3 이렇게 입력해도 되고  1 이렇게 입력해도 됩니다.)
         ### Returns:
        ### status: (200, 'OK')
        ### data: null
    ### Raises:
        ### ReportException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request")
    """
    await service.delete_report(db, request, report_id)
    return ApiResponse.of()


# report table의 정보들중 detail get해오기
@admin_answer.get("/report/{report_id}")
async def get_report_detail(
        db: db_session,
        request: Request,
        report_id: int,
) -> JSONResponse:
    """
        ## 관리자 report 상세 조회

        ### Args:
            report_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다

        ### Raises:
            ReportNotFoundException: Report not found = 가져오려는 report no이 (404, "Not Found")

        ### Returns:
            status: (200, 'OK')
            data: {
                "report_id": 1,
                "question_content": "로그인 어떻게 해?",
                "answer_content": "로그인을 하려면 먼저 화면에 나타난 사번과 비밀번호란에 각각 사용자의 사번과 비밀번호를 입력해야 합니다. 그리고 \"LOGIN\" 버튼을 클릭하면 시스템에 인증이 됩니다.",
                "report_content": "이건",
                "creation_dt": 1727265550,
                "user_id": 1,
                "screen_id": null,
                "manual_name": null,
                "manual_path": null,
                "type_id": null
            }
        """
    data = await service.get_report_detail(db, request, report_id)
    return ApiResponse.of(data=data)


@admin_answer.get('/{answer_id}')
async def get_answer(
        db: db_session,
        request: Request,
        answer_id: int
):
    """
           ## 관리자 답변 조회

           ### Args:
               answer_id: int = 반드시 1입니다.

           ### Raises:
               AnswerNotFoundException: Report not found = 가져오려는 answer이 없을때 발생-사실 이경우는 발생할수 없습니다. (404, "Not Found")

           ### Returns:
               status: (200, 'OK')
               data: {
                    "answer_id": 1,
                    "answer_content": "Updated answer content"
               }
           """
    data = await service.get_answer(db, request, answer_id)
    return ApiResponse.of(data=data)


# 답변 table update하기
@admin_answer.patch('/{answer_id}')
async def update_answer(
        db: db_session,
        request: Request,
        answer_id: int,
        request_body: UpdateAnswerRequest
):
    """
           ## 관리자 답변 update

           ### Args:
               answer_id: int = 반드시 1입니다.

           ### Request_body:
               answer_content: "Updated answer content"

           ### Returns:
               status: (200, 'OK')
               data: {}
       """
    await service.update_answer(db, request, answer_id, request_body)
    return ApiResponse.of()
