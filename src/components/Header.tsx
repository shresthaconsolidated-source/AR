"use client";

import React from 'react';
import { Bell, Search, User, Zap } from 'lucide-react';
import { CONFIG } from '@/config/endpoints';

export function Header() {
  return (
    <header className="h-16 border-b border-[var(--glass-border)] bg-[rgba(5,7,10,0.8)] backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search invoices, clients, or insights..." 
            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#22d3ee] bg-[#22d3ee20] px-3 py-1 rounded-full border border-[#22d3ee40]">
          <Zap className="w-3 h-3 fill-current" />
          Working Capital: High
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#05070a]" />
        </button>

        <div className="h-8 w-px bg-[var(--glass-border)]" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Finance Admin</p>
            <p className="text-[10px] text-slate-500">Demo Organization</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <User className="text-slate-400 w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
