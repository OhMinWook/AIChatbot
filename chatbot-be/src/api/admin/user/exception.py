from src.core.exception import BadRequestException, NotFoundException


class AdminException(BadRequestException):
    def __init__(self, message):
        self.message = message


class AdminNotFoundException(NotFoundException):
    message = "Admin not found"
