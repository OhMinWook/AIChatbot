from src.core.custom_enum import CustomEnum


class UsqtyType(CustomEnum):
    PREPROCESSING = ("0", "Preprocessing")
    EMBEDDING = ("1", "Embedding")
    USER = ("2", "User")


class CRUDType(CustomEnum):
    INSERT = ("c", "Insert")
    UPDATE = ("u", "Update")
