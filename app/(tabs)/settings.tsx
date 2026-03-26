import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useFinancialStore } from '@/store/financialStore';

export default function SettingsScreen() {
  const { seedFromImport, transactions } = useFinancialStore();

  const handleReset = () => {
    Alert.alert(
      'Resetar Dados',
      'Isso vai apagar todos os lançamentos e carregar os dados de exemplo de Maio/2025. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: () => seedFromImport() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total de lançamentos</Text>
          <Text style={styles.infoValue}>{transactions.length}</Text>
        </View>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleReset}>
          <Text style={styles.dangerBtnText}>Carregar dados de exemplo (Maio/2025)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.about}>Life Controller v0.1.0</Text>
        <Text style={styles.about}>Controle financeiro pessoal</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#d1d5db',
    fontSize: 14,
  },
  infoValue: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerBtn: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dangerBtnText: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '500',
  },
  about: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 4,
  },
});
