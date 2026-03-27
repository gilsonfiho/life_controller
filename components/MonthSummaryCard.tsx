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
    backgroundColor: '#0F1B35',
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
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  income: {
    color: '#22C55E',
  },
  expense: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E3A8A',
    marginVertical: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22C55E',
  },
  negative: {
    color: '#EF4444',
  },
});
