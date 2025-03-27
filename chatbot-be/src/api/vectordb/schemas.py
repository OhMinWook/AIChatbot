from datetime import datetime
from typing import Optional
from uuid import UUID

from src.core import utils
from src.core.schemas import OrmBase


class VectorDB(OrmBase):
    id: int
    hash_id: str
    screen_id: Optional[str]
    manual_name: str
    manual_path: str
    subject: Optional[str]
    content: str
    image_path: Optional[str]
    data_status: str
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime


class CreateVectorDBSchema(OrmBase):
    id: int
    hash_id: str
    screen_id: Optional[str]
    manual_name: str
    manual_path: str
    subject: Optional[str]
    content: str
    image_path: Optional[str]
    data_status: str
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime

    @staticmethod
    def of(
            id: int,
            preprocessed_dict: dict,
            hash_id: UUID,
            manual_path: str,
            image_path: str,
            user_id: int
    ) -> "CreateVectorDBSchema":
        return CreateVectorDBSchema(
            id=id,
            hash_id=str(hash_id),
            screen_id=preprocessed_dict["source"],
            manual_name=preprocessed_dict["manual_name"],
            manual_path=manual_path,
            subject=preprocessed_dict["subject"],
            content=preprocessed_dict["content"],
            image_path=image_path,
            data_status="Y",
            creation_id=user_id,
            update_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )

    @staticmethod
    def of_add(
            new_page: dict,
            hash_id: UUID,
            manual_path: str,
            image_path: str,
            user_id: int
    ) -> "CreateVectorDBSchema":
        return CreateVectorDBSchema(
            id=new_page["id"],
            hash_id=str(hash_id),
            screen_id=new_page.get("source"),
            manual_name=new_page["manual_name"],
            manual_path=manual_path,
            subject=new_page.get("subject"),
            content=new_page["content"],
            image_path=image_path,
            data_status="Y",
            creation_id=user_id,
            update_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )


class UpdateVectorDBSchema(OrmBase):
    id: int
    screen_id: Optional[str]
    subject: Optional[str]
    content: Optional[str]
    image_path: Optional[str]
    data_status: str
    update_id: int
    update_dt: datetime

    @staticmethod
    def of(vector: dict, data_status: str, user_id: int) -> "UpdateVectorDBSchema":
        return UpdateVectorDBSchema(
            id=vector["id"],
            screen_id=vector["screen_id"],
            subject=vector["subject"],
            content=vector["content"],
            image_path=vector.get("image_path"),
            data_status=data_status,
            update_id=user_id,
            update_dt=utils.now()
        )
