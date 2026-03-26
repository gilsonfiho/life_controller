import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '@/types/financial';
import { formatCurrency, formatDate } from '@/utils/calculations';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: Props) {
  const isIncome = transaction.category === 'entrada';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
          {transaction.installmentInfo
            ? ` (${transaction.installmentInfo.currentInstallment}/${transaction.installmentInfo.totalInstallments})`
            : ''}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Text>
        <View style={[styles.statusDot, transaction.status === 'pago' ? styles.paid : styles.pending]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    color: '#f3f4f6',
    fontSize: 14,
  },
  date: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  income: {
    color: '#4ade80',
  },
  expense: {
    color: '#f87171',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paid: {
    backgroundColor: '#4ade80',
  },
  pending: {
    backgroundColor: '#f59e0b',
  },
});
