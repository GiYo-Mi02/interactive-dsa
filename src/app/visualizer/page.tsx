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
import { Network, Home, Github } from 'lucide-react';

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
  
  // Animation timer ref
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  // Current step for display
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

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
              {/* Enhanced Logo */}
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-60 blur-sm group-hover:opacity-80 transition-opacity animate-pulse"></div>
                {/* Logo container */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/20">
                  {/* Inner gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg sm:rounded-xl"></div>
                  {/* Icon with glow */}
                  <div className="relative">
                    <Network className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    {/* Animated dots representing nodes */}
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                  Interactive DSA Visualizer
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  Dijkstra&apos;s Algorithm Visualization
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
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Graph Canvas & Algorithm Table - Main area */}
          <div className="lg:col-span-8 xl:col-span-9 order-1 space-y-4 lg:space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-3 sm:p-4 h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[680px]">
              <GraphCanvas
                graph={graph}
                startNode={startNode}
                endNode={endNode}
                blockedNodes={blockedNodes}
                currentStep={currentStep}
                shortestPath={shortestPath}
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
            />
          </div>

          {/* Right Sidebar - Info & Legend */}
          <div className="lg:col-span-4 xl:col-span-3 order-2 space-y-4 lg:space-y-6">
            {/* AI Explanation Panel */}
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
                  shortestPath,
                  stepNumber: currentStepIndex + 1,
                  totalSteps: steps.length,
                },
              })}
            />
            
            <InfoPanel
              currentStep={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
              startNode={startNode}
              endNode={endNode}
              blockedNodes={blockedNodes}
              shortestPath={shortestPath}
            />
            <Legend />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-white/10 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-slate-500 text-sm">
            Interactive DSA Visualizer — An educational tool for understanding graph algorithms
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>
    </div>
  );
}
