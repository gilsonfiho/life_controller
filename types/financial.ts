// Categoria de transação
export type TransactionCategory =
  | 'despesa_fixa'
  | 'parcela_cartao'
  | 'transporte'
  | 'despesa_avulsa'
  | 'alimentacao'
  | 'lazer'
  | 'entrada';

// Situação do lançamento
export type TransactionStatus = 'pago' | 'pendente' | 'agendado';

// Transação financeira
export interface Transaction {
  id: string;
  description: string;
  amount: number; // sempre positivo — TransactionCategory define se é entrada ou saída
  date: string; // ISO 8601
  category: TransactionCategory;
  subcategory?: string;
  status: TransactionStatus;
  month: string; // "2025-05"
  isRecurring: boolean;
  installmentInfo?: {
    totalInstallments: number;
    currentInstallment: number;
    originalItemName: string;
  };
}

// Resumo mensal
export interface MonthSummary {
  month: string; // "2025-05"
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  byCategory: Record<TransactionCategory, number>;
}
