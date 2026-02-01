import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Link } from 'expo-router';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // TODO: Connect to backend
    Alert.alert('Success', 'Login successful!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CryptoBot</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={CRYPTO_COLORS.GRAY}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={CRYPTO_COLORS.GRAY}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>log in</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>create account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CRYPTO_COLORS.DARK_BLUE,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: CRYPTO_COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 40,
  },
  titleHighlight: {
    color: CRYPTO_COLORS.BLUE,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: CRYPTO_COLORS.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: CRYPTO_COLORS.WHITE,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: CRYPTO_COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  link: {
    color: CRYPTO_COLORS.BLUE,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
