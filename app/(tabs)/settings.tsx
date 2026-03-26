import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency } from '@/utils/calculations';
import { useMonthSummary } from '@/hooks/useMonthSummary';
import { Transaction } from '@/types/financial';

export default function SettingsScreen() {
  const { importTransactions, clearAllData, transactions } = useFinancialStore();
  const summary = useMonthSummary();

  const months = [...new Set(transactions.map((t) => t.month))].sort();

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) return;
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const data = JSON.parse(content) as Transaction[];
      if (!Array.isArray(data)) throw new Error('Formato inválido');
      Alert.alert(
        'Importar dados',
        `${data.length} lançamentos encontrados. Isso substituirá todos os dados atuais.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Importar', onPress: () => importTransactions(data) },
        ]
      );
    } catch {
      Alert.alert('Erro', 'Arquivo inválido. Use um JSON exportado pelo Life Controller.');
    }
  };

  const handleExport = async () => {
    try {
      await Share.share({ message: JSON.stringify(transactions, null, 2), title: 'life_controller.json' });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar os dados.');
    }
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

        {/* Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleImport}>
            <Text style={styles.primaryBtnText}>⬆  Importar JSON</Text>
          </TouchableOpacity>
          {transactions.length > 0 && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleExport}>
              <Text style={styles.secondaryBtnText}>⬇  Exportar dados</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.warnBtn, styles.dangerBtn]} onPress={handleClear}>
            <Text style={styles.dangerBtnText}>✕  Apagar todos os lançamentos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.about}>Life Controller v1.0.0</Text>
          <Text style={styles.about}>Controle financeiro pessoal</Text>
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
  primaryBtn: {
    backgroundColor: '#312e81',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: { color: '#a5b4fc', fontSize: 14, fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: '#064e3b',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtnText: { color: '#6ee7b7', fontSize: 14, fontWeight: '600' },
  warnBtn: {
    backgroundColor: '#78350f',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerBtn: { backgroundColor: '#7f1d1d', marginBottom: 0 },
  dangerBtnText: { color: '#fca5a5', fontSize: 14, fontWeight: '600' },
  about: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
});
