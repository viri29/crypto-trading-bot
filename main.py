from fastapi import FastAPI, Depends, HTTPException
from schemas import AlertCreate, PortfolioCreate, PositionCreate, StrategyCreate, TradeCreate, UserCreate
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import SessionLocal, engine, Base
from models import User, Portfolio, Strategy, Alert, Trade, Position, Price_History
from utils import fetch_coin_price
from alert_checker import check_alerts
from auth import hash_password, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

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

#list all trades by portfolio id
@app.get("/trades")
def get_all_trades(portfolio_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Trade)
    if portfolio_id:
        query = query.filter(Trade.portfolio_id == portfolio_id)
    return db.query(Trade).all()

#list all positions by position id
@app.get("/positions")
def get_all_positions(position_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Position)
    if position_id:
        query = query.filter(Position.id == position_id)
    return query.all()

#list all strategies by strategy id
@app.get("/strategies")
def get_all_strategies(strategy_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Strategy)
    if strategy_id:
        query = query.filter(Strategy.id == strategy_id)
    return query.all()

#list all alerts
@app.get("/alerts")
def get_all_alerts(alert_id: int | None = None, db: Session = Depends(get_db)):  
    query = db.query(Alert)
    if alert_id:
        query = query.filter(Alert.id == alert_id)
    return query.all()

@app.get("/check-alerts")
def run_alert_check(db: Session = Depends(get_db)):
    triggered = check_alerts(db)
    return {"checked": True, "triggered_alerts": triggered}


#get price for a coin by symbol
@app.get("/price")
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

#accepts new user creation with password hashing
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        #hash the password before storing
        password = hash_password(user.password)
        
        db_user = User(
            email=user.email,
            username=user.username,
            password_hash=password
        ) 
        db.add(db_user) #add new user to db
        db.commit()
        db.refresh(db_user)
        return db_user #returns created user
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #find user by username
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password!")
    
    #create token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id)}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
    
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
        #fetch call to get current price
        current_price = fetch_coin_price(trade.symbol)
        if current_price is None:
            raise HTTPException(
                status_code=404, 
                detail=f"Symbol '{trade.symbol.upper()}' not recognized or price not found"
            )
        
        #calculate total value
        trade_value = trade.quantity * current_price
        
        #create trade with calculated total value
        db_trade = Trade(
            portfolio_id=trade.portfolio_id,
            strategy_id=trade.strategy_id,
            symbol=trade.symbol,
            quantity=trade.quantity,
            price=current_price,
            total_value=trade_value,
            trade_type=trade.trade_type
        )
        
        db.add(db_trade) #add new trade to db
        
        #check if a position exists for this portfolio and symbol
        position = db.query(Position).filter_by(
            portfolio_id=trade.portfolio_id, 
            symbol=trade.symbol
        ).first() 
        #if BUY trade
        if trade.trade_type == "buy":
            if position:
                #update existing position
                total_quantity = position.quantity + trade.quantity
                total_cost = (position.average_buy_price * position.quantity) + trade_value
                position.average_buy_price = total_cost / total_quantity
                position.quantity = total_quantity
                position.current_value = total_quantity * current_price
                db.add(position)
            else:
                #create new position
                new_position = Position(
                    portfolio_id=trade.portfolio_id,
                    symbol=trade.symbol,
                    quantity=trade.quantity,
                    average_buy_price=current_price,
                    current_value=trade.quantity * current_price
                )
                db.add(new_position)
        #if SELL trade
        elif trade.trade_type == "sell":
            if not position or position.quantity < trade.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail="Insufficient position quantity to execute sell trade"
                )
            #update existing position
            position.quantity -= trade.quantity
            position.current_value = position.quantity * current_price
            if position.quantity == 0:
                db.delete(position)  #remove position if quantity is zero
            else:
                db.add(position)
        
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
    