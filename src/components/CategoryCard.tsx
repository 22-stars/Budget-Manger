import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Category } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onAddExpense: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete, onAddExpense }) => {
  const { monthData } = useBudget();

  const categoryExpenses = monthData.expenses.filter(exp => exp.categoryId === category.id);
  const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = category.budgetLimit - spent;
  const usagePercentage = category.budgetLimit > 0 ? (spent / category.budgetLimit) * 100 : 0;

  const isOverBudget = usagePercentage > 100;
  const isWarning = usagePercentage >= 75 && usagePercentage <= 100;

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(val));
  };

  const getBorderColor = () => {
    if (isOverBudget) return 'border-red-300 dark:border-red-900';
    if (isWarning) return 'border-amber-300 dark:border-amber-900';
    return 'border-stone-200 dark:border-stone-800';
  };

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isWarning) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`bg-white dark:bg-stone-900 border-2 ${getBorderColor()} rounded-lg p-4 sm:p-5 transition-all hover:shadow-md active:scale-[0.98]`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[60%]">
          {category.name}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            title="Edit category"
            aria-label="Edit category"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete category"
            aria-label="Delete category"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">Spent</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">{formatCurrency(spent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">Budget</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">{formatCurrency(category.budgetLimit)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500 dark:text-stone-400">Left</span>
          <span className={`font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {isOverBudget ? '-' : ''}{formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center text-xs font-medium mb-1">
          <span className="text-stone-500 dark:text-stone-400">{usagePercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
        {isOverBudget && (
          <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(spent - category.budgetLimit)} over
          </p>
        )}
      </div>

      {/* Add expense button */}
      <button
        onClick={() => onAddExpense(category.id)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors text-sm font-medium active:scale-[0.97]"
        style={{ minHeight: '44px' }}
      >
        <Plus size={16} />
        Add Expense
      </button>
    </div>
  );
};
