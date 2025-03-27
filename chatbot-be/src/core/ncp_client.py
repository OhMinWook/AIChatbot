import logging
import os
import io
import random
import string
import traceback
from typing import Optional

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from src.core.config import config


class NCPClient:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            config=Config(signature_version='s3v4', s3={'addressing_style': 'virtual'}),
            endpoint_url=config.NCP_END_POINT_URL,
            aws_access_key_id=config.NCP_ACCESS_KEY,
            aws_secret_access_key=config.NCP_SECRET_KEY
        )

    def generate_presigned_get_url(
            self,
            object_path: str,
            expiration: int = 300
    ) -> str:
        try:
            file_url = self.s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    "Bucket": config.NCP_BUCKET_NAME,
                    "Key": object_path
                },
                ExpiresIn=expiration
            )
            return file_url

        except ClientError as e:
            logging.error(traceback.format_exc())

    def generate_presigned_upload_url(
            self,
            object_path: str,
            expiration: int = 300
    ) -> str:
        try:
            file_url = self.s3.generate_presigned_url(
                ClientMethod='put_object',
                Params={
                    "Bucket": config.NCP_BUCKET_NAME,
                    "Key": object_path
                },
                ExpiresIn=expiration
            )
            return file_url

        except ClientError as e:
            logging.error(traceback.format_exc())

    async def upload_file(
            self,
            image_bytes_io: io.BytesIO,
            object_path: str,
    ):
        try:
            image_bytes_io.seek(0)
            await run_in_threadpool(
                self.s3.upload_fileobj,
                image_bytes_io,
                config.NCP_BUCKET_NAME,
                object_path
            )

        except ClientError as e:
            logging.error(traceback.format_exc())

    def delete_file(self, object_path: str):
        try:
            self.s3.delete_object(Bucket=config.NCP_BUCKET_NAME, Key=object_path)

        except ClientError as e:
            logging.error(traceback.format_exc())

    def move_file_path(
            self,
            src_path: str,
            dst_path: str
    ):
        try:
            paginator = self.s3.get_paginator('list_objects_v2')

            for page in paginator.paginate(Bucket=config.NCP_BUCKET_NAME, Prefix=src_path):
                for obj in page.get('Contents', []):
                    src_key = obj['Key']
                    dst_key = src_key.replace(src_path, dst_path, 1)
                    self.s3.copy_object(
                        Bucket=config.NCP_BUCKET_NAME,
                        CopySource={
                            'Bucket': config.NCP_BUCKET_NAME,
                            'Key': src_key
                        },
                        Key=dst_key
                    )
                    self.delete_file(src_key)

        except ClientError as e:
            logging.error(traceback.format_exc())

    def is_duplicate(self, file_path: str) -> bool:
        try:
            # 버킷 내부에 file_path 이미 존재 하는 지 확인
            self.s3.head_object(Bucket=config.NCP_BUCKET_NAME, Key=file_path)

        except ClientError as e:
            # 존재하지 않을 경우 ClientError 발생
            return False

        finally:
            return True

    def generate_unique_path(self, file_path: str) -> bool:
        try:
            self.s3.head_object(Bucket=config.NCP_BUCKET_NAME, Key=file_path)
            ran_string = "".join(random.choices("".join([string.ascii_uppercase, string.digits]), k=8))
            directory, file_name = os.path.split(file_path)
            name, extension = os.path.splitext(file_name)
            new_file_path = os.path.join(directory, f"{name}{ran_string}{extension}")
            return self.generate_unique_path(new_file_path)

        except ClientError as e:
            return file_path

    def path_maker(
            self,
            prefix_url: str,
            manual_name: str,
            file_name: Optional[str] = None
    ) -> str:
        name, pdf = os.path.splitext(manual_name)
        if file_name is None:
            return f"{prefix_url}/{name}/{manual_name}"
        return f"{prefix_url}/{name}/{file_name}"

    def prefix_changer(
            self,
            file_path: str
    ) -> str:
        if file_path.startswith(config.TMP_DIR):
            return file_path.replace(config.TMP_DIR, config.SAVE_DIR, 1)

        elif file_path.startswith(config.SAVE_DIR):
            return file_path.replace(config.SAVE_DIR, config.TMP_DIR, 1)

    def bucket_cors_setting(self, cors_rules: dict):
        self.s3.put_bucket_cors(
            Bucket=config.NCP_BUCKET_NAME,
            CORSConfiguration=cors_rules
        )
        bucket_cors_info = self.s3.get_bucket_cors(
            Bucket=config.NCP_BUCKET_NAME
        )
        changed_cors_info = bucket_cors_info["CORSRules"]
        logging.info(f"Bucket CORS Changed : {changed_cors_info}")


ncp_client = NCPClient()
