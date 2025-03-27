from src.core.custom_enum import CustomEnum


class Permission(CustomEnum):
    SUPER_ADMIN = (1, "최고 관리자")
    MANUAL = (2, "매뉴얼 관리")
    ANSWER = (3, "답변 관리")
    TokenDashboard = (4, "사용량 대시보드")
