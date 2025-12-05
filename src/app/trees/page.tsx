'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, Github, Play, Pause, SkipForward, SkipBack, 
  RefreshCw, GitBranch, ChevronDown, HelpCircle, BookOpen, Sun, Moon
} from 'lucide-react';
import TreeVisualizer from './TreeVisualizer';
import AIExplanationPanel from '@/components/AIExplanationPanel';
import OnboardingTour, { useTour } from '@/components/OnboardingTour';
import AlgorithmEducationPanel from '@/components/AlgorithmEducationPanel';
import { TREE_VISUALIZER_TOUR, getAlgorithmInfo } from '@/lib/educationalContent';
import { useTheme } from '@/context/ThemeContext';
import { TreeAlgorithm, TreeStep, TREE_INFO, TreeNode } from './types';
import { 
  generateBST,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelorderTraversal,
  avlRotation
} from './algorithms';
import { getStepDelay } from '@/lib/animationEngine';

const ALGORITHM_OPTIONS: { value: TreeAlgorithm; label: string }[] = [
  { value: 'inorder', label: 'In-Order (Left→Root→Right)' },
  { value: 'preorder', label: 'Pre-Order (Root→Left→Right)' },
  { value: 'postorder', label: 'Post-Order (Left→Right→Root)' },
  { value: 'levelorder', label: 'Level-Order (BFS)' },
  { value: 'avl-rotation', label: 'AVL Rotations' },
];

