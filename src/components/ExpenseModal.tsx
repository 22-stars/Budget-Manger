import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Expense } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  preselectedCategoryId?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, expense, preselectedCategoryId }) => {
  const { monthData, addExpense, updateExpense } = useBudget();
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategoryId(expense.categoryId);
      setDate(expense.date);
      setDescription(expense.description);
    } else {
      setAmount('');
      setCategoryId(preselectedCategoryId || (monthData.categories[0]?.id || ''));
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [expense, isOpen, preselectedCategoryId, monthData.categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!isNaN(value) && value >= 0 && categoryId && date && description.trim()) {
      if (expense) {
        updateExpense(expense.id, {
          amount: value,
          categoryId,
          date,
          description: description.trim()
        });
      } else {
        addExpense(value, categoryId, date, description.trim());
      }
      onClose();
      setAmount('');
      setCategoryId('');
      setDate('');
      setDescription('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            placeholder="Enter amount"
            min="0"
            step="1"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            required
          >
            <option value="">Select category</option>
            {monthData.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            placeholder="e.g., Grocery shopping"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors font-medium"
          >
            {expense ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
