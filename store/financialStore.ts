import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/financial';
import { getCurrentMonth } from '@/utils/calculations';
import seedData from '@/data/seed/all_months.json';

const STORAGE_KEY = '@life_controller:transactions';
const SEEDED_KEY = '@life_controller:seeded';

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
  resetToSeedData: () => Promise<void>;
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
      const alreadySeeded = await AsyncStorage.getItem(SEEDED_KEY);
      if (!alreadySeeded) {
        const seed = seedData as Transaction[];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        await AsyncStorage.setItem(SEEDED_KEY, '1');
        set({ transactions: seed, currentMonth: getCurrentMonth(), isLoaded: true });
        return;
      }
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

  resetToSeedData: async () => {
    const seed = seedData as Transaction[];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    await AsyncStorage.setItem(SEEDED_KEY, '1');
    set({ transactions: seed, currentMonth: getCurrentMonth() });
  },

  clearAllData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(SEEDED_KEY);
    set({ transactions: [], currentMonth: getCurrentMonth() });
  },
}));
