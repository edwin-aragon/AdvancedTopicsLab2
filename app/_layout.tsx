import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { JSX } from 'react';

export default function RootLayout(): JSX.Element {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/signin" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transaction-details/[id]" />
      </Stack>
    </AuthProvider>
  );
}
