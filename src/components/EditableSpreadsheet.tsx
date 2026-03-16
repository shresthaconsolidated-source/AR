"use client";

import React from 'react';
import { FinancialEntry, MonthlyValues } from '@/types';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { formatNumber, cn } from '@/lib/utils';

interface EditableSpreadsheetProps {
  entries: FinancialEntry[];
  type: 'expenses' | 'budgets';
  onUpdate: (id: string, field: keyof FinancialEntry, value: any) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const EditableSpreadsheet: React.FC<EditableSpreadsheetProps> = ({
  entries,
  type,
  onUpdate,
  onAdd,
  onDelete
}) => {
  const getRowTotal = (values: MonthlyValues) => {
    return Object.values(values).reduce((acc, v) => acc + (Number(v) || 0), 0);
  };

  const getColTotal = (month: string) => {
    return entries.reduce((acc, entry) => acc + (Number(entry.monthlyValues[month]) || 0), 0);
  };

  const grandTotal = entries.reduce((acc, entry) => acc + getRowTotal(entry.monthlyValues), 0);

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-[var(--glass-border)] bg-white/[0.02]">
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 w-48">Category</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 w-24 text-center">Type</th>
              {MONTHS.map(m => (
                <th key={m} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center w-24">{m}</th>
              ))}
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] text-center w-32 bg-[var(--primary)]/5">Annual Total</th>
              <th className="px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-4 py-2">
                  <input 
                    type="text" 
                    value={entry.category}
                    onChange={(e) => onUpdate(entry.id, 'category', e.target.value)}
                    className="w-full bg-transparent border-none text-white font-medium text-xs focus:ring-0 focus:outline-none placeholder-slate-700"
                    placeholder="Category Name"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <select 
                    value={entry.type}
                    onChange={(e) => onUpdate(entry.id, 'type', e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg text-[10px] px-2 py-1 text-slate-400 focus:outline-none appearance-none cursor-pointer text-center"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Variable">Variable</option>
                  </select>
                </td>
                {MONTHS.map(m => (
                  <td key={m} className="px-2 py-2">
                    <input 
                      type="number" 
                      value={entry.monthlyValues[m] || ''}
                      onChange={(e) => onUpdate(entry.id, 'monthlyValues', { [m]: Number(e.target.value) })}
                      className="w-full bg-slate-950/30 border border-transparent hover:border-slate-800 rounded px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-[var(--primary)]/50 transition-all font-mono"
                      placeholder="0"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center bg-[var(--primary)]/5">
                  <span className="text-xs font-bold text-white">
                    {formatNumber(getRowTotal(entry.monthlyValues))}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr className="bg-white/[0.05] font-bold">
              <td className="px-4 py-4 text-xs text-white uppercase tracking-widest">Monthly Totals</td>
              <td className="px-4 py-4"></td>
              {MONTHS.map(m => (
                <td key={m} className="px-4 py-4 text-xs text-center text-[var(--primary)]">
                  {formatNumber(getColTotal(m))}
                </td>
              ))}
              <td className="px-4 py-4 text-center bg-[var(--primary)]/20 border-l border-[var(--primary)]/30">
                <span className="text-sm text-white">{formatNumber(grandTotal)}</span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-white/[0.01] border-t border-[var(--glass-border)]">
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:text-white transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add New Category
        </button>
      </div>
    </div>
  );
};
