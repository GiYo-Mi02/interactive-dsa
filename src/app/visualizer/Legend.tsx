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

export default function Legend() {
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
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-2 sm:pb-3 mb-3 sm:mb-4 flex items-center gap-2">
        <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
        Legend
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Node Legend - Grid on mobile */}
        <div>
          <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">
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
                <span className="text-slate-300 truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edge Legend */}
        <div>
          <h3 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-3">
            Edges
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2">
            {edgeItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                <div className={`w-6 sm:w-8 h-1 ${item.color} rounded-full flex-shrink-0`} />
                <span className="text-slate-300 truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Info - Hidden on very small screens */}
        <div className="hidden sm:block bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/5 rounded-xl p-3 sm:p-4 mt-3 sm:mt-4">
          <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            Dijkstra&apos;s Algorithm
          </h3>
          <ul className="text-[10px] sm:text-xs text-slate-400 space-y-1 sm:space-y-1.5">
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
