from src.core.exception import NotFoundException, UnauthorizedException


class UserNotFoundException(NotFoundException):
    message = 'User not found'


class AuthenticationFailedException(UnauthorizedException):
    message = 'Authentication failed'
