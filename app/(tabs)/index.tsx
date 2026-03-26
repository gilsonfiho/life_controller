import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MonthNavigator } from '@/components/MonthNavigator';
import { MonthSummaryCard } from '@/components/MonthSummaryCard';
import { TransactionList } from '@/components/TransactionList';
import { useMonthSummary } from '@/hooks/useMonthSummary';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinancialStore } from '@/store/financialStore';

export default function DashboardScreen() {
  const { isLoaded } = useFinancialStore();
  const summary = useMonthSummary();
  const { byCategory } = useTransactions();

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Life Controller</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/transaction/new')}
        >
          <Ionicons name="add" size={24} color="#f9fafb" />
        </TouchableOpacity>
      </View>

      {/* Navegador de mês */}
      <MonthNavigator />

      {/* Resumo mensal */}
      <MonthSummaryCard summary={summary} />

      {/* Lista de transações por categoria */}
      <TransactionList byCategory={byCategory} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  loading: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#4f46e5',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
