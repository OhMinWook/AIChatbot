from src.core.exception import BadRequestException, NotFoundException


class InvalidDateFilter(BadRequestException):
    message = "Invalid date filter"


class InvalidDetailFilter(BadRequestException):
    message = "Invalid detail filter"


class DataNotFound(NotFoundException):
    message = "Not exist data for the requested id"
