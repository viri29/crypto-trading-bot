from pydantic import BaseModel
from decimal import Decimal

class PortfolioCreate(BaseModel):
    user_id: int
    base_currency: str
    is_paper_trading: bool
    initial_balance: float

class UserCreate(BaseModel):
    email: str
    username: str
    password_hash: str
    
class TradeCreate(BaseModel):
    portfolio_id: int
    strategy_id: int | None = None
    symbol: str
    quantity: Decimal
    price: Decimal
    trade_type: str  #"buy" or "sell"
    
class TradeResponse(BaseModel):
    id: int
    portfolio_id: int
    strategy_id: int | None = None
    symbol: str
    quantity: Decimal
    price: Decimal
    total_value: Decimal
    trade_type: str  #"buy" or "sell"
    executed_at: str