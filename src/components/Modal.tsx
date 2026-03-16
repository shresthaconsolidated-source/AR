"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        
        <div className="p-4 bg-white/[0.02] border-t border-[var(--glass-border)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs hover:bg-slate-700 transition-all uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
