import math
from datetime import datetime
from decimal import Decimal, ROUND_DOWN, Context
from http import HTTPStatus

from fastapi import Request
from functools import wraps
from typing import Optional, Dict

from pytz import timezone
from starlette.responses import JSONResponse

from src.core.pagination import Pageable
from src.core.config import config
from src.core.response import ApiResponse

__DEFAULT_TIME_ZONE = 'Asia/Seoul'
__DECIMAL_POINT = Decimal('.0000000000000000001')


def set_default_timezone(date: datetime) -> datetime:
    if date.tzinfo is None:
        return timezone(__DEFAULT_TIME_ZONE).localize(date)

    return date


def convert_to_kst(date: datetime) -> datetime:
    return date.astimezone(timezone(__DEFAULT_TIME_ZONE)).replace(tzinfo=None)


def now() -> datetime:
    return datetime.now().astimezone(timezone(__DEFAULT_TIME_ZONE)).replace(tzinfo=None)


def date_format(date: datetime) -> str:
    return date.strftime("%Y-%m-%d %H:%M:%S")


def get_page_offset(pageable: Pageable) -> int:
    return (pageable.page_no - 1) * pageable.page_size


def get_page_count(page_size: int, total_count: int) -> int:
    return math.ceil(total_count / page_size)


def decimal_prec(input: Decimal) -> Decimal:
    return input.quantize(Decimal('0.000000000000000001'), rounding=ROUND_DOWN, context=Context(prec=36))


def datetime_to_unix_time(date: datetime) -> float:
    return set_default_timezone(date).timestamp()


def unix_time_to_datetime(unix_time: int) -> datetime:
    return datetime.fromtimestamp(unix_time)


def decimal_to_str(decimal: Optional[Decimal]) -> Optional[str]:
    if decimal is None:
        return None

    # Decimal('0E-18')로 표현 되는 경우 convert
    if isinstance(decimal, Decimal) and decimal == Decimal('0E-18'):
        return f"{Decimal('0'):.18f}"

    # 18 자리
    quantized_balance = decimal.quantize(__DECIMAL_POINT, rounding=ROUND_DOWN, context=Context(prec=36))

    return f"{quantized_balance:.18f}"


def ratelimit(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request: Request = kwargs.get('request') or next((arg for arg in args if isinstance(arg, Request)), None)
        if "idempotency_cache" not in request.session:
            request.session["idempotency_cache"]: Dict[str, float] = dict()

        if request.url.path.startswith(f'{config.ROOT_PATH}/admin'):
            session_cookie_name = config.ADMIN_COOKIE_NAME
        else:
            session_cookie_name = config.COOKIE_NAME

        session_id = request.cookies.get(session_cookie_name)
        cache = request.session["idempotency_cache"]
        key = f"{session_id}:{request.url.path}"

        current_time = datetime_to_unix_time(now())
        last_request_time = cache.get(key)
        if last_request_time and current_time - last_request_time < 1.0:
            return JSONResponse(
                status_code=HTTPStatus.CONFLICT,
                content=ApiResponse(
                    error=True,
                    message="요청 처리 중...",
                    data=None
                ).model_dump()
            )
        cache[key] = current_time

        response = await func(*args, **kwargs)

        return response

    return wrapper
