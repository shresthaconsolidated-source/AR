"use client";

import React, { useEffect, useState } from 'react';
import { 
  Banknote, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Briefcase, 
  Percent,
  ChevronDown,
  ArrowUpRight,
  ShieldAlert,
  Receipt,
  Calculator
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { Invoice, AppData } from '@/types';
import { StatCard } from '@/components/StatCard';
import { ARCharts } from '@/components/DashboardCharts';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { useFinance } from '@/context/FinanceContext';
import { Modal } from '@/components/Modal';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: null });
  
  const { expenses, budgets, forecastMode, initialCash } = useFinance();

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

  const totalAR = data?.invoices.reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
  const overdueAR = data?.invoices
    .filter(inv => inv.invoiceStatus === 'Overdue')
    .reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
  const overdueCount = data?.invoices.filter(inv => inv.invoiceStatus === 'Overdue').length || 0;
  const highRiskAR = data?.invoices
    .filter(inv => inv.riskFlag === 'High')
    .reduce((acc, inv) => acc + inv.outstandingAmount, 0) || 0;
  
  const totalPaid = data?.invoices.reduce((acc, inv) => acc + inv.amountPaid, 0) || 0;
  const totalInvoiced = data?.invoices.reduce((acc, inv) => acc + inv.invoiceAmount, 0) || 0;
  const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
  
  const currentMonthIdx = new Date().getMonth();
  const currentMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentMonthIdx];
  const monthlyExpenses = expenses.reduce((acc, e) => acc + (Number(e.monthlyValues[currentMonth]) || 0), 0);
  const monthlyBudget = budgets.reduce((acc, b) => acc + (Number(b.monthlyValues[currentMonth]) || 0), 0);
  
  const forecastBalance = initialCash + (totalAR * 0.8) - (forecastMode === 'Expenses' ? monthlyExpenses : monthlyBudget);

  const openDetails = (type: string) => {
    let title = '';
    let content: React.ReactNode = null;

    const TableHeader = ({ cols }: { cols: string[] }) => (
      <thead className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/10">
        <tr>
          {cols.map(col => <th key={col} className="pb-3 text-left font-bold">{col}</th>)}
        </tr>
      </thead>
    );

    switch(type) {
      case 'total-ar':
        title = 'All Receivables';
        content = (
          <table className="w-full">
            <TableHeader cols={['Invoice #', 'Customer', 'Amount', 'Status']} />
            <tbody className="divide-y divide-white/5">
              {data?.invoices.map(inv => (
                <tr key={inv.invoiceNumber} className="text-sm">
                  <td className="py-3 text-slate-300">#{inv.invoiceNumber}</td>
                  <td className="py-3 text-white font-medium">{inv.companyName || 'Unknown'}</td>
                  <td className="py-3 text-white font-bold">{formatCurrency(inv.outstandingAmount)}</td>
                  <td className="py-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      inv.invoiceStatus === 'Overdue' ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"
                    )}>{inv.invoiceStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        break;
      case 'overdue':
        title = 'Overdue Invoices Detail';
        content = (
          <table className="w-full">
            <TableHeader cols={['Customer', 'Amount', 'Days Overdue']} />
            <tbody className="divide-y divide-white/5">
              {data?.invoices.filter(inv => inv.invoiceStatus === 'Overdue').map(inv => (
                <tr key={inv.invoiceNumber} className="text-sm">
                  <td className="py-3 text-white font-medium">{inv.companyName || 'Unknown'}</td>
                  <td className="py-3 text-red-400 font-bold">{formatCurrency(inv.outstandingAmount)}</td>
                  <td className="py-3 text-slate-300">{inv.daysOverdue} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        break;
      case 'outflow':
        title = `Actual Expenses - ${currentMonth}`;
        content = (
          <table className="w-full">
            <TableHeader cols={['Category', 'Type', 'Amount']} />
            <tbody className="divide-y divide-white/5">
              {expenses.map(exp => (
                <tr key={exp.id} className="text-sm">
                  <td className="py-3 text-white font-medium">{exp.category}</td>
                  <td className="py-3 text-slate-400">{exp.type}</td>
                  <td className="py-3 text-white font-bold">{formatCurrency(Number(exp.monthlyValues[currentMonth]) || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        break;
      case 'forecast':
        title = `8-Week Liquidity Walkthrough (${forecastMode} Mode)`;
        content = (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400">Calculation: Starting Cash + AR Inflows (Weighted 80%) - {forecastMode}</p>
            </div>
            <table className="w-full">
              <TableHeader cols={['Period', 'Est. Inflow', 'Est. Outflow', 'Projected Balance']} />
              <tbody className="divide-y divide-white/5">
                <tr className="text-sm">
                  <td className="py-3 text-slate-400 italic">Starting</td>
                  <td className="py-3">-</td>
                  <td className="py-3">-</td>
                  <td className="py-3 text-white font-bold">{formatCurrency(initialCash)}</td>
                </tr>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(week => {
                  const monthlyTotal = (forecastMode === 'Expenses' ? monthlyExpenses : monthlyBudget);
                  const weeklyOutflow = monthlyTotal / 4;
                  return (
                    <tr key={week} className="text-sm">
                      <td className="py-3 text-slate-300 font-medium">Week {week}</td>
                      <td className="py-3 text-green-400 font-medium">+{formatCurrency(totalAR * 0.1)}</td>
                      <td className="py-3 text-red-400 font-medium">-{formatCurrency(weeklyOutflow)}</td>
                      <td className="py-3 text-white font-bold">{formatCurrency(initialCash + (totalAR * 0.1 * week) - (weeklyOutflow * week))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        break;
      case 'high-risk':
        title = 'High Risk Exposure';
        content = (
          <table className="w-full">
            <TableHeader cols={['Customer', 'Insurance Coverage', 'Outstanding']} />
            <tbody className="divide-y divide-white/5">
              {data?.invoices.filter(inv => inv.riskFlag === 'High').map(inv => (
                <tr key={inv.invoiceNumber} className="text-sm">
                  <td className="py-3 text-white font-medium">{inv.companyName || 'Unknown'}</td>
                  <td className="py-3 text-slate-400 underline decoration-dotted decoration-white/20">80% Protected</td>
                  <td className="py-3 text-red-400 font-bold">{formatCurrency(inv.outstandingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        break;
      case 'budget':
        title = `Target Budget - ${currentMonth}`;
        content = (
          <table className="w-full">
            <TableHeader cols={['Category', 'Planned', 'Actual', 'Variance']} />
            <tbody className="divide-y divide-white/5">
              {budgets.map(b => {
                const actual = Number(expenses.find(e => e.category === b.category)?.monthlyValues[currentMonth]) || 0;
                const planned = Number(b.monthlyValues[currentMonth]) || 0;
                const variance = planned - actual;
                return (
                  <tr key={b.id} className="text-sm">
                    <td className="py-3 text-white font-medium">{b.category}</td>
                    <td className="py-3 text-slate-300">{formatCurrency(planned)}</td>
                    <td className="py-3 text-slate-300">{formatCurrency(actual)}</td>
                    <td className={cn("py-3 font-bold", variance >= 0 ? "text-green-400" : "text-red-400")}>
                      {formatCurrency(variance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
        break;
    }

    setModalConfig({ title, content });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Finance Operations Control</h1>
        <p className="text-slate-400 mt-1">Real-time working capital monitoring and receivables risk analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Receivables" 
          value={formatCurrency(totalAR)} 
          change="12%" 
          isPositive={false} 
          icon={Banknote} 
          variant="primary"
          onClick={() => openDetails('total-ar')}
        />
        <StatCard 
          title="Overdue Balance" 
          value={formatCurrency(overdueAR)} 
          change="8%" 
          isPositive={false} 
          icon={Clock} 
          variant="danger"
          onClick={() => openDetails('overdue')}
        />
        <StatCard 
          title="Monthly Outflow" 
          value={formatCurrency(monthlyExpenses)} 
          change={monthlyBudget > 0 ? `${((monthlyExpenses / monthlyBudget - 1) * 100).toFixed(1)}% vs Budget` : 'Manual'} 
          isPositive={monthlyExpenses < monthlyBudget} 
          icon={Receipt} 
          variant="accent"
          onClick={() => openDetails('outflow')}
        />
        <StatCard 
          title="Forecasted Cash" 
          value={formatCurrency(forecastBalance)} 
          change={forecastMode} 
          isPositive={true} 
          icon={TrendingUp} 
          variant="success"
          onClick={() => openDetails('forecast')}
        />
        <StatCard 
          title="Overdue Invoices" 
          value={overdueCount} 
          change="2" 
          isPositive={false} 
          icon={AlertTriangle} 
          variant="danger"
          onClick={() => openDetails('overdue')}
        />
        <StatCard 
          title="High Risk AR" 
          value={formatCurrency(highRiskAR)} 
          icon={ShieldAlert} 
          variant="danger"
          onClick={() => openDetails('high-risk')}
        />
        <StatCard 
          title="Collection Rate" 
          value={`${collectionRate.toFixed(1)}%`} 
          change="3.4%" 
          isPositive={true} 
          icon={Percent} 
          variant="success"
          onClick={() => openDetails('total-ar')}
        />
        <StatCard 
          title="Current Month Budget" 
          value={formatCurrency(monthlyBudget)} 
          icon={Calculator} 
          variant="primary"
          onClick={() => openDetails('budget')}
        />
      </div>

      <ARCharts invoices={data?.invoices || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Top Overdue Customers</h4>
            <button className="text-[var(--primary)] text-xs font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {data?.customers.slice(0, 5).map((cust, i) => (
              <div key={cust.customerId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                    {cust.companyName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cust.companyName}</p>
                    <p className="text-[10px] text-slate-500">{cust.industry} • {cust.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--danger)]">{formatCurrency((i + 1) * 35000)}</p>
                  <p className="text-[10px] text-slate-500">{(i + 1) * 2} Invoices Overdue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Smart Insights</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--primary-glow)] border border-[var(--primary)]/20">
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase mb-2">Cash Warning</p>
              <p className="text-sm text-slate-300">Projected cash might dip below safe threshold of {formatCurrency(500000)} in next 30 days if overdue collections stay delayed.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--danger-glow)] border border-[var(--danger)]/20">
              <p className="text-[10px] font-bold text-[var(--danger)] uppercase mb-2">High Exposure</p>
              <p className="text-sm text-slate-300">Client Everest Education has 2 critical overdue invoices. Follow-up Stage 3 recommended.</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
            Run AI Analysis
          </button>
        </div>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalConfig.title}
      >
        {modalConfig.content}
      </Modal>
    </div>
  );
}
