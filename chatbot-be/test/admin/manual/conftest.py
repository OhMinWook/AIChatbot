import os
from contextlib import ExitStack
import random
from datetime import datetime
from decimal import Decimal
from typing import List
from unittest.mock import patch, AsyncMock

import pytest
import pytz
from factory.fuzzy import FuzzyInteger, FuzzyText, FuzzyDecimal

from chatbot.conftest import dgstfn_maker

from src.api.admin.dashboard.constants import UsqtyType, CRUDType
from src.api.admin.dashboard.models import UsageQuantity
from src.api.admin.manual.request import ManualSearchParam, CreatePreprocessRequest, \
    UpdateManualRequest
from src.api.admin.manual.response import ManualDetailResponse, PreprocessDetailResponse, ManualResponse, ManualPage, \
    ManualUrlResponse, ManualInfoResponse, ManualImageResponse
from src.api.chatbot.models import Chatbot
from src.api.preprocessing.constants import TokenPrice
from src.api.preprocessing.models import Preprocessing
from src.api.vectordb.models import VectorDB
from src.core import utils
from src.core.config import config

DATE = datetime(2024, 1, 1, tzinfo=pytz.UTC)


@pytest.fixture
def admin_manual_router():
    methods_to_patch = [
        "get_all",
        "get_one_manual",
        "get_one_preprocess",
        "create_preprocessing",
        "create_collection",
        "update_manual",
        "delete_manual"
    ]

    with ExitStack() as stack:
        mocks = [stack.enter_context(patch(f"src.api.admin.manual.router.{method}", new_callable=AsyncMock)) for method in methods_to_patch]
        yield mocks


@pytest.fixture
def admin_manual_service():
    methods_to_patch = [
        "get_all",
        "get_one_manual",
        "get_one_preprocess",
        "create_preprocessing",
        "create_collection",
        "update_manual",
        "delete_manual"
    ]

    with ExitStack() as stack:
        mocks = [stack.enter_context(patch(f"src.api.admin.manual.service.{method}", new_callable=AsyncMock)) for method in methods_to_patch]
        yield mocks


@pytest.fixture
def manual_page() -> ManualPage:
    return ManualPage(
        id=FuzzyInteger(1, 100).fuzz(),
        source=FuzzyText(length=50).fuzz(),
        subject=FuzzyText(length=50).fuzz(),
        content=FuzzyText(length=50).fuzz(),
        image_path=FuzzyText(length=50).fuzz()
    )


@pytest.fixture
def manual_search_param() -> ManualSearchParam:
    return ManualSearchParam(
        last_update_dt=None,
        last_id=0,
        page_size=FuzzyInteger(1, 100).fuzz(),
        start_dt=None,
        end_dt=None,
        screen_id=None,
        manual_name=None
    )


@pytest.fixture
def preprocess_pattern():
    pattern = "{\"exclude\": \"1~2\", \"pattern1\": \"3~5\"}"
    return pattern


@pytest.fixture
def create_preprocess_request() -> CreatePreprocessRequest:
    return CreatePreprocessRequest(
        manual_name="test_manual.pdf",
        pattern1="3~5",
        pattern1_1=None,
        pattern2=None,
        exclude="1~2"
    )


@pytest.fixture
def updated_pages():
    updated_pages = "{\"updated_pages\":[{\"id\":1,\"source\":\"string\",\"content\":\"string\"},{\"id\":2,\"source\":\"string2\",\"content\":\"string2\"}]}"
    return updated_pages


@pytest.fixture
def added_pages():
    added_pages = "{\"added_pages\":[{\"id\":0,\"source\":\"string\",\"content\":\"string\"}]}"
    return added_pages


@pytest.fixture
def manual_detail_response() -> ManualDetailResponse:
    return ManualDetailResponse(
        manual_name="manual_name.pdf",
        page=[
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            )
        ]
    )


@pytest.fixture
def preprocess_detail_response() -> PreprocessDetailResponse:
    return PreprocessDetailResponse(
        manual_name="manual_name.pdf",
        page=[
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            ),
            ManualPage(
                id=FuzzyInteger(1, 100).fuzz(),
                source=FuzzyText(length=50).fuzz(),
                subject=FuzzyText(length=50).fuzz(),
                content=FuzzyText(length=50).fuzz(),
                image_path=FuzzyText(length=50).fuzz()
            )
        ]
    )


