// Core graph types
export interface NodePosition {
  id: number;
  x: number;
  y: number;
  blocked?: boolean;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface Graph {
  nodes: NodePosition[];
  edges: GraphEdge[];
  adjacencyList: Record<number, Record<number, number>>;
}

// Algorithm visualization types
export interface PathStep {
  currentNode: number;
  distances: Record<number, number>;
  previous: Record<number, number | null>;
  visited: number[];
  pq: [number, number][];
  currentEdge?: { from: number; to: number };
  explanation: string;
}

// Animation state types
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
  steps: PathStep[];
}

// Visualization state types
export interface VisualizationState {
  graph: Graph | null;
  startNode: number | null;
  endNode: number | null;
  blockedNodes: Set<number>;
  shortestPath: number[];
  animationState: AnimationState;
  selectionMode: 'none' | 'start' | 'end' | 'block';
}

// Component props types
export interface GraphCanvasProps {
  graph: Graph | null;
  startNode: number | null;
  endNode: number | null;
  blockedNodes: Set<number>;
  currentStep: PathStep | null;
  shortestPath: number[];
  selectionMode: 'none' | 'start' | 'end' | 'block';
  onNodeClick: (nodeId: number) => void;
}

export interface ControlPanelProps {
  onGenerateGraph: () => void;
  onSelectStart: () => void;
  onSelectEnd: () => void;
  onRunAlgorithm: () => void;
  onBlockNodes: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  speed: number;
  canRun: boolean;
  hasSteps: boolean;
  selectionMode: 'none' | 'start' | 'end' | 'block';
}

export interface InfoPanelProps {
  currentStep: PathStep | null;
  stepNumber: number;
  totalSteps: number;
  startNode: number | null;
  endNode: number | null;
  blockedNodes: Set<number>;
  shortestPath: number[];
}

export interface AlgorithmTableProps {
  graph: Graph | null;
  currentStep: PathStep | null;
  startNode: number | null;
  endNode: number | null;
}

export interface LegendProps {}
