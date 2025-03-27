from __future__ import annotations
import argparse
import logging
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings
import os

# 현재 파일의 위치: /server/src/core이므로 root 경로로 이동
FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]


def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--env",
        type=str,
        default="",  # 기본 값
        choices=["", "develop", "production"],  # 환경 추가 시 리스트 안에 추가 필요
        help="set environments",
    )
    args, unknown = parser.parse_known_args()
    return args


opt = parse_opt()
env_file = f".env.{opt.env}"

if opt.env == "":
    env_file = ".env"

load_dotenv(dotenv_path=ROOT / env_file)


class Config(BaseSettings):
    os.environ["TZ"] = "Asia/Seoul"

    MYSQL_USER: str = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD")
    MYSQL_HOST: str = os.getenv("MYSQL_HOST")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE")

    SERVER_IP: str = os.getenv("SERVER_IP")
    SERVER_PORT: int = os.getenv("SERVER_PORT")
    ORIGINS: str = os.getenv("ORIGINS", "http://test,http://test:8000")
    ROOT_PATH: str = os.getenv("ROOT_PATH")
    DB_URL: str = f"mysql+asyncmy://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

    COOKIE_NAME: str = os.getenv("COOKIE_NAME")
    ADMIN_COOKIE_NAME: str = os.getenv("ADMIN_COOKIE_NAME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")

    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

    ENDPOINT_URL: str = "https://kr.object.ncloudstorage.com"
    REGION_NAME: str = "kr-standard"

    ENV: str = os.getenv("ENV")
    DOMAIN: str | None = os.getenv("DOMAIN")

    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME")
    CHROMA_HOST: str = os.getenv("CHROMA_HOST")
    CHROMA_PORT: str = os.getenv("CHROMA_PORT")

    MAX_AGE: int = 86400

    SAVE_DIR: str = os.getenv("SAVE_DIR")
    TMP_DIR: str = os.getenv("TMP_DIR")

    GPT_MODEL: str = os.getenv("GPT_MODEL")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL")
    PATTERN_1_MODEL: str = os.getenv("PATTERN_1_MODEL")
    PATTERN_1_1_MODEL: str = os.getenv("PATTERN_1_1_MODEL")
    PATTERN_2_MODEL: str = os.getenv("PATTERN_2_MODEL")

    NCP_END_POINT_URL: str = os.getenv("NCP_END_POINT_URL")
    NCP_ACCESS_KEY: str = os.getenv("NCP_ACCESS_KEY")
    NCP_SECRET_KEY: str = os.getenv("NCP_SECRET_KEY")
    NCP_BUCKET_NAME: str = os.getenv("NCP_BUCKET_NAME")

    DEFAULT_NUM_RETRIEVAL: int = os.getenv("DEFAULT_NUM_RETRIEVAL", 10)

    logging.info(f"Running in {ENV} environment")


config = Config()
