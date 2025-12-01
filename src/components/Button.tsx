import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

const variantStyles = {
  primary: {
    base: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400',
    glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    active: 'ring-2 ring-cyan-400/50 bg-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.5)]',
  },
  secondary: {
    base: 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500',
    glow: 'hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    active: 'ring-2 ring-slate-400/50 bg-slate-600/50',
  },
  danger: {
    base: 'bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30 hover:border-rose-400',
    glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    active: 'ring-2 ring-rose-400/50 bg-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.5)]',
  },
  success: {
    base: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    active: 'ring-2 ring-emerald-400/50 bg-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.5)]',
  },
  warning: {
    base: 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30 hover:border-amber-400',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    active: 'ring-2 ring-amber-400/50 bg-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
  },
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export default function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  size = 'md',
  active = false,
}: ButtonProps) {
  const styles = variantStyles[variant];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        ${styles.base}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed saturate-0' : `cursor-pointer ${styles.glow}`}
        ${active ? styles.active : ''}
        border rounded-lg font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50
        backdrop-blur-sm
        ${className}
      `}
    >
      {children}
    </button>
  );
}
