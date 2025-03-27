#
# Builder
#
FROM python:3.11-slim AS builder

# 필요한 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    libgfortran5 \
    libopenblas-dev

ENV HOME=/root
ENV APP=${HOME}/application

WORKDIR ${APP}

# Python 패키지 설치
COPY ./requirements* ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 소스 코드 복사
COPY . .

#
# Deployer
#
FROM python:3.11-slim AS deployer

# 런타임에 필요한 라이브러리만 설치
RUN apt-get update && apt-get install -y \
    libgfortran5 \
    libopenblas-dev

ENV HOME=/root
ENV APP=${HOME}/application

# Python 패키지 및 실행 파일 복사
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 애플리케이션 코드 복사
COPY --from=builder ${APP} ${APP}

WORKDIR ${APP}

CMD ["python", "server.py"]