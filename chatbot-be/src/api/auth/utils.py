from typing import TypeVar

from fastapi import Request
import uuid
import hashlib

from sqlalchemy.ext.asyncio import AsyncSession

from src.api.auth.request import SignInRequest
from src.api.user.exceptions import UserNotFoundException, AuthenticationFailedException

ModelType = TypeVar('ModelType')
SchemaType = TypeVar('SchemaType')
RepoType = TypeVar('RepoType')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_check = get_password_hash(plain_password)
    return password_check == hashed_password


def get_password_hash(password: str) -> str:
    encoded_password = password.encode()
    hashed_password = hashlib.sha256(encoded_password)
    hex_dig = hashed_password.hexdigest()
    return hex_dig


def create_session_id():
    session_id = uuid.uuid4()
    return str(session_id)


# 로그인 시 아이디/비밀번호 확인 및 세션에 정보 저장
async def authenticate_user(
        request_body: SignInRequest,
        repository: RepoType,
        db: AsyncSession
) -> ModelType:
    user = await repository.get_by_login_id(db=db, login_id=request_body.login_id)
    if user is None:
        raise UserNotFoundException("Wrong id")

    if not verify_password(request_body.password, user.password):
        raise AuthenticationFailedException("Wrong password")

    return user


# get_current_user 호출 시 세션 만료 연장 및 유저 반환
async def get_current_user(
        request: Request,
        repository: RepoType,
        db: AsyncSession
) -> SchemaType:
    user_id = request.session.get("user_id")
    if not user_id:
        raise AuthenticationFailedException()

    user = await repository.get_by_id(db=db, id=user_id)
    if user is None:
        raise UserNotFoundException()

    return user
