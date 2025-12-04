'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { HashAlgorithm, HashStep, HASH_INFO } from './types';
import {
  demonstrateHashFunction,
  linearProbing,
  chaining,
  generateRandomKeys,
} from './algorithms';
import { HashingVisualizer } from './HashingVisualizer';
import AIExplanationPanel from '@/components/AIExplanationPanel';

export default function HashingPage() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('hash-function');
  const [tableSize, setTableSize] = useState(10);
  const [keyCount, setKeyCount] = useState(5);
  const [steps, setSteps] = useState<HashStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [inputMode, setInputMode] = useState<'random' | 'custom'>('random');
  const [customInput, setCustomInput] = useState('');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const parseCustomInput = useCallback((input: string): number[] => {
    return input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n <= 999)
      .slice(0, 10);
  }, []);

  const generateSteps = useCallback(() => {
    let keys: number[];
    
    if (inputMode === 'custom' && customInput.trim()) {
      keys = parseCustomInput(customInput);
      if (keys.length === 0) keys = generateRandomKeys(keyCount);
    } else {
      keys = generateRandomKeys(keyCount);
    }
    
    let newSteps: HashStep[];

    switch (algorithm) {
      case 'hash-function':
        newSteps = demonstrateHashFunction(keys, tableSize);
        break;
      case 'linear-probing':
        newSteps = linearProbing(keys, tableSize);
        break;
      case 'chaining':
        newSteps = chaining(keys, Math.min(tableSize, 7)); // Smaller table for chaining demo
        break;
      default:
        newSteps = [];
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm, tableSize, keyCount, inputMode, customInput, parseCustomInput]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const delay = 1500 / speed;
      animationRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, delay);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleRegenerate = () => {
    setIsPlaying(false);
    generateSteps();
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const info = HASH_INFO[algorithm];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Hash className="text-teal-400" size={24} />
              <h1 className="text-xl font-bold text-white">Hashing Algorithms</h1>
            </div>
          </div>

          {/* Algorithm Selector */}
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="hash-function">Hash Function</option>
            <option value="linear-probing">Linear Probing</option>
            <option value="chaining">Chaining</option>
          </select>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Explanation Panel */}
            <AIExplanationPanel
              algorithm={info.name}
              getState={() => {
                const step = steps[currentStep];
                return {
                  stepDescription: step?.explanation || 'Algorithm not started yet',
                  rawState: {
                    buckets: step?.buckets ?? [],
                    currentKey: step?.currentKey ?? null,
                    hashValue: step?.hashValue ?? null,
                    probeIndex: step?.probeIndex ?? null,
                    probeCount: step?.probeCount ?? null,
                    tableSize,
                    algorithm,
                    stepNumber: currentStep + 1,
                    totalSteps: steps.length,
                  },
                };
              }}
            />
            
            {/* Algorithm Info */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{info.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{info.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Time (Avg):</span>
                  <span className="font-mono text-green-400">{info.avgTimeComplexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time (Worst):</span>
                  <span className="font-mono text-yellow-400">{info.worstTimeComplexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Space:</span>
                  <span className="font-mono text-cyan-400">{info.spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 space-y-4">
              <h3 className="font-semibold text-white">Parameters</h3>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Table Size: {tableSize}
                </label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={tableSize}
                  onChange={(e) => setTableSize(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              {/* Input Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setInputMode('random')}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    inputMode === 'random' 
                      ? 'bg-teal-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Random
                </button>
                <button
                  onClick={() => setInputMode('custom')}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    inputMode === 'custom' 
                      ? 'bg-teal-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>

              {inputMode === 'random' ? (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Keys to Insert: {keyCount}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={keyCount}
                    onChange={(e) => setKeyCount(Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Custom Keys:</label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g., 12, 25, 36, 47"
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 text-sm focus:outline-none focus:border-teal-500 placeholder:text-slate-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Animation Speed: {speed}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <button
                onClick={handleRegenerate}
                className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Generate New Keys
              </button>
            </div>

            {/* Playback Controls */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  title="Reset"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={stepBackward}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous Step"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={stepForward}
                  disabled={currentStep >= steps.length - 1}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next Step"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => setCurrentStep(steps.length - 1)}
                  disabled={currentStep >= steps.length - 1}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Skip to End"
                >
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Step {currentStep + 1}</span>
                  <span>of {steps.length}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 h-[600px] overflow-hidden">
              {currentStepData && <HashingVisualizer step={currentStepData} />}
            </div>

            {/* Explanation */}
            {currentStepData && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-slate-300 text-lg">{currentStepData.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-slate-500 text-sm">
            Interactive DSA Visualizer — Hashing Algorithms
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>
    </div>
  );
}
