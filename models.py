from sqlalchemy import Column, Integer, String, Float, Numeric, DateTime, ForeignKey, Boolean
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
    is_paper_trading = Column(Boolean, nullable=False)
    initial_balance = Column(Numeric(12,2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)