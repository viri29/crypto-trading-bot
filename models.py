from sqlalchemy import Column, Integer, String, Float, Numeric, DateTime, ForeignKey, Boolean, JSON, Index
from datetime import datetime
from db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    base_currency = Column(String, nullable=False)
    is_paper_trading = Column(Boolean, nullable=False, default=True)
    initial_balance = Column(Numeric(12,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Strategy(Base):
    __tablename__ = "strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    strategy_type = Column(String, nullable=False)
    parameters = Column(JSON)  #JSON string of parameters; e.g.,"short_window:10", "long_window:50"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String, nullable=False)
    condition_type = Column(String, nullable=False)  #e.g., "price_above", "price_below"
    target_price = Column(Numeric(12,2), nullable=False)
    is_triggered = Column(Boolean, default=False)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    strategy_id = Column(Integer, ForeignKey("strategies.id"))
    symbol = Column(String, nullable=False)
    quantity = Column(Numeric(20, 8), nullable=False)
    price = Column(Numeric(12,2), nullable=False)
    total_value = Column(Numeric(12,2), nullable=False)
    trade_type = Column(String, nullable=False)  #"buy" or "sell"
    executed_at = Column(DateTime, default=datetime.utcnow)
    
class Position(Base):
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String, nullable=False)
    quantity = Column(Numeric(20, 8), nullable=False)
    average_buy_price = Column(Numeric(12,2), nullable=False)
    current_value = Column(Numeric(12,2), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Price_History(Base):
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    volume = Column(Numeric(20,8), nullable=False)
    price = Column(Numeric(12,2), nullable=False)
