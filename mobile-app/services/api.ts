import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://18.220.237.130:8000'; //aws backend
const TOKEN_KEY = 'auth_token';

export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

//generic api request function
async function apiRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    requiresAuth: boolean = true
) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if(requiresAuth) {
        const token = await getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request failed');
    }

    return await response.json();
}

//auth api
export const authAPI = {
    signup: async (email: string, username: string, password: string) => {
        return await apiRequest('/users', 'POST', { email, username, password }, false);
    },

    login: async (username: string, password: string) => {
        //fastAPI oauth2passwordrequestform expects form data, NOT JSON
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        await setAuthToken(data.access_token);
        console.log('Token:', data.access_token); //log token for curl testing portfolio creation
        return data;
    },

    logout: async () => {
        await removeAuthToken();
    },

    getCurrentUser: async () => {
        return await apiRequest('/me');
    },
};

//portfolio api
export const portfolioAPI = {
    getAll: async () => {
        return await apiRequest('/portfolios');
    },

    create: async (userID: number, baseCurrency: string, initialBalance: number) => {
        return await apiRequest('/portfolios', 'POST', { 
            user_id: userID, 
            base_currency: baseCurrency, 
            initial_balance: initialBalance,
            is_paper_trading: true
            });
        },
};

//position api
export const positionAPI = {
  getAll: async () => {
    return await apiRequest('/positions');
  },
};

//trades api
export const tradesAPI = {
    getAll: async (portfolioId?: number) => {
        const query = portfolioId ? `?portfolio_id=${portfolioId}` : '';
        return await apiRequest(`/trades${query}`);
    },

    create: async (portfolioId: number, symbol: string, quantity: number, tradeType: 'buy' | 'sell') => {
        return await apiRequest('/trades', 'POST', { 
            portfolio_id: portfolioId, 
            symbol, 
            quantity, 
            trade_type: tradeType 
        });
    },
};

//price api
export const priceAPI = {
    getPrice: async (symbol: string) => {
        return await apiRequest(`/price?symbol=${symbol}`, 'GET', null, false);
    },

    getPrices: async (symbols: string[]) => {
        const symbolsParam = symbols.join(',');
        return await apiRequest(`/prices?symbols=${symbolsParam}`, 'GET', null, false);
    },
}

//alert api
export const alertAPI = {
    getAll: async () => {
        return await apiRequest('/alerts');
    },

    create: async (symbol: string, conditionType: string, targetPrice: number) => {
        return await apiRequest('/alerts', 'POST', { 
            symbol, 
            condition_type: conditionType, 
            target_price: targetPrice 
        });
    },
};