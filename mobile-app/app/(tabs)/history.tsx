import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function HistoryScreen() {
  const trades = [
    { id: 1, type: 'BUY', asset: 'BTC', amount: '0.5', price: '$21,500', date: '2024-01-31' },
    { id: 2, type: 'SELL', asset: 'ETH', amount: '2', price: '$3,200', date: '2024-01-30' },
    { id: 3, type: 'BUY', asset: 'XRP', amount: '100', price: '$450', date: '2024-01-29' },
  ];

  const handleTradePress = (trade: any) => {
    // TODO: Navigate to trade detail view
    console.log('Viewing trade details:', trade);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade History</Text>
      </View>

      {/* Trade List */}
      <View style={styles.section}>
        {trades.map((trade) => (
          <TouchableOpacity
            key={trade.id}
            style={styles.tradeItem}
            onPress={() => handleTradePress(trade)}
          >
            <View style={styles.tradeContent}>
              <View>
                <Text style={styles.tradeType}>{trade.type}</Text>
                <Text style={styles.tradeAsset}>{trade.asset}</Text>
              </View>
              <View>
                <Text style={styles.tradeAmount}>{trade.amount}</Text>
                <Text style={styles.tradeDate}>{trade.date}</Text>
              </View>
            </View>
            <View style={styles.tradeRight}>
              <Text style={[styles.tradePrice, trade.type === 'BUY' ? styles.buy : styles.sell]}>
                {trade.type === 'BUY' ? '+' : '-'}{trade.price}
              </Text>
              <Text style={styles.expandIcon}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    gap: 5,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CRYPTO_COLORS.BLUE,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    height: 85,
  },
  tradeContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 40,
  },
  tradeType: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  tradeAsset: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 13,
  },
  tradeAmount: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 10,
  },
  tradeDate: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 13,
    textAlign: 'right',
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buy: {
    color: CRYPTO_COLORS.GREEN,
  },
  sell: {
    color: CRYPTO_COLORS.RED,
  },
  expandIcon: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 18,
  },
});
