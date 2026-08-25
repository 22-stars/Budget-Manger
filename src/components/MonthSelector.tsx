import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

export const MonthSelector: React.FC = () => {
  const { currentMonthKey, setCurrentMonthKey } = useBudget();

  const parseMonthKey = (key: string): Date => {
    const [year, month] = key.split('-').map(Number);
    return new Date(year, month - 1, 1);
  };

  const formatMonthKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const formatDisplay = (key: string): string => {
    const date = parseMonthKey(key);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    const current = parseMonthKey(currentMonthKey);
    current.setMonth(current.getMonth() - 1);
    setCurrentMonthKey(formatMonthKey(current));
  };

  const goToNextMonth = () => {
    const current = parseMonthKey(currentMonthKey);
    current.setMonth(current.getMonth() + 1);
    setCurrentMonthKey(formatMonthKey(current));
  };

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <button
        onClick={goToPreviousMonth}
        className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>

      <h2 className="text-2xl font-medium text-stone-900 dark:text-stone-100 min-w-[200px] text-center">
        {formatDisplay(currentMonthKey)}
      </h2>

      <button
        onClick={goToNextMonth}
        className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
