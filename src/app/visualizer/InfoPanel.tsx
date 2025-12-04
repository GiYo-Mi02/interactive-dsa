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

interface ExtendedInfoPanelProps extends InfoPanelProps {
  isDark?: boolean;
}

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
  isDark = true,
}: ExtendedInfoPanelProps) {
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
    <div className={`backdrop-blur-xl rounded-2xl border p-4 sm:p-6 space-y-4 sm:space-y-5 ${
      isDark 
        ? 'bg-slate-900/80 border-white/10' 
        : 'bg-white/90 border-slate-200 shadow-lg'
    }`}>
      <h2 className={`text-lg sm:text-xl font-bold border-b pb-3 flex items-center gap-2 ${
        isDark 
          ? 'text-white border-white/10' 
          : 'text-slate-800 border-slate-200'
      }`}>
        <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        Algorithm Info
      </h2>

      {/* Step Progress */}
      <div className={`rounded-xl p-3 sm:p-4 border ${
        isDark 
          ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-white/5' 
          : 'bg-gradient-to-r from-cyan-50 to-purple-50 border-slate-200'
      }`}>
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Progress</span>
          <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Step {stepNumber} / {totalSteps || 0}
          </span>
        </div>
        <div className={`w-full rounded-full h-1.5 sm:h-2 overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
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
        <div className={`border p-3 sm:p-4 rounded-xl ${
          isDark 
            ? 'bg-amber-500/10 border-amber-500/20' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <h3 className={`font-semibold mb-1.5 sm:mb-2 flex items-center gap-2 text-sm ${
            isDark ? 'text-amber-400' : 'text-amber-600'
          }`}>
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Current Step
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{currentStep.explanation}</p>
        </div>
      )}

      {/* Priority Queue */}
      {currentStep && (
        <div className={`rounded-xl p-3 sm:p-4 border ${
          isDark 
            ? 'bg-purple-500/10 border-purple-500/20' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Priority Queue
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentStep.pq.length === 0 ? (
              <span className={`text-xs sm:text-sm italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Empty</span>
            ) : (
              currentStep.pq.slice(0, 6).map(([dist, node], idx) => (
                <span
                  key={idx}
                  className={`pq-item px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border ${
                    isDark 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                      : 'bg-purple-100 text-purple-700 border-purple-300'
                  }`}
                >
                  ({formatDistance(dist)}, {node})
                </span>
              ))
            )}
            {currentStep.pq.length > 6 && (
              <span className={`text-[10px] sm:text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                +{currentStep.pq.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Visited Nodes */}
      {currentStep && (
        <div className={`rounded-xl p-3 sm:p-4 border ${
          isDark 
            ? 'bg-violet-500/10 border-violet-500/20' 
            : 'bg-violet-50 border-violet-200'
        }`}>
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`}>
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Visited ({currentStep.visited.length})
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {currentStep.visited.length === 0 ? (
              <span className={`text-xs sm:text-sm italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>None yet</span>
            ) : (
              currentStep.visited.slice(0, 12).map((node) => (
                <span
                  key={node}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border ${
                    isDark 
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' 
                      : 'bg-violet-100 text-violet-700 border-violet-300'
                  }`}
                >
                  {node}
                </span>
              ))
            )}
            {currentStep.visited.length > 12 && (
              <span className={`text-[10px] sm:text-xs ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                +{currentStep.visited.length - 12} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Blocked Nodes */}
      {blockedNodes.size > 0 && (
        <div className={`rounded-xl p-3 sm:p-4 border ${
          isDark 
            ? 'bg-slate-800/80 border-slate-600/50' 
            : 'bg-slate-100 border-slate-300'
        }`}>
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <ShieldOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Blocked ({blockedNodes.size})
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {Array.from(blockedNodes).map((node) => (
              <span
                key={node}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-mono border ${
                  isDark 
                    ? 'bg-slate-700 text-slate-300 border-slate-600' 
                    : 'bg-slate-200 text-slate-600 border-slate-400'
                }`}
              >
                {node}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shortest Path Result */}
      {shortestPath.length > 0 && (
        <div className={`rounded-xl p-3 sm:p-4 border ${
          isDark 
            ? 'bg-cyan-500/10 border-cyan-500/20' 
            : 'bg-cyan-50 border-cyan-200'
        }`}>
          <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
            isDark ? 'text-cyan-400' : 'text-cyan-600'
          }`}>
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
                  <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {currentStep && endNode !== null && (
            <p className={`text-xs sm:text-sm mt-2 sm:mt-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Total Distance:{' '}
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {formatDistance(currentStep.distances[endNode] || Infinity)}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Animated Dijkstra Pseudocode */}
      <div className={`rounded-xl p-3 sm:p-4 overflow-hidden border ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-slate-100 border-slate-200'
      }`}>
        <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-2 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
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
                    ? isDark
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/20 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                      : 'bg-gradient-to-r from-cyan-200/70 to-purple-200/50 text-cyan-700 shadow-md'
                    : isExecuted
                    ? isDark 
                      ? 'text-emerald-400/70' 
                      : 'text-emerald-600/70'
                    : isDark 
                      ? 'text-slate-500' 
                      : 'text-slate-400'
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
                  <span className={`absolute left-0.5 top-1/2 -translate-y-1/2 text-[8px] ${
                    isDark ? 'text-emerald-500' : 'text-emerald-600'
                  }`}>✓</span>
                )}
                
                {/* Line number */}
                <span className={`inline-block w-5 mr-2 text-right ${
                  isActive 
                    ? isDark ? 'text-cyan-400 font-bold' : 'text-cyan-600 font-bold'
                    : isExecuted 
                    ? isDark ? 'text-emerald-500/60' : 'text-emerald-600/60'
                    : isDark ? 'text-slate-600' : 'text-slate-400'
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
          <div className={`mt-3 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Executing: <span className={`font-mono font-medium ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>Line {activeLineIndex + 1}</span>
              </span>
            </div>
          </div>
        )}
        
        {/* No active line - show waiting state */}
        {activeLineIndex < 0 && stepNumber === 0 && (
          <div className={`mt-3 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-[10px] sm:text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
              <span>Waiting to start...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
