'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ControlPanel from './ControlPanel';
import InfoPanel from './InfoPanel';
import AlgorithmTable from './AlgorithmTable';
import Legend from './Legend';
import AIExplanationPanel from '@/components/AIExplanationPanel';
import { Graph, PathStep } from './types';
import { generateGraph } from '@/lib/graphGenerator';
import { dijkstra, getShortestPath } from '@/lib/dijkstra';
import { getStepDelay } from '@/lib/animationEngine';
import { useTheme } from '@/context/ThemeContext';
import { Network, Home, Github, Sun, Moon, Bot, Activity, Palette, ChevronDown, ChevronUp } from 'lucide-react';

// Dynamically import GraphCanvas to avoid SSR issues with p5.js
const GraphCanvas = dynamic(() => import('./GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-800/50 rounded-2xl flex items-center justify-center border border-white/10">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Initializing canvas...</span>
      </div>
    </div>
  ),
});

export default function VisualizerPage() {
  const { isDark, toggleTheme } = useTheme();
  
  // Graph state
  const [graph, setGraph] = useState<Graph | null>(null);
  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [blockedNodes, setBlockedNodes] = useState<Set<number>>(new Set());
  
  // Algorithm state
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [shortestPath, setShortestPath] = useState<number[]>([]);
  
  // UI state
  const [selectionMode, setSelectionMode] = useState<'none' | 'start' | 'end' | 'block'>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  
  // Sidebar panel states for collapsible sections
  const [activeTab, setActiveTab] = useState<'ai' | 'info' | 'legend'>('info');
  const [expandedSections, setExpandedSections] = useState({
    ai: true,
    info: true,
    legend: false,
  });
  
  // Animation timer ref
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  // Toggle section expansion
  const toggleSection = (section: 'ai' | 'info' | 'legend') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Current step for display
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;
  
  // Only show shortest path when algorithm is complete (at last step)
  const isAlgorithmComplete = steps.length > 0 && currentStepIndex >= steps.length - 1;
  const displayShortestPath = isAlgorithmComplete ? shortestPath : [];

  // Generate a new graph - wider canvas
  const handleGenerateGraph = useCallback(() => {
    const newGraph = generateGraph(18, 1000, 580, 200);
    setGraph(newGraph);
    setStartNode(null);
    setEndNode(null);
    setBlockedNodes(new Set());
    setSteps([]);
    setCurrentStepIndex(0);
    setShortestPath([]);
    setSelectionMode('none');
    setIsPlaying(false);
  }, []);

  // Handle node click based on selection mode
  const handleNodeClick = useCallback(
    (nodeId: number) => {
      switch (selectionMode) {
        case 'start':
          if (nodeId !== endNode && !blockedNodes.has(nodeId)) {
            setStartNode(nodeId);
            setSelectionMode('none');
            setSteps([]);
            setCurrentStepIndex(0);
            setShortestPath([]);
          }
          break;
        case 'end':
          if (nodeId !== startNode && !blockedNodes.has(nodeId)) {
            setEndNode(nodeId);
            setSelectionMode('none');
            setSteps([]);
            setCurrentStepIndex(0);
            setShortestPath([]);
          }
          break;
        case 'block':
          if (nodeId !== startNode && nodeId !== endNode) {
            const newBlocked = new Set(blockedNodes);
            if (newBlocked.has(nodeId)) {
              newBlocked.delete(nodeId);
            } else {
              newBlocked.add(nodeId);
            }
            setBlockedNodes(newBlocked);
            setSteps([]);
            setCurrentStepIndex(0);
            setShortestPath([]);
          }
          break;
        default:
          break;
      }
    },
    [selectionMode, startNode, endNode, blockedNodes]
  );

  // Run Dijkstra's algorithm
  const handleRunAlgorithm = useCallback(() => {
    if (!graph || startNode === null || endNode === null) return;

    const algorithmSteps = dijkstra(graph, startNode, endNode, blockedNodes);
    setSteps(algorithmSteps);
    setCurrentStepIndex(0);
    
    const path = getShortestPath(algorithmSteps, startNode, endNode);
    setShortestPath(path);
    setIsPlaying(true);
  }, [graph, startNode, endNode, blockedNodes]);

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

  // Control handlers
  const handleSelectStart = () => setSelectionMode(selectionMode === 'start' ? 'none' : 'start');
  const handleSelectEnd = () => setSelectionMode(selectionMode === 'end' ? 'none' : 'end');
  const handleBlockNodes = () => setSelectionMode(selectionMode === 'block' ? 'none' : 'block');
  
  const handleReset = () => {
    setStartNode(null);
    setEndNode(null);
    setBlockedNodes(new Set());
    setSteps([]);
    setCurrentStepIndex(0);
    setShortestPath([]);
    setSelectionMode('none');
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
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

  return (
    <div className={`min-h-screen overflow-hidden relative transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a1a]' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
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
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`}></div>
      <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
        isDark ? 'bg-cyan-500/10' : 'bg-cyan-300/20'
      }`}></div>

      {/* Header */}
      <header className={`relative backdrop-blur-xl border-b ${
        isDark 
          ? 'bg-slate-900/50 border-white/10' 
          : 'bg-white/70 border-slate-200'
      }`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Enhanced Logo */}
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity animate-pulse"></div>
                {/* Logo container */}
                <div className={`relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl border ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/20' 
                    : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'
                }`}>
                  {/* Inner gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg sm:rounded-xl"></div>
                  {/* Icon with glow */}
                  <div className="relative">
                    <Network className={`w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`} />
                    {/* Animated dots representing nodes */}
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className={`text-base sm:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark 
                    ? 'from-white via-cyan-200 to-white' 
                    : 'from-slate-800 via-cyan-600 to-slate-800'
                }`}>
                  Interactive DSA Visualizer
                </h1>
                <p className={`text-xs sm:text-sm hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dijkstra&apos;s Algorithm Visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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

      {/* Main Content - Responsive layout */}
      <main className="relative max-w-[1920px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Control Panel - Top bar on all screens */}
        <div className="mb-6">
          <ControlPanel
            onGenerateGraph={handleGenerateGraph}
            onSelectStart={handleSelectStart}
            onSelectEnd={handleSelectEnd}
            onRunAlgorithm={handleRunAlgorithm}
            onBlockNodes={handleBlockNodes}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onPlayPause={handlePlayPause}
            isPlaying={isPlaying}
            speed={speed}
            canRun={graph !== null && startNode !== null && endNode !== null}
            hasSteps={steps.length > 0}
            selectionMode={selectionMode}
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Graph Canvas & Algorithm Table - Main area */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 space-y-4 lg:space-y-6">
            <div className={`backdrop-blur-xl rounded-2xl border p-3 sm:p-4 h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[680px] ${
              isDark 
                ? 'bg-slate-900/60 border-white/10' 
                : 'bg-white/70 border-slate-200 shadow-lg'
            }`}>
              <GraphCanvas
                graph={graph}
                startNode={startNode}
                endNode={endNode}
                blockedNodes={blockedNodes}
                currentStep={currentStep}
                shortestPath={displayShortestPath}
                selectionMode={selectionMode}
                onNodeClick={handleNodeClick}
              />
            </div>
            
            {/* Algorithm Table - Under graph canvas */}
            <AlgorithmTable
              graph={graph}
              currentStep={currentStep}
              startNode={startNode}
              endNode={endNode}
              isDark={isDark}
            />
          </div>

          {/* Right Sidebar - Improved with tabs and collapsible sections */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 space-y-3">
            {/* Sidebar Tab Navigation */}
            <div className={`flex rounded-xl p-1 ${
              isDark ? 'bg-slate-800/50' : 'bg-slate-100'
            }`}>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'ai'
                    ? isDark 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-white text-indigo-600 shadow-md'
                    : isDark 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Tutor</span>
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'info'
                    ? isDark 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-white text-cyan-600 shadow-md'
                    : isDark 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Info</span>
              </button>
              <button
                onClick={() => setActiveTab('legend')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'legend'
                    ? isDark 
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg' 
                      : 'bg-white text-pink-600 shadow-md'
                    : isDark 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Legend</span>
              </button>
            </div>

            {/* Tab Content with improved spacing */}
            <div className={`rounded-2xl overflow-hidden ${
              isDark ? '' : 'shadow-lg'
            }`}>
              {/* AI Explanation Panel */}
              {activeTab === 'ai' && (
                <div className="animate-fadeIn">
                  <AIExplanationPanel
                    algorithm="Dijkstra's Algorithm"
                    getState={() => ({
                      stepDescription: currentStep?.explanation || 'Algorithm not started yet',
                      rawState: {
                        currentNode: currentStep?.currentNode ?? null,
                        distances: currentStep?.distances ?? {},
                        visited: currentStep?.visited ?? [],
                        priorityQueue: currentStep?.pq ?? [],
                        currentEdge: currentStep?.currentEdge ?? null,
                        startNode,
                        endNode,
                        blockedNodes: Array.from(blockedNodes),
                        shortestPath: displayShortestPath,
                        stepNumber: currentStepIndex + 1,
                        totalSteps: steps.length,
                      },
                    })}
                  />
                </div>
              )}
              
              {/* Info Panel */}
              {activeTab === 'info' && (
                <div className="animate-fadeIn">
                  <InfoPanel
                    currentStep={currentStep}
                    stepNumber={currentStepIndex + 1}
                    totalSteps={steps.length}
                    startNode={startNode}
                    endNode={endNode}
                    blockedNodes={blockedNodes}
                    shortestPath={displayShortestPath}
                    isDark={isDark}
                  />
                </div>
              )}
              
              {/* Legend Panel */}
              {activeTab === 'legend' && (
                <div className="animate-fadeIn">
                  <Legend isDark={isDark} />
                </div>
              )}
            </div>

            {/* Quick Stats - Always visible summary */}
            <div className={`rounded-xl p-4 border ${
              isDark 
                ? 'bg-slate-900/60 border-white/10' 
                : 'bg-white/70 border-slate-200 shadow-md'
            }`}>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  <p className={`text-[10px] uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Start</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {startNode !== null ? startNode : '—'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'
                }`}>
                  <p className={`text-[10px] uppercase ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>End</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                    {endNode !== null ? endNode : '—'}
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'
                }`}>
                  <p className={`text-[10px] uppercase ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>Visited</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {currentStep?.visited.length || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'
                }`}>
                  <p className={`text-[10px] uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>Step</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {currentStepIndex + 1}/{steps.length || 0}
                  </p>
                </div>
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
            Interactive DSA Visualizer — An educational tool for understanding graph algorithms
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
