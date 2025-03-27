from typing import List, Optional

from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from starlette import status
from starlette.responses import JSONResponse

from src.api.admin.manual import service
from src.api.admin.manual.request import CreatePreprocessRequest, ManualSearchParam
from src.core.database import db_session
from src.core.response import ApiResponse
from src.core.utils import ratelimit

manual = APIRouter()


@manual.get("/")
async def get_all(
    db: db_session, request: Request, request_body: ManualSearchParam = Depends()
) -> JSONResponse:
    """
    ## 전체 매뉴얼 목록 paginate 하여 보여주기

    ### Args:
        page_no: int = 요청할 페이지 번호
        page_size: int = 한 번에 조회 할 매뉴얼 수, 기본 값 50개 (10/30/50/100)
        screen_id: Optional[str] = 화면(ID)로 검색
        manual_name Optional[str] = 매뉴얼 이름으로 검색
        hash_id: Option[str] = 해시 ID 검색
        start_dt, end_dt: Optional[float] = 매뉴얼 변동 일자 (unix time) 넣어주시면 됩니다

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: [
            {
                "id": 1,
                "screen_id": "~~",
                "manual_name": "00.~~pdf",
                "manual_path": "www.~~~.kr",
                "creation_dt": 1726055378,
                "update_dt": 1726055378
            },
            ...
        ]
    """
    data = await service.get_all(db, request, request_body)
    return ApiResponse.of(data=data)


@manual.get("/embedding/{manual_id}")
async def get_one_manual(db: db_session, request: Request, manual_id: int):
    """
    ## 매뉴얼 id로 상세 조회 (좌측의 source/subject/content 페이지 별로 반환)
    ## id 값은 페이지에 해당하는 id이며,
    ## 상세 조회 시 그 매뉴얼에 해당하는 전체 페이지를 스크롤 형식으로 띄워줌.
    ## 이 경우, 요청한 id가 처음으로 보여야 함

    ### Args:
        manual_id: int = 위 전체 조회 api response의 id 값 주시면 됩니다

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: {
            "manual_name": "테스트1",
            "page": [
                {
                    "id": 1,
                    "source": "테스트1-1",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                },
                {
                    "id": 2,
                    "source": "테스트1-2",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                },
                {
                    "id": 3,
                    "source": "테스트1-3",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                }
            ]
        }
    """
    data = await service.get_one_manual(db, request, manual_id)
    return ApiResponse.of(data=data)


@manual.get("/preprocess/{set_id}")
async def get_one_preprocess(db: db_session, request: Request, set_id: int):
    """
    ## /admin/manual/preprocess 요청 후 매뉴얼 등록 팝업 1의 값

    ### Args:
        set_id: int = POST /admin/manual/preprocess api response 값 주시면 됩니다

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        "data": {
            "manual_name": "테스트1",
            "page": [
                {
                    "id": 1,
                    "source": "테스트1-1",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                },
                {
                    "id": 2,
                    "source": "테스트1-2",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                },
                {
                    "id": 3,
                    "source": "테스트1-3",
                    "subject": "어쩌구저쩌구",
                    "content": "어쩌구저쩌구",
                    "image": null
                }
            ]
        }
    """
    data = await service.get_one_preprocess(db, request, set_id)
    return ApiResponse.of(data=data)


@manual.post("/preprocess")
@ratelimit
async def create_preprocessing(
    db: db_session,
    request: Request,
    pattern: str = Form(...),
    manual_file: UploadFile = File(...),
):
    """
    ## 매뉴얼 전처리 (매뉴얼 등록 1)

    ### Args:
        pattern
        현재 패턴은 1, 1_1, 2의 3종류이며, 제외 페이지는 exclude
        request 예시
        {
            "pattern1": "12, 20~23",
            "pattern1_1": "1~11",
            "pattern2": "13~14, 16~19",
            "exclude": "24~40"
        }
        manual_file: 업로드 하고자 하는 파일 객체

    ### Raises:
        DuplicateManualException: Duplicate Manual Name Not Allowed. 중복 파일 업로드한 경우 (422, Unprocessable Entity)
        ManualException: 누락 되거나 파일에 없는 페이지의 패턴 값이 있습니다. 패턴 검증 실패 경우 (400, Bad Request)

    ### Returns:
        status: (201, 'Created')
        data: 생성된 매뉴얼 set_id 반환
    """
    data = await service.create_preprocessing(db, request, pattern, manual_file)
    return ApiResponse.of(http_status=status.HTTP_201_CREATED, data=data)


