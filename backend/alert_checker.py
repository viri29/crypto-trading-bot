from sqlalchemy.orm import Session
from models import Alert
from utils import fetch_coin_price
from datetime import datetime
def check_alerts(db:Session):
    triggered_alerts = []
    
    #fetch untriggered alerts
    alerts = db.query(Alert).filter(Alert.is_triggered == False).all()
    
    for alert in alerts:
        current_price = fetch_coin_price(alert.symbol)
        if current_price is None:
            continue  #skip if price not found
        
        #check alert condition
        triggered = False
        if (alert.condition_type == "price_above" and current_price > (alert.target_price)):
            triggered = True
        elif (alert.condition_type == "price_below" and current_price < (alert.target_price)):
            triggered = True    
            
        if triggered:
            alert.is_triggered = True
            alert.triggered_at = datetime.utcnow()
            triggered_alerts.append({
                "alert_id": alert.id,
                "symbol": alert.symbol,
                "condition": alert.condition_type,
                "target_price": float(alert.target_price),
                "current_price": current_price,
            })
            
    db.commit()
    return triggered_alerts
            
        