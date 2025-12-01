import { ListNode, LinkedListStep } from './types';

/**
 * Generates a random linked list
 */
export function generateLinkedList(size: number = 6): ListNode[] {
  const nodes: ListNode[] = [];
  for (let i = 0; i < size; i++) {
    nodes.push({
      id: i,
      value: Math.floor(Math.random() * 90) + 10,
      next: i < size - 1 ? i + 1 : null,
      state: 'default',
    });
  }
  return nodes;
}

/**
 * Generates a sorted linked list
 */
export function generateSortedLinkedList(size: number = 5, offset: number = 0): ListNode[] {
  const values = Array.from({ length: size }, () => Math.floor(Math.random() * 40) + 10)
    .sort((a, b) => a - b);
  
  return values.map((value, i) => ({
    id: i + offset,
    value,
    next: i < size - 1 ? i + 1 + offset : null,
    state: 'default' as const,
  }));
}

/**
 * Generates a linked list with a cycle
 */
export function generateCyclicList(size: number = 6): { nodes: ListNode[]; cycleStart: number } {
  const nodes = generateLinkedList(size);
  const cycleStart = Math.floor(size / 3); // Cycle back to ~1/3 of the list
  nodes[nodes.length - 1].next = cycleStart;
  return { nodes, cycleStart };
}

/**
 * Linked List Traversal with step tracking
 */
export function traverseList(nodes: ListNode[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));
  
  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    head: 0,
    explanation: 'Starting linked list traversal from head node.',
    highlightCode: [0, 1],
  });

  let current: number | null = 0;
  const visited: number[] = [];

  while (current !== null && current < workingNodes.length) {
    visited.push(current);
    
    // Mark current node
    const stepNodes = workingNodes.map((n, i) => ({
      ...n,
      state: i === current ? 'current' as const : 
             visited.includes(i) && i !== current ? 'visited' as const : 'default' as const,
    }));

    steps.push({
      nodes: stepNodes,
      head: 0,
      currentPointer: current,
      explanation: `Visiting node ${current} with value ${workingNodes[current].value}`,
      highlightCode: [2, 3],
    });

    // Move to next
    const nextNode: number | null = workingNodes[current].next;
    
    steps.push({
      nodes: stepNodes.map((n, i) => ({
        ...n,
        state: visited.includes(i) ? 'visited' as const : 'default' as const,
      })),
      head: 0,
      currentPointer: nextNode ?? undefined,
      explanation: nextNode !== null 
        ? `Moving to next node (index ${nextNode})` 
        : 'Reached end of list (null)',
      highlightCode: [4],
    });

    current = nextNode;
  }

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'visited' as const })),
    head: 0,
    explanation: 'Traversal complete! Visited all nodes in the list.',
    highlightCode: [5],
  });

  return steps;
}

/**
 * Floyd's Cycle Detection with step tracking
 */
export function floydCycleDetection(nodes: ListNode[], hasCycle: boolean, cycleStart?: number): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const workingNodes = nodes.map(n => ({ ...n, state: 'default' as const }));
  
  steps.push({
    nodes: workingNodes.map(n => ({ ...n })),
    head: 0,
    explanation: "Starting Floyd's Cycle Detection (Tortoise and Hare algorithm)",
    highlightCode: [0, 1],
  });

  let slow = 0;
  let fast = 0;
  let iteration = 0;
  const maxIterations = nodes.length * 2; // Safety limit

  steps.push({
    nodes: workingNodes.map((n, i) => ({
      ...n,
      state: i === 0 ? 'slow' as const : 'default' as const,
    })),
    head: 0,
    slowPointer: slow,
    fastPointer: fast,
    explanation: 'Initialize slow and fast pointers at head',
    highlightCode: [1],
  });

  while (iteration < maxIterations) {
    iteration++;

    // Check if fast can move
    const fastNext = workingNodes[fast].next;
    if (fastNext === null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === slow ? 'slow' as const : i === fast ? 'fast' as const : 'default' as const,
        })),
        head: 0,
        slowPointer: slow,
        fastPointer: fast,
        explanation: 'Fast pointer reached null. No cycle detected!',
        highlightCode: [2, 7],
      });
      break;
    }

    const fastNextNext = workingNodes[fastNext].next;
    if (fastNextNext === null) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === slow ? 'slow' as const : i === fast ? 'fast' as const : 'default' as const,
        })),
        head: 0,
        slowPointer: slow,
        fastPointer: fast,
        explanation: 'Fast pointer will reach null. No cycle detected!',
        highlightCode: [2, 7],
      });
      break;
    }

    // Move pointers
    slow = workingNodes[slow].next!;
    fast = fastNextNext;

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === slow && i === fast ? 'cycle' as const :
               i === slow ? 'slow' as const : 
               i === fast ? 'fast' as const : 'default' as const,
      })),
      head: 0,
      slowPointer: slow,
      fastPointer: fast,
      cycleNode: hasCycle ? cycleStart : undefined,
      explanation: `Slow moves 1 step to node ${slow}, Fast moves 2 steps to node ${fast}`,
      highlightCode: [3, 4],
    });

    // Check if they meet
    if (slow === fast) {
      steps.push({
        nodes: workingNodes.map((n, i) => ({
          ...n,
          state: i === slow ? 'cycle' as const : 'default' as const,
        })),
        head: 0,
        slowPointer: slow,
        fastPointer: fast,
        cycleNode: cycleStart,
        explanation: `🔄 Cycle detected! Slow and fast pointers meet at node ${slow}`,
        highlightCode: [5, 6],
      });
      break;
    }
  }

  return steps;
}

/**
 * Linked List Reversal with step tracking
 */
