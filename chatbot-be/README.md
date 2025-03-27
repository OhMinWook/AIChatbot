# 휴니버스 서버

**기술 스택**

- python 3.11.0
- fastapi 0.111.0
- chromadb 0.5.4
- mariadb 11.4

## 서버 실행 방법

### 파이썬 설치

- 3.11.x 버전으로 설치
- <https://www.python.org/downloads/release/python-3110/>

```shell
python -V
# Python 3.11.x
```

### 도커 설치 및 컨테이너 생성

- <https://www.docker.com/>

```shell
 docker-compose up -d
```

### 가상 환경

```shell
python -m venv .venv

# Windows
source .venv/Scripts/activate

# MacOS
source .venv/bin/activate
```

### requirements 설치

```shell
pip install --upgrade pip
pip install -r requirements.txt
```

### .env 설정

공유드린 .env 파일을 root 경로에 생성해 주세요.

### 서버 실행

```shell
python server.py

# 2024-08-26 11:56:15.545 | INFO     | logging:callHandlers:1706 - Application startup complete.
# 2024-08-26 11:56:15.546 | INFO     | logging:callHandlers:1706 - Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

## 추가 문서

- [기능](./docs/features.md)
- [실행가이드](./docs/guide.md)
- [마이그레이션](./docs/migration.md)
