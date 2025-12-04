'use client';

import React from 'react';
import {
  Circle,
  MapPin,
  Target,
  Eye,
  CheckCircle,
  Navigation,
  ShieldOff,
  Palette,
  Calculator,
} from 'lucide-react';

interface LegendProps {
  isDark?: boolean;
}

export default function Legend({ isDark = true }: LegendProps) {
  const items = [
    { color: 'bg-slate-500', label: 'Default', Icon: Circle },
    { color: 'bg-emerald-500', label: 'Start', Icon: MapPin },
    { color: 'bg-rose-500', label: 'End', Icon: Target },
    { color: 'bg-amber-500', label: 'Current', Icon: Eye },
    { color: 'bg-violet-500', label: 'Visited', Icon: CheckCircle },
    { color: 'bg-cyan-500', label: 'Path', Icon: Navigation },
    { color: 'bg-slate-800', label: 'Blocked', Icon: ShieldOff },
  ];

  const edgeItems = [
    { color: 'bg-slate-500', label: 'Default' },
    { color: 'bg-amber-400', label: 'Exploring' },
    { color: 'bg-cyan-500', label: 'Path' },
  ];

  return (
    <div className={`backdrop-blur-xl rounded-2xl border p-4 sm:p-6 ${
      isDark 
        ? 'bg-slate-900/80 border-white/10' 
        : 'bg-white/90 border-slate-200 shadow-lg'
    }`}>
      <h2 className={`text-lg sm:text-xl font-bold border-b pb-2 sm:pb-3 mb-3 sm:mb-4 flex items-center gap-2 ${
        isDark 
          ? 'text-white border-white/10' 
          : 'text-slate-800 border-slate-200'
      }`}>
        <Palette className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
        Legend
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Node Legend - Grid on mobile */}
        <div>
          <h3 className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Nodes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} rounded-full shadow-lg flex items-center justify-center flex-shrink-0`}
                >
                  <item.Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
                <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edge Legend */}
        <div>
          <h3 className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Edges
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2">
            {edgeItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                <div className={`w-6 sm:w-8 h-1 ${item.color} rounded-full flex-shrink-0`} />
                <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Info - Improved styling */}
        <div className={`rounded-xl p-3 sm:p-4 mt-3 sm:mt-4 border ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-white/5' 
            : 'bg-gradient-to-r from-cyan-50 to-purple-50 border-slate-200'
        }`}>
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            <Calculator className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            Dijkstra&apos;s Algorithm
          </h3>
          <ul className={`text-[10px] sm:text-xs space-y-1 sm:space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <li className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0"></span>
              <span>Shortest path in weighted graphs</span>
            </li>
            <li className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0"></span>
              <span>Uses priority queue (min-heap)</span>
            </li>
            <li className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1 h-1 bg-cyan-400 rounded-full flex-shrink-0"></span>
              <span>Time: O((V + E) log V)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
