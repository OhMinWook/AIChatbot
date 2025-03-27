from datetime import datetime
from decimal import Decimal
from typing import Optional

from src.api.admin.dashboard.constants import UsqtyType
from src.api.admin.dashboard.utils import preprocessing_token, embedding_token, chatbot_token
from src.api.chatbot.models import Chatbot
from src.api.preprocessing.models import Preprocessing
from src.core import utils
from src.core.schemas import OrmBase


class UsageQuantity(OrmBase):
    id: int
    usqty_type: str
    type_id: int
    crud_type: str
    question_token_cnt: Optional[int]
    answer_token_cnt: Optional[int]
    use_token_cnt: Optional[int]
    use_amount: Optional[Decimal]
    creation_id: int
    creation_dt: datetime


class CreateUsageQuantitySchema(OrmBase):
    usqty_type: str
    type_id: int
    crud_type: str
    question_token_cnt: Optional[int]
    answer_token_cnt: Optional[int]
    use_token_cnt: Optional[int]
    use_amount: Optional[Decimal]
    creation_id: int
    creation_dt: datetime

    @staticmethod
    def of_preprocessing(
            token: dict,
            preprocess: Preprocessing,
            usqty_type: str,
            crud_type: str,
            user_id: int
    ) -> "CreateUsageQuantitySchema":
        pattern = preprocess.preprocessing_pattern
        token_cnt, total_amt = preprocessing_token(token, pattern)

        return CreateUsageQuantitySchema(
            usqty_type=usqty_type,
            type_id=preprocess.id,
            crud_type=crud_type,
            question_token_cnt=None,
            answer_token_cnt=None,
            use_token_cnt=token_cnt,
            use_amount=utils.decimal_prec(total_amt),
            creation_id=user_id,
            creation_dt=utils.now()
        )

    @staticmethod
    def of_vector(
            token_cnt: int,
            vector_db_id: int,
            usqty_type: str,
            crud_type: str,
            user_id: int
    ) -> "CreateUsageQuantitySchema":
        total_amt = embedding_token(token_cnt)
        return CreateUsageQuantitySchema(
            usqty_type=usqty_type,
            type_id=vector_db_id,
            crud_type=crud_type,
            question_token_cnt=None,
            answer_token_cnt=None,
            use_token_cnt=token_cnt,
            use_amount=utils.decimal_prec(total_amt),
            creation_id=user_id,
            creation_dt=utils.now()
        )

    @staticmethod
    def of_chatbot(
            token: dict,
            chatbot: Chatbot,
            usqty_type: str,
            crud_type: str,
            user_id: int
    ) -> "CreateUsageQuantitySchema":
        token_cnt, total_amt = chatbot_token(token)
        return CreateUsageQuantitySchema(
            usqty_type=usqty_type,
            type_id=chatbot.id,
            crud_type=crud_type,
            question_token_cnt=token["prompt_tokens"],
            answer_token_cnt=token["completion_tokens"],
            use_token_cnt=token_cnt,
            use_amount=utils.decimal_prec(total_amt),
            creation_id=user_id,
            creation_dt=utils.now()
        )


class UpdateUsageQuantitySchema(OrmBase):
    pass
