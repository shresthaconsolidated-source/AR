"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface AgingData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c3aed'];

export function ARCharts({ invoices }: { invoices: any[] }) {
  // Aggregate Aging Buckets
  const agingBuckets = [
    { name: 'Current', value: 0, color: '#10b981' },
    { name: '1-15 d', value: 0, color: '#3b82f6' },
    { name: '16-30 d', value: 0, color: '#f59e0b' },
    { name: '31-45 d', value: 0, color: '#f43f5e' },
    { name: '45+ d', value: 0, color: '#ef4444' },
  ];

  invoices.forEach(inv => {
    if (inv.daysOverdue <= 0) agingBuckets[0].value += inv.outstandingAmount;
    else if (inv.daysOverdue <= 15) agingBuckets[1].value += inv.outstandingAmount;
    else if (inv.daysOverdue <= 30) agingBuckets[2].value += inv.outstandingAmount;
    else if (inv.daysOverdue <= 45) agingBuckets[3].value += inv.outstandingAmount;
    else agingBuckets[4].value += inv.outstandingAmount;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">AR Aging Buckets</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingBuckets}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff' 
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {agingBuckets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Cash Position Forecast (Receivables based)</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={invoices.slice(0, 10).map((inv, i) => ({ name: `W${i+1}`, cash: 500000 + (inv.invoiceAmount * (i+1) * 0.7) }))}>
              <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px'
                }}
              />
              <Area type="monotone" dataKey="cash" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCash)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
