import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { parseMonthLabel, addMonths } from '@/utils/calculations';
import { useFinancialStore } from '@/store/financialStore';

export function MonthNavigator() {
  const { currentMonth, setCurrentMonth } = useFinancialStore();

  const handlePrev = () => setCurrentMonth(addMonths(currentMonth, -1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.btn}>
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.label}>{parseMonthLabel(currentMonth)}</Text>
      <TouchableOpacity onPress={handleNext} style={styles.btn}>
        <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  btn: {
    padding: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    minWidth: 180,
    textAlign: 'center',
  },
});
