// Array algorithm types

export type ArrayAlgorithm = 
  | 'linear-search'
  | 'binary-search'
  | 'bubble-sort'
  | 'selection-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'two-pointer';

export interface ArrayElement {
  value: number;
  index: number;
  state: 'default' | 'comparing' | 'found' | 'sorted' | 'pivot' | 'left-pointer' | 'right-pointer' | 'swapping' | 'merging';
}

export interface ArrayStep {
  array: ArrayElement[];
  comparing?: number[];        // Indices being compared
  swapping?: number[];         // Indices being swapped
  sorted?: number[];           // Indices that are sorted
  leftPointer?: number;        // Left pointer position
  rightPointer?: number;       // Right pointer position
  midPointer?: number;         // Mid pointer (for binary search)
  pivot?: number;              // Pivot index (for quick sort)
  found?: number;              // Found element index
  left?: number;               // Left bound (for merge sort partitions)
  right?: number;              // Right bound
  mergeLeft?: number[];        // Left partition (for merge sort)
  mergeRight?: number[];       // Right partition (for merge sort)
  explanation: string;
  highlightCode?: number[];    // Lines to highlight in pseudo-code
}

export interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  pseudocode: string[];
}

export const ALGORITHM_INFO: Record<ArrayAlgorithm, AlgorithmInfo> = {
  'linear-search': {
    name: 'Linear Search',
    description: 'Sequentially checks each element until a match is found or the end is reached.',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function linearSearch(arr, target):',
      '  for i = 0 to n-1:',
      '    if arr[i] == target:',
      '      return i',
      '  return -1',
    ],
  },
  'binary-search': {
    name: 'Binary Search',
    description: 'Efficiently searches a sorted array by repeatedly dividing the search interval in half.',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function binarySearch(arr, target):',
      '  left = 0, right = n-1',
      '  while left <= right:',
      '    mid = (left + right) / 2',
      '    if arr[mid] == target:',
      '      return mid',
      '    else if arr[mid] < target:',
      '      left = mid + 1',
      '    else:',
      '      right = mid - 1',
      '  return -1',
    ],
  },
  'bubble-sort': {
    name: 'Bubble Sort',
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function bubbleSort(arr):',
      '  for i = 0 to n-1:',
      '    for j = 0 to n-i-2:',
      '      if arr[j] > arr[j+1]:',
      '        swap(arr[j], arr[j+1])',
    ],
  },
  'selection-sort': {
    name: 'Selection Sort',
    description: 'Finds the minimum element and places it at the beginning, then repeats for remaining elements.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function selectionSort(arr):',
      '  for i = 0 to n-1:',
      '    minIdx = i',
      '    for j = i+1 to n-1:',
      '      if arr[j] < arr[minIdx]:',
      '        minIdx = j',
      '    swap(arr[i], arr[minIdx])',
    ],
  },
  'merge-sort': {
    name: 'Merge Sort',
    description: 'Divides array in half, recursively sorts, then merges the sorted halves.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '  if left < right:',
      '    mid = (left + right) / 2',
      '    mergeSort(arr, left, mid)',
      '    mergeSort(arr, mid+1, right)',
      '    merge(arr, left, mid, right)',
    ],
  },
  'quick-sort': {
    name: 'Quick Sort',
    description: 'Picks a pivot, partitions array around it, then recursively sorts partitions.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pivot = partition(arr, low, high)',
      '    quickSort(arr, low, pivot-1)',
      '    quickSort(arr, pivot+1, high)',
    ],
  },
  'two-pointer': {
    name: 'Two-Pointer Technique',
    description: 'Uses two pointers moving towards each other to find pairs that sum to a target.',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    pseudocode: [
      'function twoSum(arr, target):',
      '  left = 0, right = n-1',
      '  while left < right:',
      '    sum = arr[left] + arr[right]',
      '    if sum == target:',
      '      return [left, right]',
      '    else if sum < target:',
      '      left++',
      '    else:',
      '      right--',
      '  return null',
    ],
  },
};
