import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TransactionCategory, TransactionStatus } from '@/types/financial';
import { useFinancialStore } from '@/store/financialStore';
import { ALL_CATEGORIES } from '@/constants/categories';
const CATEGORIES = Object.entries(ALL_CATEGORIES) as [TransactionCategory, { label: string }][];

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, updateTransaction, deleteTransaction } = useFinancialStore();
  const transaction = transactions.find((t) => t.id === id);

  const [description, setDescription] = useState(transaction?.description ?? '');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [date, setDate] = useState(transaction?.date ?? '');
  const [category, setCategory] = useState<TransactionCategory>(transaction?.category ?? 'alimentacao');
  const [status, setStatus] = useState<TransactionStatus>(transaction?.status ?? 'pago');

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Lançamento não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!description.trim()) return Alert.alert('Erro', 'Informe a descrição.');
    const parsed = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return Alert.alert('Erro', 'Informe um valor válido.');

    await updateTransaction(id!, {
      description: description.trim(),
      amount: parsed,
      date,
      category,
      status,
      month: date.slice(0, 7),
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Excluir', `Excluir "${transaction.description}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id!);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Valor (R$) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data (AAAA-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map(([key, cat]) => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, category === key && styles.chipActive]}
                onPress={() => setCategory(key)}
              >
                <Text style={[styles.chipText, category === key && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Situação</Text>
          <View style={styles.row}>
            {(['pago', 'pendente', 'agendado'] as TransactionStatus[]).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, status === s && styles.chipActive]}
                onPress={() => setStatus(s)}
              >
                <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Excluir lançamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { flex: 1, padding: 16 },
  notFound: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  field: { marginBottom: 20 },
  label: { color: '#9ca3af', fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    padding: 12,
    color: '#f9fafb',
    fontSize: 15,
  },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e1e2e',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#4f46e5' },
  chipText: { color: '#9ca3af', fontSize: 13 },
  chipTextActive: { color: '#f9fafb', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveBtnText: { color: '#f9fafb', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: '#7f1d1d',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  deleteBtnText: { color: '#fca5a5', fontSize: 16, fontWeight: '600' },
});
