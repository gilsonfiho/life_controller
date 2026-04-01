import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MonthNavigator } from '@/components/MonthNavigator';
import { TransactionItem } from '@/components/TransactionItem';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionStatus } from '@/types/financial';

const STATUS_OPTIONS: Array<{ key: TransactionStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'pago', label: 'Pago' },
  { key: 'pendente', label: 'Pendente' },
  { key: 'agendado', label: 'Agendado' },
];

export default function TransactionsScreen() {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { monthTransactions: allMonthTransactions } = useTransactions();
  const statusCounts = useMemo(
    () => ({
      pago: allMonthTransactions.filter((t) => t.status === 'pago').length,
      pendente: allMonthTransactions.filter((t) => t.status === 'pendente').length,
      agendado: allMonthTransactions.filter((t) => t.status === 'agendado').length,
    }),
    [allMonthTransactions]
  );

  const { monthTransactions } = useTransactions(
    undefined,
    statusFilter === 'all' ? undefined : statusFilter,
    undefined,
    searchTerm
  );

  const sorted = useMemo(
    () => [...monthTransactions].sort((a, b) => b.date.localeCompare(a.date)),
    [monthTransactions]
  );

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

      <View style={styles.statusRow}>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Pago</Text>
          <Text style={[styles.statusValue, styles.statusPaid]}>{statusCounts.pago}</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Pendente</Text>
          <Text style={[styles.statusValue, styles.statusPending]}>{statusCounts.pendente}</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Agendado</Text>
          <Text style={[styles.statusValue, styles.statusScheduled]}>{statusCounts.agendado}</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar por descrição"
        placeholderTextColor="#94A3B8"
      />

      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterChip,
              statusFilter === option.key && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter(option.key)}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === option.key && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
          <Text style={styles.empty}>Nenhum lançamento encontrado.</Text>
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusBox: {
    flex: 1,
    backgroundColor: '#0F1B35',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusPaid: {
    color: '#22C55E',
  },
  statusPending: {
    color: '#FBBF24',
  },
  statusScheduled: {
    color: '#60A5FA',
  },
  searchInput: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F1B35',
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterChip: {
    backgroundColor: '#0F1B35',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA',
  },
  filterText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