@pytest.fixture
def manual_response() -> ManualResponse:
    return ManualResponse(
        id=FuzzyInteger(1, 100).fuzz(),
        screen_id=FuzzyText(length=50).fuzz(),
        manual_name=FuzzyText(length=50).fuzz(),
        content=FuzzyText(length=50).fuzz(),
        creation_dt=utils.datetime_to_unix_time(DATE),
        update_dt=utils.datetime_to_unix_time(DATE),
        hash_id=FuzzyText(length=32).fuzz(),
    )


@pytest.fixture
def manual_url_response() -> ManualUrlResponse:
    return ManualUrlResponse(
        post_url="test",
        get_url="test"
    )


@pytest.fixture
def manual_image_response() -> ManualImageResponse:
    return ManualImageResponse(
        post_url="http://test.com",
        real_path="http://real.com"
    )


@pytest.fixture
def manual_info_response() -> ManualInfoResponse:
    return ManualInfoResponse(
        manual_name="test_file.pdf",
        page_count=1
    )


@pytest.fixture
def preprocessing_fixture() -> Preprocessing:
    return Preprocessing(
        id=FuzzyInteger(1, 100).fuzz(),
        set_id=FuzzyInteger(1, 100).fuzz(),
        preprocessing_pattern=random.choice(["Exclude", "pattern1", "pattern1-1", "pattern2"]),
        manual_name="manual_name.pdf",
        prompt_content=FuzzyText(length=50).fuzz(),
        screen_id=FuzzyText(length=50).fuzz(),
        subject=FuzzyText(length=50).fuzz(),
        content=FuzzyText(length=50).fuzz(),
        image_path="http://test.com/png",
        creation_id=FuzzyInteger(1, 100).fuzz(),
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def vector_db_fixture() -> VectorDB:
    return VectorDB(
        id=FuzzyInteger(1, 100).fuzz(),
        hash_id="testtest",
        screen_id="source",
        manual_name="test_manual.pdf",
        manual_path="upload/test_manual/test_manual.pdf",
        subject="subject",
        content="content",
        image_path="upload/test_manual/1.png",
        data_status="Y",
        creation_id=FuzzyInteger(1, 100).fuzz(),
        update_id=FuzzyInteger(1, 100).fuzz(),
        creation_dt=DATE,
        update_dt=DATE
    )


@pytest.fixture
def chatbot_fixture() -> Chatbot:
    user = FuzzyInteger(1, 100).fuzz()
    return Chatbot(
        id=FuzzyInteger(1, 100).fuzz(),
        user_id=user,
        call_path=random.choice(["user", "api"]),
        vectordb_id=FuzzyInteger(1, 100).fuzz(),
        question_content=FuzzyText(length=50).fuzz(),
        answer_content=FuzzyText(length=50).fuzz(),
        dgstfn=Decimal(dgstfn_maker()),
        creation_id=user,
        creation_dt=DATE,
        update_id=user,
        update_dt=DATE
    )


@pytest.fixture
def usage_quantity_fixture() -> UsageQuantity:
    usqty_type = random.choice([UsqtyType.PREPROCESSING.value, UsqtyType.EMBEDDING.value, UsqtyType.USER.value])
    question_token_cnt = FuzzyInteger(1, 100).fuzz()
    answer_token_cnt = FuzzyInteger(1, 100).fuzz()
    total_amt = FuzzyDecimal(0.00000002, 0.000015).fuzz() * (question_token_cnt + answer_token_cnt)

    return UsageQuantity(
        id=FuzzyInteger(1, 100).fuzz(),
        usqty_type=usqty_type,
        type_id=FuzzyInteger(1, 100).fuzz(),
        crud_type=random.choice(["c", "u"]),
        question_token_cnt=question_token_cnt,
        answer_token_cnt=answer_token_cnt,
        use_token_cnt=question_token_cnt + answer_token_cnt,
        use_amount=utils.decimal_prec(total_amt),
        creation_id=FuzzyInteger(1, 100).fuzz(),
        creation_dt=DATE,
    )


@pytest.fixture
def preprocess_schemas() -> List[Preprocessing]:
    return [
        Preprocessing(
            id=1,
            set_id=1,
            preprocessing_pattern="pattern1",
            manual_name="test_manual.pdf",
            prompt_content="~~",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="tmp/test_manual/1.png",
            creation_id=1,
            creation_dt=DATE,
            update_dt=DATE
        ),
        Preprocessing(
            id=2,
            set_id=1,
            preprocessing_pattern="pattern1",
            manual_name="test_manual.pdf",
            prompt_content="~~",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="tmp/test_manual/2.png",
            creation_id=1,
            creation_dt=DATE,
            update_dt=DATE
        ),
        Preprocessing(
            id=3,
            set_id=1,
            preprocessing_pattern="pattern1",
            manual_name="test_manual.pdf",
            prompt_content="~~",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="tmp/test_manual/3.png",
            creation_id=1,
            creation_dt=DATE,
            update_dt=DATE
        )
    ]


@pytest.fixture
def vector_db_schemas() -> List[VectorDB]:
    return [
        VectorDB(
            id=1,
            hash_id="11111111-1111-1111-11111111",
            manual_name="test_manual.pdf",
            manual_path="upload/test_manual/test_manual.pdf",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="upload/test_manual/1.png",
            creation_id=1,
            creation_dt=DATE,
            update_id=1,
            update_dt=DATE,
            data_status="Y"
        ),
        VectorDB(
            id=2,
            hash_id="22222222-2222-2222-22222222",
            manual_name="test_manual.pdf",
            manual_path="upload/test_manual/test_manual.pdf",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="upload/test_manual/2.png",
            creation_id=1,
            creation_dt=DATE,
            update_id=1,
            update_dt=DATE,
            data_status="Y"
        ),
        VectorDB(
            id=3,
            hash_id="33333333-3333-3333-33333333",
            manual_name="test_manual.pdf",
            manual_path="upload/test_manual/test_manual.pdf",
            screen_id="~~",
            subject="~~",
            content="~~",
            image_path="upload/test_manual/3.png",
            creation_id=1,
            creation_dt=DATE,
            update_id=1,
            update_dt=DATE,
            data_status="Y"
        )
    ]


@pytest.fixture
def usage_quantity_schemas() -> List[UsageQuantity]:
    return [
        UsageQuantity(
            id=1,
            usqty_type=UsqtyType.EMBEDDING.value,
            type_id=1,
            crud_type=CRUDType.INSERT.value,
            question_token_cnt=None,
            answer_token_cnt=None,
            use_token_cnt=10,
            use_amount=utils.decimal_prec(10 * TokenPrice.TEXT_EMBEDDING_ADA_002.value),
            creation_id=1,
            creation_dt=DATE
        ),
        UsageQuantity(
            id=2,
            usqty_type=UsqtyType.EMBEDDING.value,
            type_id=2,
            crud_type=CRUDType.INSERT.value,
            question_token_cnt=None,
            answer_token_cnt=None,
            use_token_cnt=20,
            use_amount=utils.decimal_prec(20 * TokenPrice.TEXT_EMBEDDING_ADA_002.value),
            creation_id=1,
            creation_dt=DATE
        ),
        UsageQuantity(
            id=3,
            usqty_type=UsqtyType.EMBEDDING.value,
            type_id=3,
            crud_type=CRUDType.INSERT.value,
            question_token_cnt=None,
            answer_token_cnt=None,
            use_token_cnt=30,
            use_amount=utils.decimal_prec(30 * TokenPrice.TEXT_EMBEDDING_ADA_002.value),
            creation_id=1,
            creation_dt=DATE
        )
    ]


@pytest.fixture(scope='session', autouse=True)
def mock_chromadb_client():
    with patch('src.api.vectordb.utils.ChromaDBClient.get_client', new_callable=AsyncMock) as mock_get_client:
        mock_get_client.return_value = AsyncMock()
        yield
