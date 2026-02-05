import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function PortfolioScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portfolio</Text>
      </View>

      {/* Total Value */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Value</Text>
        <Text style={styles.cardValue}>$12,450.50</Text>
      </View>

      {/* P&L */}
      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>P&L</Text>
          <Text style={[styles.cardValue, styles.positive]}>+$2,450.50</Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Change</Text>
          <Text style={[styles.cardValue, styles.positive]}>+24.5%</Text>
        </View>
      </View>

      {/* Asset Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Asset Breakdown</Text>
        <View style={styles.assetItem}>
          <View>
            <Text style={styles.assetName}>Bitcoin</Text>
            <Text style={styles.assetAmount}>0.5 BTC</Text>
          </View>
          <Text style={styles.assetValue}>$20,500.00</Text>
        </View>
        <View style={styles.assetItem}>
          <View>
            <Text style={styles.assetName}>Ethereum</Text>
            <Text style={styles.assetAmount}>2.5 ETH</Text>
          </View>
          <Text style={styles.assetValue}>$5,250.00</Text>
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
    paddingTop:20,
  },
  positive: {
    color: CRYPTO_COLORS.GREEN,
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
});
