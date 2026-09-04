import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MonthData } from '../types/budget';
import * as budgetStore from '../services/budgetStore';
import * as cloudBudgetStore from '../services/cloudBudgetStore';
import { useAuth } from './AuthContext';

interface BudgetContextType {
  currentMonthKey: string;
  monthData: MonthData;
  loading: boolean;
  setCurrentMonthKey: (monthKey: string) => void;
  refreshData: () => Promise<void>;
  updateMonthlyBudget: (budget: number) => void;
  addCategory: (name: string, budgetLimit: number) => void;
  updateCategory: (categoryId: string, name: string, budgetLimit: number) => void;
  deleteCategory: (categoryId: string) => void;
  addExpense: (amount: number, categoryId: string, date: string, description: string) => void;
  updateExpense: (expenseId: string, updated: { amount?: number; categoryId?: string; date?: string; description?: string }) => void;
  deleteExpense: (expenseId: string) => void;
  syncing: boolean;
  syncedAt: string | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(getCurrentMonthKey());
  const [monthData, setMonthData] = useState<MonthData>(() => budgetStore.getMonthData(currentMonthKey));
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const isCloudEnabled = !!user && !!session;

  // Load data from cloud or local storage
  const loadData = useCallback(async () => {
    if (isCloudEnabled && user?.id) {
      try {
        const data = await cloudBudgetStore.fetchMonthData(user.id, currentMonthKey);
        setMonthData(data);
      } catch (e) {
        console.warn('Cloud fetch failed, using local:', e);
        setMonthData(budgetStore.getMonthData(currentMonthKey));
      }
    } else {
      setMonthData(budgetStore.getMonthData(currentMonthKey));
    }
    setLoading(false);
  }, [currentMonthKey, isCloudEnabled, user?.id]);

  // Initial load and reload on month/user change
  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const persistToCloud = useCallback(async (data: MonthData) => {
    if (!isCloudEnabled || !user?.id) return false;
    try {
      setSyncing(true);
      await cloudBudgetStore.saveMonthData(user.id, currentMonthKey, data);
      setSyncedAt(new Date().toISOString());
      return true;
    } catch (e) {
      console.error('Cloud sync failed:', e);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [isCloudEnabled, user?.id, currentMonthKey]);

  const updateMonthlyBudget = (budget: number) => {
    const updated = budgetStore.updateMonthlyBudget(currentMonthKey, budget);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const addCategory = (name: string, budgetLimit: number) => {
    const updated = budgetStore.addCategory(currentMonthKey, name, budgetLimit);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const updateCategory = (categoryId: string, name: string, budgetLimit: number) => {
    const updated = budgetStore.updateCategory(currentMonthKey, categoryId, name, budgetLimit);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const deleteCategory = (categoryId: string) => {
    const updated = budgetStore.deleteCategory(currentMonthKey, categoryId);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const addExpense = (amount: number, categoryId: string, date: string, description: string) => {
    const updated = budgetStore.addExpense(currentMonthKey, amount, categoryId, date, description);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const updateExpense = (expenseId: string, updated: { amount?: number; categoryId?: string; date?: string; description?: string }) => {
    const result = budgetStore.updateExpense(currentMonthKey, expenseId, updated);
    setMonthData(result);
    persistToCloud(result);
  };

  const deleteExpense = (expenseId: string) => {
    const updated = budgetStore.deleteExpense(currentMonthKey, expenseId);
    setMonthData(updated);
    persistToCloud(updated);
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    const cloudData = await cloudBudgetStore.fetchMonthData(user?.id ?? '', currentMonthKey);
    if (cloudData) setMonthData(cloudData);
    setLoading(false);
  }, [currentMonthKey, user?.id]);

  return (
    <BudgetContext.Provider value={{
      currentMonthKey,
      monthData,
      loading,
      setCurrentMonthKey,
      refreshData,
      updateMonthlyBudget,
      addCategory,
      updateCategory,
      deleteCategory,
      addExpense,
      updateExpense,
      deleteExpense,
      syncing,
      syncedAt,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};
