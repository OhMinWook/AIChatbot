from fastapi import APIRouter, Depends, Request
from starlette.responses import JSONResponse

from src.api.admin.user import service
from src.api.admin.user.request import CreateAdminRequest, UpdateAdminRequest, CreateUserRequest, UpdateUserRequest
from src.core.database import db_session
from src.core.pagination import Pageable
from src.core.response import ApiResponse
from src.core.utils import ratelimit

admin_user = APIRouter()


@admin_user.get('/')
async def get_all_admin(
        db: db_session,
        request: Request,
        request_body: Pageable = Depends()
) -> JSONResponse:
    """
    ## 전체 관리자 목록 paginate 하여 보여주기

    ### Args:
        page_no: int = 요청할 페이지 번호
        page_size: int = 한 번에 조회 할 관리자 수, 기본 값 50개 (10/30/50/100)
        start_dt, end_dt: Optional[float] = 이 api는 일자 필터가 없어서 아예 안보내주셔도 됩니다

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: [
            {
                "id": 1,
                "name": "현빈",
                "dept_name": "경영지원",
                "tel_no": "010-3333-5555",
                "login_id": "Asdfwww",
                "auth_menu_list": "최고 관리자",
                "creation_dt": 1726055378
            },
            ...
        ]
    """
    data = await service.get_all_admin(db, request, request_body)
    return ApiResponse.of(data=data)


@admin_user.get('/detail/{admin_id}')
async def get_admin_detail(
        db: db_session,
        request: Request,
        admin_id: int,
) -> JSONResponse:
    """
    ## 관리자 상세 조회

    ### Args:
        admin_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다

    ### Raises:
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: {
                "id": 1,
                "name": "현빈",
                "dept_name": "경영지원",
                "tel_no": "010-3333-5555",
                "login_id": "Asdfwww",
                "auth_menu_list": "최고 관리자"
        }
    """
    data = await service.get_admin_detail(db, request, admin_id)
    return ApiResponse.of(data=data)


@admin_user.post('/')
@ratelimit
async def create_admin(
        db: db_session,
        request: Request,
        request_body: CreateAdminRequest
) -> JSONResponse:
    """
    ## 관리자 등록

    ### Args:
        name: str
        dept_name: str
        tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.)
        login_id: str
        password: str
        password_check: str (비밀번호 확인)
        auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이)

    ### Raises:
        AdminException: User already exists = 아이디가 이미 있는 경우 (400, "Bad Request")
        AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request")
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.create_admin(db, request, request_body)
    return ApiResponse.of()


@admin_user.patch('/')
async def update_admin(
        db: db_session,
        request: Request,
        request_body: UpdateAdminRequest
) -> JSONResponse:
    """
    ## 관리자 수정 (변경되지 않는 필드는 request에 주시는 건가요?)

    ### Args:
        id: int (detail 조회에 쓴 id)
        name: str
        dept_name: str
        tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.)
        login_id: str
        password: str
        password_check: str (비밀번호 확인)
        auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이)

    ### Raises:
        AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request")
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.update_admin(db, request, request_body)
    return ApiResponse.of()


@admin_user.delete('/')
async def delete_admin(
        db: db_session,
        request: Request,
        id_list: str
) -> JSONResponse:
    """
    ## 관리자 삭제

    ### Args:
        id_list: str = "1, 2, 3" (리스트 [1, 2, 3]가 편하실까요? 문자열 "1, 2, 3"이 편하실까요?)

    ### Raises:
        AdminException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.delete_admin(db, request, id_list)
    return ApiResponse.of()


@admin_user.get('/member')
async def get_all_user(
        db: db_session,
        request: Request,
        request_body: Pageable = Depends()
) -> JSONResponse:
    """
    ## 전체 관리자 목록 paginate 하여 보여주기

    ### Args:
        page_no: int = 요청할 페이지 번호
        page_size: int = 한 번에 조회 할 관리자 수, 기본 값 50개 (10/30/50/100)
        start_dt, end_dt: Optional[float] = 이 api는 일자 필터가 없어서 아예 안보내주셔도 됩니다

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: [
            {
                "id": 1,
                "name": "현빈",
                "dept_name": "경영지원",
                "tel_no": "010-3333-5555",
                "login_id": "Asdfwww",
                "auth_menu_list": "최고 관리자",
                "creation_dt": 1726055378
            },
            ...
        ]
    """
    data = await service.get_all_user(db, request, request_body)
    return ApiResponse.of(data=data)


@admin_user.get('/member/detail/{user_id}')
async def get_user_detail(
        db: db_session,
        request: Request,
        user_id: int,
) -> JSONResponse:
    """
    ## 관리자 상세 조회

    ### Args:
        admin_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다

    ### Raises:
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: {
                "id": 1,
                "name": "현빈",
                "dept_name": "경영지원",
                "tel_no": "010-3333-5555",
                "login_id": "Asdfwww",
                "auth_menu_list": "최고 관리자"
        }
    """
    data = await service.get_user_detail(db, request, user_id)
    return ApiResponse.of(data=data)


@admin_user.post('/member')
@ratelimit
async def create_user(
        db: db_session,
        request: Request,
        request_body: CreateUserRequest
) -> JSONResponse:
    """
    ## 관리자 등록

    ### Args:
        name: str
        dept_name: str
        tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.)
        login_id: str
        password: str
        password_check: str (비밀번호 확인)
        auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이)

    ### Raises:
        AdminException: User already exists = 아이디가 이미 있는 경우 (400, "Bad Request")
        AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request")
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.create_user(db, request, request_body)
    return ApiResponse.of()


@admin_user.patch('/member')
async def update_user(
        db: db_session,
        request: Request,
        request_body: UpdateUserRequest
) -> JSONResponse:
    """
    ## 관리자 수정 (변경되지 않는 필드는 request에 주시는 건가요?)

    ### Args:
        id: int (detail 조회에 쓴 id)
        name: str
        dept_name: str
        tel_no: str (010-3333-3333 or 01033335555로 보내주시면 됩니다.)
        login_id: str
        password: str
        password_check: str (비밀번호 확인)
        auth_menu_list: str (1, 2, 3 or 1,2,3 띄어쓰기 구분 상관 없이)

    ### Raises:
        AdminException: Password mismatch = 비밀번호 확인 안맞을 때 (400, "Bad Request")
        AdminNotFoundException: Admin not found = 업데이트 하려는 아이디가 없을 때 (404, "Not Found")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.update_user(db, request, request_body)
    return ApiResponse.of()


@admin_user.delete('/member')
async def delete_user(
        db: db_session,
        request: Request,
        id_list: str
) -> JSONResponse:
    """
    ## 관리자 삭제

    ### Args:
        id_list: str = "1, 2, 3" (리스트 [1, 2, 3]가 편하실까요? 문자열 "1, 2, 3"이 편하실까요?)

    ### Raises:
        AdminException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.delete_user(db, request, id_list)
    return ApiResponse.of()
