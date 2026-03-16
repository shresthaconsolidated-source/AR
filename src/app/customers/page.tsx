"use client";

import React, { useEffect, useState } from 'react';
import { dataService } from '@/services/dataService';
import { AppData, Customer, Invoice } from '@/types';
import { Users, Search, Globe, Building2, User as UserIcon, Phone, Mail, ExternalLink, ShieldAlert, TrendingDown } from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { Badge } from '@/components/Badge';

export default function CustomersPage() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCustomers = data?.customers.filter(cust => 
    cust.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.industry.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCustomerMetrics = (customerId: string) => {
    const custInvoices = data?.invoices.filter(inv => inv.customerId === customerId) || [];
    const outstanding = custInvoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0);
    const count = custInvoices.filter(inv => inv.outstandingAmount > 0).length;
    const overdueInvoices = custInvoices.filter(inv => inv.daysOverdue > 0);
    const avgOverdue = overdueInvoices.length 
      ? (overdueInvoices.reduce((acc, inv) => acc + inv.daysOverdue, 0) / overdueInvoices.length).toFixed(0)
      : 0;
    
    return { outstanding, count, avgOverdue };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Users className="text-[var(--primary)] w-8 h-8" />
          Customer Portfolio
        </h1>
        <p className="text-slate-400 mt-1">Deep analytics on client payment behavior and exposure.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search clients by name, industry or location..."
            className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map(cust => {
          const metrics = getCustomerMetrics(cust.customerId);
          return (
            <div key={cust.customerId} className="glass-card p-6 group hover:border-slate-600 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--primary-glow)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-xl">
                    {cust.companyName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[var(--primary)] transition-colors flex items-center gap-2">
                      {cust.companyName}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{cust.industry}</Badge>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                        <Globe className="w-3 h-3" /> {cust.country}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Outstanding</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(metrics.outstanding)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Open Items</p>
                  <p className="text-sm font-bold text-slate-200">{metrics.count}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Delay</p>
                  <p className={cn("text-sm font-bold", Number(metrics.avgOverdue) > 30 ? "text-red-400" : "text-green-400")}>
                    {metrics.avgOverdue} Days
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Terms</p>
                  <p className="text-sm font-bold text-slate-200">{cust.paymentTerms} Net</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-6 border-t border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[var(--primary)]" />
                  {cust.contactPerson}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--primary)]" />
                  {cust.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--primary)]" />
                  {cust.phone}
                </div>
              </div>

              {/* Future Integration Placeholders */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between group/risk opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Market Risk Intelligence</p>
                    <p className="text-xs text-slate-400">Public signals & reputation monitoring incoming...</p>
                  </div>
                </div>
                <Badge variant="default" className="text-[8px]">Disabled</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
