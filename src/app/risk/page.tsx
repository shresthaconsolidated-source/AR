"use client";

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Globe, 
  AlertCircle, 
  Zap, 
  BarChart3, 
  Building,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';

export default function RiskIntelligencePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-[var(--danger)] w-8 h-8" />
          Client Risk Intelligence
        </h1>
        <p className="text-slate-400 mt-1">External signals and public reputation tracking placeholders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
            { title: "Public Reputation Monitoring", icon: Search, desc: "Automated scan of forums, social signals and reviews." },
            { title: "Financial Distress Detection", icon: Zap, desc: "Scanning public filings and industry performance news." },
            { title: "Adverse Media Alerts", icon: Globe, desc: "Real-time tracking of negative news involving clients." },
            { title: "Market Exposure Benchmarking", icon: BarChart3, desc: "Comparing client payment speed against industry average." },
            { title: "Website Health Analysis", icon: Building, desc: "Monitoring client digital footprint and domain status." },
            { title: "Compliance & Sanctions Scan", icon: ShieldAlert, desc: "Continuous AML/KYC public database matching." }
        ].map(card => (
            <div key={card.title} className="glass-card p-8 group relative overflow-hidden bg-slate-950/20 grayscale opacity-40 hover:opacity-60 transition-all cursor-not-allowed">
                <div className="absolute top-0 right-0 p-3">
                    <Badge variant="default" className="text-[7px]">Coming Soon</Badge>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <card.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                <div className="mt-8 flex items-center gap-1 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                    Feature Lock <ChevronRight className="w-3 h-3" />
                </div>
            </div>
        ))}
      </div>

      <div className="p-12 glass-card text-center space-y-6 border-dashed border-2 border-slate-800 bg-white/[0.01]">
         <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Sparkles className="w-10 h-10 text-slate-700" />
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-500 uppercase tracking-[0.4em]">Next Gen Intelligence</h2>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Connect external data aggregators in the Settings panel to unlock automated reputation and financial signal alerts.
            </p>
         </div>
         <button className="px-8 py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-widest border border-slate-700 opacity-50">
            Request Early Access
         </button>
      </div>

      <div className="p-4 bg-[var(--danger-glow)] rounded-2xl border border-[var(--danger)]/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-red-400 opacity-50" />
        <p className="text-[10px] text-red-300/40 uppercase font-bold tracking-widest">
            Architecture Ready: ClientID mapping is prioritized. Future data streams will bind to existing CustomerMaster IDs.
        </p>
      </div>
    </div>
  );
}
