# AIChatbot

# 기획

### 사용자

* 챗봇
  * 사용자 질문 시 가장 유사도 높은 데이터를 불러와 답변 생성, 원본 매뉴얼 정보 반환 (질문/답변 1 세트가 chatbot에 row 1개)
  * 기존의 Vector 검색 뿐만 아니라 문서의 Title 이나 SubTitle의 metadata를 활용한 키워드 검색을 추가하여 RAG의 검색을 강화(하이브리드 검색 이후 유사도를 재계산하여 재정렬 후 답변 도출)
  * 사용자 질문 시 유사도가 너무 낮거나 유사하지 않은 답변을 도출할 경우 사용자 질문의 키워드의 유사어 및 동의어를 생성하여 질문을 재생성하여 기존의 과정을 재실행
  * 만족도 입력 시 그 대화에 해당하는 chatbot row에 update
  * 불만족 리포트 작성 시 report 테이블에 정보 insert
  * 이전 대화 기록은 스크롤 방식으로 5개씩 불러옴
    * 이전 대화 기록에서 삭제된 manual 답변인 경우, 팝업

### 관리자

* 관리자 메뉴
  * 관리자 조회, 등록 및 수정, 삭제 가능
  * 로그인 id는 변경 불가


* 매뉴얼
  * 매뉴얼 파일 업로드 (파일 이름 중복 허용 x)
  * 제외 페이지, 패턴 등 입력 후 preprocessing 테이블에 insert
    * 이미지는 ncp 클라우드에 업로드 후 링크 반환
    * 사용량은 $ 기준, 환율은 https://openai.com/api/pricing/ 참고하여 계산
  * 전처리 된 데이터 중 추가/수정 사항이 있을 경우 
    * 이미지는 ncp 클라우드에 추가/교체 후 링크 반환
    * 추가/수정 사항 반영하여 vectordb 테이블에 insert 및 임베딩 (preprocessing 테이블은 건드리지 않음)
  * 업로드 된 매뉴얼(vectordb) 수정 시 이미지/화면id/주제/내용 개별 수정 및 즉시 mysql, chroma db에 반영 되어야 함
  * 매뉴얼 삭제 시 data 삭제 및 임베딩 제거
  

* 답변 관리
  * 챗봇에서 사용자가 보낸 불만족 답변 조회, 삭제 답변에 사용된 매뉴얼 조회 기능
  * 답변 설정/수정 기능


* 사용량 대시보드
  * 회원 + 특정 기준 별 토큰 사용량 조회 및 토큰 사용 history
  * 매뉴얼 전처리/임베딩 + 날짜 기준 별 토큰 사용량 조회 및 토큰 사용 history


### 기술 스택
  * Backend
    *  python 3.11.0
    *  fastapi 0.111.0
    *  chromadb 0.5.4
    *  mariadb 11.4
  * Frontend
    *  next.js 14.2.5
    *  node 18.17.x

### 환경 구성 정보

| 구성                | 버전 정보      |
| ------------------- | -------------- |
| **OS**              | Windows 11     |
| **Server**          | Python 3.11    |
| **Web**             | Node.js 22     |
| **Database**        | MySQL 8.0      |
| **Vector Database** | ChromaDB 0.5.4 |
| **Proxy**           | Nginx 1.27     |



# 프로젝트 구조 설명

---
## 전체 설명

- `/src/core`는 애플리케이션 전반에서 사용 되는 설정, 데이터베이스 연결, 예외 처리, 유틸리티 등을 정의
- `/src/api`는 각 도메인별로 필요한 모델, 스키마, 서비스, 라우터 등을 정의
- 새로운 도메인을 추가할 때는 `api` 디렉터리 내에 해당 도메인의 폴더를 만들고, 위의 구조에 따라 파일들을 작성

---

## 추가 설명

- **Pydantic 모델(=Pydantic 스키마)**
  - Pydantic은 FastAPI에서 데이터 형식 검증 및 데이터 직렬화(예: 파이썬 객체를 JSON 형식 등으로 변환)에 주로 쓰이는 라이브러리
  - BaseModel을 상속 받는 클래스를 작성하여, 요청 형식 검증 등을 위한 pydantic 모델(=스키마)를 생성


- **FastAPI 기본 구조**
  - FastAPI 공식 문서에서는 도메인 중심이 아닌 기능 중심(routes, models)으로 프로젝트 구조를 안내 
    <br>관련 링크: https://fastapi.tiangolo.com/tutorial/bigger-applications/#another-module-with-apirouter
  - 위의 구조는 단순한 구조일때 적합하다 판단하여, 각 도메인별로 코드를 분리하는 DDD(Domain-Driven Design) 구조를 적용

---

## 프로젝트 전체 구조

- **`/alembic`**: alembic(데이터베이스 형상 관리용 툴) 관련 설정용 디렉토리
- **`/src`**: 소스 코드 디렉토리
  - **`/src/api`**: 각 기능별(도메인별) 코드 및 로직용 디렉토리
  - **`/src/core`**: 애플리케이션 전체에서 공통적으로 사용되는 기능 및 설정용 디렉토리
- **`/test`**: 테스트 코드 디렉토리

---

### **`/src/core` 디렉터리 상세 설명**
#### core 디렉토리에서는 애플리케이션 전반에 쓰이는 설정 및 도메인 공통적으로 쓰이는 코드를 관리
#### 기본 클래스(검증용 pydantic 모델, 데이터베이스 작업 관련 기본 클래스)들을 정의하여, 각 도메인별로 확장하여 사용

- **`config.py`**
  - 애플리케이션의 설정 및 환경 변수를 관리
  - 예: 데이터베이스 연결 정보, API 키 등


