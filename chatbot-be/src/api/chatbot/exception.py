from src.core.exception import BadRequestException, NotFoundException


class ChatNotFoundException(NotFoundException):
    message = "Chat id Not Found."


class RateValueException(BadRequestException):
    message = "Rate must be in 0 ~ 5 and decimal point must .0 or .5"


class ChatbotException(BadRequestException):
    def __init__(self, message):
        self.message = message
