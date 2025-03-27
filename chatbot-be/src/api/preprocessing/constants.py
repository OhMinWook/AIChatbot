from decimal import Decimal

from src.core.custom_enum import CustomEnum


class Pattern(CustomEnum):
    EXCLUDE = ("exclude", "exclude")
    PATTERN_1 = ("pattern1", "pattern 1")
    PATTERN_1_1 = ("pattern1_1", "pattern 1-1")
    PATTERN_2 = ("pattern2", "pattern 2")


# 토큰 1개당 가격
class TokenPrice(CustomEnum):
    GPT3_5_TURBO_IN = (Decimal(0.0000015), "gpt-3.5-turbo")
    GPT3_5_TURBO_OUT = (Decimal(0.000003), "gpt-3.5-turbo")
    GPT4O_IN = (Decimal(0.0000025), "gpt-4o")
    GPT4O_OUT = (Decimal(0.0000075), "gpt-4o")
    TEXT_EMBEDDING_3_SMALL = (Decimal(0.00000001), "text-embedding-3-small")
    TEXT_EMBEDDING_3_LARGE = (Decimal(0.000000065), "text-embedding-3-large")
    TEXT_EMBEDDING_ADA_002 = (Decimal(0.000000050), "text-embedding-ada-002")


class ChatResponseFormat(CustomEnum):
    JSON_MODE = (['gpt-3.5-turbo', 'gpt-4'], "json_mode")
    STRUCTURED_OUTPUT = (['gpt-4o-mini', 'gpt-4o'], "structured_output")
