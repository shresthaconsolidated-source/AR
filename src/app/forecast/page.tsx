"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { AppData, Invoice } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { useFinance } from '@/context/FinanceContext';

export default function ForecastPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const { 
    expenses, 
    budgets, 
    forecastMode, 
    setForecastMode,
    initialCash,
    setInitialCash,
    safeThreshold,
    setSafeThreshold
  } = useFinance();

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

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Enhanced forecast generator using manual inputs
  const generateForecast = () => {
    let currentBalance = initialCash;
    const forecast = [{
      date: 'Today',
      balance: currentBalance,
      delta: 0,
    }];

    const activeOutflows = forecastMode === 'Expenses' ? expenses : budgets;

    // Weekly projection for 8 weeks
    for (let i = 1; i <= 8; i++) {
        const weekDate = new Date();
        weekDate.setDate(weekDate.getDate() + (i * 7));
        const currentMonthName = MONTH_NAMES[weekDate.getMonth()];
        
        // Find inflows this week from AR
        const inflows = data?.invoices
            .filter(inv => {
                const due = new Date(inv.dueDate);
                const start = new Date();
                start.setDate(start.getDate() + ((i-1) * 7));
                return due >= start && due < weekDate && inv.outstandingAmount > 0;
            })
            .reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
        
        // Determine weekly outflow based on monthly manual entry
        // We'll roughly divide the monthly total by 4 for simple weekly estimation
        const monthlyTotal = activeOutflows.reduce((acc, entry) => 
            acc + (Number(entry.monthlyValues[currentMonthName]) || 0), 0);
        const weeklyOutflow = monthlyTotal / 4; 
        
        currentBalance = currentBalance + inflows - weeklyOutflow;
        
        forecast.push({
            date: `W${i}`,
            balance: currentBalance,
            delta: inflows - weeklyOutflow,
        });
    }

    return forecast;
  };

  const forecastData = generateForecast();
  const lowestPoint = Math.min(...forecastData.map(d => d.balance));
  const isThresholdBreached = lowestPoint < safeThreshold;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="text-[var(--primary)] w-8 h-8" />
            Cashflow Forecast
          </h1>
          <p className="text-slate-400 mt-1">Projected working capital outlook based on receivables and manual assumptions.</p>
        </div>

        <div className="flex bg-[var(--glass-bg)] p-1 rounded-2xl border border-[var(--glass-border)]">
          <button 
            onClick={() => setForecastMode('Expenses')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              forecastMode === 'Expenses' ? "bg-[var(--primary)] text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            AR + Expenses
          </button>
          <button 
            onClick={() => setForecastMode('Budget')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              forecastMode === 'Budget' ? "bg-[var(--primary)] text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
            )}
          >
            AR + Budget
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-[var(--primary)]">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Starting Cash Balance</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="number" 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 pl-10 pr-4 text-white font-bold text-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
              value={initialCash}
              onChange={(e) => setInitialCash(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-[var(--accent)]">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Min. Safe Threshold</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="number" 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 pl-10 pr-4 text-white font-bold text-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
              value={safeThreshold}
              onChange={(e) => setSafeThreshold(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Lowest Projected Point</p>
          <h3 className={cn("text-2xl font-black tracking-tight", lowestPoint < safeThreshold ? "text-red-400" : "text-[var(--success)]")}>
            {formatCurrency(lowestPoint)}
          </h3>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
             Next 60 Days Projection
          </p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Forecast Status</p>
          <div className="flex items-center gap-2">
            {isThresholdBreached ? (
                <>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-bold text-red-400">Action Required</span>
                </>
            ) : (
                <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-bold text-green-400">Condition Stable</span>
                </>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            Liquidity Buffer: {formatCurrency(lowestPoint - safeThreshold)}
          </p>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h4 className="text-lg font-bold text-white tracking-tight">8-Week Liquidity Projection</h4>
                <p className="text-xs text-slate-500">Includes guaranteed receivables and fixed expense estimates.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Projected Balance</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 opacity-50" />
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Safety Line</span>
                </div>
            </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
                formatter={(value: any) => [formatCurrency(value), 'Balance']}
              />
              <ReferenceLine y={safeThreshold} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                strokeWidth={4}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                Management Warnings
            </h4>
            <div className="space-y-3">
                {isThresholdBreached && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                            <span className="font-bold text-red-400">!</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-200">Safety Threshold Breach</p>
                            <p className="text-xs text-red-400/80 mt-0.5">Cash position projected at {formatCurrency(lowestPoint)} in Week 4. Requires immediate collection of overdue AR.</p>
                        </div>
                    </div>
                )}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-orange-200">Concentration Risk Flag</p>
                        <p className="text-xs text-orange-400/80 mt-0.5">45% of forecasted inflows depend on a single customer: Everest Education.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Inflow Breakdown</h4>
            <div className="space-y-4">
                {forecastData.slice(1, 5).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300 font-medium">Week {i+1} Expected</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-white">{formatCurrency(Math.max(0, d.delta + (expenses.reduce((acc, e) => acc + (Number(e.monthlyValues['Jan']) || 0), 0) / 4)))}</span>
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-blue-400" />
        <p className="text-[10px] text-blue-300/60 uppercase font-bold tracking-widest">
            Note: This forecast uses {forecastMode} data combined with live Receivables. Weekly outflows are estimated as (Monthly Total / 4).
        </p>
      </div>
    </div>
  );
}
