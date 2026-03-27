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
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0F1E' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/new"
          options={{ presentation: 'modal', title: 'Nova Transação', headerShown: true, headerStyle: { backgroundColor: '#0F1B35' }, headerTintColor: '#f9fafb' }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{ presentation: 'modal', title: 'Editar Transação', headerShown: true, headerStyle: { backgroundColor: '#0F1B35' }, headerTintColor: '#f9fafb' }}
        />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
