from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from src.core import utils


def get_detail_type(detail: Optional[str]):
    detail_mappings = {
        "user": "화면",
        "api": "api",
        "0": "전처리",
        "1": "임베딩"
    }
    if detail is not None:
        return detail_mappings.get(detail, detail)
    else:
        return "-"


class UserUseDetailResponse(BaseModel):
    use_id: int
    hospital: Optional[str]
    username: Optional[str]
    call_path: str
    use_token_cnt: Optional[int]
    use_amount: Optional[str]
    question: str
    answer: Optional[str]
    creation_dt: float

    @classmethod
    def of(cls, data: dict) -> "UserUseResponse":
        usage_quantity = data["UsageQuantity"]
        chatbot = data["Chatbot"]
        user = data["User"]

        return UserUseResponse(
            use_id=usage_quantity.id,
            hospital=user.hospital_name if user else None,
            username=user.name if user else None,
            call_path=chatbot.call_path if chatbot.call_path == "api" else "화면",
            use_token_cnt=usage_quantity.use_token_cnt,
            use_amount=utils.decimal_to_str(usage_quantity.use_amount),
            question=chatbot.question_content,
            answer=chatbot.answer_content,
            satisfaction_rate=str(chatbot.dgstfn) if chatbot.dgstfn else None,
            creation_dt=utils.datetime_to_unix_time(usage_quantity.creation_dt)
        )


class UserUseResponse(UserUseDetailResponse):
    satisfaction_rate: Optional[str]

    @classmethod
    def of(cls, data: dict) -> "UserUseResponse":
        usage_quantity = data["UsageQuantity"]
        chatbot = data["Chatbot"]
        user = data["User"]
        question = chatbot.question_content
        answer = chatbot.answer_content

        return UserUseResponse(
            use_id=usage_quantity.id,
            hospital=user.hospital_name if user else None,
            username=user.name if user else None,
            call_path=chatbot.call_path if chatbot.call_path == "api" else "화면",
            use_token_cnt=usage_quantity.use_token_cnt,
            use_amount=utils.decimal_to_str(usage_quantity.use_amount),
            question=question[:100] if question and len(question) > 100 else question,
            answer=answer[:100] if answer is not None and len(answer) > 100 else answer,
            satisfaction_rate=str(chatbot.dgstfn) if chatbot.dgstfn else None,
            creation_dt=utils.datetime_to_unix_time(usage_quantity.creation_dt)
        )


class AdminUseResponse(BaseModel):
    use_id: int
    admin_name: Optional[str]
    use_type: str
    screen_id: Optional[str]
    manual_name: Optional[str]
    use_token_cnt: Optional[int]
    use_amount: Optional[str]
    creation_dt: float

    @classmethod
    def of(cls, data: dict) -> "AdminUseResponse":
        return AdminUseResponse(
            use_id=data["id"],
            admin_name=data.get("name"),
            use_type=get_detail_type(data["usqty_type"]),
            screen_id=data.get("screen_id"),
            manual_name=data.get("manual_name"),
            use_token_cnt=data["use_token_cnt"],
            use_amount=utils.decimal_to_str(data.get("use_amount", Decimal(0))),
            creation_dt=utils.datetime_to_unix_time(data["creation_dt"])
        )


class UseSummaryResponse(BaseModel):
    detail: Optional[str]
    total_token_cnt: Optional[int]
    total_use_amount: Optional[str]
    date: str

    @classmethod
    def of(cls, start_dt: datetime, end_dt: datetime, data: dict) -> "UseSummaryResponse":
        start_dt = f"{start_dt.year}.{start_dt.month:02d}"
        end_dt = f"{end_dt.year}.{end_dt.month:02d}"

        return UseSummaryResponse(
            detail=get_detail_type(data["detail"] if data["detail"] is not None else None),
            total_token_cnt=data["total_token_cnt"] if data["total_token_cnt"] is not None else None,
            total_use_amount=utils.decimal_to_str(data["total_use_amount"])
            if data["total_use_amount"] is not None
            else utils.decimal_to_str(Decimal(0)),
            date=start_dt + " - " + end_dt if data["date"] == "-" else data["date"]
        )
