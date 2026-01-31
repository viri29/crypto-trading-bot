from fastapi import FastAPI, Depends, HTTPException
from schemas import PortfolioCreate, PositionCreate, TradeCreate, UserCreate
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import SessionLocal, engine, Base
from models import User, Portfolio, Strategy, Alert, Trade, Position, Price_History

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Crypto Trading Bot API")

#dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#health check endpoint to test DB connection
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try a simple query to verify DB connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

######### API GET Endpoints #########

#root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Crypto Trading Bot API"}
    
#list all users
@app.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

#list all portfolios
@app.get("/portfolios")
def get_all_portfolios(db: Session = Depends(get_db)):
    return db.query(Portfolio).all()

#list all trades
@app.get("/trades")
def get_all_trades(db: Session = Depends(get_db)):
    return db.query(Trade).all()

#list all positions
@app.get("/positions")
def get_all_positions(db: Session = Depends(get_db)):
    return db.query(Position).all()

######### API POST Endpoints #########

#accepts new user creation
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = User(**user.dict()) #accepts new user object
        db.add(db_user) #add new user to db
        db.commit()
        db.refresh(db_user)
        return db_user #returns created user
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
#accepts new portfolio creation
@app.post("/portfolios")
def create_portfolio(portfolio: PortfolioCreate, db: Session = Depends(get_db)):
    try:
        db_portfolio = Portfolio(**portfolio.dict()) #accepts new portfolio object
        db.add(db_portfolio) #add new portfolio to db
        db.commit()
        db.refresh(db_portfolio)
        return db_portfolio #returns created portfolio
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))    
    
#accepts new trade creation
@app.post("/trades")
def create_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    try:
        #calculate total value
        trade_value = trade.quantity * trade.price
        
        #create trade with calculated total value
        db_trade = Trade(
            portfolio_id=trade.portfolio_id,
            strategy_id=trade.strategy_id,
            symbol=trade.symbol,
            quantity=trade.quantity,
            price=trade.price,
            total_value=trade_value,
            trade_type=trade.trade_type
        )
        
        db.add(db_trade) #add new trade to db
        db.commit()
        db.refresh(db_trade)
        return db_trade #returns created trade
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

#accepts new position creation
@app.post("/positions")
def create_position(position: PositionCreate, db: Session = Depends(get_db)):
    try:
        db_position = Position(**position.dict()) #accepts new position object
        db.add(db_position) #add new position to db
        db.commit()
        db.refresh(db_position)
        return db_position #returns created position
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))