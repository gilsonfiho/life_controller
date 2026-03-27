import { useMemo } from 'react';
import { useFinancialStore } from '@/store/financialStore';
import { calculateMonthSummary } from '@/utils/calculations';

export function useMonthSummary(month?: string) {
  const { transactions, currentMonth } = useFinancialStore();
  const targetMonth = month ?? currentMonth;

  const summary = useMemo(
    () => calculateMonthSummary(transactions, targetMonth),
    [transactions, targetMonth]
  );

  return summary;
}
