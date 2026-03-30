import { useMemo } from 'react';
import { useFinancialStore } from '@/store/financialStore';
import { Transaction, TransactionCategory, TransactionStatus } from '@/types/financial';
import { EXPENSE_CATEGORY_KEYS } from '@/constants/categories';

export function useTransactions(
  month?: string,
  status?: TransactionStatus,
  category?: TransactionCategory,
  search?: string
) {
  const { transactions, currentMonth } = useFinancialStore();
  const targetMonth = month ?? currentMonth;
  const normalizedSearch = search?.trim().toLowerCase();

  const monthTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const matchesMonth = t.month === targetMonth;
        const matchesStatus = status === undefined || t.status === status;
        const matchesCategory = category === undefined || t.category === category;
        const matchesSearch =
          !normalizedSearch ||
          t.description.toLowerCase().includes(normalizedSearch);
        return matchesMonth && matchesStatus && matchesCategory && matchesSearch;
      }),
    [transactions, targetMonth, status, category, normalizedSearch]
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
