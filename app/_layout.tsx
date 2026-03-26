import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFinancialStore } from '@/store/financialStore';

export default function RootLayout() {
  const loadTransactions = useFinancialStore((s) => s.loadTransactions);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f0f1a' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/new"
          options={{ presentation: 'modal', title: 'Nova Transação', headerShown: true, headerStyle: { backgroundColor: '#1e1e2e' }, headerTintColor: '#f9fafb' }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{ presentation: 'modal', title: 'Editar Transação', headerShown: true, headerStyle: { backgroundColor: '#1e1e2e' }, headerTintColor: '#f9fafb' }}
        />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
