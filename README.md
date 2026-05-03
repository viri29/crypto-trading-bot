# Cryptocurrency Paper Trading Mobile App

A full-stack mobile application that enables users to practice cryptocurrency trading with virtual funds, featuring real-time price data, portfolio tracking, and trade execution without financial risk.

## Project Goals

This project serves as a comprehensive portfolio piece demonstrating full-stack development skills across mobile frontend, backend API design, cloud deployment, and database architecture. The current MVP provides core trading functionality with plans to expand into automated trading strategies and backtesting capabilities.

### Current Features
- User authentication with JWT tokens and secure password hashing
- Real-time cryptocurrency price fetching from CoinGecko API
- Manual trade execution (buy/sell) for BTC, ETH, and XRP
- Automated position tracking with weighted average cost basis calculation
- Portfolio analytics showing total value, profit/loss, and percentage change
- Trade history with chronological display
- Price alerts system (storage implemented, notification system pending)
- 7-day historical price charts
- Pull-to-refresh functionality on portfolio and history screens

### Future Enhancements
- **Automated Trading Strategies**: Implement moving average crossover and RSI-based strategies that execute trades automatically based on market conditions
- **Backtesting Engine**: Allow users to test trading strategies against historical data to evaluate performance before deploying with virtual funds
- **Expanded Asset Support**: Add more cryptocurrencies beyond the current three
- **Advanced Portfolio Analytics**: Multi-timeframe performance graphs, risk metrics, and comparative analysis
- **Push Notifications**: Real-time alerts when price targets are hit or trades are executed
- **Strategy Marketplace**: Share and discover trading strategies with other users
- **WebSocket Integration**: Replace polling with real-time price streaming for live market updates

## Tech Stack

### Frontend
- **React Native** with **TypeScript** (Expo framework)
- **React Navigation** for screen routing
- **AsyncStorage** for secure local token storage
- **react-native-chart-kit** and **react-native-svg** for price visualization

### Backend
- **Python FastAPI** - REST API framework
- **SQLAlchemy** - ORM for database interactions
- **PostgreSQL** - Relational database
- **JWT (python-jose)** - Token-based authentication
- **bcrypt** - Password hashing
- **Requests** - External API calls to CoinGecko

### Cloud Infrastructure
- **AWS EC2** (t3.micro) - Backend application server
- **AWS RDS** (db.t3.micro PostgreSQL) - Managed database
- **systemd** - Service management for 24/7 uptime
- **Elastic IP** - Static IP addressing

### External APIs
- **CoinGecko API** (free tier) - Real-time and historical cryptocurrency pricing

## Database Schema

Seven normalized tables with composite indexes for query optimization:

- **users** - Authentication and user accounts
- **portfolios** - Virtual trading portfolios with initial balances
- **trades** - All executed transactions (composite index on `portfolio_id`, `executed_at`)
- **positions** - Current cryptocurrency holdings with average cost basis
- **alerts** - Price notification configurations
- **strategies** - Trading strategy parameters (execution logic pending)
- **price_history** - Historical price data cache (currently unused, fetching on-demand from CoinGecko)

## Prerequisites

### Local Development
- **Node.js** 20.x or higher
- **Python** 3.12+
- **PostgreSQL** 16.x
- **Expo CLI** (installed via npm)
- **AWS Account** (for deployment only)
- **iOS Simulator** (macOS) or **Android Emulator**, or physical device with Expo Go app

### AWS Deployment
- EC2 instance with Ubuntu 24.04 LTS
- RDS PostgreSQL instance
- SSH key pair for EC2 access
- Security groups configured for EC2-RDS communication

## Project Setup

### Backend Setup (Local Development)

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd crypto-trading-bot
```

2. **Create and activate Python virtual environment**
```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
   pip install -r requirements.txt
```

4. **Set up local PostgreSQL database**
```bash
   createdb cryptodb
```

5. **Configure environment variables**
   
   Create a `.env` file in the `backend/` directory:
```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cryptodb
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

6. **Run the backend server**
```bash
   uvicorn main:app --reload --host 0.0.0.0
```
   
   Backend will be available at `http://localhost:8000`

### Mobile App Setup

