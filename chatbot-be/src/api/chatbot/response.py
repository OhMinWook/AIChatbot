from typing import Optional

from pydantic import BaseModel

from src.core import utils
from src.core.ncp_client import ncp_client


class ChatbotResponse(BaseModel):
    id: int
    question_content: str
    answer_content: Optional[str]
    hash_id_list: list
    dgstfn: Optional[str]
    is_report_exist: bool
    date: float

    @classmethod
    def of(cls, results: list) -> "ChatbotResponse":
        hash_id_list = []
        first = results[0]
        chatbot = first["Chatbot"]
        report = first.get("Report")

        for result in results:
            vector = result.get("VectorDB")
            if vector and vector.hash_id and vector.image_path:
                hash_id_list.append(vector.hash_id)

        return ChatbotResponse(
            id=chatbot.id,
            question_content=chatbot.question_content,
            answer_content=chatbot.answer_content,
            hash_id_list=hash_id_list,
            is_report_exist=True if report else False,
            dgstfn=utils.decimal_to_str(chatbot.dgstfn)
            if chatbot.dgstfn else None,
            date=utils.datetime_to_unix_time(chatbot.creation_dt),
        )
