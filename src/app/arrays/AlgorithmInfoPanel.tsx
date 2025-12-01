'use client';

import React from 'react';
import { ArrayAlgorithm, ALGORITHM_INFO, ArrayStep } from './types';

interface AlgorithmInfoPanelProps {
  algorithm: ArrayAlgorithm;
  currentStep: ArrayStep | null;
  stepNumber: number;
  totalSteps: number;
}

export default function AlgorithmInfoPanel({
  algorithm,
  currentStep,
  stepNumber,
  totalSteps,
}: AlgorithmInfoPanelProps) {
  const info = ALGORITHM_INFO[algorithm];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4">
      {/* Algorithm Name & Description */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{info.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{info.description}</p>
      </div>

      {/* Time & Space Complexity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Time Complexity</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Best:</span>
              <span className="text-emerald-400 font-mono">{info.timeComplexity.best}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Avg:</span>
              <span className="text-yellow-400 font-mono">{info.timeComplexity.average}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Worst:</span>
              <span className="text-red-400 font-mono">{info.timeComplexity.worst}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Space</h4>
          <div className="text-lg font-mono text-cyan-400">{info.spaceComplexity}</div>
        </div>
      </div>

      {/* Step Progress */}
      {totalSteps > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs text-slate-500 uppercase tracking-wider">Progress</h4>
            <span className="text-cyan-400 font-mono text-sm">{stepNumber} / {totalSteps}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Step Explanation */}
      {currentStep && (
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-500/20">
          <h4 className="text-xs text-purple-400 uppercase tracking-wider mb-2">Current Step</h4>
          <p className="text-white text-sm leading-relaxed">{currentStep.explanation}</p>
        </div>
      )}

      {/* Pseudocode */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Pseudocode</h4>
        <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
          {info.pseudocode.map((line, idx) => (
            <div 
              key={idx}
              className={`py-0.5 px-2 rounded transition-colors ${
                currentStep?.highlightCode?.includes(idx) 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : ''
              }`}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
