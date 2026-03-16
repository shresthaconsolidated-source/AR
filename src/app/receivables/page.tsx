"use client";

import React, { useEffect, useState } from 'react';
import { dataService } from '@/services/dataService';
import { AppData } from '@/types';
import { ReceivablesTable } from '@/components/ReceivablesTable';
import { FileText, Download, Filter, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/StatCard';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ReceivablesPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dataService.getAllData();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--primary)]" />
    </div>
  );

  const totalAR = data?.invoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
  const overdueAR = data?.invoices
    .filter(inv => inv.invoiceStatus === 'Overdue')
    .reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
  const highRiskAR = data?.invoices
    .filter(inv => inv.riskFlag === 'High')
    .reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="text-[var(--primary)] w-8 h-8" />
            Accounts Receivable
          </h1>
          <p className="text-slate-400 mt-1">Detailed invoice tracking and collection management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-4 text-sm hover:bg-slate-800 transition-colors text-white font-medium">
            Bulk Reminder
          </button>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-white font-bold rounded-xl py-2 px-4 text-sm hover:opacity-90 transition-opacity shadow-[0_0_15px_var(--primary-glow)]">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Outstanding" 
          value={formatCurrency(totalAR)} 
          icon={FileText} 
          variant="primary"
        />
        <StatCard 
          title="Total Overdue" 
          value={formatCurrency(overdueAR)} 
          icon={Clock} 
          variant="danger"
        />
        <StatCard 
          title="High Risk Exposure" 
          value={formatCurrency(highRiskAR)} 
          icon={ShieldAlert} 
          variant="danger"
        />
      </div>

      <ReceivablesTable invoices={data?.invoices || []} />
    </div>
  );
}
