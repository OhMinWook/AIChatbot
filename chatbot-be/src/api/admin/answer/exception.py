from src.core.exception import NotFoundException, BadRequestException


class ReportNotFoundException(NotFoundException):
    message = "Report Not Found"


class AnswerNotFoundException(NotFoundException):
    message = "Answer Not Found"


class ReportException(BadRequestException):
    def __init__(self, message):
        self.message = message
