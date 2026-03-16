"use client";

import React, { useState } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Settings as SettingsIcon,
  Trash2,
  Mail,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/Modal';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const handleTabClick = (tab: "all" | "unread") => {
    setActiveTab(tab);
    setIsSummaryModalOpen(true);
  };

  const notifications = [
    {
      id: 1,
      type: "overdue",
      title: "Invoice High Delay",
      message: "INV-2026-001 for Everest Education is now 55 days overdue. Stage 3 Reminder needed.",
      time: "2 hours ago",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      type: "cash",
      title: "Liquidity Warning",
      message: "Projected cash balance falls below threshold in Week 4.",
      time: "5 hours ago",
      read: false,
      priority: "high"
    },
    {
      id: 3,
      type: "promise",
      title: "Payment Promise Missed",
      message: "Himalayan Logistics missed payment promise date (2026-03-14).",
      time: "1 day ago",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      type: "system",
      title: "Sheets API Connected",
      message: "Google Sheets data successfully synchronized with 132 invoice records.",
      time: "2 days ago",
      read: true,
      priority: "low"
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
        case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-400" />;
        case 'cash': return <Zap className="w-5 h-5 text-orange-400" />;
        case 'promise': return <Clock className="w-5 h-5 text-yellow-400" />;
        default: return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BellRing className="text-[var(--primary)] w-8 h-8" />
            Notification Center
          </h1>
          <p className="text-slate-400 mt-1">Stay updated on critical working capital events and collection tasks.</p>
        </div>
        
        <div className="flex bg-[var(--glass-bg)] p-1 rounded-2xl border border-[var(--glass-border)]">
          <button 
            onClick={() => handleTabClick("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === "all" ? "bg-[var(--primary)] text-white" : "text-slate-500"
            )}
          >
            All Activity
          </button>
          <button 
            onClick={() => handleTabClick("unread")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === "unread" ? "bg-[var(--primary)] text-white" : "text-slate-500"
            )}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            {notifications.map(notif => (
                <div key={notif.id} className={cn(
                    "glass-card p-5 border-l-4 transition-all hover:bg-white/[0.03]",
                    notif.priority === 'high' ? "border-l-red-500" : (notif.priority === 'medium' ? "border-l-orange-500" : "border-l-blue-500"),
                    !notif.read && "bg-white/[0.02]"
                )}>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-white tracking-tight">{notif.title}</h4>
                                <span className="text-[10px] font-medium text-slate-500">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-3">{notif.message}</p>
                            <div className="flex items-center gap-4">
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] hover:underline transition-all">Action Task</button>
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest bg-white/[0.01] rounded-xl border border-dashed border-slate-800">
                Load Architecture History
            </button>
        </div>

        <div className="space-y-6">
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <SettingsIcon className="w-5 h-5 text-slate-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Email Preferences</h4>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "Overdue Alerts", desc: "Notify when invoice > 7 days past due" },
                        { label: "Cash Threshhold", desc: "Notify when low cash is projected" },
                        { label: "Risk Changes", desc: "Notify on customer risk movements" }
                    ].map(pref => (
                        <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">{pref.label}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{pref.desc}</p>
                            </div>
                            <div className="w-10 h-5 bg-[var(--primary)] rounded-full relative cursor-pointer shadow-[0_0_8px_var(--primary-glow)]">
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-all border border-slate-700">
                    <Mail className="w-4 h-4" /> Save User Email Settings
                </button>
            </div>
            
            <div className="glass-card p-6 border-l-4 border-l-[var(--primary)]">
                <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-2">Technical Note</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                    User email notifications are currently simulated. Connecting a real notification endpoint in Settings will enable SMTP/API mail delivery to your personal inbox.
                </p>
            </div>
        </div>
      </div>

      <Modal 
        isOpen={isSummaryModalOpen} 
        onClose={() => setIsSummaryModalOpen(false)} 
        title={`Notification Summary: ${activeTab === 'all' ? 'Archive' : 'New Events'}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
            <h5 className="text-xs font-bold text-white mb-2">Critical Pending Actions</h5>
            <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
              <li>Review 3 overdue invoices from Himalayan Logistics</li>
              <li>Address Week 4 liquidity warning in Forecast</li>
              <li>Coordinate with Everest Education contact person</li>
            </ul>
          </div>
          <p className="text-[10px] text-slate-500 text-center italic">
            You have {notifications.filter(n => !n.read).length} unread notifications in the secure cloud gateway.
          </p>
        </div>
      </Modal>
    </div>
  );
}
