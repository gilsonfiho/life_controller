import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, TransactionCategory } from '@/types/financial';
import { getCurrentMonth } from '@/utils/calculations';
import seedData from '@/data/seed/may2025.json';

const STORAGE_KEY = '@life_controller:transactions';

interface FinancialStore {
  transactions: Transaction[];
  currentMonth: string;
  isLoaded: boolean;

  // Navegação de mês
  setCurrentMonth: (month: string) => void;

  // CRUD
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Persistência
  loadTransactions: () => Promise<void>;
  saveTransactions: (transactions: Transaction[]) => Promise<void>;

  // Seed
  seedFromImport: () => Promise<void>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  transactions: [],
  currentMonth: getCurrentMonth(),
  isLoaded: false,

  setCurrentMonth: (month) => set({ currentMonth: month }),

  addTransaction: async (transaction) => {
    const newTransaction: Transaction = { ...transaction, id: generateId() };
    const updated = [...get().transactions, newTransaction];
    set({ transactions: updated });
    await get().saveTransactions(updated);
  },

  updateTransaction: async (id, updates) => {
    const updated = get().transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    set({ transactions: updated });
    await get().saveTransactions(updated);
  },

  deleteTransaction: async (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    set({ transactions: updated });
    await get().saveTransactions(updated);
  },

  loadTransactions: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ transactions: JSON.parse(stored), isLoaded: true });
      } else {
        // Primeira vez: carrega seed de Maio/2025
        await get().seedFromImport();
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  saveTransactions: async (transactions) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  seedFromImport: async () => {
    const seeded: Transaction[] = (seedData.transactions as Omit<Transaction, 'id'>[]).map((t) => ({
      ...t,
      id: generateId(),
      month: seedData.month,
    }));
    set({ transactions: seeded, currentMonth: seedData.month });
    await get().saveTransactions(seeded);
  },
}));
