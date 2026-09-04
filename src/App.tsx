import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { Summary } from './components/Summary';
import { CategoryList } from './components/CategoryList';
import { ExpenseList } from './components/ExpenseList';
import { BudgetModal } from './components/BudgetModal';
import { CategoryModal } from './components/CategoryModal';
import { ExpenseModal } from './components/ExpenseModal';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './context/AuthContext';
import { useBudget } from './context/BudgetContext';
import type { Category, Expense } from './types/budget';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { loading: budgetLoading } = useBudget();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [preselectedCategoryId, setPreselectedCategoryId] = useState<string | undefined>(undefined);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  if (authLoading || budgetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-stone-400 mx-auto mb-3" />
          <p className="text-stone-500 dark:text-stone-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={() => {}} />;
  }

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
      <Header onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
