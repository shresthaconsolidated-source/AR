"use client";

import React, { useState } from 'react';
import { 
  BellRing, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  User,
  ExternalLink,
  History
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { formatCurrency, cn } from '@/lib/utils';
import { MOCK_DATA } from '@/services/mockData';

export default function RemindersPage() {
  const [selectedStage, setSelectedStage] = useState(1);
  const overdueInvoices = MOCK_DATA.invoices.filter(inv => inv.invoiceStatus === 'Overdue');

  const stages = [
    { id: 0, label: 'Not Sent', icon: Clock, color: 'text-slate-500' },
    { id: 1, label: 'Friendly', icon: CheckCircle2, color: 'text-green-400' },
    { id: 2, label: 'Follow-up', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 3, label: 'Escalation', icon: BellRing, color: 'text-red-400' },
  ];

  const templates = {
    1: {
      subject: "Friendly Reminder: Invoice [Number] Outstanding",
      body: "Dear [Contact],\n\nThis is a friendly note to remind you that invoice [Number] for [Amount] is now slightly past its due date. We would appreciate it if you could look into this at your earliest convenience.\n\nBest regards,\nFinance Team"
    },
    2: {
      subject: "Follow-up: Past Due Invoice [Number]",
      body: "Hi [Contact],\n\nWe haven't received payment for invoice [Number], which is now [Days] days overdue. Could you please confirm when we can expect the funds?\n\nThank you,\nFinance Operations"
    },
    3: {
        subject: "URGENT: Escalation - Invoice [Number] Significant Overdue",
        body: "To Management,\n\nInvoice [Number] is now significantly past due ([Days] days). We have sent multiple reminders without resolution. We require an immediate update on the status of this payment to avoid further action.\n\nFinance Director"
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BellRing className="text-[var(--primary)] w-8 h-8" />
          Collection Workflows
        </h1>
        <p className="text-slate-400 mt-1">Automate and track reminder lifecycle for overdue accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)] bg-white/[0.01]">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Worklist</h4>
                </div>
                <div className="max-h-[600px] overflow-y-auto divide-y divide-[var(--glass-border)]">
                    {overdueInvoices.map(inv => (
                        <div key={inv.invoiceId} className="p-4 hover:bg-white/[0.03] transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-white group-hover:text-[var(--primary)]">{inv.invoiceNumber}</span>
                                <Badge variant={inv.reminderStage >= 3 ? 'danger' : 'warning'} className="text-[7px]">Stage {inv.reminderStage}</Badge>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium truncate mb-2">{inv.companyName}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">{formatCurrency(inv.outstandingAmount)}</span>
                                <span className="text-[10px] font-bold text-red-400">{inv.daysOverdue}d overdue</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Reminder Stage Selector</h4>
                    <div className="flex gap-4">
                        {stages.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => s.id > 0 && setSelectedStage(s.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 group transition-all",
                                    selectedStage === s.id ? "scale-100 opacity-100" : "opacity-40 hover:opacity-100 scale-90"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all",
                                    selectedStage === s.id ? "bg-[var(--primary-glow)] border-[var(--primary)] shadow-[0_0_15px_var(--primary-glow)]" : "bg-slate-900 border-slate-800"
                                )}>
                                    <s.icon className={cn("w-5 h-5", selectedStage === s.id ? "text-[var(--primary)]" : "text-slate-500")} />
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-300">Preview: {stages.find(s => s.id === selectedStage)?.label} Reminder</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500"><History className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-widest">Edit</button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">To:</p>
                            <p className="text-sm text-white font-medium">customer.contact@example.com</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Subject:</p>
                            <p className="text-sm text-white font-medium">{(templates as any)[selectedStage]?.subject}</p>
                        </div>
                        <div className="h-px bg-slate-800 my-4" />
                        <div className="space-y-1">
                            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {(templates as any)[selectedStage]?.body}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-3">
                         <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                            Cancel
                        </button>
                        <button className="px-6 py-2 bg-[var(--primary)] text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:opacity-90 transition-opacity uppercase tracking-widest shadow-[0_0_15px_var(--primary-glow)]">
                            <Send className="w-4 h-4" /> Send Email
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <History className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h5 className="text-sm font-bold text-white">Recent Activity</h5>
                        <p className="text-[10px] text-slate-500 mt-1">3 Friendly reminders sent today successfully via automation placeholder.</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center border border-[var(--primary)]/20">
                        <User className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h5 className="text-sm font-bold text-white">Mail Config</h5>
                        <p className="text-[10px] text-slate-500 mt-1">Currently using Internal Sandbox. Production Mail API is not connected.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
