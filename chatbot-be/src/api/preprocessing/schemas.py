from datetime import datetime
from typing import Optional

from src.api.preprocessing.constants import Pattern
from src.core import utils
from src.core.prompts import pattern1, pattern1_1, pattern2
from src.core.schemas import OrmBase
from src.api.preprocessing.models import Preprocessing as PreprocessingModel


class Preprocessing(OrmBase):
    id: int
    set_id: int
    preprocessing_pattern: Optional[str]
    manual_name: str
    prompt_content: Optional[str]
    screen_id: Optional[str]
    subject: Optional[str]
    content: Optional[str]
    image_path: Optional[str]
    creation_id: int
    creation_dt: datetime
    update_dt: datetime


class CreatePreprocessingSchema(OrmBase):
    set_id: int
    preprocessing_pattern: Optional[str]
    manual_name: str
    prompt_content: Optional[str]
    screen_id: Optional[str]
    subject: Optional[str]
    content: Optional[str]
    image_path: Optional[str]
    creation_id: int
    creation_dt: datetime
    update_dt: datetime

    @staticmethod
    def of(
            preprocess: dict,
            set_id: int,
            image_path: str,
            manual_name: str,
            user_id: int
    ) -> "CreatePreprocessingSchema":
        prompt = None
        pattern = preprocess.get('pattern')

        if pattern == Pattern.PATTERN_1.value:
            prompt = pattern1
        elif pattern == Pattern.PATTERN_1_1.value:
            prompt = pattern1_1
        elif pattern == Pattern.PATTERN_2.value:
            prompt = pattern2

        return CreatePreprocessingSchema(
            set_id=set_id,
            preprocessing_pattern=pattern,
            manual_name=manual_name,
            prompt_content=prompt,
            screen_id=preprocess["source"],
            subject=preprocess["subject"],
            content=preprocess["content"],
            image_path=image_path,
            creation_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now(),
        )

    @staticmethod
    def of_add(new_page: dict, user_id: int) -> "CreatePreprocessingSchema":
        return CreatePreprocessingSchema(
            set_id=new_page["type_id"],
            preprocessing_pattern=None,
            manual_name=new_page["manual_name"],
            prompt_content=None,
            screen_id=new_page["source"],
            subject=new_page["subject"],
            content=new_page["content"],
            image_path=new_page["image_path"],
            creation_id=user_id,
            creation_dt=utils.now(),
            update_dt=utils.now()
        )


class UpdatePreprocessingSchema(OrmBase):
    id: int
    screen_id: Optional[str]
    subject: Optional[str]
    content: Optional[str]
    image_path: Optional[str]
    update_dt: datetime

    @staticmethod
    def of(preprocessing: PreprocessingModel, user_id: int) -> "UpdatePreprocessingSchema":
        return UpdatePreprocessingSchema(
            id=preprocessing.id,
            screen_id=preprocessing.screen_id,
            subject=preprocessing.subject,
            content=preprocessing.content,
            image_path=preprocessing.image_path,
            update_id=user_id,
            update_dt=utils.now()
        )
