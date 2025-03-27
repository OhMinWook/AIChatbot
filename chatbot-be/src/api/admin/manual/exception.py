from src.core.exception import NotFoundException, BadRequestException, DuplicateValueException


class NotFoundManualException(NotFoundException):
    message = "Manual Not Found"


class DuplicateManualException(DuplicateValueException):
    message = "Duplicate Manual Name Not Allowed"


class DuplicatePatternException(DuplicateValueException):
    def __init__(self, message):
        self.message = message


class ManualException(BadRequestException):
    def __init__(self, message):
        self.message = message