export function reverseList(nodes: ListNode[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const workingNodes = nodes.map(n => ({ ...n }));
  
  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'default' as const })),
    head: 0,
    explanation: 'Starting linked list reversal',
    highlightCode: [0],
  });

  let prev: number | null = null;
  let current: number | null = 0;

  steps.push({
    nodes: workingNodes.map((n, i) => ({
      ...n,
      state: i === current ? 'current' as const : 'default' as const,
    })),
    head: 0,
    currentPointer: current ?? undefined,
    prevPointer: undefined,
    explanation: 'Initialize prev = null, current = head',
    highlightCode: [1, 2],
  });

  while (current !== null) {
    const nextTemp: number | null = workingNodes[current].next;

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === current ? 'current' as const : 
               i === prev ? 'reversed' as const : 
               i === nextTemp ? 'comparing' as const : 'default' as const,
      })),
      head: prev ?? 0,
      currentPointer: current,
      prevPointer: prev ?? undefined,
      explanation: `Save nextTemp = ${nextTemp !== null ? `node ${nextTemp}` : 'null'}`,
      highlightCode: [4],
    });

    // Reverse the pointer
    workingNodes[current].next = prev;

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === current ? 'current' as const : 
               i === prev ? 'reversed' as const : 'default' as const,
        next: n.next,
      })),
      head: current,
      currentPointer: current,
      prevPointer: prev ?? undefined,
      explanation: `Reverse pointer: node ${current}.next now points to ${prev !== null ? `node ${prev}` : 'null'}`,
      highlightCode: [5],
    });

    // Move prev and current
    prev = current;
    current = nextTemp;

    steps.push({
      nodes: workingNodes.map((n, i) => ({
        ...n,
        state: i === current ? 'current' as const : 
               i === prev ? 'reversed' as const : 
               (prev !== null && i < prev) ? 'reversed' as const : 'default' as const,
      })),
      head: prev,
      currentPointer: current ?? undefined,
      prevPointer: prev,
      explanation: `Move pointers: prev = ${prev}, current = ${current !== null ? current : 'null'}`,
      highlightCode: [6, 7],
    });
  }

  steps.push({
    nodes: workingNodes.map(n => ({ ...n, state: 'reversed' as const })),
    head: prev ?? 0,
    explanation: `Reversal complete! New head is node ${prev}`,
    highlightCode: [8],
  });

  return steps;
}

/**
 * Merge Two Sorted Lists with step tracking
 */
export function mergeSortedLists(list1: ListNode[], list2: ListNode[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  
  // Adjust list2 IDs to avoid conflicts
  const offset = list1.length;
  const adjustedList2 = list2.map(n => ({
    ...n,
    id: n.id + offset,
    next: n.next !== null ? n.next + offset : null,
  }));
  
  const allNodes = [...list1, ...adjustedList2];
  const merged: number[] = [];
  
  steps.push({
    nodes: allNodes.map(n => ({ ...n, state: 'default' as const })),
    head: null,
    list1Pointer: 0,
    list2Pointer: offset,
    explanation: 'Starting merge of two sorted lists',
    highlightCode: [0, 1, 2],
  });

  let p1: number | null = 0;
  let p2: number | null = offset;

  while (p1 !== null && p2 !== null && p1 < offset && p2 < allNodes.length) {
    steps.push({
      nodes: allNodes.map((n, i) => ({
        ...n,
        state: merged.includes(i) ? 'merged' as const :
               i === p1 || i === p2 ? 'comparing' as const : 'default' as const,
      })),
      head: merged.length > 0 ? merged[0] : null,
      list1Pointer: p1,
      list2Pointer: p2,
      explanation: `Comparing ${allNodes[p1].value} (list1) with ${allNodes[p2].value} (list2)`,
      highlightCode: [3, 4],
    });

    if (allNodes[p1].value <= allNodes[p2].value) {
      merged.push(p1);
      steps.push({
        nodes: allNodes.map((n, i) => ({
          ...n,
          state: merged.includes(i) ? 'merged' as const :
                 i === p1 ? 'current' as const : 'default' as const,
        })),
        head: merged[0],
        list1Pointer: p1,
        list2Pointer: p2,
        explanation: `${allNodes[p1].value} <= ${allNodes[p2].value}, append node from list1`,
        highlightCode: [5, 6],
      });
      p1 = list1[p1]?.next;
      if (p1 !== null && p1 >= offset) p1 = null;
    } else {
      merged.push(p2);
      steps.push({
        nodes: allNodes.map((n, i) => ({
          ...n,
          state: merged.includes(i) ? 'merged' as const :
                 i === p2 ? 'current' as const : 'default' as const,
        })),
        head: merged[0],
        list1Pointer: p1,
        list2Pointer: p2,
        explanation: `${allNodes[p1].value} > ${allNodes[p2].value}, append node from list2`,
        highlightCode: [7, 8, 9],
      });
      const localIdx: number = p2 - offset;
      p2 = adjustedList2[localIdx]?.next ?? null;
    }
  }

  // Append remaining nodes
  while (p1 !== null && p1 < offset) {
    merged.push(p1);
    p1 = list1[p1]?.next;
  }
  
  while (p2 !== null && p2 < allNodes.length) {
    merged.push(p2);
    const localIdx2 = p2 - offset;
    p2 = adjustedList2[localIdx2]?.next;
  }

  steps.push({
    nodes: allNodes.map((n, i) => ({
      ...n,
      state: merged.includes(i) ? 'merged' as const : 'default' as const,
    })),
    head: merged[0],
    explanation: `Merge complete! Merged list: [${merged.map(i => allNodes[i].value).join(' → ')}]`,
    highlightCode: [11, 12],
  });

  return steps;
}
