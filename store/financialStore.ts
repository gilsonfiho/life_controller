import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/financial';
import { getCurrentMonth } from '@/utils/calculations';

const STORAGE_KEY = '@life_controller:transactions';

interface FinancialStore {
  transactions: Transaction[];
  currentMonth: string;
  isLoaded: boolean;

  setCurrentMonth: (month: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  saveTransactions: (transactions: Transaction[]) => Promise<void>;
  importTransactions: (transactions: Transaction[]) => Promise<void>;
  clearAllData: () => Promise<void>;
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
    const newTx: Transaction = { ...transaction, id: generateId() };
    const updated = [...get().transactions, newTx];
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
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  saveTransactions: async (transactions) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },

  importTransactions: async (incoming) => {
    const withIds = incoming.map((t) => ({ ...t, id: t.id || generateId() }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withIds));
    set({ transactions: withIds, currentMonth: getCurrentMonth() });
  },

  clearAllData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ transactions: [], currentMonth: getCurrentMonth() });
  },
}));
