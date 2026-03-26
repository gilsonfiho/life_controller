import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MonthSummary } from '@/types/financial';
import { formatCurrency } from '@/utils/calculations';

interface Props {
  summary: MonthSummary;
}

export function MonthSummaryCard({ summary }: Props) {
  const isNegative = summary.balance < 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Entradas</Text>
          <Text style={[styles.value, styles.income]}>{formatCurrency(summary.totalIncome)}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Despesas</Text>
          <Text style={[styles.value, styles.expense]}>{formatCurrency(summary.totalExpenses)}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={[styles.balanceValue, isNegative && styles.negative]}>
          {formatCurrency(summary.balance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  income: {
    color: '#4ade80',
  },
  expense: {
    color: '#f87171',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#d1d5db',
    fontSize: 15,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4ade80',
  },
  negative: {
    color: '#f87171',
  },
});
