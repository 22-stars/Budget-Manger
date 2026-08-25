import React, { useState } from 'react';
import { Modal } from './Modal';
import { useBudget } from '../context/BudgetContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { monthData, updateMonthlyBudget } = useBudget();
  const [budget, setBudget] = useState(monthData.monthlyBudget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(budget);
    if (!isNaN(value) && value >= 0) {
      updateMonthlyBudget(value);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Monthly Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Monthly Budget (₹)
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
            placeholder="Enter monthly budget"
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
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
