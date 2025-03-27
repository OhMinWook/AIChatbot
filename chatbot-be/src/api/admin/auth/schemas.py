from datetime import datetime

from src.core.schemas import OrmBase


class BoAuthMenu(OrmBase):
    id: int
    upper_menu_name: str
    lower_menu_name: str
    creation_id: int
    update_id: int
    creation_dt: datetime
    update_dt: datetime
