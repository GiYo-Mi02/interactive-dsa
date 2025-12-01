'use client';

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import type p5 from 'p5';
import { GraphCanvasProps, NodePosition } from './types';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';

// Space-themed colors for visualization
const COLORS = {
  background: '#0d1117',
  node: {
    default: '#6366f1',
    start: '#10b981',
    end: '#f43f5e',
    blocked: '#374151',
    visited: '#a855f7',
    current: '#fbbf24',
    path: '#22d3ee',
  },
  edge: {
    default: 'rgba(148, 163, 184, 0.4)',
    path: '#22d3ee',
    exploring: '#fbbf24',
  },
  text: '#ffffff',
  weight: '#94a3b8',
};

const NODE_RADIUS = 22;

// Detect if device is mobile for performance optimizations
const isMobile = typeof window !== 'undefined' && 
  (window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

export default function GraphCanvas({
  graph,
  startNode,
  endNode,
  blockedNodes,
  currentStep,
  shortestPath,
  selectionMode,
  onNodeClick,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const zoomRef = useRef(zoom);
  const panRef = useRef(panOffset);
  const isPanningRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const needsRedraw = useRef(true);
  
  // Create node lookup map for O(1) access instead of O(n) find()
  const nodeMap = useMemo(() => {
    if (!graph) return new Map<number, NodePosition>();
    return new Map(graph.nodes.map(n => [n.id, n]));
  }, [graph]);
  
  // Create path set for O(1) lookup
  const pathSet = useMemo(() => new Set(shortestPath), [shortestPath]);
  
  // Keep refs in sync and trigger redraw
  useEffect(() => {
    zoomRef.current = zoom;
    panRef.current = panOffset;
    needsRedraw.current = true;
  }, [zoom, panOffset]);
  
  // Trigger redraw on state changes
  useEffect(() => {
    needsRedraw.current = true;
  }, [graph, startNode, endNode, blockedNodes, currentStep, shortestPath, selectionMode]);
  
  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const togglePanMode = () => setIsPanning(prev => !prev);

  const getNodeColor = useCallback(
    (nodeId: number): string => {
      if (blockedNodes.has(nodeId)) return COLORS.node.blocked;
      if (pathSet.has(nodeId)) return COLORS.node.path;
      if (currentStep?.currentNode === nodeId) return COLORS.node.current;
      if (currentStep?.visited.includes(nodeId)) return COLORS.node.visited;
      if (nodeId === startNode) return COLORS.node.start;
      if (nodeId === endNode) return COLORS.node.end;
      return COLORS.node.default;
    },
    [blockedNodes, pathSet, currentStep, startNode, endNode]
  );

  // Pre-compute path edges for O(1) lookup
  const pathEdges = useMemo(() => {
    const edges = new Set<string>();
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const a = Math.min(shortestPath[i], shortestPath[i + 1]);
      const b = Math.max(shortestPath[i], shortestPath[i + 1]);
      edges.add(`${a}-${b}`);
    }
    return edges;
  }, [shortestPath]);

  const isEdgeInPath = useCallback(
    (from: number, to: number): boolean => {
      const a = Math.min(from, to);
      const b = Math.max(from, to);
      return pathEdges.has(`${a}-${b}`);
    },
    [pathEdges]
  );

  const isCurrentEdge = useCallback(
    (from: number, to: number): boolean => {
      if (!currentStep?.currentEdge) return false;
      const edge = currentStep.currentEdge;
      return (
        (edge.from === from && edge.to === to) ||
        (edge.from === to && edge.to === from)
      );
    },
    [currentStep]
  );

  useEffect(() => {
    if (!containerRef.current || !graph) return;

    const loadP5 = async () => {
      const p5Module = await import('p5');
      const P5 = p5Module.default;

      if (p5Instance.current) {
        p5Instance.current.remove();
      }

      const sketch = (p: p5) => {
        // Reduce frame rate for better performance
        const TARGET_FPS = isMobile ? 24 : 30;

        p.setup = () => {
          const canvas = p.createCanvas(
            containerRef.current?.clientWidth || 1000,
            containerRef.current?.clientHeight || 650
          );
          canvas.parent(containerRef.current!);
          p.textAlign(p.CENTER, p.CENTER);
          p.textFont('system-ui');
          p.frameRate(TARGET_FPS);
          // Disable smooth for better mobile performance
          if (isMobile) {
            p.noSmooth();
          } else {
            p.smooth();
          }
        };

        p.draw = () => {
          // Skip frame if nothing changed (massive performance boost)
          if (!needsRedraw.current && p.frameCount > 1) {
            return;
          }
          needsRedraw.current = false;
          
          // Dark space background
          p.background(COLORS.background);
          
          // Apply zoom and pan transformations
          p.push();
          p.translate(p.width / 2 + panRef.current.x, p.height / 2 + panRef.current.y);
          p.scale(zoomRef.current);
          p.translate(-p.width / 2, -p.height / 2);
          
          // Draw simplified grid (skip on mobile for performance)
          if (!isMobile) {
            p.stroke(255, 255, 255, 5);
            p.strokeWeight(1);
            const gridSize = 80; // Larger grid = fewer lines
            for (let x = 0; x < p.width; x += gridSize) {
              p.line(x, 0, x, p.height);
            }
            for (let y = 0; y < p.height; y += gridSize) {
              p.line(0, y, p.width, y);
            }
          }

          if (!graph) {
            p.pop();
            return;
          }

          // Draw edges - batch by type for fewer state changes
          // First pass: regular edges
          p.stroke(148, 163, 184, 60);
          p.strokeWeight(1.5);
          graph.edges.forEach((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return;
            
            const isBlocked = blockedNodes.has(fromNode.id) || blockedNodes.has(toNode.id);
            const inPath = isEdgeInPath(edge.from, edge.to);
            const isCurrent = isCurrentEdge(edge.from, edge.to);
            
            if (!isBlocked && !inPath && !isCurrent) {
              p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
            }
          });
          
          // Second pass: blocked edges
          p.stroke(100, 100, 100, 50);
          p.strokeWeight(1);
          graph.edges.forEach((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return;
            if (blockedNodes.has(fromNode.id) || blockedNodes.has(toNode.id)) {
              p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
            }
          });
          
          // Third pass: path and current edges (with glow)
          graph.edges.forEach((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return;
            if (blockedNodes.has(fromNode.id) || blockedNodes.has(toNode.id)) return;
            
            if (isEdgeInPath(edge.from, edge.to)) {
              // Simplified glow - just one extra line
              if (!isMobile) {
                p.stroke(34, 211, 238, 60);
                p.strokeWeight(6);
                p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
              }
              p.stroke(COLORS.edge.path);
              p.strokeWeight(3);
              p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
            } else if (isCurrentEdge(edge.from, edge.to)) {
              if (!isMobile) {
                p.stroke(251, 191, 36, 50);
                p.strokeWeight(5);
                p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
              }
              p.stroke(COLORS.edge.exploring);
              p.strokeWeight(2);
              p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
            }
          });
          
          // Draw weight labels
          p.noStroke();
          p.textSize(11);
          graph.edges.forEach((edge) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return;
            
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            p.fill(13, 17, 23, 200);
            p.ellipse(midX, midY - 8, 24, 18);
            p.fill(COLORS.weight);
            p.text(edge.weight.toString(), midX, midY - 8);
          });

          // Draw nodes - simplified rendering
          graph.nodes.forEach((node) => {
            const color = getNodeColor(node.id);
            const isSpecial = pathSet.has(node.id) || 
                            currentStep?.currentNode === node.id || 
                            node.id === startNode || 
                            node.id === endNode;

            // Static glow for special nodes (no animation = no lag)
            if (isSpecial && !isMobile) {
              const glowSize = NODE_RADIUS * 2.5;
              p.noStroke();
              
              if (currentStep?.currentNode === node.id) {
                p.fill(251, 191, 36, 35);
              } else if (pathSet.has(node.id)) {
                p.fill(34, 211, 238, 30);
              } else if (node.id === startNode) {
                p.fill(16, 185, 129, 35);
              } else if (node.id === endNode) {
                p.fill(244, 63, 94, 35);
              }
              
              p.ellipse(node.x, node.y, glowSize);
            }

            // Node outer ring
            p.noFill();
            p.stroke(color);
            p.strokeWeight(2);
            p.ellipse(node.x, node.y, NODE_RADIUS * 2 + 6);

            // Node circle
            p.fill(color);
            p.noStroke();
            p.ellipse(node.x, node.y, NODE_RADIUS * 2);
            
            // Inner highlight (skip on mobile)
            if (!isMobile) {
              p.fill(255, 255, 255, 25);
              p.ellipse(node.x - 4, node.y - 4, NODE_RADIUS);
            }

            // Node label
            p.fill(COLORS.text);
            p.textSize(13);
            p.textStyle(p.BOLD);
            p.text(node.id.toString(), node.x, node.y);

            // Distance label
            if (currentStep && currentStep.distances[node.id] !== undefined) {
              const dist = currentStep.distances[node.id];
              const distText = dist === Infinity ? '∞' : dist.toString();
              
              p.fill(13, 17, 23, 220);
              const textW = p.textWidth(`d:${distText}`) + 12;
              p.rect(node.x - textW/2, node.y + NODE_RADIUS + 6, textW, 16, 8);
              
              p.fill(COLORS.weight);
              p.textSize(10);
              p.textStyle(p.NORMAL);
              p.text(`d:${distText}`, node.x, node.y + NODE_RADIUS + 14);
            }
          });

          p.pop();
          
          // UI overlays (outside transform)
          if (selectionMode !== 'none') {
            const indicatorWidth = 220;
            const indicatorHeight = 36;
            
            p.noStroke();
            p.fill(15, 23, 42, 220);
            p.rect(12, 12, indicatorWidth, indicatorHeight, 10);
            
            p.stroke(255, 255, 255, 20);
            p.strokeWeight(1);
            p.noFill();
            p.rect(12, 12, indicatorWidth, indicatorHeight, 10);
            
            p.noStroke();
            if (selectionMode === 'start') {
              p.fill(16, 185, 129);
            } else if (selectionMode === 'end') {
              p.fill(244, 63, 94);
            } else {
              p.fill(107, 114, 128);
            }
            p.ellipse(32, 30, 12, 12);
            
            p.fill(255);
            p.textSize(13);
            p.textAlign(p.LEFT, p.CENTER);
            const modeText =
              selectionMode === 'start'
                ? 'Click to set START node'
                : selectionMode === 'end'
                ? 'Click to set END node'
                : 'Click to BLOCK nodes';
            p.text(modeText, 46, 30);
            p.textAlign(p.CENTER, p.CENTER);
          }
          
          // Zoom indicator
          p.noStroke();
          p.fill(15, 23, 42, 200);
          p.rect(p.width - 70, 12, 58, 24, 8);
          p.fill(148, 163, 184);
          p.textSize(11);
          p.text(`${Math.round(zoomRef.current * 100)}%`, p.width - 41, 24);
        };

        p.mousePressed = () => {
          if (!graph) return;
          
          lastMousePos.current = { x: p.mouseX, y: p.mouseY };
          needsRedraw.current = true;

          const transformedX = (p.mouseX - p.width / 2 - panRef.current.x) / zoomRef.current + p.width / 2;
          const transformedY = (p.mouseY - p.height / 2 - panRef.current.y) / zoomRef.current + p.height / 2;

          for (const node of graph.nodes) {
            const d = p.dist(transformedX, transformedY, node.x, node.y);
            if (d < NODE_RADIUS + 5) {
              onNodeClick(node.id);
              return;
            }
          }
        };
        
        p.mouseDragged = () => {
          if (isPanningRef.current) {
            const dx = p.mouseX - lastMousePos.current.x;
            const dy = p.mouseY - lastMousePos.current.y;
            setPanOffset(prev => ({
              x: prev.x + dx,
              y: prev.y + dy
            }));
            lastMousePos.current = { x: p.mouseX, y: p.mouseY };
            needsRedraw.current = true;
          }
        };
        
        p.mouseWheel = (event: WheelEvent) => {
          if (isPanningRef.current) {
            const delta = event.deltaY > 0 ? -0.1 : 0.1;
            setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
            needsRedraw.current = true;
            return false;
          }
          return true;
        };

        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.clientWidth,
              containerRef.current.clientHeight
            );
            needsRedraw.current = true;
          }
        };
      };

      p5Instance.current = new P5(sketch);
    };

    loadP5();

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [
    graph,
    nodeMap,
    startNode,
    endNode,
    blockedNodes,
    currentStep,
    pathSet,
    selectionMode,
    onNodeClick,
    getNodeColor,
    isEdgeInPath,
    isCurrentEdge,
  ]);

  // Keep isPanningRef in sync
  useEffect(() => {
    isPanningRef.current = isPanning;
  }, [isPanning]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className={`w-full h-full bg-[#0d1117] rounded-xl overflow-hidden ${isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
        style={{ minHeight: '600px' }}
      />
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={togglePanMode}
          className={`p-2 backdrop-blur-sm border rounded-lg transition-all ${
            isPanning 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
              : 'bg-slate-800/90 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/90 hover:border-cyan-500/50'
          }`}
          title="Pan Mode (drag to move)"
        >
          <Move className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Pan mode indicator */}
      {isPanning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-400 text-xs font-medium backdrop-blur-sm">
          Pan Mode: Drag to move, scroll to zoom • Click nodes still works
        </div>
      )}
    </div>
  );
}
