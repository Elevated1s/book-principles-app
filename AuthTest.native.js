// AuthTest.native.js - React Native Authentication Test Component
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  logout 
} from './authService.native';
import { useGoogleSignIn } from './authService.native';

const AuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { promptAsync, signInWithGoogle } = useGoogleSignIn();

  const handleSignUp = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      setMessage(`Sign up successful! User ID: ${result.user.uid}`);
      Alert.alert('Success', `Sign up successful! User ID: ${result.user.uid}`);
    } catch (error) {
      setMessage(`Sign up error: ${error.message}`);
      Alert.alert('Error', `Sign up error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmail(email, password);
      setMessage(`Sign in successful! User ID: ${result.user.uid}`);
      Alert.alert('Success', `Sign in successful! User ID: ${result.user.uid}`);
    } catch (error) {
      setMessage(`Sign in error: ${error.message}`);
      Alert.alert('Error', `Sign in error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const googleResult = await signInWithGoogle();
        if (googleResult) {
          setMessage(`Google sign in successful! User ID: ${googleResult.user.uid}`);
          Alert.alert('Success', `Google sign in successful! User ID: ${googleResult.user.uid}`);
        }
      }
    } catch (error) {
      setMessage(`Google sign in error: ${error.message}`);
      Alert.alert('Error', `Google sign in error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setMessage('Sign out successful!');
      Alert.alert('Success', 'Sign out successful!');
    } catch (error) {
      setMessage(`Sign out error: ${error.message}`);
      Alert.alert('Error', `Sign out error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Test</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      {message ? (
        <View style={[
          styles.messageContainer,
          { backgroundColor: message.includes('error') ? '#ffebee' : '#e8f5e8' }
        ]}>
          <Text style={[
            styles.messageText,
            { color: message.includes('error') ? '#d32f2f' : '#2e7d32' }
          ]}>
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AuthTest; 