import { useMemo } from 'react';
import { useFinancialStore } from '@/store/financialStore';
import { Transaction, TransactionCategory } from '@/types/financial';
import { EXPENSE_CATEGORY_KEYS } from '@/constants/categories';

export function useTransactions(month?: string) {
  const { transactions, currentMonth } = useFinancialStore();
  const targetMonth = month ?? currentMonth;

  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.month === targetMonth),
    [transactions, targetMonth]
  );

  const byCategory = useMemo(() => {
    const map: Partial<Record<TransactionCategory, Transaction[]>> = {};
    for (const t of monthTransactions) {
      if (!map[t.category]) map[t.category] = [];
      map[t.category]!.push(t);
    }
    return map;
  }, [monthTransactions]);

  const expenses = useMemo(
    () => monthTransactions.filter((t) => EXPENSE_CATEGORY_KEYS.includes(t.category as never)),
    [monthTransactions]
  );

  const incomes = useMemo(
    () => monthTransactions.filter((t) => t.category === 'entrada'),
    [monthTransactions]
  );

  return { monthTransactions, byCategory, expenses, incomes };
}
