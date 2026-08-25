import React, { useState, useMemo } from 'react';
import { Plus, ArrowUpDown } from 'lucide-react';
import { ExpenseItem } from './ExpenseItem';
import type { Expense } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface ExpenseListProps {
  onAddExpense: (categoryId?: string) => void;
  onEditExpense: (expense: Expense) => void;
}

type SortField = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

export const ExpenseList: React.FC<ExpenseListProps> = ({ onAddExpense, onEditExpense }) => {
  const { monthData, deleteExpense } = useBudget();
  const { expenses, categories } = monthData;

  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    if (filterCategoryId !== 'all') {
      filtered = expenses.filter(exp => exp.categoryId === filterCategoryId);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortField === 'date') {
        const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.amount - b.amount;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return sorted;
  }, [expenses, filterCategoryId, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Recent Expenses
        </h2>
        <button
          onClick={() => onAddExpense()}
          className="flex items-center gap-1.5 py-2 px-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="categoryFilter" className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Filter:
          </label>
          <select
            id="categoryFilter"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Sort:
          </span>
          <button
            onClick={() => toggleSort('date')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sortField === 'date'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            Date
            {sortField === 'date' && <ArrowUpDown size={14} />}
          </button>
          <button
            onClick={() => toggleSort('amount')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              sortField === 'amount'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            Amount
            {sortField === 'amount' && <ArrowUpDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expenses List */}
      {filteredAndSortedExpenses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg">
          <p className="text-stone-500 dark:text-stone-400">
            {filterCategoryId !== 'all'
              ? 'No expenses found for this category.'
              : 'No expenses recorded yet. Click "Add Expense" to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEditExpense}
              onDelete={deleteExpense}
            />
          ))}
        </div>
      )}

      {filteredAndSortedExpenses.length > 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400 text-center pt-2">
          Showing {filteredAndSortedExpenses.length} of {expenses.length} expense(s)
        </p>
      )}
    </div>
  );
};
