## 데이터 마이그레이션

1. 마이그레이션 케이스
   1) 기존에 구성한 DB 서버가 있는 경우 </br> 
     → 데이터베이스 초기화(1. MySQL 데이터베이스 초기화) 후 데이터 마이그레이션 진행 
   2) 새로 DB 서버를 구성한 경우 </br> 
     → 휴니버스 챗봇 시스템 설치 가이드로 구성완료 후 `(1)–2. dump 파일을 운영 서버 내 원하는 경로에 저장`부터 실행
   2. 마이그레이션 파일 정보 </br>

       | 구분           | 파일 이름                | 
       |--------------|----------------------|
       | **MySQL**    | huniverse_backup_all_except_user.sql |
       | **ChromaDB** | chroma.sqlite3       |
      - **huniverse_backup_all_except_user.sql** : </br>
        huniverse 데이터베이스의 vectordb 테이블을 Dump한 파일입니다. bo_user, user, alembic_version 테이블을 유지한 상태에서 그 외 테이블 초기화 후 vectordb 테이블에 데이터를 Dump합니다.
      - **chroma.sqlite3** : </br>
        ChromaDB에 임베딩된 데이터 및 메타데이터 정보를 담고 있는 파일입니다.


### (1) MySQL 마이그레이션

1) **MySQL 데이터베이스 초기화**

   1. **MySQL 데이터베이스 컨테이너에 접속합니다.**
      
      ```bash
      C:\(원하는 경로)> docker exec -it huniverse-database bash
      bash-5.1# mysql -u huniverse -p"huniverse2024"
      ```
      이후 개발 서버에서 데이터베이스 초기화 진행 시 2번, 운영 서버에서 데이터베이스 변경 사항 적용 시 3번을 수행해주세요.

   2. **개발 서버 데이터베이스 초기화 방법**
      
      1. **huniverse 데이터베이스를 삭제 후 재생성합니다.**
         
         ```sql
         mysql> DROP DATABASE IF EXISTS huniverse;
         mysql> CREATE DATABASE huniverse;
         mysql> exit
         ```

      2. **컨테이너 쉘 세션을 종료 후 호스트 환경으로 복귀합니다.**
         
         ```bash
         bash-5.1# exit
         C:\(원하는 경로)>
         ```

      3. **Alembic을 활용해 데이터베이스 최신 버전을 적용합니다.**
         
         ```bash
         C:\(원하는 경로)> cd huniverse
         C:\(원하는 경로)\huniverse> cd server
         C:\(원하는 경로)\huniverse\server> alembic upgrade head
         ```

   3. **운영 서버 데이터베이스 변경사항 적용 방법**
      
      1. **huniverse 데이터베이스의 user 테이블 구조의 변경사항을 적용합니다.**
         
         ```sql
         mysql> USE huniverse;
         mysql> DROP INDEX `UQ_user_1` ON `user`;
         mysql> exit
   
3) **MySQL dump 파일을 운영중인 서버 내 원하는 경로에 저장 후 실행** </br>
   ```bash
   mysql -u huniverse -p"huniverse2024" huniverse < (원하는 경로)/huniverse_backup_all_except_user.sql
   ```

### (2) ChromaDB 마이그레이션
1) **chromadb.sqlite3 파일 교체** </br>
    - chroma.sqlite3 파일 vectordb 운영 중인 서버 내 `/chroma/chroma` 디렉토리의 
    `chroma.sqlite3` 파일을 새로운 `chroma.sqlite3`로 교체합니다.
    - /chroma/chroma 디렉토리의 UUID 이름으로 된 서브 폴더들을 모두 삭제합니다.
    ```bash
    root@'':/chroma/chroma# ls -al
    total ...
    drwxrwxrwx 1 root root    4096 Oct 29 01:46 .
    drwxr-xr-x 1 root root     4096 Oct 24 07:21 ..
    drwxr-xr-x 1 root root     4096 Oct 28 10:12 99131643-78fd-4b30-...
    -rw-r--r-- 1 root root 33095680 Oct 29 01:46 chroma.sqlite3
   ```
    ※ chroma.sqlite3 파일을 교체한 이후 ChromaDB 서버를 반드시 재시작하시기 바랍니다. 또한, 백엔드 서버도 재시작하시기 바랍니다.
