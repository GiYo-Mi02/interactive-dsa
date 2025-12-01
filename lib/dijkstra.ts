import { Graph, PathStep } from '@/app/visualizer/types';

/**
 * Dijkstra's algorithm implementation with step-by-step tracking
 * for visualization purposes
 */
export function dijkstra(
  graph: Graph,
  start: number,
  end: number,
  blockedNodes: Set<number> = new Set()
): PathStep[] {
  const steps: PathStep[] = [];
  const distances: Record<number, number> = {};
  const previous: Record<number, number | null> = {};
  const visited: number[] = [];

  // Initialize distances and previous
  for (const node of graph.nodes) {
    if (blockedNodes.has(node.id)) continue;
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }

  // Check if start or end is blocked
  if (blockedNodes.has(start) || blockedNodes.has(end)) {
    return steps;
  }

  distances[start] = 0;

  // Priority queue: [distance, nodeId]
  const pq: [number, number][] = [[0, start]];

  // Record initial state
  steps.push({
    currentNode: start,
    distances: { ...distances },
    previous: { ...previous },
    visited: [],
    pq: [...pq],
    explanation: `Starting at node ${start}. Initial distance is 0.`,
  });

  while (pq.length > 0) {
    // Sort by distance (min-heap simulation)
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, current] = pq.shift()!;

    // Skip if already visited
    if (visited.includes(current)) continue;

    visited.push(current);

    // Record the visit step
    steps.push({
      currentNode: current,
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
      pq: [...pq],
      explanation:
        current === start
          ? `Visiting start node ${current}.`
          : `Visiting node ${current} with distance ${dist} from source.`,
    });

    // Found the end node
    if (current === end) {
      steps.push({
        currentNode: end,
        distances: { ...distances },
        previous: { ...previous },
        visited: [...visited],
        pq: [],
        explanation: `Reached destination node ${end}! Shortest distance: ${distances[end]}`,
      });
      break;
    }

    // Explore neighbors
    const neighbors = graph.adjacencyList[current] || {};
    for (const neighborStr in neighbors) {
      const neighbor = Number(neighborStr);
      
      // Skip blocked nodes
      if (blockedNodes.has(neighbor)) continue;
      
      // Skip already visited
      if (visited.includes(neighbor)) continue;

      const weight = neighbors[neighbor];
      const newDist = dist + weight;

      if (newDist < distances[neighbor]) {
        const oldDist = distances[neighbor];
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        pq.push([newDist, neighbor]);

        // Record the update step
        steps.push({
          currentNode: current,
          distances: { ...distances },
          previous: { ...previous },
          visited: [...visited],
          pq: [...pq],
          currentEdge: { from: current, to: neighbor },
          explanation:
            oldDist === Infinity
              ? `Found path to node ${neighbor} via node ${current}. Distance: ${newDist}`
              : `Found shorter path to node ${neighbor} via node ${current}. Old: ${oldDist}, New: ${newDist}`,
        });
      }
    }
  }

  return steps;
}

/**
 * Reconstructs the shortest path from the algorithm results
 */
export function reconstructPath(
  previous: Record<number, number | null>,
  start: number,
  end: number
): number[] {
  const path: number[] = [];
  let current: number | null = end;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
    
    // Safety check to prevent infinite loop
    if (path.length > Object.keys(previous).length + 1) {
      return [];
    }
  }

  // If path doesn't start with start node, there's no path
  if (path[0] !== start) {
    return [];
  }

  return path;
}

/**
 * Gets the final shortest path from Dijkstra steps
 */
export function getShortestPath(steps: PathStep[], start: number, end: number): number[] {
  if (steps.length === 0) return [];
  
  const lastStep = steps[steps.length - 1];
  return reconstructPath(lastStep.previous, start, end);
}
