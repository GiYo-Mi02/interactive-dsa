'use client';

import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  label,
  showValue = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-slate-300">{label}</label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${percentage}%, #334155 ${percentage}%, #334155 100%)`,
          }}
        />
      </div>
    </div>
  );
}