1. **Navigate to mobile app directory**
```bash
   cd mobile-app
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure API endpoint**
   
   In `mobile-app/services/api.ts`, set the `API_BASE_URL`:
```typescript
   // For local development
   const API_BASE_URL = 'http://localhost:8000';
   
   // For AWS deployment
   const API_BASE_URL = 'http://YOUR_ELASTIC_IP:8000';
```

4. **Start Expo development server**
```bash
   npx expo start
```
   
   Press `i` for iOS simulator, `a` for Android emulator, or scan QR code with Expo Go app on physical device.

### AWS Deployment

1. **Create RDS PostgreSQL Database**
   - Engine: PostgreSQL 16.x
   - Instance: db.t3.micro (free tier)
   - Enable public access
   - Create database named `cryptodb`
   - Note the endpoint URL

2. **Launch EC2 Instance**
   - AMI: Ubuntu Server 24.04 LTS
   - Instance type: t3.micro (free tier)
   - Create new key pair and download `.pem` file
   - Security group: Allow SSH (22), HTTP (80), Custom TCP (8000)
   - Allocate and associate Elastic IP

3. **Configure EC2-RDS Connectivity**
   - In RDS console, select database
   - Click "Set up EC2 connection"
   - Select your EC2 instance
   - This automatically configures security groups

4. **Set up EC2 Instance**
   
   SSH into instance:
```bash
   chmod 400 your-key.pem
   ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```
   
   Install dependencies:
```bash
   sudo apt update
   sudo apt install -y python3-pip python3-venv postgresql-client
```
   
   Create application directory:
```bash
   mkdir crypto-backend
   cd crypto-backend
   python3 -m venv venv
   source venv/bin/activate
