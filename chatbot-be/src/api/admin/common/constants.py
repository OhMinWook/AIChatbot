from src.core.custom_enum import CustomEnum


class ManualSearch(CustomEnum):
    SCREEN_ID = ("screen_id", "화면 (ID)")
    MANUAL_NAME = ("manual_name", "매뉴얼 이름")


class AnswerSearch(CustomEnum):
    REPORT_CONTENT = ("report_content", "내용")
