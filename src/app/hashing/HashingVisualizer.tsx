'use client';

import React from 'react';
import { HashBucket, HashStep } from './types';

interface HashingVisualizerProps {
  step: HashStep;
}

export const HashingVisualizer: React.FC<HashingVisualizerProps> = ({ step }) => {
  const { buckets, currentKey, hashValue, probeIndex, probeCount } = step;

  const getStateColor = (state: HashBucket['state']) => {
    switch (state) {
      case 'hashing':
        return 'bg-yellow-500/30 border-yellow-400';
      case 'collision':
        return 'bg-red-500/30 border-red-400';
      case 'probing':
        return 'bg-orange-500/30 border-orange-400';
      case 'inserted':
        return 'bg-green-500/30 border-green-400';
      default:
        return 'bg-slate-800/50 border-slate-600';
    }
  };

  const getStateGlow = (state: HashBucket['state']) => {
    switch (state) {
      case 'hashing':
        return 'shadow-[0_0_15px_rgba(234,179,8,0.4)]';
      case 'collision':
        return 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
      case 'probing':
        return 'shadow-[0_0_15px_rgba(249,115,22,0.4)]';
      case 'inserted':
        return 'shadow-[0_0_15px_rgba(34,197,94,0.4)]';
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-auto">
      {/* Current Operation Info */}
      <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex flex-wrap gap-6 items-center justify-center text-sm">
          {currentKey !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Current Key:</span>
              <span className="font-mono text-lg text-cyan-400 font-bold">{currentKey}</span>
            </div>
          )}
          {hashValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Hash Value:</span>
              <span className="font-mono text-lg text-yellow-400 font-bold">{hashValue}</span>
            </div>
          )}
          {probeIndex !== undefined && probeIndex !== hashValue && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Probe Index:</span>
              <span className="font-mono text-lg text-orange-400 font-bold">{probeIndex}</span>
            </div>
          )}
          {probeCount !== undefined && probeCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Probe Count:</span>
              <span className="font-mono text-lg text-purple-400 font-bold">{probeCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hash Formula */}
      <div className="mb-4 text-center">
        <span className="font-mono text-sm text-slate-400">
          hash(key) = key % {step.tableSize}
        </span>
        {currentKey !== undefined && hashValue !== undefined && (
          <span className="ml-4 font-mono text-sm text-cyan-400">
            → hash({currentKey}) = {currentKey} % {step.tableSize} = {hashValue}
          </span>
        )}
      </div>

      {/* Hash Table Visualization */}
      <div className="flex-1 flex items-start justify-center">
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl">
          {buckets.map((bucket) => (
            <div
              key={bucket.index}
              className={`flex flex-col rounded-lg border-2 transition-all duration-300 ${getStateColor(bucket.state)} ${getStateGlow(bucket.state)}`}
              style={{ minWidth: '80px', maxWidth: '120px' }}
            >
              {/* Bucket Index Header */}
              <div className="px-3 py-1.5 border-b border-slate-600 bg-slate-900/50 rounded-t-md">
                <span className="font-mono text-sm text-slate-300">[{bucket.index}]</span>
              </div>
              
              {/* Bucket Contents */}
              <div className="p-2 min-h-[60px] flex flex-col gap-1">
                {bucket.values.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center italic">empty</div>
                ) : (
                  bucket.values.map((item, idx) => (
                    <div
                      key={`${item.key}-${idx}`}
                      className={`px-2 py-1 rounded text-xs font-mono text-center transition-all duration-300 ${
                        idx === bucket.values.length - 1 && bucket.state === 'inserted'
                          ? 'bg-green-500/30 text-green-300 ring-1 ring-green-400'
                          : 'bg-slate-700/50 text-slate-200'
                      }`}
                    >
                      {item.key}:{item.value}
                    </div>
                  ))
                )}
              </div>

              {/* Chain indicator for multiple values */}
              {bucket.values.length > 1 && (
                <div className="px-2 py-1 text-xs text-center text-purple-400 border-t border-slate-600">
                  chain: {bucket.values.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 bg-yellow-500/30 border-yellow-400" />
          <span className="text-slate-300">Hashing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 bg-red-500/30 border-red-400" />
          <span className="text-slate-300">Collision</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 bg-orange-500/30 border-orange-400" />
          <span className="text-slate-300">Probing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 bg-green-500/30 border-green-400" />
          <span className="text-slate-300">Inserted</span>
        </div>
      </div>
    </div>
  );
};
