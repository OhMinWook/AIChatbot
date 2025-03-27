import uvicorn

from src.core.config import config, parse_opt
from src.api.main import app


# 서버 실행 시 python server.py --env production 과 같이 실행
def run(opt):
    uvicorn.run(
        app="server:app",
        host=config.SERVER_IP,
        port=config.SERVER_PORT,
        root_path=config.ROOT_PATH
    )


if __name__ == "__main__":
    opt = parse_opt()
    run(opt)
