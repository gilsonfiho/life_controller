import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/utils/calculations';
import { useMonthSummary } from '@/hooks/useMonthSummary';

export default function SettingsScreen() {
  const { resetToSeedData, clearAllData, transactions } = useFinancialStore();
  const summary = useMonthSummary();

  const months = [...new Set(transactions.map((t) => t.month))].sort();

  const handleReset = () => {
    Alert.alert(
      'Restaurar dados da planilha',
      `Isso vai substituir todos os lançamentos pelos dados originais importados da planilha (${transactions.length} registros serão perdidos). Continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: resetToSeedData },
      ]
    );
  };

  const handleClear = () => {
    Alert.alert(
      'Apagar tudo',
      'Remove TODOS os lançamentos sem possibilidade de recuperação.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar tudo', style: 'destructive', onPress: clearAllData },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        {/* Resumo geral */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <View style={styles.row}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Lançamentos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{months.length}</Text>
              <Text style={styles.statLabel}>Meses</Text>
            </View>
          </View>
        </View>

        {/* Meses disponíveis */}
        {months.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meses com dados</Text>
            {months.map((m) => {
              const count = transactions.filter((t) => t.month === m).length;
              const income = transactions.filter((t) => t.month === m && t.category === 'entrada').reduce((s, t) => s + t.amount, 0);
              const expenses = transactions.filter((t) => t.month === m && t.category !== 'entrada').reduce((s, t) => s + t.amount, 0);
              const [year, mon] = m.split('-');
              const label = new Date(Number(year), Number(mon) - 1, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
              return (
                <View key={m} style={styles.monthRow}>
                  <View>
                    <Text style={styles.monthLabel}>{label}</Text>
                    <Text style={styles.monthCount}>{count} lançamentos</Text>
                  </View>
                  <View style={styles.monthAmounts}>
                    <Text style={styles.incomeText}>{formatCurrency(income)}</Text>
                    <Text style={styles.expenseText}>-{formatCurrency(expenses)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Ações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <TouchableOpacity style={styles.warnBtn} onPress={handleReset}>
            <Text style={styles.warnBtnText}>↺  Restaurar dados originais da planilha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.warnBtn, styles.dangerBtn]} onPress={handleClear}>
            <Text style={styles.dangerBtnText}>✕  Apagar todos os lançamentos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.about}>Life Controller v1.0.0</Text>
          <Text style={styles.about}>Dados importados de Maio/2025 a Fev/2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { color: '#f9fafb', fontSize: 20, fontWeight: '700' },
  section: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { color: '#f9fafb', fontSize: 24, fontWeight: '700' },
  statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  monthLabel: { color: '#e5e7eb', fontSize: 14, textTransform: 'capitalize' },
  monthCount: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  monthAmounts: { alignItems: 'flex-end' },
  incomeText: { color: '#4ade80', fontSize: 13, fontWeight: '600' },
  expenseText: { color: '#f87171', fontSize: 12 },
  warnBtn: {
    backgroundColor: '#78350f',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  warnBtnText: { color: '#fde68a', fontSize: 14, fontWeight: '600' },
  dangerBtn: { backgroundColor: '#7f1d1d', marginBottom: 0 },
  dangerBtnText: { color: '#fca5a5', fontSize: 14, fontWeight: '600' },
  about: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
});
