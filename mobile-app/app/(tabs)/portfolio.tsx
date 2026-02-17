import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';
import { portfolioAPI, positionAPI } from '@/services/api';
import { useFocusEffect } from '@react-navigation/native';


export default function PortfolioScreen() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //refersh function to reload data when user pulls down
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
    try {
      const [portfolioData, positionData] = await Promise.all([
        portfolioAPI.getAll(),
        positionAPI.getAll()
      ]);
      setPortfolios(portfolioData);
      setPositions(positionData);
    } catch (error: any) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const calculateTotalValue = () => {
    return positions.reduce((sum, pos) => sum + parseFloat(pos.current_value), 0);
  };

  const calculatePnL = () => {
    const totalCost = positions.reduce(
      (sum, pos) => sum + (parseFloat(pos.average_buy_price) * parseFloat(pos.quantity)),
      0
    );
    const totalValue = calculateTotalValue();
    return totalValue - totalCost;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={CRYPTO_COLORS.BLUE} />
      </View>
    );
  }

  if (portfolios.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>No portfolios yet</Text>
        <Text style={styles.emptySubtext}>Create a portfolio to start trading</Text>
      </View>
    );
  }

  const totalValue = calculateTotalValue();
  const pnl = calculatePnL();
  const pnlPercent = totalValue > 0 ? (pnl / totalValue) * 100 : 0;

  return (
    <ScrollView 
    style={styles.container} 
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
      </View>

      {/* Total Value */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Value</Text>
        <Text style={styles.cardValue}>${totalValue.toFixed(2)}</Text>
      </View>

      {/* P&L */}
      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>P&L</Text>
          <Text style={[styles.cardValue, pnl >= 0 ? styles.positive : styles.negative]}>
            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Change</Text>
          <Text style={[styles.cardValue, pnl >= 0 ? styles.positive : styles.negative]}>
            {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* Asset Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Breakdown</Text>
        {positions.length === 0 ? (
          <Text style={styles.emptyText}>No positions yet</Text>
        ) : (
          positions.map((position) => (
            <View key={position.id} style={styles.assetItem}>
              <View>
                <Text style={styles.assetName}>{position.symbol}</Text>
                <Text style={styles.assetAmount}>{parseFloat(position.quantity).toFixed(4)}</Text>
              </View>
              <Text style={styles.assetValue}>${parseFloat(position.current_value).toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CRYPTO_COLORS.DARK_BLUE,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: CRYPTO_COLORS.BLUE,
    margin: 15,
    padding: 20,
    height: 100,
    borderRadius: 12,
  },
  cardLabel: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 14,
    marginBottom: 6,
  },
  cardValue: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 23,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: 0,
    margin: 10,
  },
  halfCard: {
    flex: 1,
    margin: 7.5,
    height: 100,
    padding: 17,
    paddingTop: 20,
  },
  positive: {
    color: CRYPTO_COLORS.GREEN,
  },
  negative: {
    color: CRYPTO_COLORS.RED,
  },
  section: {
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  sectionTitle: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: CRYPTO_COLORS.BLUE,
  },
  assetName: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  assetAmount: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 12,
    marginTop: 4,
  },
  assetValue: {
    color: CRYPTO_COLORS.GREEN,
    fontSize: 16,
    fontWeight: '600',
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
});