'use client';

import React from 'react';
import { InfoPanelProps } from './types';
import { formatDistance } from '@/lib/utils';
import {
  Activity,
  Lightbulb,
  MapPin,
  Target,
  List,
  CheckCircle,
  ShieldOff,
  Route,
  ArrowRight,
} from 'lucide-react';

export default function InfoPanel({
  currentStep,
  stepNumber,
  totalSteps,
  startNode,
  endNode,
  blockedNodes,
  shortestPath,
}: InfoPanelProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
        Algorithm Info
      </h2>

      {/* Step Progress */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 border border-white/5">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm font-medium text-slate-400">Progress</span>
          <span className="text-xs sm:text-sm font-bold text-cyan-400">
            Step {stepNumber} / {totalSteps || 0}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-300"
            style={{
              width: totalSteps > 0 ? `${(stepNumber / totalSteps) * 100}%` : '0%',
            }}
          />
        </div>
      </div>

      {/* Current Explanation */}
      {currentStep && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 sm:p-4 rounded-xl">
          <h3 className="font-semibold text-amber-400 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Current Step
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{currentStep.explanation}</p>
        </div>
      )}

      {/* Node Info */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5 sm:mb-1">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] sm:text-xs uppercase font-semibold">Start</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">
            {startNode !== null ? startNode : '—'}
          </p>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-rose-400 mb-0.5 sm:mb-1">
            <Target className="w-3 h-3" />
            <span className="text-[10px] sm:text-xs uppercase font-semibold">End</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-400">
            {endNode !== null ? endNode : '—'}
          </p>
        </div>
      </div>

      {/* Priority Queue */}
      {currentStep && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-purple-400 mb-2 sm:mb-3 flex items-center gap-2">
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Priority Queue
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentStep.pq.length === 0 ? (
              <span className="text-slate-500 text-xs sm:text-sm italic">Empty</span>
            ) : (
              currentStep.pq.slice(0, 6).map(([dist, node], idx) => (
                <span
                  key={idx}
                  className="pq-item bg-purple-500/20 text-purple-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border border-purple-500/30"
                >
                  ({formatDistance(dist)}, {node})
                </span>
              ))
            )}
            {currentStep.pq.length > 6 && (
              <span className="text-purple-400 text-[10px] sm:text-xs">
                +{currentStep.pq.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Visited Nodes */}
      {currentStep && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-violet-400 mb-2 sm:mb-3 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Visited ({currentStep.visited.length})
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentStep.visited.length === 0 ? (
              <span className="text-slate-500 text-xs sm:text-sm italic">None yet</span>
            ) : (
              currentStep.visited.slice(0, 12).map((node) => (
                <span
                  key={node}
                  className="bg-violet-500/20 text-violet-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border border-violet-500/30"
                >
                  {node}
                </span>
              ))
            )}
            {currentStep.visited.length > 12 && (
              <span className="text-violet-400 text-[10px] sm:text-xs">
                +{currentStep.visited.length - 12} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Blocked Nodes */}
      {blockedNodes.size > 0 && (
        <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3 flex items-center gap-2">
            <ShieldOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Blocked ({blockedNodes.size})
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {Array.from(blockedNodes).map((node) => (
              <span
                key={node}
                className="bg-slate-700 text-slate-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border border-slate-600"
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shortest Path Result */}
      {shortestPath.length > 0 && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-cyan-400 mb-2 sm:mb-3 flex items-center gap-2">
            <Route className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Shortest Path
          </h3>
          <div className="flex items-center flex-wrap gap-1">
            {shortestPath.map((node, idx) => (
              <React.Fragment key={node}>
                <span className="bg-cyan-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold">
                  {node}
                </span>
                {idx < shortestPath.length - 1 && (
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                )}
              </React.Fragment>
            ))}
          </div>
          {currentStep && endNode !== null && (
            <p className="text-cyan-400 text-xs sm:text-sm mt-2 sm:mt-3">
              Total Distance:{' '}
              <span className="font-bold text-white">
                {formatDistance(currentStep.distances[endNode] || Infinity)}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
