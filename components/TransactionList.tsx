import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TransactionCategory } from '@/types/financial';
import { CategorySection } from './CategorySection';

interface Props {
  byCategory: Partial<Record<TransactionCategory, import('@/types/financial').Transaction[]>>;
  categoryOrder?: TransactionCategory[];
}

const DEFAULT_ORDER: TransactionCategory[] = [
  'despesa_fixa',
  'parcela_cartao',
  'transporte',
  'despesa_avulsa',
  'alimentacao',
  'lazer',
  'entrada',
];

export function TransactionList({ byCategory, categoryOrder = DEFAULT_ORDER }: Props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {categoryOrder.map((cat) => {
        const items = byCategory[cat];
        if (!items || items.length === 0) return null;
        return <CategorySection key={cat} category={cat} transactions={items} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
