import type { Category, Expense, MonthData } from '../types/budget';
import { supabase } from '../lib/supabase';

export interface DbRow {
  id: string;
  user_id: string;
  month_key: string;
  monthly_budget: number;
  categories: Category[];
  expenses: Expense[];
  updated_at: string;
}

// Query existing row by user_id + month_key
async function getExistingRow(userId: string, monthKey: string): Promise<DbRow | null> {
  const { data, error } = await supabase
    .from('budget_data')
    .select('*')
    .eq('user_id', userId)
    .eq('month_key', monthKey)
    .single();

  if (error) return null;
  return data as DbRow;
}

export async function fetchMonthData(userId: string, monthKey: string): Promise<MonthData> {
  console.log('[Cloud] Fetching for user:', userId, 'month:', monthKey);

  const existing = await getExistingRow(userId, monthKey);
  if (existing) {
    console.log('[Cloud] Found row:', {
      budget: existing.monthly_budget,
      categories: existing.categories?.length ?? 0,
      expenses: existing.expenses?.length ?? 0,
    });
    return {
      monthlyBudget: Number(existing.monthly_budget),
      categories: existing.categories as Category[],
      expenses: existing.expenses as Expense[],
    };
  }

  console.log('[Cloud] No row found, using localStorage');
  return getLocalMonthData(monthKey);
}

export async function saveMonthData(userId: string, monthKey: string, data: MonthData): Promise<void> {
  console.log('[Cloud] Saving for user:', userId, 'month:', monthKey);

  try {
    const existing = await getExistingRow(userId, monthKey);

    if (existing) {
      // UPDATE existing row
      const { error } = await supabase
        .from('budget_data')
        .update({
          monthly_budget: data.monthlyBudget,
          categories: data.categories,
          expenses: data.expenses,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;
      console.log('[Cloud] Update successful');
    } else {
      // INSERT new row
      const { error } = await supabase
        .from('budget_data')
        .insert({
          user_id: userId,
          month_key: monthKey,
          monthly_budget: data.monthlyBudget,
          categories: data.categories,
          expenses: data.expenses,
        })
        .select()
        .single();

      if (error) throw error;
      console.log('[Cloud] Insert successful');
    }

    // Also persist locally as backup
    saveLocalMonthData(monthKey, data);
  } catch (e) {
    console.error('[Cloud] Save failed:', e);
    // Still save locally
    saveLocalMonthData(monthKey, data);
    throw e;
  }
}

// --- localStorage helpers ---

const LOCAL_KEY = 'personal_budget_store';

function getStore(): Record<string, MonthData> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveLocalMonthData(monthKey: string, data: MonthData): void {
  const store = getStore();
  store[monthKey] = data;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
}

function getLocalMonthData(monthKey: string): MonthData {
  const store = getStore();
  if (store[monthKey]) return store[monthKey];

  const defaults = getDefaultsFromStore(store);
  const newMonthData: MonthData = {
    monthlyBudget: defaults.budget,
    categories: defaults.categories,
    expenses: [],
  };
  saveLocalMonthData(monthKey, newMonthData);
  return newMonthData;
}

function getDefaultsFromStore(store: Record<string, MonthData>): { budget: number; categories: Category[] } {
  const months = Object.keys(store).sort();
  if (months.length > 0) {
    const last = store[months[months.length - 1]];
    return {
      budget: last.monthlyBudget,
      categories: last.categories.map(c => ({ ...c })) as Category[],
    };
  }
  return {
    budget: 60000,
    categories: [
      { id: 'cat-food', name: 'Food', budgetLimit: 8000 },
      { id: 'cat-trans', name: 'Transportation', budgetLimit: 5000 },
      { id: 'cat-shop', name: 'Shopping', budgetLimit: 6000 },
      { id: 'cat-bills', name: 'Bills', budgetLimit: 10000 },
      { id: 'cat-ent', name: 'Entertainment', budgetLimit: 3000 },
      { id: 'cat-save', name: 'Savings', budgetLimit: 15000 },
      { id: 'cat-other', name: 'Other', budgetLimit: 3000 },
    ],
  };
}
