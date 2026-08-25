import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Expense } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const { monthData } = useBudget();
  const category = monthData.categories.find(cat => cat.id === expense.categoryId);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${expense.description}"?`)) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(expense.amount)}
          </span>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {expense.description}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-stone-500 dark:text-stone-400">
          <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-xs font-medium">
            {category?.name || 'Unknown'}
          </span>
          <span>{formatDate(expense.date)}</span>
        </div>
      </div>

      <div className="flex gap-1 ml-4">
        <button
          onClick={() => onEdit(expense)}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
          title="Edit expense"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Delete expense"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
