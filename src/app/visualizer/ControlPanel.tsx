'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import Slider from '@/components/Slider';
import { ControlPanelProps } from './types';
import {
  RefreshCw,
  RotateCcw,
  MapPin,
  Target,
  ShieldOff,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function ControlPanel({
  onGenerateGraph,
  onSelectStart,
  onSelectEnd,
  onRunAlgorithm,
  onBlockNodes,
  onReset,
  onSpeedChange,
  onStepForward,
  onStepBackward,
  onPlayPause,
  isPlaying,
  speed,
  canRun,
  hasSteps,
  selectionMode,
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Mobile Header with Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 lg:hidden hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 rounded-lg border border-cyan-500/30">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-lg font-semibold text-white">Controls</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Control Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 pt-0 lg:pt-4 lg:p-5">
          {/* Desktop: Single row layout */}
          <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {/* Graph Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Graph</span>
              <div className="flex gap-2">
                <Button onClick={onGenerateGraph} variant="primary" size="sm">
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate</span>
                </Button>
                <Button onClick={onReset} variant="secondary" size="sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0"></div>

            {/* Node Selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Nodes</span>
              <div className="flex gap-2">
                <Button onClick={onSelectStart} variant="success" active={selectionMode === 'start'} size="sm">
                  <MapPin className="w-4 h-4" />
                  <span>Start</span>
                </Button>
                <Button onClick={onSelectEnd} variant="danger" active={selectionMode === 'end'} size="sm">
                  <Target className="w-4 h-4" />
                  <span>End</span>
                </Button>
                <Button onClick={onBlockNodes} variant="warning" active={selectionMode === 'block'} size="sm">
                  <ShieldOff className="w-4 h-4" />
                  <span>Block</span>
                </Button>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0"></div>

            {/* Algorithm */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Run</span>
              <Button onClick={onRunAlgorithm} variant="primary" disabled={!canRun} size="sm">
                <Play className="w-4 h-4" />
                <span>Dijkstra</span>
              </Button>
              {hasSteps && (
                <div className="flex items-center gap-1">
                  <Button onClick={onStepBackward} variant="secondary" size="sm">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button onClick={onPlayPause} variant={isPlaying ? 'warning' : 'success'} size="sm">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button onClick={onStepForward} variant="secondary" size="sm">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-white/10 flex-shrink-0"></div>

            {/* Speed */}
            <div className="flex items-center gap-3 min-w-[160px]">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Speed</span>
              <div className="flex-1">
                <Slider value={speed} onChange={onSpeedChange} min={1} max={5} showValue={true} label="" />
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Grid layout with descriptions */}
          <div className="lg:hidden space-y-4">
            {/* Quick Guide - Only visible on small screens */}
            <div className="sm:hidden bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold">Quick Guide:</span> Generate a graph → Select start & end nodes → Run the algorithm. Use pinch/scroll to zoom the canvas!
              </p>
            </div>

            {/* Row 1: Graph Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Graph</span>
                <span className="text-[10px] text-slate-600 sm:hidden">• Create or reset the graph</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={onGenerateGraph} variant="primary" size="sm">
                  <RefreshCw className="w-4 h-4" />
                  <span className="sm:inline hidden">Generate</span>
                </Button>
                <Button onClick={onReset} variant="secondary" size="sm">
                  <RotateCcw className="w-4 h-4" />
                  <span className="sm:inline hidden">Reset</span>
                </Button>
              </div>
            </div>

            {/* Row 2: Node Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nodes</span>
                <span className="text-[10px] text-slate-600 sm:hidden">• Tap nodes on graph to select</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={onSelectStart} variant="success" active={selectionMode === 'start'} size="sm">
                  <MapPin className="w-4 h-4" />
                  <span className="sm:inline hidden">Start</span>
                </Button>
                <Button onClick={onSelectEnd} variant="danger" active={selectionMode === 'end'} size="sm">
                  <Target className="w-4 h-4" />
                  <span className="sm:inline hidden">End</span>
                </Button>
                <Button onClick={onBlockNodes} variant="warning" active={selectionMode === 'block'} size="sm">
                  <ShieldOff className="w-4 h-4" />
                  <span className="sm:inline hidden">Block</span>
                </Button>
              </div>
            </div>

            {/* Row 3: Algorithm & Playback */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Run</span>
                <span className="text-[10px] text-slate-600 sm:hidden">• Find shortest path</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button onClick={onRunAlgorithm} variant="primary" disabled={!canRun} size="sm">
                  <Play className="w-4 h-4" />
                  <span>Dijkstra</span>
                </Button>
                {hasSteps && (
                  <div className="flex items-center gap-1">
                    <Button onClick={onStepBackward} variant="secondary" size="sm">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button onClick={onPlayPause} variant={isPlaying ? 'warning' : 'success'} size="sm">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button onClick={onStepForward} variant="secondary" size="sm">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Speed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Speed</span>
                <span className="text-[10px] text-slate-600 sm:hidden">• Animation speed</span>
              </div>
              <div className="flex-1 max-w-[200px]">
                <Slider value={speed} onChange={onSpeedChange} min={1} max={5} showValue={true} label="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
