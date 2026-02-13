import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';
import { portfolioAPI, tradesAPI } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  //loading real trades from api when screen focuses
  const [loading, setLoading] = useState(true);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  //portfolioId state to fetch trades for specific portfolio
  const [portfolioId, setPortfolioId] = useState<number | null>(null);

  //

  //load data function that fetches portfolio id then trades for that portfolio
  const loadData = async () => {
    try {
      const portfolios = await portfolioAPI.getAll();
      if (portfolios.length > 0) {
        const id = portfolios[0].id; //for simplicity, using first portfolio
        setPortfolioId(id);
        const tradesData = await tradesAPI.getAll(id);
        setTradeHistory(tradesData);
      }
    } catch (error) {
      console.error('Failed to load trade history:', error);
    } finally {
      setLoading(false);
    }
  };

  //useFocusEffect to call loadData
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={CRYPTO_COLORS.BLUE} />
      </View>
    );
  }

  if (tradeHistory.length === 0) {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.emptyText}>No trades yet</Text>
      <Text style={styles.emptySubtext}>Execute a trade to see your history</Text>
    </View>
  );
}

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade History</Text>
      </View>

      {/* Trade List */}
      <View style={styles.section}>
        {
          tradeHistory.map((trade) => (
          <TouchableOpacity
            key={trade.id}
            style={styles.tradeItem}
          >
            <View style={styles.tradeContent}>
              <View>
                <Text style={styles.tradeType}>{trade.trade_type.toUpperCase()}</Text>
                <Text style={styles.tradeSymbol}>{trade.symbol}</Text>
              </View>
              <View>
                <Text style={styles.tradeQuantity}>{trade.quantity}</Text>
                <Text style={styles.tradeExecutedAt}>{new Date(trade.executed_at).toLocaleDateString()}</Text>
              </View>
            </View>
            <View style={styles.tradeRight}>
              <Text style={[styles.tradePrice, trade.trade_type === 'BUY' ? styles.buy : styles.sell]}>
                {trade.trade_type === 'BUY' ? '+' : '-'}{trade.total_value}
              </Text>
              <Text style={styles.expandIcon}>›</Text>
            </View>
          </TouchableOpacity>
        ))
      }
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
  sectionTitle: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  tradeSymbol: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 13,
  },
  tradeQuantity: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 10,
  },
  tradeExecutedAt: {
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
  emptyText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 18,
    textAlign: 'center',
  },
  emptySubtext: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
