import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function ProfileScreen() {
  const [isPaperMode, setIsPaperMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Paper/Live Mode */}
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Trading Mode</Text>
            <Text style={styles.settingValue}>{isPaperMode ? 'Paper Trading' : 'Live Trading'}</Text>
          </View>
          <Switch
            value={isPaperMode}
            onValueChange={setIsPaperMode}
            trackColor={{ false: CRYPTO_COLORS.RED, true: CRYPTO_COLORS.GREEN }}
            thumbColor={CRYPTO_COLORS.WHITE}
          />
        </View>

        {/* Notifications */}
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: CRYPTO_COLORS.RED, true: CRYPTO_COLORS.GREEN }}
            thumbColor={CRYPTO_COLORS.WHITE}
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Change Password</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>Two-Factor Authentication</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountItemText}>API Keys</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CRYPTO_COLORS.BLUE,
    padding: 15,
    borderRadius: 8,
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CRYPTO_COLORS.GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: CRYPTO_COLORS.DARK_BLUE,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 14,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: CRYPTO_COLORS.BLUE,
  },
  settingLabel: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  settingValue: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 12,
    marginTop: 4,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CRYPTO_COLORS.BLUE,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  accountItemText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    color: CRYPTO_COLORS.GRAY,
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: CRYPTO_COLORS.RED,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
