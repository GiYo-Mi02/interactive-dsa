import { TreeNode, TreeStep } from './types';

/**
 * Generates a random BST
 */
export function generateBST(size: number = 7): TreeNode[] {
  const values: number[] = [];
  while (values.length < size) {
    const val = Math.floor(Math.random() * 90) + 10;
    if (!values.includes(val)) values.push(val);
  }

  const nodes: TreeNode[] = [];
  
  function insert(value: number, parentId: number | null): number {
    const id = nodes.length;
    nodes.push({
      id,
      value,
      left: null,
      right: null,
      parent: parentId,
      state: 'default',
    });
    return id;
  }

  function insertBST(value: number, nodeId: number | null, parentId: number | null): number {
    if (nodeId === null) {
      return insert(value, parentId);
    }

    const node = nodes[nodeId];
    if (value < node.value) {
      if (node.left === null) {
        node.left = insert(value, nodeId);
        return node.left;
      } else {
        return insertBST(value, node.left, nodeId);
      }
    } else {
      if (node.right === null) {
        node.right = insert(value, nodeId);
        return node.right;
      } else {
        return insertBST(value, node.right, nodeId);
      }
    }
  }

  // Build BST
  insert(values[0], null);
  for (let i = 1; i < values.length; i++) {
    insertBST(values[i], 0, null);
  }

  // Calculate positions for rendering
  calculatePositions(nodes, 0, 400, 60, 180);

  return nodes;
}

/**
 * Calculate node positions for rendering
 */
function calculatePositions(
  nodes: TreeNode[], 
  nodeId: number | null, 
  x: number, 
  y: number, 
  xOffset: number
): void {
  if (nodeId === null || nodeId >= nodes.length) return;

  const node = nodes[nodeId];
  node.x = x;
  node.y = y;

  const nextOffset = Math.max(xOffset * 0.55, 40);
  
  if (node.left !== null) {
    calculatePositions(nodes, node.left, x - xOffset, y + 80, nextOffset);
  }
  if (node.right !== null) {
    calculatePositions(nodes, node.right, x + xOffset, y + 80, nextOffset);
  }
}

/**
 * In-Order Traversal with step tracking
 */
export function inorderTraversal(nodes: TreeNode[]): TreeStep[] {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  const resultOrder: number[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));

  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'Starting In-Order traversal: Left → Root → Right',
    highlightCode: [0],
  });

  function inorder(nodeId: number | null): void {
    if (nodeId === null || nodeId >= workingNodes.length) return;

    const node = workingNodes[nodeId];

    // Going left
    if (node.left !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        stack: [nodeId],
        explanation: `At node ${node.value}, going to left child`,
        highlightCode: [3],
      });
      inorder(node.left);
    }

    // Visit current node
    visited.push(nodeId);
    resultOrder.push(node.value);

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: resultOrder.includes(n.value) ? 'result' as const :
               visited.includes(i) ? 'visited' as const :
               i === nodeId ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: nodeId,
      visitedNodes: [...visited],
      resultOrder: [...resultOrder],
      explanation: `Visit node ${node.value}. Result: [${resultOrder.join(', ')}]`,
      highlightCode: [4],
    });

    // Going right
    if (node.right !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        explanation: `At node ${node.value}, going to right child`,
        highlightCode: [5],
      });
      inorder(node.right);
    }
  }

  inorder(0);

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: visited,
    resultOrder,
    explanation: `In-Order traversal complete! Result: [${resultOrder.join(', ')}]`,
  });

  return steps;
}

/**
 * Pre-Order Traversal with step tracking
 */
export function preorderTraversal(nodes: TreeNode[]): TreeStep[] {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  const resultOrder: number[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));

  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'Starting Pre-Order traversal: Root → Left → Right',
    highlightCode: [0],
  });

  function preorder(nodeId: number | null): void {
    if (nodeId === null || nodeId >= workingNodes.length) return;

    const node = workingNodes[nodeId];

    // Visit current node FIRST
    visited.push(nodeId);
    resultOrder.push(node.value);

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: resultOrder.includes(n.value) ? 'result' as const :
               visited.includes(i) ? 'visited' as const :
               i === nodeId ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: nodeId,
      visitedNodes: [...visited],
      resultOrder: [...resultOrder],
      explanation: `Visit node ${node.value} first. Result: [${resultOrder.join(', ')}]`,
      highlightCode: [3],
    });

    // Then go left
    if (node.left !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        explanation: `At node ${node.value}, going to left child`,
        highlightCode: [4],
      });
      preorder(node.left);
    }

    // Then go right
    if (node.right !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        explanation: `At node ${node.value}, going to right child`,
        highlightCode: [5],
      });
      preorder(node.right);
    }
  }

  preorder(0);

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: visited,
    resultOrder,
    explanation: `Pre-Order traversal complete! Result: [${resultOrder.join(', ')}]`,
  });

  return steps;
}

