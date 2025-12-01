'use client';

import React from 'react';
import { LinkedListStep, ListNode } from './types';

interface LinkedListVisualizerProps {
  step: LinkedListStep | null;
  nodes: ListNode[];
  isCyclic?: boolean;
  cycleStart?: number;
}

const getStateColor = (state: ListNode['state']): string => {
  switch (state) {
    case 'current':
      return 'from-yellow-400 to-amber-500 border-yellow-400';
    case 'slow':
      return 'from-emerald-400 to-green-500 border-emerald-400';
    case 'fast':
      return 'from-rose-400 to-red-500 border-rose-400';
    case 'visited':
      return 'from-cyan-400 to-blue-500 border-cyan-400';
    case 'cycle':
      return 'from-purple-400 to-violet-500 border-purple-400 animate-pulse';
    case 'reversed':
      return 'from-pink-400 to-rose-500 border-pink-400';
    case 'merged':
      return 'from-teal-400 to-cyan-500 border-teal-400';
    case 'comparing':
      return 'from-orange-400 to-amber-500 border-orange-400';
    default:
      return 'from-slate-600 to-slate-700 border-slate-500';
  }
};

const getPointerLabel = (
  index: number, 
  step: LinkedListStep | null
): string | null => {
  if (!step) return null;
  
  const labels: string[] = [];
  
  if (step.slowPointer === index) labels.push('Slow');
  if (step.fastPointer === index) labels.push('Fast');
  if (step.currentPointer === index) labels.push('Current');
  if (step.prevPointer === index) labels.push('Prev');
  if (step.list1Pointer === index) labels.push('L1');
  if (step.list2Pointer === index) labels.push('L2');
  
  return labels.length > 0 ? labels.join(' | ') : null;
};

export default function LinkedListVisualizer({ 
  step, 
  nodes, 
  isCyclic = false,
  cycleStart 
}: LinkedListVisualizerProps) {
  const displayNodes = step?.nodes || nodes;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-x-auto">
      {/* Main linked list visualization */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Head label */}
        <div className="flex flex-col items-center mr-2">
          <div className="text-cyan-400 text-xs font-mono mb-1">HEAD</div>
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-cyan-400"></div>
        </div>

        {displayNodes.map((node, idx) => {
          const stateColor = getStateColor(node.state);
          const pointerLabel = getPointerLabel(node.id, step);
          const isLastNode = node.next === null && !isCyclic;
          const hasCycleArrow = isCyclic && idx === displayNodes.length - 1 && cycleStart !== undefined;
          
          return (
            <React.Fragment key={node.id}>
              {/* Node */}
              <div className="flex flex-col items-center">
                {/* Pointer label */}
                {pointerLabel && (
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 bg-gradient-to-r ${stateColor} text-white whitespace-nowrap`}>
                    {pointerLabel}
                  </div>
                )}
                
                {/* Node box */}
                <div className={`relative flex items-center bg-gradient-to-br ${stateColor} rounded-xl border-2 shadow-lg transition-all duration-300`}>
                  {/* Value section */}
                  <div className="px-4 py-3 border-r border-white/20">
                    <div className="text-white font-bold text-lg">{node.value}</div>
                    <div className="text-white/60 text-[10px] font-mono">id: {node.id}</div>
                  </div>
                  
                  {/* Next pointer section */}
                  <div className="px-3 py-3 flex items-center justify-center">
                    <div className="text-white/80 text-xs font-mono">
                      {node.next !== null ? `→${node.next}` : 'null'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow to next node */}
              {!isLastNode && idx < displayNodes.length - 1 && (
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-slate-400 to-slate-500"></div>
                  <div className="w-0 h-0 border-l-8 border-l-slate-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                </div>
              )}

              {/* Null terminator */}
              {isLastNode && (
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-slate-400 to-slate-600"></div>
                  <div className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-600 text-slate-400 text-sm font-mono">
                    NULL
                  </div>
                </div>
              )}

              {/* Cycle arrow (visual indicator) */}
              {hasCycleArrow && (
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-violet-500"></div>
                  <div className="px-2 py-1 bg-purple-500/20 rounded border border-purple-400 text-purple-300 text-xs font-mono">
                    ↩ {cycleStart}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cycle indicator */}
      {isCyclic && cycleStart !== undefined && (
        <div className="mt-6 flex items-center gap-2 text-purple-400">
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
          <span className="text-sm">Cycle connects back to node {cycleStart}</span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-slate-600 to-slate-700"></div>
          <span className="text-xs text-slate-400">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-400 to-amber-500"></div>
          <span className="text-xs text-slate-400">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-400 to-green-500"></div>
          <span className="text-xs text-slate-400">Slow Pointer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-rose-400 to-red-500"></div>
          <span className="text-xs text-slate-400">Fast Pointer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <span className="text-xs text-slate-400">Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-400 to-violet-500"></div>
          <span className="text-xs text-slate-400">Cycle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-pink-400 to-rose-500"></div>
          <span className="text-xs text-slate-400">Reversed</span>
        </div>
      </div>
    </div>
  );
}
