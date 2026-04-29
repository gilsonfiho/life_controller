import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useFinancialStore } from '@/store/financialStore';
import { formatCurrency, getCurrentMonth } from '@/utils/calculations';
import { useMonthSummary } from '@/hooks/useMonthSummary';
import { Transaction } from '@/types/financial';

function normalizeTransaction(t: any): Transaction {
  return {
    id: String(t.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
    description: String(t.description || ''),
    amount: Number(t.amount) || 0,
    date: String(t.date || ''),
    category: t.category || 'despesa_avulsa',
    status: t.status || 'pago',
    month: String(t.month || getCurrentMonth()),
    isRecurring: Boolean(t.isRecurring),
    subcategory: t.subcategory ? String(t.subcategory) : undefined,
  };
}

export default function SettingsScreen() {
  const { importTransactions, clearAllData, transactions } = useFinancialStore();
  const summary = useMonthSummary();

  const months = [...new Set(transactions.map((t) => t.month))].sort();

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ 
        type: 'application/json'
      });
      
      if (result.canceled) return;
      
      const file = result.assets[0];
      if (!file || !file.uri) {
        throw new Error('Arquivo inválido');
      }
      
      // Ler arquivo usando fetch como alternativa
      const response = await fetch(file.uri);
      if (!response.ok) {
        throw new Error('Erro ao ler arquivo');
      }
      
      const content = await response.text();
      const parsed = JSON.parse(content);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Arquivo deve ser um array de transações');
      }
      
      if (parsed.length === 0) {
        throw new Error('Arquivo vazio');
      }
      
      const txs = parsed.map((t: any) => normalizeTransaction(t));
      
      Alert.alert(
        'Importar dados',
        `${txs.length} lançamentos encontrados.\nIsso substituirá todos os dados atuais.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Importar',
            onPress: async () => {
              await importTransactions(txs);
              Alert.alert('✓ Sucesso', `${txs.length} lançamentos importados!`);
            }
          },
        ]
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert('Erro ao importar', msg);
    }
  };

  const handleExport = async () => {
    try {
      if (transactions.length === 0) {
        Alert.alert('Aviso', 'Não há dados para exportar');
        return;
      }
      
      // Exportar de forma assíncrona em chunks se houver muitos dados
      const jsonData = JSON.stringify(transactions, null, 2);
      
      // Mostrar alerta antes de compartilhar
      Alert.alert(
        'Exportar dados',
        `${transactions.length} lançamentos serão exportados.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Exportar',
            onPress: async () => {
              try {
                await Share.share({
                  message: jsonData,
                  title: 'life_controller.json',
                });
              } catch (e) {
                if (!(e instanceof Error && e.message.includes('User did not share'))) {
                  Alert.alert('Erro', 'Falha ao exportar dados');
                }
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao preparar exportação');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Apagar dados',
      'Remove TODOS os lançamentos sem possibilidade de recuperação.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar', style: 'destructive', onPress: clearAllData },
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
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  section: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#0F1B35',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  statLabel: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A8A',
  },
  monthLabel: { color: '#FFFFFF', fontSize: 14, textTransform: 'capitalize' },
  monthCount: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  monthAmounts: { alignItems: 'flex-end' },
  incomeText: { color: '#22C55E', fontSize: 13, fontWeight: '600' },
  expenseText: { color: '#EF4444', fontSize: 12 },
  primaryBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: { color: '#BFDBFE', fontSize: 14, fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: '#14532D',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryBtnText: { color: '#86EFAC', fontSize: 14, fontWeight: '600' },
  warnBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerBtn: { backgroundColor: '#7f1d1d', marginBottom: 0 },
  dangerBtnText: { color: '#fca5a5', fontSize: 14, fontWeight: '600' },
  about: { color: '#94A3B8', fontSize: 13, marginBottom: 4 },
});
