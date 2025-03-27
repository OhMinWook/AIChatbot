from fastapi import APIRouter, Request, Depends
from starlette.responses import JSONResponse

from src.api.admin.dashboard import service
from src.api.admin.dashboard.request import AdminUseSummarySearchParam, UserUseSummarySearchParam
from src.core.database import db_session
from src.core.pagination import Pageable
from src.core.response import ApiResponse

use_dashboard = APIRouter()


@use_dashboard.get("/user")
async def get_user_all_use(
        db: db_session,
        request: Request,
        params: Pageable = Depends()
) -> JSONResponse:
    """
        ## 일반 사용자 챗봇 사용량 히스토리

        ### Args:
            page_no: int = 요청할 페이지 번호
            page_size: int = 한 번에 조회 할 매뉴얼 수, 기본 값 50개 (10/30/50/100)
            start_dt, end_dt: float= 조회할 사용일자(unixtime)

        ### Returns:
            "data": {
                "response": [
                  {
                    "use_id": 1,
                    "hospital": "위데이터랩",
                    "username": "user1",
                    "call_path": "화면",
                    "use_token_cnt": 20,
                    "use_amount": "0.500000000000000000",
                    "question": "질문 내용입니다",  # 최대 100자만 가져옵니다
                    "answer": "답변 내용입니다", # 최대 100자만 가져옵니다
                    "satisfaction_rate": "3.5",
                    "creation_dt": 1724029200
                  },
                  ...
                ],
                "total_pages": 1,
                "page_size": 10,
                "current_page_no": 1
    """
    data = await service.get_user_all_use(db, request, params)
    return ApiResponse.of(data=data)


@use_dashboard.get("/user/summary")
async def get_user_use_summary(
        db: db_session,
        request: Request,
        params: UserUseSummarySearchParam = Depends()
) -> JSONResponse:
    """
        ## 일반 사용자 챗봇 사용량 통계

        ### Args
            date_filter: Optional[str] = 날짜 필터 조건 -> 종류: all(default)/year/month/day
            detail_filter: Optional[str] = 상세 필터 조건 -> 종류: all(default)/hospital/call_path
            start_dt, end_dt: float =  조회할 사용일자(unix time)

        ### Returns
              "data": {
                    "response": [
                      {
                        "detail": "화면",
                        "total_token_cnt": 20,
                        "total_use_amount": "0.500000000000000000",
                        "date": "2024.07"
                      },
                      ...
                    ],
                    "total_pages": 1,
                    "page_size": 50,
                    "current_page_no": 1
              }

    """

    data = await service.get_user_use_summary(db, request, params)
    return ApiResponse.of(data=data)


@use_dashboard.get("/user/{use_id}")
async def get_user_use(
        db: db_session,
        request: Request,
        use_id: int
) -> JSONResponse:
    """
        ## 일반 사용자 챗봇 사용 상세

        ### Args:
            use_id: int = 상세 조회할 사용 번호

        ### Returns:
            "data": {
                "use_id": 6,
                "hospital": "서울대병원",
                "username": "user1",
                "call_path": "api",
                "use_token_cnt": 20,
                "use_amount": "0.500000000000000000",
                "question": "질문6",
                "answer": "답변6",
                "satisfaction_rate": "5",
                "creation_dt": 1726621200
              }

    """
    data = await service.get_user_use(db, request, use_id)
    return ApiResponse.of(data=data)


@use_dashboard.get("/admin")
async def get_admin_all_use(
        db: db_session,
        request: Request,
        params: Pageable = Depends()
) -> JSONResponse:
    """
        ## 관리자 사용량 데이터 전체 조회

        ### Args
            start_dt, end_dt: float= 사용 일자(unix time)

        ### Returns
            "response": [
              {
                "use_id": 1,
                "admin_name": "Jenny",
                "use_type": "1",
                "screen_id": "screen1",
                "manual_name": "manual1",
                "use_token_cnt": 20,
                "use_amount": "0.500000000000000000",
                "creation_dt": 1726707600
              },
                ...
            ],
            "total_pages": 1,
            "page_size": 50,
            "current_page_no": 1
    """
    data = await service.get_admin_all_use(db, request, params)
    return ApiResponse.of(data)


@use_dashboard.get("/admin/summary")
async def get_admin_use_summary(
        db: db_session,
        request: Request,
        params: AdminUseSummarySearchParam = Depends()
) -> JSONResponse:
    """
        ## 관리자 사용량 통계

        ### Args
            date_filter: Optional[str] = 날짜 필터 조건 -> 종류: all(default)/year/month/day
            detail_filter: Optional[str] = 상세 필터 조건 -> 종류: all(default)/admin/type
            start_dt, end_dt: float =  조회할 사용 일자(unix time)

        ### Returns
              "data": {
                "response": [
                  {
                    "detail": "전처리",
                    "total_token_cnt": 80,
                    "total_use_amount": "2.000000000000000000",
                    "date": "2020.07 - 2024.09"
                  },
                  {
                    "detail": "임베딩",
                    "total_token_cnt": 40,
                    "total_use_amount": "1.000000000000000000",
                    "date": "2020.07 - 2024.09"
                  }
                ],
                "total_pages": 1,
                "page_size": 50,
                "current_page_no": 1
              }
    """
    data = await service.get_admin_use_summary(db=db, request=request, params=params)

    return ApiResponse.of(data=data)
