from src.core.exception import DuplicateValueException


class ReportDuplicateValueException(DuplicateValueException):
    message = "Report Already Exists"
