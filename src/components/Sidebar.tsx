"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  Receipt, 
  BellRing, 
  MessageSquare, 
  Zap, 
  Settings,
  ShieldAlert,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Receivables', href: '/receivables', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Forecast', href: '/forecast', icon: TrendingUp },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Budget', href: '/budget', icon: Calculator },
  { name: 'Reminders', href: '/reminders', icon: BellRing },
  { name: 'Notifications', href: '/notifications', icon: BellRing },
  { name: 'Insights', href: '/insights', icon: MessageSquare },
  { name: 'Risk Intelligence', href: '/risk', icon: ShieldAlert, comingSoon: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-[#05070a] border-r border-[var(--glass-border)] flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Working Capital</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
              pathname === item.href
                ? "bg-[var(--primary-glow)] text-[var(--primary)] neon-border"
                : "text-slate-400 hover:text-white hover:bg-[var(--glass-border)]",
              item.comingSoon && "opacity-50 cursor-not-allowed"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              pathname === item.href ? "text-[var(--primary)]" : "text-slate-500 group-hover:text-white"
            )} />
            <span className="text-sm font-medium">{item.name}</span>
            {item.comingSoon && (
              <span className="absolute right-3 text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest font-bold">
                Soon
              </span>
            )}
            {pathname === item.href && (
              <div className="absolute left-[-1rem] w-1 h-6 bg-[var(--primary)] rounded-r-full shadow-[0_0_10px_var(--primary)]" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-xs text-slate-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">System Live: Demo Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
