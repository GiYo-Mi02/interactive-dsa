import { Graph, PathStep } from '@/app/visualizer/types';
import { dijkstra, getShortestPath } from './dijkstra';

/**
 * Handles rerouting when nodes are blocked
 * Returns new algorithm steps and the new shortest path
 */
export function reroute(
  graph: Graph,
  start: number,
  end: number,
  blockedNodes: Set<number>
): { steps: PathStep[]; path: number[] } {
  // Run Dijkstra with blocked nodes
  const steps = dijkstra(graph, start, end, blockedNodes);
  
  // Get the new shortest path
  const path = getShortestPath(steps, start, end);
  
  return { steps, path };
}

/**
 * Checks if a path exists between start and end avoiding blocked nodes
 */
export function hasValidPath(
  graph: Graph,
  start: number,
  end: number,
  blockedNodes: Set<number>
): boolean {
  const { path } = reroute(graph, start, end, blockedNodes);
  return path.length > 0 && path[0] === start && path[path.length - 1] === end;
}

/**
 * Suggests alternative routes when the main path is blocked
 */
export function suggestAlternatives(
  graph: Graph,
  start: number,
  end: number,
  blockedNodes: Set<number>,
  maxAlternatives: number = 3
): number[][] {
  const alternatives: number[][] = [];
  const originalPath = getShortestPath(
    dijkstra(graph, start, end, blockedNodes),
    start,
    end
  );

  if (originalPath.length === 0) return alternatives;

  // Try blocking each intermediate node to find alternative paths
  for (let i = 1; i < originalPath.length - 1 && alternatives.length < maxAlternatives; i++) {
    const tempBlocked = new Set(blockedNodes);
    tempBlocked.add(originalPath[i]);
    
    const altPath = getShortestPath(
      dijkstra(graph, start, end, tempBlocked),
      start,
      end
    );
    
    if (altPath.length > 0 && !isPathDuplicate(altPath, alternatives)) {
      alternatives.push(altPath);
    }
  }

  return alternatives;
}

/**
 * Checks if a path is already in the list of alternatives
 */
function isPathDuplicate(path: number[], existing: number[][]): boolean {
  return existing.some(
    (existingPath) =>
      existingPath.length === path.length &&
      existingPath.every((node, index) => node === path[index])
  );
}