export default function TreesPage() {
  const { isDark, toggleTheme } = useTheme();
  
  // Tour and education state
  const { startTour } = useTour('tree-visualizer');
  const [showEducation, setShowEducation] = useState(false);
  
  // Algorithm to educational key mapping
  const algorithmKeyMap: Record<TreeAlgorithm, string> = {
    'inorder': 'inorder-traversal',
    'preorder': 'preorder-traversal',
    'postorder': 'postorder-traversal',
    'levelorder': 'levelorder-traversal',
    'avl-rotation': 'avl-rotation',
  };
  
  const [algorithm, setAlgorithm] = useState<TreeAlgorithm>('inorder');
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [treeSize, setTreeSize] = useState(7);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'random' | 'custom'>('random');
  const [customInput, setCustomInput] = useState('');
  
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

  // Parse custom input for tree
  const parseCustomInput = useCallback((input: string): number[] => {
    return input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= 99);
  }, []);

  // Generate new tree
  const handleGenerateTree = useCallback(() => {
    let newNodes: TreeNode[];
    
    if (inputMode === 'custom' && customInput.trim()) {
      const values = parseCustomInput(customInput);
      if (values.length > 0) {
        // Build BST from custom values
        newNodes = [];
        const insert = (value: number, parentId: number | null): number => {
          const id = newNodes.length;
          newNodes.push({ id, value, left: null, right: null, parent: parentId, state: 'default' });
          return id;
        };
        const insertBST = (value: number, nodeId: number | null, parentId: number | null): number => {
          if (nodeId === null) return insert(value, parentId);
          const node = newNodes[nodeId];
          if (value < node.value) {
            if (node.left === null) { node.left = insert(value, nodeId); return node.left; }
            return insertBST(value, node.left, nodeId);
          } else {
            if (node.right === null) { node.right = insert(value, nodeId); return node.right; }
            return insertBST(value, node.right, nodeId);
          }
        };
        insert(values[0], null);
        for (let i = 1; i < values.length; i++) insertBST(values[i], 0, null);
        // Calculate positions
        const calcPos = (nodeId: number | null, x: number, y: number, xOff: number): void => {
          if (nodeId === null || nodeId >= newNodes.length) return;
          const node = newNodes[nodeId];
          node.x = x; node.y = y;
          const nextOff = Math.max(xOff * 0.55, 40);
          if (node.left !== null) calcPos(node.left, x - xOff, y + 80, nextOff);
          if (node.right !== null) calcPos(node.right, x + xOff, y + 80, nextOff);
        };
        calcPos(0, 400, 60, 180);
      } else {
        newNodes = generateBST(treeSize);
      }
    } else {
      newNodes = generateBST(treeSize);
    }
    
    setNodes(newNodes);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [treeSize, inputMode, customInput, parseCustomInput]);

  useEffect(() => {
    handleGenerateTree();
  }, [handleGenerateTree]);

  // Run algorithm
  const handleRunAlgorithm = useCallback(() => {
    if (nodes.length === 0) return;

    let algorithmSteps: TreeStep[] = [];

    switch (algorithm) {
      case 'inorder':
        algorithmSteps = inorderTraversal(nodes);
        break;
      case 'preorder':
        algorithmSteps = preorderTraversal(nodes);
        break;
      case 'postorder':
        algorithmSteps = postorderTraversal(nodes);
        break;
      case 'levelorder':
        algorithmSteps = levelorderTraversal(nodes);
        break;
      case 'avl-rotation':
        algorithmSteps = avlRotation(nodes);
        break;
    }

    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, [nodes, algorithm]);

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

  const info = TREE_INFO[algorithm];

  return (
    <div className={`min-h-screen overflow-hidden relative transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a1a]' : 'bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50'
    }`}>
      {/* Animated stars background - Dark mode only */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
      )}
      
      {/* Gradient orbs */}
      <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
        isDark ? 'bg-orange-500/10' : 'bg-orange-300/20'
      }`}></div>
      <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
        isDark ? 'bg-amber-500/10' : 'bg-amber-300/20'
      }`}></div>

      {/* Header */}
      <header className={`relative backdrop-blur-xl border-b ${
        isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white/70 border-slate-200'
      }`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity"></div>
                <div className={`relative p-1 sm:p-1.5 rounded-lg border overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/20' 
                    : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'
                }`}>
                  <Image 
                    src="/Logo.png" 
                    alt="DSA Visualizer Logo" 
                    width={36} 
                    height={36}
                    className="w-7 h-7 sm:w-9 sm:h-9 object-cover rounded-md"
                  />
                </div>
              </Link>
              <div>
                <h1 className={`text-base sm:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark ? 'from-white via-orange-200 to-white' : 'from-slate-800 via-orange-600 to-slate-800'
                }`}>
                  Tree Algorithms
                </h1>
                <p className={`text-xs sm:text-sm hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {info.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Learn Algorithm Button */}
              <button
                onClick={() => setShowEducation(true)}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white'
                }`}
                aria-label="Learn about algorithm"
                data-tour="learn-button"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Learn</span>
              </button>
              
              {/* Help/Tour Button */}
              <button
                onClick={startTour}
                className={`p-2 rounded-lg transition-all ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300' 
                    : 'bg-slate-200 hover:bg-slate-300 text-orange-600'
                }`}
                aria-label="Start tour"
                title="Take a tour of the visualizer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <Link 
                href="/"
                className={`flex items-center gap-1.5 sm:gap-2 transition-colors px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                  isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Home</span>
              </Link>
              <a 
                href="https://github.com/GiYo-Mi02"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 sm:gap-2 transition-colors px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                  isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
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
        <div data-tour="control-panel" className={`relative z-10 backdrop-blur-xl rounded-2xl border p-4 sm:p-6 mb-6 ${
          isDark 
            ? 'bg-slate-900/60 border-white/10' 
            : 'bg-white/70 border-slate-200 shadow-lg'
        }`}>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Algorithm Selector */}
            <div className="relative" data-tour="algorithm-selector">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors min-w-[220px]"
              >
                <span className="text-sm">{ALGORITHM_OPTIONS.find(o => o.value === algorithm)?.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider">DFS Traversals</div>
                    {ALGORITHM_OPTIONS.filter(o => ['inorder', 'preorder', 'postorder'].includes(o.value)).map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-orange-500/20 text-orange-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider mt-2">BFS Traversal</div>
                    {ALGORITHM_OPTIONS.filter(o => o.value === 'levelorder').map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-orange-500/20 text-orange-300' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    
                    <div className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider mt-2">Balancing</div>
                    {ALGORITHM_OPTIONS.filter(o => o.value === 'avl-rotation').map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setAlgorithm(option.value);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          algorithm === option.value 
                            ? 'bg-orange-500/20 text-orange-300' 
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

            {/* Input Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setInputMode('random')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputMode === 'random' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Random
              </button>
              <button
                onClick={() => setInputMode('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  inputMode === 'custom' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Tree Size or Custom Input */}
            {inputMode === 'random' ? (
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={treeSize}
                  onChange={(e) => setTreeSize(Number(e.target.value))}
                  className="w-24 accent-orange-500"
                />
                <span className="text-slate-400 text-sm w-8">{treeSize}</span>
              </div>
            ) : (
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g., 50, 30, 70, 20, 40"
                className="w-44 bg-slate-800 text-white px-3 py-2 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
              />
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateTree}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-orange-500/25"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">{inputMode === 'custom' ? 'Build Tree' : 'New Tree'}</span>
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
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div data-tour="visualization-area" className={`backdrop-blur-xl rounded-2xl border p-3 sm:p-4 min-h-[500px] sm:min-h-[600px] ${
              isDark 
                ? 'bg-slate-900/60 border-white/10' 
                : 'bg-white/70 border-slate-200 shadow-lg'
            }`}>
              <TreeVisualizer
                step={currentStep}
                nodes={nodes}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4" data-tour="info-panel">
            {/* AI Explanation Panel */}
            <AIExplanationPanel
              algorithm={info.name}
              getState={() => ({
                stepDescription: currentStep?.explanation || 'Algorithm not started yet',
                rawState: {
                  currentNode: currentStep?.currentNode ?? null,
                  visitedNodes: currentStep?.visitedNodes ?? [],
                  resultOrder: currentStep?.resultOrder ?? [],
                  queue: currentStep?.queue ?? [],
                  rotationType: currentStep?.rotationType ?? null,
                  treeValues: nodes.map(n => n.value),
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

              {/* Traversal Order */}
              <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-3 border border-orange-500/20">
                <h4 className="text-xs text-orange-400 uppercase tracking-wider mb-1">Traversal Order</h4>
                <div className="text-white font-mono text-lg">{info.order}</div>
              </div>

              {/* Complexity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</h4>
                  <div className="text-lg font-mono text-orange-400">{info.timeComplexity}</div>
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
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Current Step */}
              {currentStep && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-4 border border-orange-500/20">
                  <h4 className="text-xs text-orange-400 uppercase tracking-wider mb-2">Current Step</h4>
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
                          ? 'bg-orange-500/20 text-orange-300' 
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
      <footer className={`relative backdrop-blur-xl border-t mt-8 ${
        isDark 
          ? 'bg-slate-900/50 border-white/10' 
          : 'bg-white/70 border-slate-200'
      }`}>
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Interactive DSA Visualizer — Tree Algorithms
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>

      {/* Onboarding Tour */}
      <OnboardingTour
        tourKey="tree-visualizer"
        steps={TREE_VISUALIZER_TOUR}
      />

      {/* Algorithm Education Panel */}
      <AlgorithmEducationPanel
        algorithm={getAlgorithmInfo(algorithmKeyMap[algorithm]) || getAlgorithmInfo('inorder')!}
        isOpen={showEducation}
        onClose={() => setShowEducation(false)}
      />
    </div>
  );
}
