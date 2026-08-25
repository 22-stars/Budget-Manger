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

  const getUsageProgressColor = (pct: number) => {
    if (pct > 100) return 'bg-red-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider mb-1">
            Total Budget
            <button
              onClick={onEditBudget}
              className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              title="Edit monthly budget"
            >
              <Edit2 size={12} />
            </button>
          </div>
          <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {formatCurrency(monthlyBudget)}
          </div>
        </div>

        <div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider mb-1">
            Total Spent
          </div>
          <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {formatCurrency(totalSpent)}
          </div>
        </div>

        <div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider mb-1">
            Remaining
          </div>
          <div className={`text-2xl font-bold tracking-tight ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {isOverBudget ? '-' : ''}
            {formatCurrency(remaining)}
          </div>
        </div>

        <div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider mb-1">
            Budget Usage
          </div>
          <div className={`text-2xl font-bold tracking-tight ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {usagePercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-medium mb-1">
          <span className="text-stone-500 dark:text-stone-400">
            Progress
          </span>
          <span className="text-stone-800 dark:text-stone-200">
            {formatCurrency(totalSpent)} / {formatCurrency(monthlyBudget)}
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getUsageProgressColor(usagePercentage)}`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
        {isOverBudget && (
          <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 text-right">
            Budget overdrawn by {formatCurrency(totalSpent - monthlyBudget)}
          </p>
        )}
      </div>
    </div>
  );
};