@manual.post("/embedding")
@ratelimit
async def create_collection(
    db: db_session,
    request: Request,
    set_id: int,
    updated_pages: Optional[str] = Form(None),
    added_pages: Optional[str] = Form(None),
    image_files: List[UploadFile] = File([]),
):
    """
    ## 매뉴얼 전처리 완료 후 수정/저장 (매뉴얼 등록 2 팝업)

    ### Args:
        set_id: int POST /admin/manual/preprocess에서 반환한 값

        updated_pages, added_pages: Optional[str]
        아래와 같은 형태, source, subject 값이 없는 경우 ""로 보내주시나 null로 보내주시나 상관 x
        {"updated_pages":[{"id":1,"source":"string","content":"string"},{"id":2,"source":"string2","content":"string2"}]}
        added_pages의 경우 id는 추가된 것 부터 순서대로 보내주시면 됩니다
        {"added_pages": [{"id": 1, "source": "string1", "content": "string1"}, {"id": 2, "subject": "string2", "content": "string2"}, {"id": 3, "source": "string3", "subject": "string3", "content": "string3"}]}

        image_files: Optional[List[UploadFile]] 파일 리스트

    ### Raises:

    ### Returns:
        status: (201, 'Created')
        data: null
    """

    await service.create_collection(
        db, request, set_id, updated_pages, added_pages, image_files
    )
    return ApiResponse.of(http_status=status.HTTP_201_CREATED)


@manual.put("/{manual_id}")
async def update_manual(
    db: db_session,
    request: Request,
    manual_id: int,
    updated_pages: Optional[str] = Form(None),
    added_pages: Optional[str] = Form(None),
    image_files: List[UploadFile] = File([]),
):
    """
    ## 매뉴얼 개별 수정 (매뉴얼 등록 팝업 1, 2)

    ### Args:
        manual_id: int GET /admin/manual/embedding/{manual_id}의 manual_id 값

        updated_pages, added_pages: Optional[str]
        아래와 같은 형태, source, subject, content 값이 없는 경우 ""로 보내주시나 null로 보내주시나 상관 x
        {"updated_pages":[{"id":1,"source":"string","content":"string"},{"id":2,"source":"string2","content":"string2"}]}
        added_pages의 경우 id는 추가된 것 부터 순서대로 보내주시면 됩니다
        {"added_pages": [{"id": 1, "source": "string1", "content": "string1"}, {"id": 2, "subject": "string2", "content": "string2"}, {"id": 3, "source": "string3", "subject": "string3", "content": "string3"}]}

        image_files: Optional[List[UploadFile]] 파일 리스트

    ### Raises:

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.update_manual(
        db, request, manual_id, updated_pages, added_pages, image_files
    )
    return ApiResponse.of()


@manual.delete("/")
async def delete_manual(db: db_session, request: Request, id_list: str):
    """
    ## 매뉴얼 다중 삭제

    ### Args:
        id_list: str = "1, 2, 3" (리스트 [1, 2, 3]가 편하실까요? 문자열 "1, 2, 3"이 편하실까요?)

    ### Raises:
        ManualException: id list's element is not number = id_list에 숫자가 아닌 게 끼어있을 때 (400, "Bad Request")

    ### Returns:
        status: (200, 'OK')
        data: null
    """
    await service.delete_manual(db, request, id_list)
    return ApiResponse.of()


@manual.post("/only-embedding")
async def only_embedding(db: db_session, request: Request):
    await service.only_embedding(db, request)
    return ApiResponse.of()
