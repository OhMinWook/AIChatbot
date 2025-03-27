import logging
import traceback
from http import HTTPStatus
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError

from src.core.response import ApiResponse


def init_listeners(app: FastAPI) -> None:
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exception: ValueError):
        trace_log = traceback.format_exc()
        logging.error("value_error_handler: %s", trace_log)
        return ApiResponse.of_error(
            http_status=HTTPStatus.BAD_REQUEST,
            error_message="Value Error. Please check log."
        )

    @app.exception_handler(ApiBaseException)
    async def http_exception_handler(request: Request, exception: ApiBaseException):
        trace_log = traceback.format_exc()
        logging.error("exception message: %s", exception.message)
        logging.error("%s", trace_log)
        return ApiResponse.of_error(
            http_status=exception.status,
            error_message=exception.message
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        trace_log = traceback.format_exc()
        logging.error("validation_exception_handler: %s", trace_log)
        first_error = exc.errors()[0]
        error_location = ' -> '.join(map(str, first_error['loc']))
        error_message = first_error['msg']
        message = f"{error_message}. target: {error_location}"
        return ApiResponse.of_error(
            http_status=HTTPStatus.UNPROCESSABLE_ENTITY,
            error_message=message
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        trace_log = traceback.format_exc()
        logging.error("generic_exception_handler: %s", trace_log)
        return ApiResponse.of_error(
            http_status=HTTPStatus.INTERNAL_SERVER_ERROR,
            error_message="An unexpected error occurred.."
        )


class ApiBaseException(Exception):
    status = HTTPStatus.INTERNAL_SERVER_ERROR
    message = HTTPStatus.INTERNAL_SERVER_ERROR.description

    def __init__(self, message: Optional[str] = None):
        if message:
            self.message = message


class NoContentException(ApiBaseException):
    status = HTTPStatus.NO_CONTENT
    message = HTTPStatus.NO_CONTENT.description


class BadRequestException(ApiBaseException):
    status = HTTPStatus.BAD_REQUEST
    message = HTTPStatus.BAD_REQUEST.description


class NotFoundException(ApiBaseException):
    status = HTTPStatus.NOT_FOUND
    message = HTTPStatus.NOT_FOUND.description


class ForbiddenException(ApiBaseException):
    status = HTTPStatus.FORBIDDEN
    message = HTTPStatus.FORBIDDEN.description


class UnauthorizedException(ApiBaseException):
    status = HTTPStatus.UNAUTHORIZED
    message = HTTPStatus.UNAUTHORIZED.description


class UnprocessableEntity(ApiBaseException):
    status = HTTPStatus.UNPROCESSABLE_ENTITY
    message = HTTPStatus.UNPROCESSABLE_ENTITY.description


class FieldValidationException(ApiBaseException):
    status = HTTPStatus.INTERNAL_SERVER_ERROR
    message = HTTPStatus.INTERNAL_SERVER_ERROR.description


class DuplicateValueException(ApiBaseException):
    status = HTTPStatus.UNPROCESSABLE_ENTITY
    message = HTTPStatus.UNPROCESSABLE_ENTITY.description


class ServiceUnavailableException(ApiBaseException):
    status = HTTPStatus.SERVICE_UNAVAILABLE
    message = HTTPStatus.SERVICE_UNAVAILABLE.description


class NoResultFoundIndexException(ApiBaseException):
    status = HTTPStatus.INTERNAL_SERVER_ERROR
    message = "No index number was returned by the query."


class ValidationException(ApiBaseException):
    status = HTTPStatus.BAD_REQUEST
    message = ""

    def __init__(self, message):
        self.message = message


class OpenAIRateLimitError(ApiBaseException):
    status = HTTPStatus.TOO_MANY_REQUESTS
    message = "사용량이 많습니다. 잠시 후에 다시 시도해주세요."