/**
 * Post-Order Traversal with step tracking
 */
export function postorderTraversal(nodes: TreeNode[]): TreeStep[] {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  const resultOrder: number[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));

  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'Starting Post-Order traversal: Left → Right → Root',
    highlightCode: [0],
  });

  function postorder(nodeId: number | null): void {
    if (nodeId === null || nodeId >= workingNodes.length) return;

    const node = workingNodes[nodeId];

    // Go left first
    if (node.left !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        explanation: `At node ${node.value}, going to left child first`,
        highlightCode: [3],
      });
      postorder(node.left);
    }

    // Then go right
    if (node.right !== null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 visited.includes(i) ? 'visited' as const :
                 i === nodeId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: nodeId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        explanation: `At node ${node.value}, going to right child`,
        highlightCode: [4],
      });
      postorder(node.right);
    }

    // Visit node LAST
    visited.push(nodeId);
    resultOrder.push(node.value);

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: resultOrder.includes(n.value) ? 'result' as const :
               visited.includes(i) ? 'visited' as const :
               i === nodeId ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: nodeId,
      visitedNodes: [...visited],
      resultOrder: [...resultOrder],
      explanation: `Visit node ${node.value} last. Result: [${resultOrder.join(', ')}]`,
      highlightCode: [5],
    });
  }

  postorder(0);

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: visited,
    resultOrder,
    explanation: `Post-Order traversal complete! Result: [${resultOrder.join(', ')}]`,
  });

  return steps;
}

/**
 * Level-Order Traversal (BFS) with step tracking
 */
export function levelorderTraversal(nodes: TreeNode[]): TreeStep[] {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  const resultOrder: number[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));
  const queue: number[] = [0];

  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    queue: [0],
    explanation: 'Starting Level-Order traversal (BFS). Queue initialized with root.',
    highlightCode: [0, 1],
  });

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = workingNodes[currentId];

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: resultOrder.includes(n.value) ? 'result' as const :
               queue.includes(i) ? 'queued' as const :
               i === currentId ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: currentId,
      visitedNodes: [...visited],
      resultOrder: [...resultOrder],
      queue: [...queue],
      explanation: `Dequeue node ${node.value}. Queue: [${queue.map(i => workingNodes[i].value).join(', ')}]`,
      highlightCode: [2, 3],
    });

    visited.push(currentId);
    resultOrder.push(node.value);

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: resultOrder.includes(n.value) ? 'result' as const :
               queue.includes(i) ? 'queued' as const :
               i === currentId ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: currentId,
      visitedNodes: [...visited],
      resultOrder: [...resultOrder],
      queue: [...queue],
      explanation: `Visit node ${node.value}. Result: [${resultOrder.join(', ')}]`,
      highlightCode: [4],
    });

    // Add children to queue
    if (node.left !== null) {
      queue.push(node.left);
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 queue.includes(i) ? 'queued' as const :
                 i === currentId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: currentId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        queue: [...queue],
        explanation: `Enqueue left child (${workingNodes[node.left].value}). Queue: [${queue.map(i => workingNodes[i].value).join(', ')}]`,
        highlightCode: [5],
      });
    }

    if (node.right !== null) {
      queue.push(node.right);
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: resultOrder.includes(n.value) ? 'result' as const :
                 queue.includes(i) ? 'queued' as const :
                 i === currentId ? 'current' as const : 'default' as const,
        })),
        root: 0,
        currentNode: currentId,
        visitedNodes: [...visited],
        resultOrder: [...resultOrder],
        queue: [...queue],
        explanation: `Enqueue right child (${workingNodes[node.right].value}). Queue: [${queue.map(i => workingNodes[i].value).join(', ')}]`,
        highlightCode: [6],
      });
    }
  }

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: visited,
    resultOrder,
    queue: [],
    explanation: `Level-Order traversal complete! Result: [${resultOrder.join(', ')}]`,
  });

  return steps;
}

/**
 * AVL Rotation demonstration with detailed step-by-step visualization
 */
