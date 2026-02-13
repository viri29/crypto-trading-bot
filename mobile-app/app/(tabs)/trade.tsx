import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';
import {tradesAPI, portfolioAPI, priceAPI} from '@/services/api';

export default function TradeScreen() {
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [trades, setTrades] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);

  //fetch current price when screen loads or crypto selection changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceData = await priceAPI.getPrice(selectedCrypto);
        setCurrentPrice(priceData.price);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    fetchPrice();
  }, [selectedCrypto]);

  //fetch portfolios when screen loads
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const portfoliosData = await portfolioAPI.getAll();
        setPortfolioId(portfoliosData[0].id);  
        console.log('Fetched portfolios:', portfoliosData);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };
    fetchPortfolios();
  }, []); 

//handleBuy and handleSell functions
const handleBuy = async () => {
  if (!portfolioId) {
    Alert.alert('Error', 'No portfolio available');
    return;
  }
  if (!amount || parseFloat(amount) <= 0) {
    Alert.alert('Error', 'Please enter a valid amount');
    return;
  }
  setLoadingTrades(true);
  try {
    const trade = await tradesAPI.create(portfolioId, selectedCrypto, parseFloat(amount), 'buy');
    Alert.alert('Success', `Bought ${amount} ${selectedCrypto} at $${trade.price.toLocaleString()}`);
    setAmount(''); //clear input after trade
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Trade failed');
  } finally {
    setLoadingTrades(false);
  }
};
 
const handleSell = async () => {
  if (!portfolioId) {
    Alert.alert('Error', 'No portfolio available');
    return;
  }
  if (!amount || parseFloat(amount) <= 0) {
    Alert.alert('Error', 'Please enter a valid amount');
    return;
  }
  setLoadingTrades(true);
  try {
    const trade = await tradesAPI.create(portfolioId, selectedCrypto, parseFloat(amount), 'sell');
    Alert.alert('Success', `Sold ${amount} ${selectedCrypto} at $${trade.price.toLocaleString()}`);
    setAmount(''); 
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Trade failed');
  } finally {
    setLoadingTrades(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade</Text>
      </View>

      {/* Crypto Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Asset</Text>
        <View style={styles.cryptoButtons}>
          {['BTC', 'ETH', 'XRP'].map((crypto) => (
            <TouchableOpacity
              key={crypto}
              style={[
                styles.cryptoButton,
                selectedCrypto === crypto && styles.cryptoButtonActive,
              ]}
              onPress={() => setSelectedCrypto(crypto)}
            >
              <Text
                style={[
                  styles.cryptoButtonText,
                  selectedCrypto === crypto && styles.cryptoButtonTextActive,
                ]}
              >
                {crypto}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 15 }}>
        <Text style={{ color: CRYPTO_COLORS.GRAY, fontSize: 14 }}>
          Current {selectedCrypto} Price:{' '}
          {currentPrice !== null
            ? `$${Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : 'Loading...'}
        </Text>
      </View>

      {/* Manual Trade Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Trade Execution</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor={CRYPTO_COLORS.GRAY}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.tradeButton, styles.buyButton]}
            onPress={handleBuy}
            disabled={loadingTrades}
          >
            <Text style={styles.tradeButtonText}>
              {loadingTrades ? 'Processing...' : 'BUY'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeButton, styles.sellButton]}
            onPress={handleSell}
            disabled={loadingTrades}
          >
            <Text style={styles.tradeButtonText}>
              {loadingTrades ? 'Processing...' : 'SELL'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Price Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Charts</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>Chart Coming Soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CRYPTO_COLORS.DARK_BLUE,
  },
  header: {
    padding: 20,
    paddingTop: 65,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: CRYPTO_COLORS.BLUE,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: CRYPTO_COLORS.WHITE,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cryptoButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cryptoButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: CRYPTO_COLORS.BLUE,
    borderRadius: 8,
    alignItems: 'center',
  },
  cryptoButtonActive: {
    backgroundColor: CRYPTO_COLORS.GREEN,
    borderColor: CRYPTO_COLORS.GREEN,
  },
  cryptoButtonText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  cryptoButtonTextActive: {
    color: CRYPTO_COLORS.DARK_BLUE,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: CRYPTO_COLORS.BLUE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tradeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: CRYPTO_COLORS.GREEN,
  },
  sellButton: {
    backgroundColor: CRYPTO_COLORS.RED,
  },
  tradeButtonText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    backgroundColor: CRYPTO_COLORS.BLUE,
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 16,
  },
});
