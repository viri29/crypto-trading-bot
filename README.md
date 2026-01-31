# crypto-trading-bot
Full-stack algorithmic cryptocurrency trading bot with mobile app interface
## Tech Stack: 
- Frontend: React Native (iOS/Android mobile app)
- Backend: FastAPI (Python)
- Database: PostgreSQL + TimescaleDB
- ML: scikit-learn for fraud detection and price prediction
- Infrastructure: Docker, Redis, AWS deployment
## Key Features:
- Real-time price tracking and alerts
- Automated trading with customizable strategies (moving averages, RSI)
- Paper trading mode with fake money for testing
- ML-based fraud detection and risk assessment
- Backtesting engine for strategy validation
- Push notifications for trade execution
- Portfolio performance analytics and visualizations 

## Prerequisites
- Docker Desktop ```https://www.docker.com/products/docker-desktop```
- Python 3.10+  
- pip ```https://pip.pypa.io/en/stable/installation/```

## Docker Setup

## Setup
1. Clone repository
2. Create a Python virtual environment

macOS/Linux:
```
python3 -m venv venv
source venv/bin/activate
```
Windows PowerShell:
```
python3 -m venv venv
venv\Scripts\Activate.ps1
```
3. Install dependencies
```
pip install -r requirements.txt
```
or install manually
```
pip install fastapi uvicorn sqlalchemy "psycopg[binary]" python-dotenv
```
4. Start PostgreSQL with Docker
```
docker compose up -d
```
This starts a local Postgres database with:
	•	Database: mydb
	•	User: myuser
	•	Password: myuserpassword
	•	Port: 5432 (localhost)
5. Create a .env file in project root:
```
DB_USER=myuser
DB_PASSWORD=myuserpassword
DB_NAME=mydb
DB_HOST=localhost
DB_PORT=5432
```
(replace with your actual credentials)
6. Run the FastAPI server
```
uvicorn main:app --reload
```
	•	Open ```http://127.0.0.1:8000```￼ → test the root endpoint
	•	Open ```http://127.0.0.1:8000/docs```￼ → interactive API documentation

## Notes
	•	This setup is for local development only
	•	Credentials are configurable via .env
	•	Docker ensures the database is isolated and persistent via volumes
