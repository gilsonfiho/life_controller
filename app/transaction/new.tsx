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
import { router } from 'expo-router';
import { TransactionCategory, TransactionStatus } from '@/types/financial';
import { useFinancialStore } from '@/store/financialStore';
import { getCurrentMonth } from '@/utils/calculations';
import { ALL_CATEGORIES } from '@/constants/categories';

const CATEGORIES = Object.entries(ALL_CATEGORIES) as [TransactionCategory, { label: string }][];

export default function NewTransactionScreen() {
  const { addTransaction, currentMonth } = useFinancialStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<TransactionCategory>('alimentacao');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState<TransactionStatus>('pendente');

  const handleSave = async () => {
    if (!description.trim()) return Alert.alert('Erro', 'Informe a descrição.');
    const parsed = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return Alert.alert('Erro', 'Informe um valor válido.');

    await addTransaction({
      description: description.trim(),
      amount: parsed,
      date,
      category,
      subcategory: subcategory.trim() || undefined,
      status,
      month: currentMonth,
      isRecurring: false,
    });

    router.back();
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
            placeholder="Ex: Mercado, Salário, Uber..."
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Valor (R$) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0,00"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data *</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="AAAA-MM-DD"
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
          <Text style={styles.label}>Subcategoria</Text>
          <TextInput
            style={styles.input}
            value={subcategory}
            onChangeText={setSubcategory}
            placeholder="Opcional"
            placeholderTextColor="#6b7280"
          />
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
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { flex: 1, padding: 16 },
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
    marginBottom: 32,
  },
  saveBtnText: { color: '#f9fafb', fontSize: 16, fontWeight: '700' },
});
