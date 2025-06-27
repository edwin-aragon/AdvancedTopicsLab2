import React, { JSX, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { FormInput } from '../../components/FormInput';
import { globalStyles, colors } from '../../styles/globalStyles';

export default function SignIn(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(username, password);
      if (result.success) {
        router.replace('/tabs/dashboard');
      } else {
        Alert.alert('Error', result.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[globalStyles.screenContainer, { justifyContent: 'center' }]}>
        <View style={globalStyles.card}>
          <Text style={[globalStyles.title, { textAlign: 'center', marginBottom: 32 }]}>
            ExpenseTracker
          </Text>
          
          <FormInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username (admin)"
            autoCapitalize="none"
          />
          
          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password (admin)"
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[globalStyles.button, { marginTop: 16 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
          
          {/* <View style={{ marginTop: 24, padding: 16, backgroundColor: colors.background, borderRadius: 8 }}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 14 }}>
              Demo Credentials:{'\n'}Username: admin{'\n'}Password: admin
            </Text>
          </View> */}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
