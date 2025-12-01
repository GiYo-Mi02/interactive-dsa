'use client';

import React from 'react';
import { TreeStep, TreeNode } from './types';

interface TreeVisualizerProps {
  step: TreeStep | null;
  nodes: TreeNode[];
}

const getStateColor = (state: TreeNode['state']): { bg: string; border: string; text: string } => {
  switch (state) {
    case 'current':
      return { bg: 'from-yellow-400 to-amber-500', border: 'border-yellow-400', text: 'text-black' };
    case 'visited':
      return { bg: 'from-slate-500 to-slate-600', border: 'border-slate-400', text: 'text-white' };
    case 'queued':
      return { bg: 'from-purple-400 to-violet-500', border: 'border-purple-400', text: 'text-white' };
    case 'rotating':
      return { bg: 'from-pink-400 to-rose-500', border: 'border-pink-400', text: 'text-white' };
    case 'result':
      return { bg: 'from-emerald-400 to-green-500', border: 'border-emerald-400', text: 'text-white' };
    default:
      return { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-400', text: 'text-white' };
  }
};

export default function TreeVisualizer({ step, nodes }: TreeVisualizerProps) {
  const displayNodes = step?.nodes || nodes;

  // Calculate SVG dimensions based on node positions
  const minX = Math.min(...displayNodes.map(n => n.x || 0)) - 50;
  const maxX = Math.max(...displayNodes.map(n => n.x || 0)) + 50;
  const maxY = Math.max(...displayNodes.map(n => n.y || 0)) + 80;
  
  const width = maxX - minX;
  const height = maxY + 20;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 overflow-auto">
      {/* Tree SVG */}
      <svg
        viewBox={`${minX} 0 ${width} ${height}`}
        className="w-full max-w-4xl h-auto"
        style={{ minHeight: '300px', maxHeight: '450px' }}
      >
        {/* Draw edges first (so they appear behind nodes) */}
        {displayNodes.map((node) => {
          const leftChild = node.left !== null ? displayNodes[node.left] : null;
          const rightChild = node.right !== null ? displayNodes[node.right] : null;

          return (
            <g key={`edges-${node.id}`}>
              {leftChild && (
                <line
                  x1={node.x}
                  y1={(node.y || 0) + 20}
                  x2={leftChild.x}
                  y2={(leftChild.y || 0) - 20}
                  stroke="url(#edgeGradient)"
                  strokeWidth="3"
                  className="transition-all duration-300"
                />
              )}
              {rightChild && (
                <line
                  x1={node.x}
                  y1={(node.y || 0) + 20}
                  x2={rightChild.x}
                  y2={(rightChild.y || 0) - 20}
                  stroke="url(#edgeGradient)"
                  strokeWidth="3"
                  className="transition-all duration-300"
                />
              )}
            </g>
          );
        })}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Draw nodes */}
        {displayNodes.map((node) => {
          const colors = getStateColor(node.state);
          const isCurrentNode = step?.currentNode === node.id;
          
          return (
            <g key={node.id} className="transition-all duration-300">
              {/* Glow effect for current node */}
              {isCurrentNode && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  opacity="0.5"
                  className="animate-pulse"
                />
              )}
              
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="24"
                className={`fill-current transition-all duration-300`}
                style={{
                  fill: `url(#gradient-${node.state})`,
                }}
              />
              
              {/* Node border */}
              <circle
                cx={node.x}
                cy={node.y}
                r="24"
                fill="none"
                strokeWidth="3"
                className={colors.border}
                stroke="currentColor"
              />
              
              {/* Node value */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`font-bold text-sm ${colors.text}`}
                fill="white"
              >
                {node.value}
              </text>

              {/* Gradient definitions for each state */}
              <defs>
                <linearGradient id={`gradient-${node.state}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={
                    node.state === 'current' ? '#fbbf24' :
                    node.state === 'visited' ? '#64748b' :
                    node.state === 'queued' ? '#a855f7' :
                    node.state === 'rotating' ? '#f472b6' :
                    node.state === 'result' ? '#34d399' :
                    '#22d3ee'
                  } />
                  <stop offset="100%" stopColor={
                    node.state === 'current' ? '#f59e0b' :
                    node.state === 'visited' ? '#475569' :
                    node.state === 'queued' ? '#7c3aed' :
                    node.state === 'rotating' ? '#f43f5e' :
                    node.state === 'result' ? '#10b981' :
                    '#3b82f6'
                  } />
                </linearGradient>
              </defs>
            </g>
          );
        })}
      </svg>

      {/* Result Order Display */}
      {step?.resultOrder && step.resultOrder.length > 0 && (
        <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-white/10 w-full max-w-2xl">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Traversal Order</div>
          <div className="flex flex-wrap gap-2">
            {step.resultOrder.map((value, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg text-white font-bold shadow-lg shadow-emerald-500/25"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Display for BFS */}
      {step?.queue && step.queue.length > 0 && (
        <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-white/10 w-full max-w-2xl">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Queue</div>
          <div className="flex flex-wrap gap-2">
            {step.queue.map((nodeId, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg text-white font-bold shadow-lg shadow-purple-500/25"
              >
                {displayNodes[nodeId]?.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
          <span className="text-xs text-slate-400">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500"></div>
          <span className="text-xs text-slate-400">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-violet-500"></div>
          <span className="text-xs text-slate-400">Queued</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500"></div>
          <span className="text-xs text-slate-400">Visited</span>
        </div>
      </div>
    </div>
  );
}
