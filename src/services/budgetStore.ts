import type { Category, Expense, MonthData, BudgetStore } from '../types/budget';

const STORAGE_KEY = 'personal_budget_store';

// Helper to generate IDs
const generateId = (): string => Math.random().toString(36).substring(2, 9);

// Demo data for August 2026
const getSeedData = (): MonthData => {
  const categories: Category[] = [
    { id: 'cat-food', name: 'Food', budgetLimit: 8000 },
    { id: 'cat-trans', name: 'Transportation', budgetLimit: 5000 },
    { id: 'cat-shop', name: 'Shopping', budgetLimit: 6000 },
    { id: 'cat-bills', name: 'Bills', budgetLimit: 10000 },
    { id: 'cat-ent', name: 'Entertainment', budgetLimit: 3000 },
    { id: 'cat-save', name: 'Savings', budgetLimit: 15000 },
    { id: 'cat-other', name: 'Other', budgetLimit: 3000 }
  ];

  const expenses: Expense[] = [
    { id: generateId(), amount: 850, categoryId: 'cat-food', date: '2026-08-25', description: 'Dinner team outing' },
    { id: generateId(), amount: 450, categoryId: 'cat-trans', date: '2026-08-24', description: 'Uber ride' },
    { id: generateId(), amount: 2500, categoryId: 'cat-shop', date: '2026-08-23', description: 'Bought new jeans' },
    { id: generateId(), amount: 9500, categoryId: 'cat-bills', date: '2026-08-01', description: 'House rent & electric bill' },
    { id: generateId(), amount: 1200, categoryId: 'cat-ent', date: '2026-08-15', description: 'Movie & popcorn' },
    { id: generateId(), amount: 250, categoryId: 'cat-food', date: '2026-08-12', description: 'Office lunch' },
    { id: generateId(), amount: 15000, categoryId: 'cat-save', date: '2026-08-05', description: 'Mutual fund SIP' },
    { id: generateId(), amount: 1200, categoryId: 'cat-food', date: '2026-08-18', description: 'Grocery shopping' },
    { id: generateId(), amount: 3500, categoryId: 'cat-shop', date: '2026-08-14', description: 'New running shoes' },
    { id: generateId(), amount: 800, categoryId: 'cat-trans', date: '2026-08-10', description: 'Car fuel refill' },
    { id: generateId(), amount: 1500, categoryId: 'cat-food', date: '2026-08-20', description: 'Restaurant dinner' },
    { id: generateId(), amount: 650, categoryId: 'cat-ent', date: '2026-08-22', description: 'Concert tickets' }
  ];

  return {
    monthlyBudget: 60000,
    categories,
    expenses
  };
};

// Initialize the store in localStorage if empty
export const initializeStore = (): BudgetStore => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error('Failed to parse budget store from localStorage:', error);
  }

  const seedStore: BudgetStore = {
    '2026-08': getSeedData()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStore));
  return seedStore;
};

export const getStore = (): BudgetStore => {
  return initializeStore();
};

export const saveStore = (store: BudgetStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const getMonthData = (monthKey: string): MonthData => {
  const store = getStore();
  if (store[monthKey]) {
    return store[monthKey];
  }

  let defaultCategories: Category[] = [
    { id: 'cat-food', name: 'Food', budgetLimit: 8000 },
    { id: 'cat-trans', name: 'Transportation', budgetLimit: 5000 },
    { id: 'cat-shop', name: 'Shopping', budgetLimit: 6000 },
    { id: 'cat-bills', name: 'Bills', budgetLimit: 10000 },
    { id: 'cat-ent', name: 'Entertainment', budgetLimit: 3000 },
    { id: 'cat-save', name: 'Savings', budgetLimit: 15000 },
    { id: 'cat-other', name: 'Other', budgetLimit: 3000 }
  ];
  let defaultBudget = 60000;

  const months = Object.keys(store).sort();
  if (months.length > 0) {
    const closestMonth = months[months.length - 1];
    const closestData = store[closestMonth];
    defaultCategories = closestData.categories.map(c => ({
      id: c.id,
      name: c.name,
      budgetLimit: c.budgetLimit
    }));
    defaultBudget = closestData.monthlyBudget;
  }

  const newMonthData: MonthData = {
    monthlyBudget: defaultBudget,
    categories: defaultCategories,
    expenses: []
  };

  store[monthKey] = newMonthData;
  saveStore(store);
  return newMonthData;
};

export const updateMonthlyBudget = (monthKey: string, budget: number): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  monthData.monthlyBudget = Math.max(0, budget);
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const addCategory = (monthKey: string, name: string, budgetLimit: number): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  const newCategory: Category = {
    id: `cat-${generateId()}`,
    name,
    budgetLimit: Math.max(0, budgetLimit)
  };
  monthData.categories.push(newCategory);
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const updateCategory = (monthKey: string, categoryId: string, name: string, budgetLimit: number): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  monthData.categories = monthData.categories.map(cat =>
    cat.id === categoryId
      ? { ...cat, name, budgetLimit: Math.max(0, budgetLimit) }
      : cat
  );
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const deleteCategory = (monthKey: string, categoryId: string): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);

  monthData.categories = monthData.categories.filter(cat => cat.id !== categoryId);

  const hasOther = monthData.categories.find(c => c.name.toLowerCase() === 'other');
  const otherId = hasOther?.id || 'cat-other';

  if (!hasOther && monthData.expenses.some(e => e.categoryId === categoryId)) {
    const otherCategory: Category = {
      id: 'cat-other',
      name: 'Other',
      budgetLimit: 3000
    };
    monthData.categories.push(otherCategory);
  }

  monthData.expenses = monthData.expenses.map(exp =>
    exp.categoryId === categoryId
      ? { ...exp, categoryId: otherId }
      : exp
  );

  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const addExpense = (monthKey: string, amount: number, categoryId: string, date: string, description: string): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  const newExpense: Expense = {
    id: `exp-${generateId()}`,
    amount: Math.max(0, amount),
    categoryId,
    date,
    description: description.trim() || 'Expense'
  };
  monthData.expenses.push(newExpense);
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const updateExpense = (monthKey: string, expenseId: string, updated: Partial<Omit<Expense, 'id'>>): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  monthData.expenses = monthData.expenses.map(exp =>
    exp.id === expenseId
      ? { ...exp, ...updated }
      : exp
  );
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};

export const deleteExpense = (monthKey: string, expenseId: string): MonthData => {
  const store = getStore();
  const monthData = getMonthData(monthKey);
  monthData.expenses = monthData.expenses.filter(exp => exp.id !== expenseId);
  store[monthKey] = monthData;
  saveStore(store);
  return monthData;
};
