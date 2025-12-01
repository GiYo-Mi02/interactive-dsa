'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Network, Home, Github, Play, Pause, SkipForward, SkipBack, 
  RefreshCw, Search, ArrowUpDown, Shuffle, ChevronDown
} from 'lucide-react';
import ArrayVisualizer from './ArrayVisualizer';
import AlgorithmInfoPanel from './AlgorithmInfoPanel';
import { ArrayAlgorithm, ArrayStep, ALGORITHM_INFO } from './types';
import { 
  generateRandomArray, 
  generateSortedArray,
  linearSearch, 
  binarySearch, 
  bubbleSort, 
  selectionSort, 
  quickSort, 
  mergeSort,
  twoPointer 
} from './algorithms';
import { getStepDelay } from '@/lib/animationEngine';

const ALGORITHM_OPTIONS: { value: ArrayAlgorithm; label: string; category: 'search' | 'sort' | 'technique' }[] = [
  { value: 'linear-search', label: 'Linear Search', category: 'search' },
  { value: 'binary-search', label: 'Binary Search', category: 'search' },
  { value: 'bubble-sort', label: 'Bubble Sort', category: 'sort' },
  { value: 'selection-sort', label: 'Selection Sort', category: 'sort' },
  { value: 'merge-sort', label: 'Merge Sort', category: 'sort' },
  { value: 'quick-sort', label: 'Quick Sort', category: 'sort' },
  { value: 'two-pointer', label: 'Two-Pointer Sum', category: 'technique' },
];

export default function ArraysPage() {
  // State
  const [algorithm, setAlgorithm] = useState<ArrayAlgorithm>('bubble-sort');
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<ArrayStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [target, setTarget] = useState<number>(42);
  const [arraySize, setArraySize] = useState(12);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'random' | 'custom'>('random');
  const [customInput, setCustomInput] = useState('');
  
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

  // Parse custom input
  const parseCustomInput = useCallback((input: string): number[] => {
    const parsed = input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 99)
      .slice(0, 20);
    return parsed.length > 0 ? parsed : [];
  }, []);

  // Generate new array
  const handleGenerateArray = useCallback(() => {
    let newArray: number[];
    
    if (inputMode === 'custom' && customInput.trim()) {
      newArray = parseCustomInput(customInput);
      const needsSorted = algorithm === 'binary-search' || algorithm === 'two-pointer';
      if (needsSorted) {
        newArray = [...newArray].sort((a, b) => a - b);
      }
    } else {
      const needsSorted = algorithm === 'binary-search' || algorithm === 'two-pointer';
      newArray = needsSorted 
        ? generateSortedArray(arraySize) 
        : generateRandomArray(arraySize);
    }
    
    if (newArray.length === 0) {
      newArray = generateRandomArray(arraySize);
    }
    
    setArray(newArray);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    
    // Set a random target from the array for search algorithms
    if (algorithm === 'linear-search' || algorithm === 'binary-search') {
      const randomIdx = Math.floor(Math.random() * newArray.length);
      setTarget(newArray[randomIdx]);
    } else if (algorithm === 'two-pointer') {
      // Set target as sum of two random elements
      const idx1 = Math.floor(Math.random() * newArray.length);
      let idx2 = Math.floor(Math.random() * newArray.length);
      while (idx2 === idx1 && newArray.length > 1) idx2 = Math.floor(Math.random() * newArray.length);
      setTarget(newArray[idx1] + newArray[idx2]);
    }
  }, [algorithm, arraySize, inputMode, customInput, parseCustomInput]);

  // Initialize array on mount and algorithm change
  useEffect(() => {
    handleGenerateArray();
  }, [algorithm, handleGenerateArray]);

  // Run algorithm
  const handleRunAlgorithm = useCallback(() => {
    if (array.length === 0) return;

    let algorithmSteps: ArrayStep[] = [];

    switch (algorithm) {
      case 'linear-search':
        algorithmSteps = linearSearch(array, target);
        break;
      case 'binary-search':
        algorithmSteps = binarySearch(array, target);
        break;
      case 'bubble-sort':
        algorithmSteps = bubbleSort(array);
        break;
      case 'selection-sort':
        algorithmSteps = selectionSort(array);
        break;
      case 'merge-sort':
        algorithmSteps = mergeSort(array);
        break;
      case 'quick-sort':
        algorithmSteps = quickSort(array);
        break;
      case 'two-pointer':
        algorithmSteps = twoPointer(array, target);
        break;
    }

    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, [array, algorithm, target]);

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

  const isSearchAlgorithm = algorithm === 'linear-search' || algorithm === 'binary-search' || algorithm === 'two-pointer';

  return (
    <div className="min-h-screen bg-[#0a0a1a] overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-2.5 rounded-lg border border-white/20">
                  <Network className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Array Algorithms
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  {ALGORITHM_INFO[algorithm].name}
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
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors min-w-[180px]"
              >
                <span className="text-sm">{ALGORITHM_INFO[algorithm].name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider">Search</div>
                    {ALGORITHM_OPTIONS.filter(o => o.category === 'search').map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider mt-2">Sort</div>
                    {ALGORITHM_OPTIONS.filter(o => o.category === 'sort').map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider mt-2">Technique</div>
                    {ALGORITHM_OPTIONS.filter(o => o.category === 'technique').map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Target Input (for search algorithms) */}
            {isSearchAlgorithm && (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-20 bg-slate-800 text-white px-3 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-purple-500"
                  placeholder="Target"
                />
              </div>
            )}

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setInputMode('random')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputMode === 'random' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Random
              </button>
              <button
                onClick={() => setInputMode('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputMode === 'custom' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Array Size (for random) or Custom Input */}
            {inputMode === 'random' ? (
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-24 accent-purple-500"
                />
                <span className="text-slate-400 text-sm w-8">{arraySize}</span>
              </div>
            ) : (
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g., 5, 12, 8, 23, 1"
                className="w-40 bg-slate-800 text-white px-3 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateArray}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-purple-500/25"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">{inputMode === 'custom' ? 'Apply' : 'New Array'}</span>
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
                disabled={array.length === 0}
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
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 h-[400px] sm:h-[500px]">
              <ArrayVisualizer
                step={currentStep}
                array={array}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <AlgorithmInfoPanel
              algorithm={algorithm}
              currentStep={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-slate-500 text-sm">
            Interactive DSA Visualizer — Array Algorithms
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>
    </div>
  );
}
