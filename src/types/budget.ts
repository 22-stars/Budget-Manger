// TypeScript interfaces for the Budget Management System

export interface Category {
  id: string;
  name: string;
  budgetLimit: number;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO format: YYYY-MM-DD
  description: string;
}

export interface MonthData {
  monthlyBudget: number;
  categories: Category[];
  expenses: Expense[];
}

export interface BudgetStore {
  [monthKey: string]: MonthData; // Key: "YYYY-MM" (e.g., "2026-08")
}

export type Theme = 'light' | 'dark';
