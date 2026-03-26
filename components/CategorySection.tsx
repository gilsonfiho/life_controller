import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction, TransactionCategory } from '@/types/financial';
import { TransactionItem } from './TransactionItem';
import { ALL_CATEGORIES } from '@/constants/categories';
import { formatCurrency } from '@/utils/calculations';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Props {
  category: TransactionCategory;
  transactions: Transaction[];
}

export function CategorySection({ category, transactions }: Props) {
  const [expanded, setExpanded] = useState(true);
  const categoryInfo = ALL_CATEGORIES[category];
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded((v) => !v)}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={(categoryInfo.icon as never) ?? 'ellipse-outline'}
            size={18}
            color="#9ca3af"
            style={styles.icon}
          />
          <Text style={styles.title}>{categoryInfo.label}</Text>
          <Text style={styles.count}>({transactions.length})</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7280" />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.items}>
          {transactions.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onPress={() => router.push(`/transaction/${t.id}`)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  total: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '500',
  },
  items: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
});
