from fastapi import APIRouter

from src.api.admin.auth.constants import Permission
from src.api.admin.common.constants import ManualSearch, AnswerSearch
from src.core.response import ApiResponse

common = APIRouter()


@common.get('/auth')
async def auth_menu():
    data = Permission.to_list_response()
    return ApiResponse.of(data[1:])


@common.get('/manual')
async def manual_search():
    return ApiResponse.of(data=ManualSearch.to_list_response())


@common.get('/answer')
async def manual_search():
    return ApiResponse.of(data=AnswerSearch.to_list_response())
