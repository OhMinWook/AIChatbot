from src.core.exception import UnauthorizedException


class PermissionDeniedException(UnauthorizedException):
    message = "Insufficient permissions."
