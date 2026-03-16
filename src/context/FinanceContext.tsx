"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinancialEntry, ForecastMode, MonthlyValues } from '@/types';

interface FinanceContextType {
  expenses: FinancialEntry[];
  budgets: FinancialEntry[];
  forecastMode: ForecastMode;
  initialCash: number;
  safeThreshold: number;
  setExpenses: (entries: FinancialEntry[]) => void;
  setBudgets: (entries: FinancialEntry[]) => void;
  setForecastMode: (mode: ForecastMode) => void;
  setInitialCash: (val: number) => void;
  setSafeThreshold: (val: number) => void;
  updateEntry: (type: 'expenses' | 'budgets', id: string, field: keyof FinancialEntry | 'monthlyValues', value: any) => void;
  addEntry: (type: 'expenses' | 'budgets') => void;
  deleteEntry: (type: 'expenses' | 'budgets', id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_MONTHLY_VALUES: MonthlyValues = MONTHS.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});

const INITIAL_EXPENSES: FinancialEntry[] = [
  { id: '1', category: 'Payroll', type: 'Fixed', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 150000, Feb: 150000, Mar: 150000 } },
  { id: '2', category: 'Freelancers / Contractors', type: 'Variable', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 45000, Feb: 60000, Mar: 30000 } },
  { id: '3', category: 'Marketing & Advertising', type: 'Variable', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 25000, Feb: 25000, Mar: 30000 } },
  { id: '4', category: 'Office Rent', type: 'Fixed', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 40000, Feb: 40000, Mar: 40000 } },
];

const INITIAL_BUDGETS: FinancialEntry[] = [
  { id: 'b1', category: 'Payroll Budget', type: 'Fixed', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 160000, Feb: 160000, Mar: 160000 } },
  { id: 'b2', category: 'Marketing Budget', type: 'Variable', monthlyValues: { ...DEFAULT_MONTHLY_VALUES, Jan: 30000, Feb: 30000, Mar: 35000 } },
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<FinancialEntry[]>([]);
  const [budgets, setBudgets] = useState<FinancialEntry[]>([]);
  const [forecastMode, setForecastMode] = useState<ForecastMode>('Expenses');
  const [initialCash, setInitialCash] = useState(500000);
  const [safeThreshold, setSafeThreshold] = useState(300000);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const storedExpenses = localStorage.getItem('wc_expenses');
    const storedBudgets = localStorage.getItem('wc_budgets');
    const storedMode = localStorage.getItem('wc_forecast_mode');
    const storedInitialCash = localStorage.getItem('wc_initial_cash');
    const storedThreshold = localStorage.getItem('wc_safe_threshold');

    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    else setExpenses(INITIAL_EXPENSES);

    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
    else setBudgets(INITIAL_BUDGETS);

    if (storedMode) setForecastMode(storedMode as ForecastMode);
    if (storedInitialCash) setInitialCash(Number(storedInitialCash));
    if (storedThreshold) setSafeThreshold(Number(storedThreshold));

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('wc_expenses', JSON.stringify(expenses));
    localStorage.setItem('wc_budgets', JSON.stringify(budgets));
    localStorage.setItem('wc_forecast_mode', forecastMode);
    localStorage.setItem('wc_initial_cash', initialCash.toString());
    localStorage.setItem('wc_safe_threshold', safeThreshold.toString());
  }, [expenses, budgets, forecastMode, initialCash, safeThreshold, isInitialized]);

  const updateEntry = (type: 'expenses' | 'budgets', id: string, field: string, value: any) => {
    const list = type === 'expenses' ? [...expenses] : [...budgets];
    const index = list.findIndex(e => e.id === id);
    if (index === -1) return;

    if (field === 'monthlyValues') {
      list[index] = { ...list[index], monthlyValues: { ...list[index].monthlyValues, ...value } };
    } else {
      list[index] = { ...list[index], [field]: value };
    }

    if (type === 'expenses') setExpenses(list);
    else setBudgets(list);
  };

  const addEntry = (type: 'expenses' | 'budgets') => {
    const newEntry: FinancialEntry = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'New Category',
      type: 'Variable',
      monthlyValues: { ...DEFAULT_MONTHLY_VALUES }
    };
    if (type === 'expenses') setExpenses([...expenses, newEntry]);
    else setBudgets([...budgets, newEntry]);
  };

  const deleteEntry = (type: 'expenses' | 'budgets', id: string) => {
    if (type === 'expenses') setExpenses(expenses.filter(e => e.id !== id));
    else setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <FinanceContext.Provider value={{
      expenses, budgets, forecastMode, initialCash, safeThreshold,
      setExpenses, setBudgets, setForecastMode, setInitialCash, setSafeThreshold,
      updateEntry, addEntry, deleteEntry
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
