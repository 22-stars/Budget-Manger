import { useState } from 'react';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { Summary } from './components/Summary';
import { CategoryList } from './components/CategoryList';
import { ExpenseList } from './components/ExpenseList';
import { BudgetModal } from './components/BudgetModal';
import { CategoryModal } from './components/CategoryModal';
import { ExpenseModal } from './components/ExpenseModal';
import type { Category, Expense } from './types/budget';

function App() {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>(undefined);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddExpense = (categoryId?: string) => {
    setEditingExpense(null);
    setPreselectedCategoryId(categoryId);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setPreselectedCategoryId(undefined);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <MonthSelector />

        <Summary onEditBudget={() => setIsBudgetModalOpen(true)} />

        <CategoryList
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onAddExpense={handleAddExpense}
        />

        <ExpenseList
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
        />
      </main>

      {/* Modals */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
          setPreselectedCategoryId(undefined);
        }}
        expense={editingExpense}
        preselectedCategoryId={preselectedCategoryId}
      />
    </div>
  );
}

export default App;
