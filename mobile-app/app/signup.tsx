import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { CRYPTO_COLORS } from '@/constants/theme';
import { authAPI } from '@/services/api';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.signup(email, username, password);
      Alert.alert('Success', 'Account created! Please log in.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
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
          placeholder="Username"
          placeholderTextColor={CRYPTO_COLORS.GRAY}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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

      <TouchableOpacity 
      style={styles.signupButton} 
      onPress={handleSignup}
      disabled={loading}
      >
        <Text style={styles.signupButtonText}>
          {loading ? 'Signing up...' : 'sign up'}
          </Text>
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
