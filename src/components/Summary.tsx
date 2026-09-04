import React from 'react';
import { Edit2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

interface SummaryProps {
  onEditBudget: () => void;
}

export const Summary: React.FC<SummaryProps> = ({ onEditBudget }) => {
  const { monthData } = useBudget();
  const { monthlyBudget, expenses } = monthData;

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = monthlyBudget - totalSpent;
  const usagePercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const isOverBudget = remaining < 0;

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(val));
  };

  const getBarColor = (pct: number) => {
    if (pct > 100) return 'bg-red-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          This Month
        </h2>
        <button
          onClick={onEditBudget}
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          title="Edit budget"
          aria-label="Edit budget"
          style={{ minWidth: '32px', minHeight: '32px' }}
        >
          <Edit2 size={14} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-stone-500 dark:text-stone-500 mb-1">Budget</div>
          <div className="text-base sm:text-xl font-semibold text-stone-900 dark:text-stone-100">
            {formatCurrency(monthlyBudget)}
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-stone-500 dark:text-stone-500 mb-1">Spent</div>
          <div className="text-base sm:text-xl font-semibold text-stone-900 dark:text-stone-100">
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-stone-500 dark:text-stone-500 mb-1">Remaining</div>
          <div className={`text-base sm:text-xl font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {isOverBudget ? '-' : ''}{formatCurrency(remaining)}
          </div>
        </div>
        <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-stone-500 dark:text-stone-500 mb-1">Used</div>
          <div className={`text-base sm:text-xl font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {usagePercentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-stone-500 dark:text-stone-500 mb-1">
          <span>{formatCurrency(totalSpent)} used</span>
          <span>{formatCurrency(monthlyBudget)} total</span>
        </div>
        <div className="h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getBarColor(usagePercentage)}`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
        {isOverBudget && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            Over budget by {formatCurrency(totalSpent - monthlyBudget)}
          </p>
        )}
      </div>
    </div>
  );
};
