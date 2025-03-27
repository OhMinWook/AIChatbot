from typing import Optional, List

from pydantic import BaseModel

from src.api.preprocessing.models import Preprocessing
from src.api.preprocessing.schemas import Preprocessing as PreprocessingSchema
from src.api.vectordb.models import VectorDB
from src.api.vectordb.schemas import VectorDB as VectorDBSchema
from src.core import utils
from src.core.ncp_client import ncp_client


class ManualPage(BaseModel):
    id: int
    source: Optional[str]
    subject: Optional[str]
    content: str
    image_path: Optional[str]

    @classmethod
    def of(cls, manuals: List[dict]) -> List["ManualPage"]:
        response = []
        for manual in manuals:
            response.append(
                ManualPage(
                    id=manual["id"],
                    source=manual["screen_id"],
                    subject=manual["subject"],
                    content=manual["content"],
                    image_path=(
                        ncp_client.generate_presigned_get_url(manual["image_path"])
                        if manual["image_path"]
                        else None
                    ),
                )
            )
        return response


class ManualDetailResponse(BaseModel):
    manual_name: str
    page: List[ManualPage]

    @classmethod
    def of(cls, manuals: List[VectorDB]) -> "ManualDetailResponse":
        validated_vectors = [
            VectorDBSchema.model_validate(manual) for manual in manuals
        ]
        vector_dicts = [
            validated_vector.model_dump() for validated_vector in validated_vectors
        ]
        return ManualDetailResponse(
            manual_name=manuals[0].manual_name, page=ManualPage.of(vector_dicts)
        )


class PreprocessDetailResponse(BaseModel):
    manual_name: str
    page: List[ManualPage]

    @classmethod
    def of(cls, manuals: List[Preprocessing]) -> "PreprocessDetailResponse":
        validated_preprocesses = [
            PreprocessingSchema.model_validate(manual) for manual in manuals
        ]
        preprocess_dicts = [
            validated_preprocess.model_dump()
            for validated_preprocess in validated_preprocesses
        ]

        return PreprocessDetailResponse(
            manual_name=manuals[0].manual_name, page=ManualPage.of(preprocess_dicts)
        )


class ManualUrlResponse(BaseModel):
    post_url: str
    get_url: str

    @classmethod
    def of(cls, post_url: str, get_url: str) -> "ManualUrlResponse":
        return ManualUrlResponse(post_url=post_url, get_url=get_url)


class ManualInfoResponse(BaseModel):
    manual_name: str
    page_count: int

    @classmethod
    def of(cls, manual_name: str, page_count: int) -> "ManualInfoResponse":
        return ManualInfoResponse(manual_name=manual_name, page_count=page_count)


class ManualImageResponse(BaseModel):
    post_url: str
    real_path: str

    @classmethod
    def of(cls, post_url: str, real_path: str) -> "ManualImageResponse":
        return ManualImageResponse(post_url=post_url, real_path=real_path)


class ManualResponse(BaseModel):
    id: int
    screen_id: Optional[str]
    manual_name: str
    content: str
    creation_dt: float
    update_dt: float
    hash_id: str

    @classmethod
    def of(cls, manual: VectorDB) -> "ManualResponse":
        return ManualResponse(
            id=manual.id,
            screen_id=manual.screen_id,
            manual_name=manual.manual_name,
            hash_id=manual.hash_id,
            content=(
                manual.content[:100] + ("." * 10)
                if len(manual.content) >= 100
                else manual.content
            ),
            creation_dt=utils.datetime_to_unix_time(manual.creation_dt),
            update_dt=utils.datetime_to_unix_time(manual.update_dt),
        )
