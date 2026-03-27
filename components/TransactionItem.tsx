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
    borderBottomColor: '#1E3A8A',
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  date: {
    color: '#94A3B8',
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
    color: '#22C55E',
  },
  expense: {
    color: '#EF4444',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paid: {
    backgroundColor: '#22C55E',
  },
  pending: {
    backgroundColor: '#f59e0b',
  },
});