export function avlRotation(nodes: TreeNode[]): TreeStep[] {
  const steps: TreeStep[] = [];
  
  // Create a deep copy to work with
  const workingNodes = nodes.map(n => ({ ...n }));

  // Introduction step
  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'default' as const })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'AVL Tree: Self-balancing BST where the height difference between left and right subtrees is at most 1',
    highlightCode: [0],
  });

  // Calculate heights for demonstration
  function getHeight(nodeId: number | null): number {
    if (nodeId === null || nodeId >= workingNodes.length) return 0;
    const node = workingNodes[nodeId];
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }

  function getBalanceFactor(nodeId: number): number {
    if (nodeId >= workingNodes.length) return 0;
    const node = workingNodes[nodeId];
    return getHeight(node.left) - getHeight(node.right);
  }

  // Find a potentially unbalanced node for demonstration
  let unbalancedNode: number | null = null;
  for (let i = 0; i < workingNodes.length; i++) {
    const bf = getBalanceFactor(i);
    if (Math.abs(bf) >= 1 && workingNodes[i].left !== null) {
      unbalancedNode = i;
      break;
    }
  }

  if (unbalancedNode === null && workingNodes.length > 0) {
    unbalancedNode = 0;
  }

  if (unbalancedNode !== null) {
    const node = workingNodes[unbalancedNode];
    const bf = getBalanceFactor(unbalancedNode);
    const leftHeight = getHeight(node.left);
    const rightHeight = getHeight(node.right);

    // Step 1: Show balance factor calculation
    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === unbalancedNode ? 'current' as const : 'default' as const,
      })),
      root: 0,
      currentNode: unbalancedNode,
      visitedNodes: [],
      resultOrder: [],
      explanation: `Checking node ${node.value}: Left height = ${leftHeight}, Right height = ${rightHeight}, Balance Factor = ${bf}`,
      highlightCode: [1, 2],
    });

    // Step 2: Determine rotation type needed
    let rotationType = '';
    if (bf > 1) {
      rotationType = 'Right Rotation (Left-Heavy)';
    } else if (bf < -1) {
      rotationType = 'Left Rotation (Right-Heavy)';
    } else if (bf === 1) {
      rotationType = 'Slightly left-heavy (balanced)';
    } else if (bf === -1) {
      rotationType = 'Slightly right-heavy (balanced)';
    } else {
      rotationType = 'Perfectly balanced';
    }

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === unbalancedNode ? 'rotating' as const : 
               i === node.left || i === node.right ? 'visited' as const : 'default' as const,
      })),
      root: 0,
      currentNode: unbalancedNode,
      visitedNodes: [],
      resultOrder: [],
      rotationType: bf > 0 ? 'right' : 'left',
      explanation: `Node ${node.value} analysis: ${rotationType}`,
      highlightCode: [3],
    });

    // Step 3: Show rotation process if applicable
    if (node.left !== null && bf >= 1) {
      const leftChild = node.left;
      const leftNode = workingNodes[leftChild];

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === leftChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: leftChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'right',
        explanation: `RIGHT ROTATION: Node ${leftNode.value} will become the new parent of ${node.value}`,
        highlightCode: [4, 5],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === leftChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: leftChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'right',
        explanation: `Step 1: ${leftNode.value}'s right subtree becomes ${node.value}'s left subtree`,
        highlightCode: [6],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === leftChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: leftChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'right',
        explanation: `Step 2: ${node.value} becomes the right child of ${leftNode.value}`,
        highlightCode: [7],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === leftChild ? 'result' as const : 
                 i === unbalancedNode ? 'visited' as const : 'default' as const,
        })),
        root: 0,
        currentNode: leftChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'right',
        explanation: `Step 3: ${leftNode.value} is now the new root of this subtree. Rotation complete!`,
        highlightCode: [8],
      });
    } else if (node.right !== null && bf <= -1) {
      const rightChild = node.right;
      const rightNode = workingNodes[rightChild];

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === rightChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: rightChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'left',
        explanation: `LEFT ROTATION: Node ${rightNode.value} will become the new parent of ${node.value}`,
        highlightCode: [4, 5],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === rightChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: rightChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'left',
        explanation: `Step 1: ${rightNode.value}'s left subtree becomes ${node.value}'s right subtree`,
        highlightCode: [6],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === unbalancedNode || i === rightChild ? 'rotating' as const : 'default' as const,
        })),
        root: 0,
        currentNode: rightChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'left',
        explanation: `Step 2: ${node.value} becomes the left child of ${rightNode.value}`,
        highlightCode: [7],
      });

      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === rightChild ? 'result' as const : 
                 i === unbalancedNode ? 'visited' as const : 'default' as const,
        })),
        root: 0,
        currentNode: rightChild,
        visitedNodes: [],
        resultOrder: [],
        rotationType: 'left',
        explanation: `Step 3: ${rightNode.value} is now the new root of this subtree. Rotation complete!`,
        highlightCode: [8],
      });
    }
  }

  // Summary step
  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'AVL rotations ensure O(log n) height, guaranteeing O(log n) search, insert, and delete operations',
  });

  // Additional info step
  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'result' as const })),
    root: 0,
    visitedNodes: [],
    resultOrder: [],
    explanation: 'Rotation Types: LL (Right Rotation), RR (Left Rotation), LR (Left-Right), RL (Right-Left)',
  });

  return steps;
}
