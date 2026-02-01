import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function TradeScreen() {
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

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
          <TouchableOpacity style={[styles.tradeButton, styles.buyButton]}>
            <Text style={styles.tradeButtonText}>BUY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tradeButton, styles.sellButton]}>
            <Text style={styles.tradeButtonText}>SELL</Text>
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
