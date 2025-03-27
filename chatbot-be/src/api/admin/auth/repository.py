from src.api.admin.auth.models import BoAuthMenu
from src.core.crud import CRUDBase


class AuthMenuRepository(CRUDBase[BoAuthMenu, BoAuthMenu, BoAuthMenu]):
    pass


auth_menu_repository = AuthMenuRepository(BoAuthMenu)
