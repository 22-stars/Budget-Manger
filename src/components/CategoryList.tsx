import React from 'react';
import { Plus } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import type { Category } from '../types/budget';
import { useBudget } from '../context/BudgetContext';

interface CategoryListProps {
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onAddExpense: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  onAddCategory,
  onEditCategory,
  onAddExpense
}) => {
  const { monthData, deleteCategory } = useBudget();
  const { categories, expenses } = monthData;

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const categoryExpensesCount = expenses.filter(exp => exp.categoryId === categoryId).length;

    let confirmMessage = `Are you sure you want to delete "${category?.name}"?`;
    if (categoryExpensesCount > 0) {
      confirmMessage += `\n\n${categoryExpensesCount} expense(s) will move to "Other".`;
    }

    if (window.confirm(confirmMessage)) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
          Categories
        </h2>
        <button
          onClick={onAddCategory}
          className="flex items-center gap-1.5 py-2.5 px-4 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors active:scale-95"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 sm:py-12 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg">
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base">
            No categories yet. Tap "Add" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEditCategory}
              onDelete={handleDeleteCategory}
              onAddExpense={onAddExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
};
