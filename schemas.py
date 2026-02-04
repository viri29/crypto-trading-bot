from pydantic import BaseModel
from decimal import Decimal

##### anything set by the user

class PortfolioCreate(BaseModel):
    user_id: int
    base_currency: str
    is_paper_trading: bool
    initial_balance: float

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    
class TradeCreate(BaseModel):
    portfolio_id: int
    strategy_id: int | None = None
    symbol: str
    quantity: Decimal
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
    
class PositionCreate(BaseModel):
    portfolio_id: int
    symbol: str
    quantity: Decimal
    average_buy_price: Decimal
    current_value: Decimal
    
class StrategyCreate(BaseModel):
    user_id: int
    strategy_type: str
    parameters: dict | None = None
    is_active: bool = True
    
class AlertCreate(BaseModel):
    user_id: int
    symbol: str
    condition_type: str  #e.g., "price_above", "price_below"
    target_price: Decimal