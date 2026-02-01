from fastapi import FastAPI, Depends, HTTPException
from schemas import AlertCreate, PortfolioCreate, PositionCreate, StrategyCreate, TradeCreate, UserCreate
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import SessionLocal, engine, Base
from models import User, Portfolio, Strategy, Alert, Trade, Position, Price_History
from utils import fetch_coin_price

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
        #query to verify DB connection
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

#list all strategies
@app.get("/strategies")
def get_all_strategies(db: Session = Depends(get_db)):
    return db.query(Strategy).all()

#list all alerts
@app.get("/alerts")
def get_all_alerts(db: Session = Depends(get_db)):  
    return db.query(Alert).all()


#get price for a coin by symbol
@app.get("/price/{symbol}")
def get_coin_price(symbol: str, vs_currency: str = "usd"):
    price = fetch_coin_price(symbol, vs_currency)
    if price is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Symbol '{symbol.upper()}' not recognized or price not found"
        )
    return {"coin": symbol.upper(), "price": price, "currency": vs_currency}
    
#multi-coin price fetch
@app.get("/prices")
def get_multiple_prices(symbols: str, vs_currency: str = "usd"):
    symbol_list = [sym.strip().upper() for sym in symbols.split(",")]
    prices = {}
    
    for symbol in symbol_list:
        price = fetch_coin_price(symbol, vs_currency)
        if price is not None:
            prices[symbol] = price
            
    if not prices:
        raise HTTPException(
            status_code=404, 
            detail="No valid symbols recognized or prices found"
        )
        
    return {"prices": prices, "currency": vs_currency}

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
    
#accepts new strategy creation
@app.post("/strategies")
def create_strategy(strategy: StrategyCreate, db: Session = Depends(get_db)):   
    try:
        db_strategy = Strategy(**strategy.dict()) #accepts new strategy object
        db.add(db_strategy) #add new strategy to db
        db.commit()
        db.refresh(db_strategy)
        return db_strategy #returns created strategy
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 
    
#accepts new alert creation
@app.post("/alerts")
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):   
    try:
        db_alert = Alert(**alert.dict()) #accepts new alert object
        db.add(db_alert) #add new alert to db
        db.commit()
        db.refresh(db_alert)
        return db_alert #returns created alert
    
    #handle potential errors
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))