from decimal import Decimal

from src.api.preprocessing.constants import TokenPrice


def preprocessing_token(token: dict, pattern: str) -> [int, Decimal]:
    token_cnt = token["prompt_tokens"] + token["completion_tokens"]
    if pattern == "pattern1_1":
        total_amt = (
                (TokenPrice.GPT4O_IN.value * token["prompt_tokens"])
                + (TokenPrice.GPT4O_OUT.value * token["completion_tokens"])
        )
    else:
        total_amt = (
                (TokenPrice.GPT3_5_TURBO_IN.value * token["prompt_tokens"])
                + (TokenPrice.GPT3_5_TURBO_OUT.value * token["completion_tokens"])
        )
    return token_cnt, total_amt


def embedding_token(token: int) -> Decimal:
    total_amt = (TokenPrice.TEXT_EMBEDDING_ADA_002.value * token)
    return total_amt


def chatbot_token(token: dict) -> [int, Decimal]:
    total_cnt = token["prompt_tokens"] + token["completion_tokens"]
    total_amt = (
            TokenPrice.GPT3_5_TURBO_IN.value * token["prompt_tokens"]
            + TokenPrice.GPT3_5_TURBO_OUT.value * token["completion_tokens"]
    )
    return total_cnt, total_amt
