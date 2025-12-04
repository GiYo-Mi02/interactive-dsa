'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Network, Home, Github, Play, Pause, SkipForward, SkipBack, 
  RefreshCw, Link2, ChevronDown, RotateCcw, GitMerge
} from 'lucide-react';
import LinkedListVisualizer from './LinkedListVisualizer';
import AIExplanationPanel from '@/components/AIExplanationPanel';
import { LinkedListAlgorithm, LinkedListStep, LINKED_LIST_INFO, ListNode } from './types';
import { 
  generateLinkedList, 
  generateSortedLinkedList,
  generateCyclicList,
  traverseList,
  floydCycleDetection,
  reverseList,
  mergeSortedLists
} from './algorithms';
import { getStepDelay } from '@/lib/animationEngine';

const ALGORITHM_OPTIONS: { value: LinkedListAlgorithm; label: string; icon: React.ElementType }[] = [
  { value: 'traversal', label: 'Traversal', icon: Link2 },
  { value: 'floyd-cycle', label: "Floyd's Cycle Detection", icon: RotateCcw },
  { value: 'reversal', label: 'List Reversal', icon: RefreshCw },
  { value: 'merge-sorted', label: 'Merge Sorted Lists', icon: GitMerge },
];

export default function LinkedListPage() {
  const [algorithm, setAlgorithm] = useState<LinkedListAlgorithm>('traversal');
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [nodes2, setNodes2] = useState<ListNode[]>([]); // For merge
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [hasCycle, setHasCycle] = useState(false);
  const [cycleStart, setCycleStart] = useState<number | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listSize, setListSize] = useState(6);
  const [inputMode, setInputMode] = useState<'random' | 'custom'>('random');
  const [customInput, setCustomInput] = useState('');
  
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

  // Parse custom input
  const parseCustomInput = useCallback((input: string): number[] => {
    return input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n <= 99)
      .slice(0, 10);
  }, []);

  // Convert values to ListNode array
  const valuesToNodes = useCallback((values: number[]): ListNode[] => {
    return values.map((value, index) => ({
      id: index,
      value,
      next: index < values.length - 1 ? index + 1 : null,
      state: 'default' as const,
    }));
  }, []);

  // Generate new list based on algorithm
  const handleGenerateList = useCallback(() => {
    if (inputMode === 'custom' && customInput.trim() && algorithm !== 'floyd-cycle') {
      const values = parseCustomInput(customInput);
      if (values.length > 0) {
        if (algorithm === 'merge-sorted') {
          const sorted = [...values].sort((a, b) => a - b);
          const mid = Math.ceil(sorted.length / 2);
          setNodes(valuesToNodes(sorted.slice(0, mid)));
          setNodes2(valuesToNodes(sorted.slice(mid)));
        } else {
          setNodes(valuesToNodes(values));
          setNodes2([]);
        }
        setHasCycle(false);
        setCycleStart(undefined);
        setSteps([]);
        setCurrentStepIndex(0);
        setIsPlaying(false);
        return;
      }
    }
    
    if (algorithm === 'floyd-cycle') {
      // 50% chance to have cycle
      const shouldHaveCycle = Math.random() > 0.5;
      if (shouldHaveCycle) {
        const { nodes: cyclicNodes, cycleStart: start } = generateCyclicList(listSize);
        setNodes(cyclicNodes);
        setHasCycle(true);
        setCycleStart(start);
      } else {
        setNodes(generateLinkedList(listSize));
        setHasCycle(false);
        setCycleStart(undefined);
      }
      setNodes2([]);
    } else if (algorithm === 'merge-sorted') {
      setNodes(generateSortedLinkedList(Math.floor(listSize / 2) + 1, 0));
      setNodes2(generateSortedLinkedList(Math.floor(listSize / 2), 0));
      setHasCycle(false);
      setCycleStart(undefined);
    } else {
      setNodes(generateLinkedList(listSize));
      setHasCycle(false);
      setCycleStart(undefined);
      setNodes2([]);
    }
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [algorithm, listSize, inputMode, customInput, parseCustomInput, valuesToNodes]);

  // Only run on algorithm change, not on every handleGenerateList change
  useEffect(() => {
    handleGenerateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  // Run algorithm
  const handleRunAlgorithm = useCallback(() => {
    if (nodes.length === 0) return;

    let algorithmSteps: LinkedListStep[] = [];

    switch (algorithm) {
      case 'traversal':
        algorithmSteps = traverseList(nodes);
        break;
      case 'floyd-cycle':
        algorithmSteps = floydCycleDetection(nodes, hasCycle, cycleStart);
        break;
      case 'reversal':
        algorithmSteps = reverseList(nodes);
        break;
      case 'merge-sorted':
        const list2 = nodes2.length > 0 ? nodes2 : generateSortedLinkedList(Math.floor(listSize / 2), 0);
        algorithmSteps = mergeSortedLists(nodes, list2);
        break;
    }

    if (algorithmSteps.length > 0) {
      setSteps(algorithmSteps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  }, [nodes, nodes2, algorithm, hasCycle, cycleStart, listSize]);

  // Animation playback
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      animationTimer.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, getStepDelay(speed));
    }

    return () => {
      if (animationTimer.current) {
        clearInterval(animationTimer.current);
      }
    };
  }, [isPlaying, steps.length, speed]);

  // Controls
  const handlePlayPause = () => {
    if (steps.length === 0) {
      handleRunAlgorithm();
    } else if (isPlaying) {
      setIsPlaying(false);
    } else if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const info = LINKED_LIST_INFO[algorithm];

  return (
    <div className="min-h-screen bg-[#0a0a1a] overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-2.5 rounded-lg border border-white/20">
                  <Network className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  Linked List Algorithms
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  {info.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/"
                className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-colors px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/5"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Home</span>
              </Link>
              <a 
                href="https://github.com/GiYo-Mi02"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 text-slate-400 hover:text-white transition-colors px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/5"
              >
                <Github className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-[1920px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Control Panel */}
        <div className="relative z-10 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Algorithm Selector */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors min-w-[200px]"
              >
                <span className="text-sm">{info.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    {ALGORITHM_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Mode Toggle */}
            {algorithm !== 'floyd-cycle' && (
              <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setInputMode('random')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inputMode === 'random' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Random
                </button>
                <button
                  onClick={() => setInputMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    inputMode === 'custom' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>
            )}

            {/* List Size or Custom Input */}
            {inputMode === 'random' || algorithm === 'floyd-cycle' ? (
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="4"
                  max="10"
                  value={listSize}
                  onChange={(e) => setListSize(Number(e.target.value))}
                  className="w-24 accent-emerald-500"
                />
                <span className="text-slate-400 text-sm w-8">{listSize}</span>
              </div>
            ) : (
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g., 3, 7, 1, 9, 4"
                className="w-40 bg-slate-800 text-white px-3 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
              />
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateList}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-500/25"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{inputMode === 'custom' && algorithm !== 'floyd-cycle' ? 'Apply' : 'New List'}</span>
            </button>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleStepBackward}
                disabled={steps.length === 0 || currentStepIndex === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
              >
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={handlePlayPause}
                disabled={nodes.length === 0}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
              
              <button
                onClick={handleStepForward}
                disabled={steps.length === 0 || currentStepIndex >= steps.length - 1}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={handleReset}
                disabled={steps.length === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-400 text-sm">Speed:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-cyan-500"
              />
            </div>
          </div>

          {/* Cycle indicator for Floyd's */}
          {algorithm === 'floyd-cycle' && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-slate-400 text-sm">Current list:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                hasCycle 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {hasCycle ? `Has Cycle (connects to node ${cycleStart})` : 'No Cycle'}
              </span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 min-h-[400px] sm:min-h-[500px]">
              <LinkedListVisualizer
                step={currentStep}
                nodes={nodes}
                isCyclic={hasCycle}
                cycleStart={cycleStart}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* AI Explanation Panel */}
            <AIExplanationPanel
              algorithm={info.name}
              getState={() => ({
                stepDescription: currentStep?.explanation || 'Algorithm not started yet',
                rawState: {
                  currentPointer: currentStep?.currentPointer ?? null,
                  slowPointer: currentStep?.slowPointer ?? null,
                  fastPointer: currentStep?.fastPointer ?? null,
                  prevPointer: currentStep?.prevPointer ?? null,
                  nodes: currentStep?.nodes ?? nodes,
                  listValues: nodes.map(n => n.value),
                  hasCycle,
                  algorithm: algorithm,
                  stepNumber: currentStepIndex + 1,
                  totalSteps: steps.length,
                },
              })}
            />
            
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 space-y-4">
              {/* Algorithm Info */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{info.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{info.description}</p>
              </div>

              {/* Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</h4>
                  <div className="text-lg font-mono text-emerald-400">{info.timeComplexity}</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Space</h4>
                  <div className="text-lg font-mono text-cyan-400">{info.spaceComplexity}</div>
                </div>
              </div>

              {/* Progress */}
              {steps.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider">Progress</h4>
                    <span className="text-cyan-400 font-mono text-sm">{currentStepIndex + 1} / {steps.length}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Current Step */}
              {currentStep && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
                  <h4 className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Current Step</h4>
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
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : ''
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-slate-500 text-sm">
            Interactive DSA Visualizer — Linked List Algorithms
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>
    </div>
  );
}
