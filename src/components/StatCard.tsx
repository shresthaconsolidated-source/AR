import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'danger' | 'success';
  href?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, change, isPositive, icon: Icon, variant = 'primary', href, onClick }: StatCardProps) {
  const variantStyles = {
    primary: 'text-[var(--primary)] bg-[var(--primary-glow)] border-[var(--primary)]',
    accent: 'text-[var(--accent)] bg-[var(--accent-glow)] border-[var(--accent)]',
    danger: 'text-[var(--danger)] bg-[var(--danger-glow)] border-[var(--danger)]',
    success: 'text-[var(--success)] bg-[var(--success-glow)] border-[var(--success)]',
  };

  const CardContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-2 rounded-xl border border-opacity-30 flex items-center justify-center transition-transform group-hover:scale-110",
          variantStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            isPositive ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
          )}>
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </>
  );

  const containerClassName = "glass-card p-6 flex flex-col justify-between group hover:border-slate-500 transition-all duration-300 w-full text-left";

  if (onClick) {
    return (
      <button onClick={onClick} className={containerClassName}>
        {CardContent}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={containerClassName}>
        {CardContent}
      </Link>
    );
  }

  return (
    <div className={containerClassName}>
      {CardContent}
    </div>
  );
}
