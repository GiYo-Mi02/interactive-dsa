'use client';

import React, { useMemo } from 'react';
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
  Code2,
} from 'lucide-react';

// Pseudocode line component with animation
interface PseudocodeLine {
  code: string;
  indent: number;
}

const DIJKSTRA_PSEUDOCODE: PseudocodeLine[] = [
  { code: 'function dijkstra(graph, start, end):', indent: 0 },
  { code: 'dist[v] = ∞ for all vertices v', indent: 1 },
  { code: 'dist[start] = 0', indent: 1 },
  { code: 'pq = [(0, start)]  // priority queue', indent: 1 },
  { code: 'while pq is not empty:', indent: 1 },
  { code: 'current = pq.extractMin()', indent: 2 },
  { code: 'if current is visited: continue', indent: 2 },
  { code: 'mark current as visited', indent: 2 },
  { code: 'if current == end: return dist[end]', indent: 2 },
  { code: 'for each neighbor of current:', indent: 2 },
  { code: 'newDist = dist[current] + weight', indent: 3 },
  { code: 'if newDist < dist[neighbor]:', indent: 3 },
  { code: 'dist[neighbor] = newDist', indent: 4 },
  { code: 'pq.insert((newDist, neighbor))', indent: 4 },
  { code: 'return "no path found"', indent: 1 },
];

// Map step explanations to pseudocode line indices
function getActiveLineFromExplanation(explanation: string | undefined): number {
  if (!explanation) return -1;
  
  const exp = explanation.toLowerCase();
  
  // "Starting at node X. Initial distance is 0." -> Lines 1-4 (initialization)
  if (exp.includes('starting at') && exp.includes('initial distance')) {
    return 2; // dist[start] = 0
  }
  
  // "Visiting start node X." -> mark as visited
  if (exp.includes('visiting start node')) {
    return 7; // mark current as visited
  }
  
  // "Visiting node X with distance Y from source." -> extractMin + mark visited
  if (exp.includes('visiting node') && exp.includes('with distance')) {
    return 7; // mark current as visited
  }
  
  // "Reached destination node X!" -> found the end
  if (exp.includes('reached destination')) {
    return 8; // if current == end: return
  }
  
  // "Found path to node X via node Y. Distance: Z" -> new path found
  if (exp.includes('found path to node') && !exp.includes('shorter')) {
    return 12; // dist[neighbor] = newDist (first time finding path)
  }
  
  // "Found shorter path to node X via node Y. Old: A, New: B" -> relaxation
  if (exp.includes('found shorter path')) {
    return 12; // dist[neighbor] = newDist
  }
  
  return -1;
}

export default function InfoPanel({
  currentStep,
  stepNumber,
  totalSteps,
  startNode,
  endNode,
  blockedNodes,
  shortestPath,
}: InfoPanelProps) {
  // Determine which line is currently active based on explanation
  const activeLineIndex = useMemo(() => {
    return getActiveLineFromExplanation(currentStep?.explanation);
  }, [currentStep?.explanation]);

  // Track which lines have been "executed" based on step progress
  const executedLines = useMemo(() => {
    const executed = new Set<number>();
    
    if (!currentStep) return executed;
    
    // Always show initialization as executed after first step
    if (stepNumber >= 1) {
      executed.add(0); // function
      executed.add(1); // dist = infinity
      executed.add(2); // dist[start] = 0
      executed.add(3); // pq init
    }
    
    // While loop and extraction
    if (stepNumber >= 2) {
      executed.add(4); // while
      executed.add(5); // extractMin
    }
    
    // Visited check and marking
    if (currentStep.visited.length > 0) {
      executed.add(7); // mark as visited
    }
    
    // If we've found paths (neighbors explored)
    if (Object.values(currentStep.distances).some(d => d !== Infinity && d !== 0)) {
      executed.add(9);  // for each neighbor
      executed.add(10); // newDist calculation
      executed.add(11); // if newDist < dist
      executed.add(12); // update dist
      executed.add(13); // insert pq
    }
    
    // If we reached destination
    if (shortestPath.length > 0) {
      executed.add(8); // return dist[end]
    }
    
    return executed;
  }, [currentStep, stepNumber, shortestPath]);

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

      {/* Animated Dijkstra Pseudocode */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 overflow-hidden">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3 flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Pseudocode
        </h3>
        <div className="font-mono text-[10px] sm:text-xs space-y-0.5 overflow-x-auto">
          {DIJKSTRA_PSEUDOCODE.map((line, idx) => {
            const isActive = idx === activeLineIndex;
            const isExecuted = executedLines.has(idx) && !isActive;
            
            return (
              <div
                key={idx}
                className={`
                  relative py-0.5 px-2 rounded transition-all duration-300 ease-out
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                    : isExecuted
                    ? 'text-emerald-400/70'
                    : 'text-slate-500'
                  }
                `}
                style={{ 
                  paddingLeft: `${line.indent * 12 + 8}px`,
                  transform: isActive ? 'translateX(4px) scale(1.01)' : 'translateX(0) scale(1)',
                }}
              >
                {/* Active line indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                )}
                
                {/* Executed line checkmark */}
                {isExecuted && (
                  <span className="absolute left-0.5 top-1/2 -translate-y-1/2 text-emerald-500 text-[8px]">✓</span>
                )}
                
                {/* Line number */}
                <span className={`inline-block w-5 mr-2 text-right ${
                  isActive ? 'text-cyan-400 font-bold' : isExecuted ? 'text-emerald-500/60' : 'text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                
                {/* Code */}
                <span className={isActive ? 'font-semibold' : ''}>
                  {line.code}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Execution indicator */}
        {activeLineIndex >= 0 && (
          <div className="mt-3 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <span className="text-slate-400">
                Executing: <span className="text-cyan-300 font-mono font-medium">Line {activeLineIndex + 1}</span>
              </span>
            </div>
          </div>
        )}
        
        {/* No active line - show waiting state */}
        {activeLineIndex < 0 && stepNumber === 0 && (
          <div className="mt-3 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>Waiting to start...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
