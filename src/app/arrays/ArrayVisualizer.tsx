'use client';

import React from 'react';
import { ArrayStep, ArrayElement } from './types';

interface ArrayVisualizerProps {
  step: ArrayStep | null;
  array: number[];
}

const getStateColor = (state: ArrayElement['state']): string => {
  switch (state) {
    case 'comparing':
      return 'from-yellow-400 to-amber-500 shadow-yellow-500/50';
    case 'found':
      return 'from-emerald-400 to-green-500 shadow-emerald-500/50';
    case 'sorted':
      return 'from-cyan-400 to-blue-500 shadow-cyan-500/50';
    case 'pivot':
      return 'from-purple-400 to-violet-500 shadow-purple-500/50';
    case 'left-pointer':
      return 'from-pink-400 to-rose-500 shadow-pink-500/50';
    case 'right-pointer':
      return 'from-orange-400 to-red-500 shadow-orange-500/50';
    case 'swapping':
      return 'from-fuchsia-400 to-pink-500 shadow-fuchsia-500/50 animate-pulse';
    case 'merging':
      return 'from-teal-400 to-cyan-500 shadow-teal-500/50';
    default:
      return 'from-slate-600 to-slate-700 shadow-slate-500/20';
  }
};

const getStateLabel = (state: ArrayElement['state']): string | null => {
  switch (state) {
    case 'comparing': return 'Comparing';
    case 'found': return 'Found!';
    case 'sorted': return 'Sorted';
    case 'pivot': return 'Pivot';
    case 'left-pointer': return 'Left';
    case 'right-pointer': return 'Right';
    case 'swapping': return 'Swap';
    case 'merging': return 'Merge';
    default: return null;
  }
};

export default function ArrayVisualizer({ step, array }: ArrayVisualizerProps) {
  const elements = step?.array || array.map((value, index) => ({
    value,
    index,
    state: 'default' as const,
  }));

  const maxValue = Math.max(...elements.map(e => e.value), 1);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Array Bar Visualization */}
      <div className="flex-1 flex items-end justify-center gap-1 sm:gap-2 px-2 sm:px-4 pb-4 min-h-[200px]">
        {elements.map((element, idx) => {
          const heightPercent = (element.value / maxValue) * 100;
          const stateColor = getStateColor(element.state);
          const label = getStateLabel(element.state);
          
          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 flex-1 max-w-16"
            >
              {/* State Label */}
              {label && (
                <div className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-full bg-gradient-to-r ${stateColor} text-white whitespace-nowrap`}>
                  {label}
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`w-full rounded-t-lg bg-gradient-to-t ${stateColor} shadow-lg transition-all duration-300 ease-out flex items-end justify-center`}
                style={{ 
                  height: `${Math.max(heightPercent, 15)}%`,
                  minHeight: '40px',
                }}
              >
                <span className="text-white font-bold text-xs sm:text-sm mb-2 drop-shadow-lg">
                  {element.value}
                </span>
              </div>
              
              {/* Index */}
              <div className="text-slate-400 text-[10px] sm:text-xs font-mono">
                [{idx}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Pointer Indicators */}
      {(step?.leftPointer !== undefined || step?.rightPointer !== undefined || step?.midPointer !== undefined) && (
        <div className="flex justify-center gap-4 px-4 py-2 bg-slate-800/50 rounded-lg mx-4 mb-4">
          {step?.leftPointer !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-500"></div>
              <span className="text-xs text-slate-300">Left: {step.leftPointer}</span>
            </div>
          )}
          {step?.midPointer !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
              <span className="text-xs text-slate-300">Mid: {step.midPointer}</span>
            </div>
          )}
          {step?.rightPointer !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
              <span className="text-xs text-slate-300">Right: {step.rightPointer}</span>
            </div>
          )}
          {step?.pivot !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-violet-500"></div>
              <span className="text-xs text-slate-300">Pivot: {step.pivot}</span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 pb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-slate-600 to-slate-700"></div>
          <span className="text-xs text-slate-400">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-400 to-amber-500"></div>
          <span className="text-xs text-slate-400">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-fuchsia-400 to-pink-500"></div>
          <span className="text-xs text-slate-400">Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <span className="text-xs text-slate-400">Sorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-400 to-green-500"></div>
          <span className="text-xs text-slate-400">Found</span>
        </div>
      </div>
    </div>
  );
}
