import random
from random import randint


def generate_phone_number():
    first = "010"
    middle = str(randint(1000, 9999))
    last = str(randint(1000, 9999))
    with_dash = f"{first}-{middle}-{last}"
    no_dash = f"{first}{middle}{last}"

    return random.choices([with_dash, no_dash])[0]


def diff_check(actual_obj, expected_obj):
    exclude_fields = {"password", "creation_dt", "update_dt"}

    # Pydantic
    if isinstance(actual_obj, dict) or hasattr(actual_obj, 'model_dump'):
        actual_dict = actual_obj.model_dump()

        # SQLAlchemy ORM -> expected_obj 값을 dict로 변환
        if hasattr(expected_obj, '__mapper__'):
            expected_dict = {attr.key: getattr(expected_obj, attr.key) for attr in expected_obj.__mapper__.attrs}
        else:
            expected_dict = expected_obj.model_dump() if hasattr(expected_obj, 'dict') else expected_obj.model_dump()

        common_fields = set(actual_dict.keys()) & set(expected_dict.keys()) - exclude_fields

        for field in common_fields:
            actual_value = actual_dict[field]
            expected_value = expected_dict[field]
            assert actual_value == expected_value, f"Field '{field}' does not match. Expected: {expected_value}, Actual: {actual_value}"

    else:
        assert actual_obj == expected_obj, f"Objects do not match. Expected: {expected_obj}, Actual: {actual_obj}"


