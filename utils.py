import requests

#symbols to CoinGecko IDs mapping
SYMBOL_TO_ID = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "LTC": "litecoin",
    "XRP": "ripple",
    "BCH": "bitcoin-cash",
    "ADA": "cardano",
    "DOT": "polkadot",
    "LINK": "chainlink",
    "BNB": "binancecoin",
    "USDT": "tether",
    "SOL": "solana",
    "DOGE": "dogecoin",
    #add more mappings as needed
}

#fetch coin price from CoinGecko API
def fetch_coin_price(symbol: str, vs_currency: str = "usd"):
    coin_id = SYMBOL_TO_ID.get(symbol.upper())
    if not coin_id:
        print(f"Symbol '{symbol}' not recognized.")
        return None

    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {"ids": coin_id, "vs_currencies": vs_currency}

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data[coin_id][vs_currency] if coin_id in data and vs_currency in data[coin_id] else None
    except requests.RequestException as e:
        print(f"Error fetching price for {symbol}: {e}")
        return None