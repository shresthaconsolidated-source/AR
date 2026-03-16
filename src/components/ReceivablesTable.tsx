"use client";

import React, { useState } from 'react';
import { 
  Eye, 
  Mail, 
  MessageSquare, 
  Calendar, 
  MoreHorizontal, 
  Search, 
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Badge } from './Badge';

interface ReceivablesTableProps {
  invoices: Invoice[];
}

export function ReceivablesTable({ invoices }: ReceivablesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.invoiceStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid': return 'success';
      case 'overdue': return 'danger';
      case 'partial': return 'warning';
      default: return 'default';
    }
  };

  const getRiskVariant = (risk: string) => {
    switch(risk.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search invoice or customer..."
            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-3 text-sm focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
          
          <button className="flex items-center gap-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 px-4 text-sm hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <button className="flex items-center gap-2 bg-white text-black font-bold rounded-xl py-2 px-4 text-sm hover:bg-slate-200 transition-colors ml-auto">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Invoice / Client</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Date / Due</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Outstanding</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.invoiceId} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-[var(--primary)] transition-colors">{inv.invoiceNumber}</span>
                      <span className="text-xs text-slate-500">{inv.companyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300" suppressHydrationWarning>{new Date(inv.invoiceDate).toLocaleDateString()}</span>
                      <span className={cn("text-[10px] font-medium", inv.daysOverdue > 0 ? "text-red-400" : "text-slate-500")} suppressHydrationWarning>
                        {inv.daysOverdue > 0 ? `${inv.daysOverdue} days overdue` : `Due: ${new Date(inv.dueDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {formatCurrency(inv.invoiceAmount, inv.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-sm font-bold", inv.outstandingAmount > 0 ? "text-white" : "text-slate-500")}>
                      {formatCurrency(inv.outstandingAmount, inv.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(inv.invoiceStatus)}>{inv.invoiceStatus}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getRiskVariant(inv.riskFlag)}>{inv.riskFlag}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Email Reminder" className="p-1.5 rounded-lg bg-[var(--primary-glow)] text-[var(--primary)] border border-[var(--primary)]/20 hover:scale-110 transition-transform">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button title="Update Promise" className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:scale-110 transition-transform">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button title="More Actions" className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:scale-110 transition-transform">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
