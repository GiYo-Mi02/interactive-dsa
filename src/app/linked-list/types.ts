// Linked List algorithm types

export type LinkedListAlgorithm = 
  | 'traversal'
  | 'floyd-cycle'
  | 'reversal'
  | 'merge-sorted';

export interface ListNode {
  id: number;
  value: number;
  next: number | null;  // Points to id of next node, or null
  state: 'default' | 'current' | 'slow' | 'fast' | 'visited' | 'cycle' | 'reversed' | 'merged' | 'comparing';
}

export interface LinkedListStep {
  nodes: ListNode[];
  head: number | null;
  slowPointer?: number;     // For Floyd's
  fastPointer?: number;     // For Floyd's
  currentPointer?: number;  // For traversal/reversal
  prevPointer?: number;     // For reversal
  cycleNode?: number;       // Where cycle connects
  list1Pointer?: number;    // For merge
  list2Pointer?: number;    // For merge
  explanation: string;
  highlightCode?: number[];
}

export interface LinkedListInfo {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

export const LINKED_LIST_INFO: Record<LinkedListAlgorithm, LinkedListInfo> = {
  'traversal': {
    name: 'Linked List Traversal',
    description: 'Visit each node starting from head, following next pointers until null.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function traverse(head):',
      '  current = head',
      '  while current != null:',
      '    visit(current)',
      '    current = current.next',
      '  return',
    ],
  },
  'floyd-cycle': {
    name: "Floyd's Cycle Detection",
    description: 'Uses slow (1 step) and fast (2 steps) pointers. If they meet, a cycle exists.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function hasCycle(head):',
      '  slow = fast = head',
      '  while fast != null && fast.next != null:',
      '    slow = slow.next',
      '    fast = fast.next.next',
      '    if slow == fast:',
      '      return true  // Cycle detected!',
      '  return false  // No cycle',
    ],
  },
  'reversal': {
    name: 'Linked List Reversal',
    description: 'Reverse the list by changing next pointers to point to previous nodes.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function reverse(head):',
      '  prev = null',
      '  current = head',
      '  while current != null:',
      '    nextTemp = current.next',
      '    current.next = prev',
      '    prev = current',
      '    current = nextTemp',
      '  return prev  // New head',
    ],
  },
  'merge-sorted': {
    name: 'Merge Two Sorted Lists',
    description: 'Merge two sorted lists by comparing heads and linking smaller values first.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function mergeLists(l1, l2):',
      '  dummy = new Node(0)',
      '  current = dummy',
      '  while l1 != null && l2 != null:',
      '    if l1.val <= l2.val:',
      '      current.next = l1',
      '      l1 = l1.next',
      '    else:',
      '      current.next = l2',
      '      l2 = l2.next',
      '    current = current.next',
      '  current.next = l1 or l2',
      '  return dummy.next',
    ],
  },
};
