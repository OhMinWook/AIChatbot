from loguru import logger
import logging


class InterceptHandler(logging.Handler):
    loglevel_mapping = {
        50: 'CRITICAL',
        40: 'ERROR',
        30: 'WARNING',
        20: 'INFO',
        10: 'DEBUG',
        5: 'TRACE',
        0: 'NOSET',
    }

    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except AttributeError:
            level = self.loglevel_mapping[record.levelno]

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        message = record.getMessage().replace("<", "\<").replace(">", "\>")

        logger.opt(
            depth=depth,
            colors=True,
            exception=record.exc_info
        ).log(level, message)


def log_config():
    logger_list = [
        'uvicorn',
        'uvicorn.access',
        'uvicorn.error',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.h11_impl',
        'fastapi'
    ]
    # 루트 로거 설정
    root_logger = logging.getLogger()
    if not any(isinstance(h, InterceptHandler) for h in root_logger.handlers):
        handler = InterceptHandler()
        root_logger.handlers.clear()
        root_logger.addHandler(handler)
    root_logger.propagate = False

    for _log in logger_list:
        _logger = logging.getLogger(_log)

        if not any(isinstance(h, InterceptHandler) for h in _logger.handlers):
            handler = InterceptHandler()
            _logger.handlers.clear()
            _logger.addHandler(handler)
        _logger.propagate = False
