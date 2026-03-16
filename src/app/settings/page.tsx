"use client";

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Link2, 
  Mail, 
  Bell, 
  Database, 
  Globe, 
  Save, 
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  FileText,
  Users
} from 'lucide-react';
import { ENDPOINTS, CONFIG } from '@/config/endpoints';
import { formatNumber } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import { MOCK_DATA } from '@/services/mockData';

export default function SettingsPage() {
  const [showSecrets, setShowSecrets] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <SettingsIcon className="text-slate-400 w-8 h-8" />
            System Configuration
          </h1>
          <p className="text-slate-400 mt-1">Manage API integrations, data sources, and operational thresholds.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[var(--primary)] text-white font-bold rounded-xl py-2 px-6 text-sm hover:opacity-90 transition-opacity shadow-[0_0_15px_var(--primary-glow)]">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-[var(--primary)]" />
                        API Integration Endpoints
                    </h2>
                    <button 
                        onClick={() => setShowSecrets(!showSecrets)}
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                
                <div className="space-y-4">
                    {[
                        { label: "AR Invoices API", key: "arInvoicesEndpoint", val: ENDPOINTS.SHEETS_API },
                        { label: "Customer Master API", key: "customersEndpoint", val: ENDPOINTS.SHEETS_API },
                        { label: "Expenses/Budget API", key: "expensesEndpoint", val: "MOCK_MODE_ACTIVE" },
                        { label: "Mail Automation API", key: "mailEndpoint", val: "SANDBOX_MOCK" },
                        { label: "Notification Gateway", key: "notificationEndpoint", val: "SANDBOX_MOCK" }
                    ].map(endpoint => (
                        <div key={endpoint.key} className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{endpoint.label}</label>
                            <input 
                                type={showSecrets ? "text" : "password"} 
                                placeholder={`Enter ${endpoint.label} URL...`}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-[var(--primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                defaultValue={endpoint.val}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="glass-card p-6 space-y-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/[0.05] pb-4">
                    <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
                    Financial Thresholds
                </h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Safe Cash Buffer (NPR)</label>
                        <input 
                            type="number" 
                            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 px-4 text-white font-bold"
                            defaultValue={CONFIG.SAFE_CASH_THRESHOLD}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Default Currency</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl py-2 px-4 text-white font-bold"
                            defaultValue={CONFIG.DEFAULT_CURRENCY}
                        />
                    </div>
                </div>
            </section>
        </div>

        <div className="space-y-6">
            <div className="glass-card p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-slate-700">
                    <RefreshCw className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-white">System Status</h4>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-green-400">API Connection Active</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                    Last sync: Today at 09:42 AM <br/>
                    <span 
                      className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                      onClick={() => setActiveModal('invoices')}
                    >
                      Invoices: {formatNumber(132)}
                    </span>
                    {' | '}
                    <span 
                      className="hover:text-[var(--primary)] cursor-pointer transition-colors"
                      onClick={() => setActiveModal('customers')}
                    >
                      Customers: {formatNumber(20)}
                    </span>
                </p>
                <button className="w-full py-2 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition-all uppercase tracking-widest">
                    Force Resync
                </button>
            </div>

            <div className="p-6 bg-[var(--primary-glow)] rounded-3xl border border-[var(--primary)]/10 space-y-3">
                <h5 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">Environment</h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Module architecture is current set to <strong>Unified Sheets Gateway</strong>. Individual microservice endpoints can be bound as necessary for production scalability.
                </p>
                <div className="pt-2">
                    <span className="text-[8px] font-bold text-white bg-black/50 px-2 py-1 rounded border border-white/10 uppercase tracking-widest">Production-Style MVP</span>
                </div>
            </div>
            
            <div className="glass-card p-6 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Branding</h4>
                <div className="h-20 w-full rounded-xl bg-slate-900 border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-xs font-bold">
                    Upload Logo
                </div>
            </div>
        </div>
      </div>

      <Modal 
        isOpen={activeModal === 'invoices'} 
        onClose={closeModal} 
        title="Sync Log: Invoices"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Showing the latest 5 synchronized invoices from Google Sheets.</p>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden text-xs">
            {MOCK_DATA.invoices.slice(0, 5).map(inv => (
              <div key={inv.invoiceId} className="p-3 border-b border-slate-800 flex justify-between">
                <span className="text-white font-bold">{inv.invoiceNumber}</span>
                <span className="text-slate-500">{inv.companyName}</span>
                <span className="text-[var(--primary)] font-mono">{inv.outstandingAmount} NPR</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'customers'} 
        onClose={closeModal} 
        title="Sync Log: Customers"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Customers detected in the latest API master data sweep.</p>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden text-xs">
            {MOCK_DATA.customers.map(cust => (
              <div key={cust.customerId} className="p-3 border-b border-slate-800 flex justify-between">
                <span className="text-white font-bold">{cust.companyName}</span>
                <span className="text-slate-500">{cust.industry}</span>
                <span className="text-[var(--success)]">{cust.paymentTerms} Net</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
