from enum import Enum

from src.core.response import EnumResponse
from src.core.exception import ValidationException


class CustomEnum(Enum):

    def __new__(cls, value, display_name):
        obj = object.__new__(cls)
        obj._value_ = value
        obj.display_name = display_name
        return obj

    @classmethod
    def value_of(cls, value):
        """주어진 값에 해당하는 Enum 멤버를 반환한다."""
        for member in cls:
            if member.value == value:
                return member
        raise ValidationException(f"{value} is not a valid value for {cls.__name__}")

    @classmethod
    def to_list_response(cls):
        """
        Enum의 모든 멤버를 EnumResponse 리스트로 변환하여 반환한다.
        front 에 전달할 때는 key, value를 반대로 준다.
        """
        return [member.to_response() for member in cls]

    def to_response(self):
        """
        Enum의 모든 멤버를 EnumResponse 리스트로 변환하여 반환한다.
        front 에 전달할 때는 key, value를 반대로 준다.
        """
        return EnumResponse(key=self.value, value=self.name, display_name=self.display_name)

    @classmethod
    def check_contain(cls, value, exception):
        """주어진 값이 존재하지 않는다면 exception을 반환한다.."""
        for member in cls:
            if member.value == value:
                return
        raise exception