```

5. **Upload backend files from local machine**
```bash
   scp -i your-key.pem -r backend/* ubuntu@YOUR_ELASTIC_IP:~/crypto-backend/
```

6. **Install Python dependencies on EC2**
```bash
   # On EC2 instance
   cd ~/crypto-backend
   source venv/bin/activate
   pip install -r requirements.txt
```

7. **Create `.env` file on EC2**
```bash
   nano ~/crypto-backend/.env
```
   
   Add RDS credentials:
```env
   DB_USER=postgres
   DB_PASSWORD=your_rds_password
   DB_HOST=crypto-trading-db.xxxxx.us-east-2.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=cryptodb
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

8. **Create systemd service for 24/7 uptime**
```bash
   sudo nano /etc/systemd/system/crypto-backend.service
```
   
   Add configuration:
```ini
   [Unit]
   Description=Crypto Trading Backend
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/crypto-backend
   Environment="PATH=/home/ubuntu/crypto-backend/venv/bin"
   ExecStart=/home/ubuntu/crypto-backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

   [Install]
   WantedBy=multi-user.target
```
   
   Enable and start service:
```bash
   sudo systemctl daemon-reload
   sudo systemctl start crypto-backend
   sudo systemctl enable crypto-backend
```

9. **Verify deployment**
```bash
   curl http://YOUR_ELASTIC_IP:8000/health
```
   
   Should return: `{"status":"healthy","database":"connected"}`

10. **Update mobile app configuration**
    
    In `mobile-app/services/api.ts`:
```typescript
    const API_BASE_URL = 'http://YOUR_ELASTIC_IP:8000';
```

## API Endpoints

### Authentication
- `POST /users` - Create new user account
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current user information (requires auth)

### Portfolio Management
- `GET /portfolios` - Get all portfolios for current user
- `POST /portfolios` - Create new portfolio

### Trading
- `POST /trades` - Execute buy/sell trade
- `GET /trades` - Get trade history for current user
- `GET /positions` - Get current holdings

### Market Data
- `GET /price?symbol=BTC` - Get current price for single cryptocurrency
- `GET /prices?symbols=BTC,ETH,XRP` - Get current prices for multiple cryptocurrencies
- `GET /historical-price?symbol=BTC&days=7` - Get 7-day price history

### Alerts
- `GET /alerts` - Get all price alerts for current user
- `POST /alerts` - Create new price alert
- `GET /check-alerts` - Manually trigger alert checking

## Usage

1. **Create Account**: Sign up with email, username, and password
2. **Create Portfolio**: Tap "Create Portfolio" to get $10,000 virtual balance
3. **Execute Trades**: 
   - Select cryptocurrency (BTC, ETH, or XRP)
   - Enter quantity to buy or sell
   - View current price before confirming
4. **Monitor Portfolio**: 
   - View total value, P&L, and percentage change
   - See breakdown of current positions
   - Pull down to refresh data
5. **Review History**: Check all past trades with timestamps and prices
6. **View Price Charts**: See 7-day historical price trends for selected cryptocurrency

## Development Notes

### Known Limitations
- **CoinGecko API Rate Limits**: Free tier has strict rate limiting. Rapid switching between cryptocurrencies may trigger 404 errors. Wait a few seconds between requests.
- **Token Expiry**: Currently set to 7 days for development convenience. Production should use shorter expiry with refresh token mechanism.
- **No Refresh Tokens**: Users must re-login after token expires. Future version should implement refresh token flow.
- **Limited Error Handling**: Some edge cases (network failures, API timeouts) show generic error messages.

### Important Technical Decisions

**Decimal Precision for Currency**
- Used `Decimal(str(value))` for all financial calculations to avoid floating-point precision errors
- Critical for accurate position tracking and P&L calculations

**Transaction Atomicity**
- Trade creation and position updates wrapped in single database transaction
- Ensures data integrity - both operations succeed or both fail

**Endpoint Naming Consistency**
- Frontend and backend must use identical endpoint paths
- Example: `/historical-price` (not `/price-history` on one end and `/historical-price` on other)

**File Upload Verification**
- Always verify uploaded files on EC2 with `grep` before restarting service
- Old file versions can persist if upload fails silently

**Environment Variable Edge Cases**
- Passwords containing `#` in `.env` files must be quoted
- Unquoted values treat `#` as start of comment

### Deployment Workflow

To update backend code on AWS:

1. **Upload files from local machine**
```
   cd backend
   scp -i ~/.ssh/your-key.pem main.py utils.py ubuntu@YOUR_ELASTIC_IP:~/crypto-backend/
```

2. **SSH into EC2**
```
   ssh -i ~/.ssh/your-key.pem ubuntu@YOUR_ELASTIC_IP
```

3. **Verify upload (important!)**
```
   grep "your_new_function_name" ~/crypto-backend/main.py
```

4. **Restart service**
```
   sudo systemctl restart crypto-backend
```

5. **Check status**
```
   sudo systemctl status crypto-backend
   sudo journalctl -u crypto-backend -n 50  # View recent logs
```

6. **Test endpoint**
```
   curl http://YOUR_ELASTIC_IP:8000/health
```

### Troubleshooting

**iOS Simulator won't open**
```
sudo xcode-select --reset
open -a Simulator
```

**Expo "internet connection appears to be offline" on physical device**
- Ensure phone and laptop on same WiFi network
- Try `npx expo start --tunnel` (requires Expo account)

**EC2 backend times out connecting to RDS**
- Check RDS security group allows PostgreSQL (5432) from EC2 security group
- Use "Set up EC2 connection" feature in RDS console

**Trade execution fails with "Insufficient position quantity"**
- User trying to sell more crypto than they own
- Check positions table for current holdings

**Chart shows "Loading chart..." indefinitely**
- Historical price fetch failed (check console logs)
- Likely CoinGecko rate limit - wait 30 seconds and refresh

## Project Structure
```
crypto-trading-bot/
├── backend/
│   ├── main.py              # FastAPI app and endpoints
│   ├── db.py                # Database connection setup
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── auth.py              # JWT token and password utilities
│   ├── utils.py             # Price fetching from CoinGecko
│   ├── alert_checker.py     # Alert monitoring logic
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (not in git)
├── mobile-app/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── portfolio.tsx    # Portfolio screen
│   │   │   ├── trade.tsx        # Trading screen with charts
│   │   │   ├── history.tsx      # Trade history screen
│   │   │   └── profile.tsx      # User profile screen
│   │   ├── index.tsx            # Auth guard/entry point
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Registration screen
│   ├── services/
│   │   └── api.ts               # API client and auth utilities
│   ├── constants/
│   │   └── theme.ts             # Color palette
│   └── package.json
└── README.md
```

This project is for educational and portfolio purposes.
