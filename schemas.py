from pydantic import BaseModel

class PortfolioCreate(BaseModel):
    user_id: int
    base_currency: str
    is_paper_trading: bool
    initial_balance: float

class UserCreate(BaseModel):
    email: str
    username: str
    password_hash: str
    