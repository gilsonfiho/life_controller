import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MonthNavigator } from '@/components/MonthNavigator';
import { TransactionItem } from '@/components/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';

export default function TransactionsScreen() {
  const { monthTransactions } = useTransactions();
  const sorted = [...monthTransactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lançamentos</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/transaction/new')}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <MonthNavigator />

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TransactionItem
              transaction={item}
              onPress={() => router.push(`/transaction/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum lançamento neste mês.</Text>
        }
        style={styles.list}
        contentContainerStyle={sorted.length === 0 && styles.emptyContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  item: {
    backgroundColor: '#0F1B35',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  empty: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
  },
});
