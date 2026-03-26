import { Transaction, MonthSummary, TransactionCategory } from '@/types/financial';
import { EXPENSE_CATEGORY_KEYS } from '@/constants/categories';

export function isExpense(category: TransactionCategory): boolean {
  return EXPENSE_CATEGORY_KEYS.includes(category as never);
}

export function calculateMonthSummary(transactions: Transaction[], month: string): MonthSummary {
  const monthTransactions = transactions.filter((t) => t.month === month);

  const byCategory = {} as Record<TransactionCategory, number>;

  let totalExpenses = 0;
  let totalIncome = 0;

  for (const t of monthTransactions) {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;

    if (isExpense(t.category)) {
      totalExpenses += t.amount;
    } else {
      totalIncome += t.amount;
    }
  }

  return {
    month,
    totalExpenses,
    totalIncome,
    balance: totalIncome - totalExpenses,
    byCategory,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function parseMonthLabel(month: string): string {
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function addMonths(month: string, delta: number): string {
  const [year, m] = month.split('-').map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
}

/**
 * Gera os lançamentos futuros de uma parcela no cartão.
 * Retorna os meses seguintes (sem o mês atual, que já foi lançado).
 */
export function generateInstallmentMonths(
  baseTransaction: Omit<Transaction, 'id' | 'month' | 'installmentInfo'>,
  startMonth: string,
  currentInstallment: number,
  totalInstallments: number
): Array<Omit<Transaction, 'id'>> {
  const remaining: Array<Omit<Transaction, 'id'>> = [];

  for (let i = currentInstallment + 1; i <= totalInstallments; i++) {
    const futureMonth = addMonths(startMonth, i - currentInstallment);
    remaining.push({
      ...baseTransaction,
      month: futureMonth,
      installmentInfo: {
        totalInstallments,
        currentInstallment: i,
        originalItemName: baseTransaction.description,
      },
    });
  }

  return remaining;
}
