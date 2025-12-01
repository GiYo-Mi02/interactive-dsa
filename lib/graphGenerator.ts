import { Graph, NodePosition, GraphEdge } from '@/app/visualizer/types';

/**
 * Generates a spaced mesh graph with random node positions
 * and weighted edges between nearby nodes
 */
export function generateGraph(
  nodeCount: number = 15,
  canvasWidth: number = 800,
  canvasHeight: number = 600,
  connectionRadius: number = 200
): Graph {
  const nodes: NodePosition[] = [];
  const edges: GraphEdge[] = [];
  const adjacencyList: Record<number, Record<number, number>> = {};

  // Generate nodes with spacing to avoid overlap
  const padding = 60;
  const minDistance = 80;

  for (let i = 0; i < nodeCount; i++) {
    let attempts = 0;
    let x: number, y: number;
    let validPosition = false;

    while (!validPosition && attempts < 100) {
      x = padding + Math.random() * (canvasWidth - 2 * padding);
      y = padding + Math.random() * (canvasHeight - 2 * padding);

      // Check distance from all existing nodes
      validPosition = nodes.every((node) => {
        const dist = Math.sqrt(
          Math.pow(node.x - x!, 2) + Math.pow(node.y - y!, 2)
        );
        return dist >= minDistance;
      });

      attempts++;
    }

    if (attempts < 100) {
      nodes.push({ id: i, x: x!, y: y!, blocked: false });
      adjacencyList[i] = {};
    }
  }

  // Create edges between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.sqrt(
        Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2)
      );

      if (dist <= connectionRadius) {
        // Weight is based on distance (rounded)
        const weight = Math.round(dist / 10);

        edges.push({
          from: nodes[i].id,
          to: nodes[j].id,
          weight: Math.max(1, weight),
        });

        // Add to adjacency list (bidirectional)
        adjacencyList[nodes[i].id][nodes[j].id] = Math.max(1, weight);
        adjacencyList[nodes[j].id][nodes[i].id] = Math.max(1, weight);
      }
    }
  }

  // Ensure graph is connected by adding edges if needed
  const connected = ensureConnectivity(nodes, adjacencyList, edges);

  return {
    nodes,
    edges: connected.edges,
    adjacencyList: connected.adjacencyList,
  };
}

/**
 * Ensures the graph is connected using a simple union-find approach
 */
function ensureConnectivity(
  nodes: NodePosition[],
  adjacencyList: Record<number, Record<number, number>>,
  edges: GraphEdge[]
): { adjacencyList: Record<number, Record<number, number>>; edges: GraphEdge[] } {
  const parent: Record<number, number> = {};
  
  // Initialize each node as its own parent
  nodes.forEach((node) => {
    parent[node.id] = node.id;
  });

  // Find with path compression
  function find(x: number): number {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  // Union two sets
  function union(x: number, y: number): void {
    const px = find(x);
    const py = find(y);
    if (px !== py) {
      parent[px] = py;
    }
  }

  // Union existing edges
  edges.forEach((edge) => {
    union(edge.from, edge.to);
  });

  // Find disconnected components and connect them
  const newEdges = [...edges];
  const newAdjacencyList = { ...adjacencyList };

  for (let i = 1; i < nodes.length; i++) {
    if (find(nodes[i].id) !== find(nodes[0].id)) {
      // Connect this node to node 0's component
      // Find the closest node in node 0's component
      let minDist = Infinity;
      let closestNode = nodes[0];

      for (const node of nodes) {
        if (find(node.id) === find(nodes[0].id)) {
          const dist = Math.sqrt(
            Math.pow(node.x - nodes[i].x, 2) +
              Math.pow(node.y - nodes[i].y, 2)
          );
          if (dist < minDist) {
            minDist = dist;
            closestNode = node;
          }
        }
      }

      const weight = Math.max(1, Math.round(minDist / 10));

      newEdges.push({
        from: closestNode.id,
        to: nodes[i].id,
        weight,
      });

      if (!newAdjacencyList[closestNode.id]) {
        newAdjacencyList[closestNode.id] = {};
      }
      if (!newAdjacencyList[nodes[i].id]) {
        newAdjacencyList[nodes[i].id] = {};
      }

      newAdjacencyList[closestNode.id][nodes[i].id] = weight;
      newAdjacencyList[nodes[i].id][closestNode.id] = weight;

      union(closestNode.id, nodes[i].id);
    }
  }

  return { adjacencyList: newAdjacencyList, edges: newEdges };
}

/**
 * Creates a copy of the graph with blocked nodes removed from adjacency
 */
export function getGraphWithBlockedNodes(
  graph: Graph,
  blockedNodes: Set<number>
): Graph {
  const newAdjacencyList: Record<number, Record<number, number>> = {};

  for (const nodeIdStr in graph.adjacencyList) {
    const nodeId = Number(nodeIdStr);
    if (blockedNodes.has(nodeId)) continue;

    newAdjacencyList[nodeId] = {};
    for (const neighborIdStr in graph.adjacencyList[nodeId]) {
      const neighborId = Number(neighborIdStr);
      if (!blockedNodes.has(neighborId)) {
        newAdjacencyList[nodeId][neighborId] = graph.adjacencyList[nodeId][neighborId];
      }
    }
  }

  return {
    ...graph,
    nodes: graph.nodes.map((n: NodePosition) => ({
      ...n,
      blocked: blockedNodes.has(n.id),
    })),
    adjacencyList: newAdjacencyList,
  };
}
