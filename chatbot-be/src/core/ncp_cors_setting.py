from src.core.config import config
from src.core.ncp_client import ncp_client


# cors 설정 부분
# 설정 반영 & 변경 시 python ncp_cors_setting.py 실행 필요
def cors_configuration_set():
    cors_configuration = {
        "CORSRules": [{
            "AllowedHeaders": [
                "Content-Type",
                "Authorization",
                "Content-Length",
                "x-amz-request-id",
                "x-clv-request-id",
                "x-clv-s3-version",
                "*"
            ],
            "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
            "AllowedOrigins": [config.ORIGINS],
            "ExposeHeaders": ["ETag", "x-amz-request-id"],
            "MaxAgeSeconds": 0
        }]
    }

    ncp_client.bucket_cors_setting(cors_configuration)


if __name__ == "__main__":
    cors_configuration_set()
