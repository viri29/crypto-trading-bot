import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Link } from 'expo-router';
import { CRYPTO_COLORS } from '@/constants/theme';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // TODO: Connect to backend
    Alert.alert('Success', 'Account created!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create<Text style={styles.titleHighlight}>Bot</Text>
      </Text>

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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={CRYPTO_COLORS.GRAY}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>sign up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>already have an account?</Text>
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
  signupButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: CRYPTO_COLORS.WHITE,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
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
