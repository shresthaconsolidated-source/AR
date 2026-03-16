"use client";

import React from 'react';
import { Calculator, Info } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { EditableSpreadsheet } from '@/components/EditableSpreadsheet';

export default function BudgetPage() {
  const { budgets, updateEntry, addEntry, deleteEntry } = useFinance();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Calculator className="text-[var(--accent)] w-8 h-8" />
          Planned Budget
        </h1>
        <p className="text-slate-400 mt-1">Define your target spending limits for the financial year.</p>
      </div>

      <div className="p-4 bg-[var(--accent-glow)] rounded-2xl border border-[var(--accent)]/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-[var(--accent)]" />
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Budget Scenario Mode: Used for 'Target' vs 'Actual' comparisons on the dashboard.
        </p>
      </div>

      <EditableSpreadsheet 
        type="budgets"
        entries={budgets}
        onUpdate={(id, field, value) => updateEntry('budgets', id, field, value)}
        onAdd={() => addEntry('budgets')}
        onDelete={(id) => deleteEntry('budgets', id)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-[var(--primary)]">
            <h5 className="text-sm font-bold text-white mb-2">Scenario Modeling</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
                Use this page to model different spending scenarios. You can toggle the Forecast engine to use these "Planned" numbers to see if your AR can sustain aggressive growth.
            </p>
        </div>
        <div className="glass-card p-6">
            <h5 className="text-sm font-bold text-white mb-2">Variance Tracking</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
                The dashboard compares the monthly totals from this page against the "Actual Expenses" to calculate variance KPIs and efficiency scores.
            </p>
        </div>
      </div>
    </div>
  );
}
