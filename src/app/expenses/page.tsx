"use client";

import React from 'react';
import { Receipt, Info } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { EditableSpreadsheet } from '@/components/EditableSpreadsheet';

export default function ExpensesPage() {
  const { expenses, updateEntry, addEntry, deleteEntry } = useFinance();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Receipt className="text-[var(--primary)] w-8 h-8" />
          Actual Expenses
        </h1>
        <p className="text-slate-400 mt-1">Manually enter and track your monthly cash outflows.</p>
      </div>

      <div className="p-4 bg-[var(--primary-glow)] rounded-2xl border border-[var(--primary)]/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-[var(--primary)]" />
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Spreadsheet Mode Active: All changes are saved instantly to local persistence.
        </p>
      </div>

      <EditableSpreadsheet 
        type="expenses"
        entries={expenses}
        onUpdate={(id, field, value) => updateEntry('expenses', id, field, value)}
        onAdd={() => addEntry('expenses')}
        onDelete={(id) => deleteEntry('expenses', id)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-[var(--accent)]">
            <h5 className="text-sm font-bold text-white mb-2">Usage in Forecast</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
                When "Expenses Mode" is selected in the Forecast engine, these monthly totals will be deducted from your projected AR inflows to calculate the final cash balance.
            </p>
        </div>
        <div className="glass-card p-6">
            <h5 className="text-sm font-bold text-white mb-2">Fixed vs Variable</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
                "Fixed" expenses (Rent, Payroll) are essential for baseline projection, while "Variable" (Marketing, Travel) can be adjusted to see impact on safety thresholds.
            </p>
        </div>
      </div>
    </div>
  );
}
