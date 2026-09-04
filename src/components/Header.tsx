import React from 'react';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useBudget } from '../context/BudgetContext';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { syncing } = useBudget();

  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2">
          <h1 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Budget Manager
          </h1>

          <div className="flex items-center gap-1">
            {/* Sync indicator */}
            {syncing && (
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-stone-400">Saving</span>
              </div>
            )}

            {/* Email */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500 mr-1">
                <User size={14} />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2.5 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle theme"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="rounded-lg p-2.5 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors"
              aria-label="Sign out"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
