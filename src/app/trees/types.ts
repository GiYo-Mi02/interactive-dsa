// Tree algorithm types

export type TreeAlgorithm = 
  | 'inorder'
  | 'preorder'
  | 'postorder'
  | 'levelorder'
  | 'avl-rotation';

export interface TreeNode {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
  parent: number | null;
  x?: number;  // Position for rendering
  y?: number;
  state: 'default' | 'current' | 'visited' | 'queued' | 'rotating' | 'result';
}

export interface TreeStep {
  nodes: TreeNode[];
  root: number;
  currentNode?: number;
  visitedNodes: number[];
  queue?: number[];  // For BFS
  stack?: number[];  // For DFS visualization
  resultOrder: number[];  // Order of visited nodes
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
  explanation: string;
  highlightCode?: number[];
}

export interface TreeInfo {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  order: string;
  pseudocode: string[];
}

export const TREE_INFO: Record<TreeAlgorithm, TreeInfo> = {
  'inorder': {
    name: 'In-Order Traversal (DFS)',
    description: 'Visit left subtree, then root, then right subtree. Yields sorted values for BST.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    order: 'Left → Root → Right',
    pseudocode: [
      'function inorder(node):',
      '  if node == null:',
      '    return',
      '  inorder(node.left)',
      '  visit(node)',
      '  inorder(node.right)',
    ],
  },
  'preorder': {
    name: 'Pre-Order Traversal (DFS)',
    description: 'Visit root first, then left subtree, then right subtree. Good for copying trees.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    order: 'Root → Left → Right',
    pseudocode: [
      'function preorder(node):',
      '  if node == null:',
      '    return',
      '  visit(node)',
      '  preorder(node.left)',
      '  preorder(node.right)',
    ],
  },
  'postorder': {
    name: 'Post-Order Traversal (DFS)',
    description: 'Visit left subtree, then right subtree, then root. Good for deleting trees.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    order: 'Left → Right → Root',
    pseudocode: [
      'function postorder(node):',
      '  if node == null:',
      '    return',
      '  postorder(node.left)',
      '  postorder(node.right)',
      '  visit(node)',
    ],
  },
  'levelorder': {
    name: 'Level-Order Traversal (BFS)',
    description: 'Visit nodes level by level from root, using a queue.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(w)',
    order: 'Level by Level',
    pseudocode: [
      'function levelorder(root):',
      '  queue = [root]',
      '  while queue not empty:',
      '    node = queue.dequeue()',
      '    visit(node)',
      '    if node.left: queue.enqueue(node.left)',
      '    if node.right: queue.enqueue(node.right)',
    ],
  },
  'avl-rotation': {
    name: 'AVL Tree Rotations',
    description: 'Balance the tree using left/right rotations to maintain O(log n) height. Balance factor = height(left) - height(right).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    order: 'Rotate to Balance',
    pseudocode: [
      '// AVL Balance Factor',
      'BF(node) = height(left) - height(right)',
      '// If |BF| > 1, tree is unbalanced',
      '',
      'function rotateRight(y):',
      '  x = y.left',
      '  T2 = x.right',
      '  x.right = y    // y becomes right child',
      '  y.left = T2    // T2 moves to y',
      '  return x       // x is new root',
    ],
  },
};
