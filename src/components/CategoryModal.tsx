import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Category } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category }) => {
  const { addCategory, updateCategory } = useBudget();
  const [name, setName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setBudgetLimit(category.budgetLimit.toString());
    } else {
      setName('');
      setBudgetLimit('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(budgetLimit);
    if (name.trim() && !isNaN(value) && value >= 0) {
      if (category) {
        updateCategory(category.id, name.trim(), value);
      } else {
        addCategory(name.trim(), value);
      }
      onClose();
      setName('');
      setBudgetLimit('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            placeholder="e.g., Food, Rent, Entertainment"
            required
          />
        </div>

        <div>
          <label htmlFor="categoryBudget" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Budget Limit (₹)
          </label>
          <input
            type="number"
            id="categoryBudget"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            placeholder="Enter budget limit"
            min="0"
            step="100"
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
            {category ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
