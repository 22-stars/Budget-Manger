import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MonthData } from '../types/budget';
import * as budgetStore from '../services/budgetStore';

interface BudgetContextType {
  currentMonthKey: string;
  monthData: MonthData;
  setCurrentMonthKey: (monthKey: string) => void;
  refreshData: () => void;
  updateMonthlyBudget: (budget: number) => void;
  addCategory: (name: string, budgetLimit: number) => void;
  updateCategory: (categoryId: string, name: string, budgetLimit: number) => void;
  deleteCategory: (categoryId: string) => void;
  addExpense: (amount: number, categoryId: string, date: string, description: string) => void;
  updateExpense: (expenseId: string, updated: { amount?: number; categoryId?: string; date?: string; description?: string }) => void;
  deleteExpense: (expenseId: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(getCurrentMonthKey());
  const [monthData, setMonthData] = useState<MonthData>(() => budgetStore.getMonthData(currentMonthKey));

  const refreshData = () => {
    setMonthData(budgetStore.getMonthData(currentMonthKey));
  };

  useEffect(() => {
    refreshData();
  }, [currentMonthKey]);

  const updateMonthlyBudget = (budget: number) => {
    budgetStore.updateMonthlyBudget(currentMonthKey, budget);
    refreshData();
  };

  const addCategory = (name: string, budgetLimit: number) => {
    budgetStore.addCategory(currentMonthKey, name, budgetLimit);
    refreshData();
  };

  const updateCategory = (categoryId: string, name: string, budgetLimit: number) => {
    budgetStore.updateCategory(currentMonthKey, categoryId, name, budgetLimit);
    refreshData();
  };

  const deleteCategory = (categoryId: string) => {
    budgetStore.deleteCategory(currentMonthKey, categoryId);
    refreshData();
  };

  const addExpense = (amount: number, categoryId: string, date: string, description: string) => {
    budgetStore.addExpense(currentMonthKey, amount, categoryId, date, description);
    refreshData();
  };

  const updateExpense = (expenseId: string, updated: { amount?: number; categoryId?: string; date?: string; description?: string }) => {
    budgetStore.updateExpense(currentMonthKey, expenseId, updated);
    refreshData();
  };

  const deleteExpense = (expenseId: string) => {
    budgetStore.deleteExpense(currentMonthKey, expenseId);
    refreshData();
  };

  return (
    <BudgetContext.Provider value={{
      currentMonthKey,
      monthData,
      setCurrentMonthKey,
      refreshData,
      updateMonthlyBudget,
      addCategory,
      updateCategory,
      deleteCategory,
      addExpense,
      updateExpense,
      deleteExpense
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
