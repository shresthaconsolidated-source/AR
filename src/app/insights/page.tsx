"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  ChevronDown, 
  Zap, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const insightOptions = [
  { id: 1, text: "Why is cash projected to decline?", icon: TrendingDown },
  { id: 2, text: "Which overdue customers are most risky?", icon: Users },
  { id: 3, text: "Which clients require follow-up now?", icon: HelpCircle },
  { id: 4, text: "What are the biggest outstanding balances?", icon: BarChart3 },
  { id: 5, text: "Which industries are paying late?", icon: Zap },
  { id: 6, text: "What happens if 20% of AR is delayed another 30 days?", icon: HelpCircle },
  { id: 7, text: "What should management watch this month?", icon: Sparkles },
];

const mockAnswers: Record<number, any> = {
  1: {
    title: "Cashflow Decline Analysis",
    content: "The projected cash decline is primarily driven by three factors: a large outflow of 350k for payroll in Week 1, and the delay in receiving 120k from Everest Education. If collections do not improve, liquidity buffer will fall to 12% by Month end.",
    impact: "Potential safety breach in W4",
    recom: "Accelerate Stage 2 reminders for High Risk invoices."
  },
  2: {
    title: "Customer Risk Profile",
    content: "Everest Education and Himalayan Logistics represent 60% of total overdue value. Everest has a repeat history of 45+ day delays. Markets signals for Himalayan indicate potential sector headwinds.",
    impact: "High Concentration Risk (2.4x average)",
    recom: "Shorten credit terms for Everest to Net 7."
  },
  7: {
    title: "Strategic Management Brief",
    content: "Watch the Tourism sector specifically this month. We see a trend of invoice cycle stretch from 15 to 22 days. Total working capital exposure is up 12% month-over-month while collection speed is down 4%.",
    impact: "Working Capital Cycle efficiency drop",
    recom: "Review credit policies for new Tourism leads."
  }
};

export default function InsightsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (id: number) => {
    setLoading(true);
    setSelected(id);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-glow)] border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_var(--primary-glow)]">
            <Sparkles className="w-4 h-4" />
            Rule-Based AI Assistant
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Financial Insight Engine</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Select a strategic financial query to generate data-driven management advice.</p>
      </div>

      <div className="glass-card p-6 bg-gradient-to-b from-slate-900 to-slate-950 shadow-inner">
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MessageSquare className="w-5 h-5 text-slate-500" />
            </div>
            <select 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-10 text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
                onChange={(e) => handleSelect(Number(e.target.value))}
                defaultValue=""
            >
                <option value="" disabled>Choose an analysis query...</option>
                {insightOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.text}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-slate-500" />
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_var(--primary)]" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Analyzing Financial Records...</p>
        </div>
      ) : selected && mockAnswers[selected] ? (
        <div className="animate-in zoom-in-95 fade-in duration-500">
            <div className="glass-card p-8 space-y-8 border-[var(--primary)]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{mockAnswers[selected].title}</h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Report Generated for Finance Management</p>
                    </div>
                    <div className="p-3 bg-[var(--primary-glow)] rounded-2xl border border-[var(--primary)]/20">
                        <Zap className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] leading-relaxed text-slate-300 text-sm">
                    {mockAnswers[selected].content}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Critical Impact</p>
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-bold text-red-100">
                            {mockAnswers[selected].impact}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-[var(--success)] uppercase tracking-widest ml-1">Recommended Action</p>
                        <div className="p-4 rounded-xl bg-[var(--success)]/5 border border-[var(--success)]/10 text-xs font-bold text-green-100">
                            {mockAnswers[selected].recom}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                        Confidence Score: 89%
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline transition-all">
                        Deep Dive Data <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      ) : selected ? (
        <div className="glass-card p-12 text-center space-y-4">
             <HelpCircle className="w-12 h-12 text-slate-800 mx-auto" />
             <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Insight Logic Pending</h3>
             <p className="text-xs text-slate-600 max-w-sm mx-auto">Rules for this specific query are currently being mapped to the data model. Contact your implementation partner.</p>
        </div>
      ) : null}

      <div className="mt-20 p-6 rounded-3xl border border-dashed border-slate-800 text-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-slate-800">
            <Zap className="w-5 h-5 text-slate-700" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architectural Note</p>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
            This module currently uses a rule-based logic engine. The clean component structure is designed to support direct LLM integration via an AI gateway once the API key is configured.
        </p>
      </div>
    </div>
  );
}