- **`constants.py`**
  - 애플리케이션 전반에서 사용되는 상수 값과 열거형(Enum)을 정의


- **`crud.py`**
  - 기본적인 데이터 처리(Create, Read, Update, Delete) 작업을 위한 클래스를 정의
  - 각 도메인별로 해당 클래스를 확장하여 사용


- **`custom_enum.py`**
  - 기본적인 Enum 클래스의 기능을 확장
  - 예: 필요 형식에 맞는 Enum 멤버 반환 함수


- **`custom_logger.py`**
  - 애플리케이션의 로깅 관리
  - 예: 로그 레벨, 핸들러 등


- **`database.py`**
  - 데이터베이스 연결 및 세션 관리


- **`exception.py`**
  - 기본적인 예외(Exception) 및 예외 핸들러를 정의
  - 도메인별로 이 클래스를 확장하여 사용


- **`model.py`**
  - RDBMS 연결을 위한 기본적인 ORM 모델 클래스를 정의. 
  - 각 도메인별로 이 클래스를 확장하여 모델을 정의


- **`pagination.py`**
  - 페이징 요청 형식 정의(pydantic) 
  - 유효성 검사에 사용되며, 도메인별로 이 모델을 확장하여 사용


- **`response.py`**
  - 기본적인 응답 형식 정의(pydantic)
  - 유효성 검사에 사용되며, 도메인에 상관 없이 클라이언트에게 반환할 응답의 최종 구조 설정
  - 도메인별로 해당 클래스를 import하여 바로 사용함


- **`utils.py`**
  - 애플리케이션 전체에서 공통적으로 사용되는 유틸리티 함수 정의
  - 예: 날짜 변환, decimal 형식 처리 등 


- **기타 파일**

  - **`chroma_client.py`**
    - chroma 데이터베이스 연결 관리
    
  - **`ncp_client.py`**
    - Naver Cloud Platform(NCP) 서비스와의 연동을 위한 기능 관리
    
  - **`ncp_cors_setting.py`**
    - Naver Cloud Platform(NCP) 관련 cors 에러 방지용 설정 파일
    - client 측에서 presigned url을 통하여 Naver Cloud Platform(NCP)에 업로드 시.env에 설정되어있는 origin을 등록하여 접근 허용
    
  - **`prompts.py`**
    - 프롬프트 관리
  
  - **`schemas.py`**
    - 공통으로 사용되는 Pydantic 스키마 정의
    - 도메인별로 확장하여 사용

---

### **`/src/api` 디렉터리 상세 설명**
#### 각 기능(도메인)별 코드와 로직을 구분하여 관리 --> 각 도메인은 아래와 같은 파일들을 독립적으로 가짐
#### 해당 도메인에서만 사용되는 기능이나 데이터에 대해서는 core와 별도로 관리(ex. utils.py, constants.py)


- **`constants.py`**
  - 해당 도메인에서 사용되는 상수 값과 열거형(Enum)을 정의


- **`models.py`**
  - RDBMS 맵핑(ORM)을 위한 해당 도메인의 데이터베이스 모델(테이블)을 정의
  - core의 model.py 내의 클래스 확장하여 사용
  - 예: 테이블 컬럼별 정보


- **`request.py`**
  - 해당 도메인의 요청 형식을 정의
  - 클라이언트로부터 받는 데이터의 구조와 유효성 검사를 위한 Pydantic 모델 정의.
  - 페이징이 필요한 요청의 경우 core의 pagination.py 내의 클래스를 확장하여 사용 


- **`response.py`**
  - 해당 도메인의 데이터 응답 형식을 정의
  

- **`schemas.py`**
  - 요청 및 응답 형식 이외의 데이터 유효성 검사를 위한 Pydantic 모델 정의
  - 도메인 특화적으로 사용되는 데이터 구조나 유효성 검사가 필요한 형식을 정의
  - 예: 데이터 생성 형식, 데이터 수정 형식


- **`exception.py`**
  - 해당 도메인에서 발생할 수 있는 예외 정의
  - core의 exception.py 내부의 예외를 확장하여 사용


- **`router.py`**
  - 해당 도메인의 API 경로를 정의
  - 예: 엔드포인트의 URL별 처리 함수


- **`service.py`**
  - 비즈니스 로직 처리


- **`repository.py`**
  - 데이터베이스 접근 로직을 처리합니다.
  - 예: 데이터의 저장, 조회, 수정, 삭제 등의 작업 기능


- **`utils.py`**
  - 해당 도메인의 유틸리티 함수를 정의
  - 예: 도메인 내에서만 반복적으로 사용되는 함수

---


## 디렉터리 구조 요약

```
project/
├── alembic/
│   ├── ...
├── src/
│   ├── api/
│   │  └── chatbot/
│   │       ├── constants.py
│   │       ├── exception.py
│   │       ├── models.py
│   │       ├── repository.py
│   │       ├── request.py
│   │       ├── response.py
│   │       ├── router.py
│   │       ├── schemas.py
│   │       ├── service.py
│   │       └── utils.py
│   │   └── admin/
│   │   └──  ...
│   ├── core/
│   │   ├── chroma_client.py
│   │   ├── config.py
│   │   ├── constants.py
│   │   ├── crud.py
│   │   ├── custom_enum.py
│   │   ├── custom_logger.py
│   │   ├── database.py
│   │   ├── exception.py
│   │   ├── model.py
│   │   ├── ncp_client.py
│   │   ├── ncp_cors_setting.py
│   │   ├── pagination.py
│   │   ├── prompts.py
│   │   ├── response.py
│   │   ├── schemas.py
│   │   └── utils.py
├── test/

