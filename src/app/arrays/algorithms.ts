import { ArrayElement, ArrayStep } from './types';

/**
 * Generates a random array of numbers
 */
export function generateRandomArray(size: number = 12, min: number = 5, max: number = 99): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

/**
 * Generates a sorted array for binary search
 */
export function generateSortedArray(size: number = 12, min: number = 5, max: number = 99): number[] {
  return generateRandomArray(size, min, max).sort((a, b) => a - b);
}

/**
 * Converts number array to ArrayElement array
 */
export function toArrayElements(arr: number[]): ArrayElement[] {
  return arr.map((value, index) => ({
    value,
    index,
    state: 'default' as const,
  }));
}

/**
 * Linear Search Algorithm with step tracking
 */
export function linearSearch(arr: number[], target: number): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const elements = toArrayElements(arr);
  
  steps.push({
    array: elements.map(e => ({ ...e })),
    explanation: `Starting Linear Search for target value ${target}`,
    highlightCode: [0],
  });

  for (let i = 0; i < arr.length; i++) {
    // Comparing step
    const comparing = elements.map((e, idx) => ({
      ...e,
      state: idx === i ? 'comparing' as const : e.state === 'found' ? 'found' as const : 'default' as const,
    }));
    
    steps.push({
      array: comparing,
      comparing: [i],
      explanation: `Comparing arr[${i}] = ${arr[i]} with target ${target}`,
      highlightCode: [1, 2],
    });

    if (arr[i] === target) {
      const found = elements.map((e, idx) => ({
        ...e,
        state: idx === i ? 'found' as const : 'default' as const,
      }));
      
      steps.push({
        array: found,
        found: i,
        explanation: `Found target ${target} at index ${i}! 🎉`,
        highlightCode: [3],
      });
      return steps;
    }
  }

  steps.push({
    array: elements.map(e => ({ ...e, state: 'default' as const })),
    explanation: `Target ${target} not found in the array.`,
    highlightCode: [4],
  });

  return steps;
}

/**
 * Binary Search Algorithm with step tracking
 */
export function binarySearch(arr: number[], target: number): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const elements = toArrayElements(arr);
  
  steps.push({
    array: elements.map(e => ({ ...e })),
    explanation: `Starting Binary Search for target value ${target}. Array must be sorted.`,
    highlightCode: [0],
  });

  let left = 0;
  let right = arr.length - 1;

  steps.push({
    array: elements.map((e, idx) => ({
      ...e,
      state: idx === left ? 'left-pointer' as const : idx === right ? 'right-pointer' as const : 'default' as const,
    })),
    leftPointer: left,
    rightPointer: right,
    explanation: `Initialize left = ${left}, right = ${right}`,
    highlightCode: [1],
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    const midStep = elements.map((e, idx) => ({
      ...e,
      state: idx === left ? 'left-pointer' as const :
             idx === right ? 'right-pointer' as const :
             idx === mid ? 'comparing' as const : 'default' as const,
    }));
    
    steps.push({
      array: midStep,
      leftPointer: left,
      rightPointer: right,
      midPointer: mid,
      comparing: [mid],
      explanation: `Calculate mid = (${left} + ${right}) / 2 = ${mid}. Comparing arr[${mid}] = ${arr[mid]} with target ${target}`,
      highlightCode: [2, 3, 4],
    });

    if (arr[mid] === target) {
      const found = elements.map((e, idx) => ({
        ...e,
        state: idx === mid ? 'found' as const : 'default' as const,
      }));
      
      steps.push({
        array: found,
        found: mid,
        explanation: `Found target ${target} at index ${mid}! 🎉`,
        highlightCode: [5],
      });
      return steps;
    } else if (arr[mid] < target) {
      left = mid + 1;
      
      steps.push({
        array: elements.map((e, idx) => ({
          ...e,
          state: idx < left ? 'sorted' as const :
                 idx === left ? 'left-pointer' as const :
                 idx === right ? 'right-pointer' as const : 'default' as const,
        })),
        leftPointer: left,
        rightPointer: right,
        explanation: `arr[${mid}] = ${arr[mid]} < ${target}, so search right half. Set left = ${left}`,
        highlightCode: [6, 7],
      });
    } else {
      right = mid - 1;
      
      steps.push({
        array: elements.map((e, idx) => ({
          ...e,
          state: idx > right ? 'sorted' as const :
                 idx === left ? 'left-pointer' as const :
                 idx === right ? 'right-pointer' as const : 'default' as const,
        })),
        leftPointer: left,
        rightPointer: right,
        explanation: `arr[${mid}] = ${arr[mid]} > ${target}, so search left half. Set right = ${right}`,
        highlightCode: [8, 9],
      });
    }
  }

  steps.push({
    array: elements.map(e => ({ ...e, state: 'default' as const })),
    explanation: `Target ${target} not found in the array.`,
    highlightCode: [10],
  });

  return steps;
}

/**
 * Bubble Sort Algorithm with step tracking
 */
export function bubbleSort(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: toArrayElements(array),
    explanation: 'Starting Bubble Sort. Will compare adjacent elements and swap if needed.',
    highlightCode: [0],
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: idx >= n - i ? 'sorted' as const : 'default' as const,
      })),
      explanation: `Pass ${i + 1}: Bubbling largest unsorted element to position ${n - 1 - i}`,
      highlightCode: [1],
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx === j || idx === j + 1 ? 'comparing' as const :
                 idx >= n - i ? 'sorted' as const : 'default' as const,
        })),
        comparing: [j, j + 1],
        explanation: `Comparing arr[${j}] = ${array[j]} with arr[${j + 1}] = ${array[j + 1]}`,
        highlightCode: [2, 3],
      });

      if (array[j] > array[j + 1]) {
        // Swapping step
        steps.push({
          array: toArrayElements(array).map((e, idx) => ({
            ...e,
            state: idx === j || idx === j + 1 ? 'swapping' as const :
                   idx >= n - i ? 'sorted' as const : 'default' as const,
          })),
          swapping: [j, j + 1],
          explanation: `${array[j]} > ${array[j + 1]}, swapping elements`,
          highlightCode: [4],
        });

        // Perform swap
        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        steps.push({
          array: toArrayElements(array).map((e, idx) => ({
            ...e,
            state: idx >= n - i ? 'sorted' as const : 'default' as const,
          })),
          explanation: `Swapped! Array is now: [${array.join(', ')}]`,
        });
      }
    }
  }

  steps.push({
    array: toArrayElements(array).map(e => ({ ...e, state: 'sorted' as const })),
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: `Bubble Sort complete! Sorted array: [${array.join(', ')}]`,
  });

  return steps;
}

/**
 * Selection Sort Algorithm with step tracking
 */
export function selectionSort(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: toArrayElements(array),
    explanation: 'Starting Selection Sort. Will find minimum and place it at the beginning.',
    highlightCode: [0],
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: idx < i ? 'sorted' as const :
               idx === i ? 'pivot' as const : 'default' as const,
      })),
      pivot: i,
      explanation: `Pass ${i + 1}: Finding minimum in unsorted portion. Current min at index ${minIdx} = ${array[minIdx]}`,
      highlightCode: [1, 2],
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx < i ? 'sorted' as const :
                 idx === minIdx ? 'pivot' as const :
                 idx === j ? 'comparing' as const : 'default' as const,
        })),
        comparing: [j],
        pivot: minIdx,
        explanation: `Comparing arr[${j}] = ${array[j]} with current min arr[${minIdx}] = ${array[minIdx]}`,
        highlightCode: [3, 4],
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push({
          array: toArrayElements(array).map((e, idx) => ({
            ...e,
            state: idx < i ? 'sorted' as const :
                   idx === minIdx ? 'pivot' as const : 'default' as const,
          })),
          pivot: minIdx,
          explanation: `Found new minimum! minIdx updated to ${minIdx} (value = ${array[minIdx]})`,
          highlightCode: [5],
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx < i ? 'sorted' as const :
                 idx === i || idx === minIdx ? 'swapping' as const : 'default' as const,
        })),
        swapping: [i, minIdx],
        explanation: `Swapping arr[${i}] = ${array[i]} with arr[${minIdx}] = ${array[minIdx]}`,
        highlightCode: [6],
      });

      [array[i], array[minIdx]] = [array[minIdx], array[i]];
    }

    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: idx <= i ? 'sorted' as const : 'default' as const,
      })),
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      explanation: `Position ${i} is now sorted with value ${array[i]}`,
    });
  }

  steps.push({
    array: toArrayElements(array).map(e => ({ ...e, state: 'sorted' as const })),
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: `Selection Sort complete! Sorted array: [${array.join(', ')}]`,
  });

  return steps;
}

/**
 * Quick Sort Algorithm with step tracking
 */
export function quickSort(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const array = [...arr];
  const sortedIndices = new Set<number>();
  
  steps.push({
    array: toArrayElements(array),
    explanation: 'Starting Quick Sort. Will pick pivot and partition array around it.',
    highlightCode: [0],
  });

  function partition(low: number, high: number): number {
    const pivot = array[high];
    
    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: sortedIndices.has(idx) ? 'sorted' as const :
               idx === high ? 'pivot' as const :
               idx >= low && idx < high ? 'comparing' as const : 'default' as const,
      })),
      pivot: high,
      left: low,
      right: high,
      explanation: `Partitioning [${low}...${high}]. Pivot = ${pivot} (at index ${high})`,
      highlightCode: [2],
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: sortedIndices.has(idx) ? 'sorted' as const :
                 idx === high ? 'pivot' as const :
                 idx === j ? 'comparing' as const :
                 idx <= i && idx >= low ? 'left-pointer' as const : 'default' as const,
        })),
        comparing: [j],
        pivot: high,
        leftPointer: i,
        explanation: `Comparing arr[${j}] = ${array[j]} with pivot ${pivot}`,
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          steps.push({
            array: toArrayElements(array).map((e, idx) => ({
              ...e,
              state: sortedIndices.has(idx) ? 'sorted' as const :
                     idx === high ? 'pivot' as const :
                     idx === i || idx === j ? 'swapping' as const : 'default' as const,
            })),
            swapping: [i, j],
            pivot: high,
            explanation: `${array[j]} < ${pivot}, swapping arr[${i}] with arr[${j}]`,
          });
          [array[i], array[j]] = [array[j], array[i]];
        } else {
          steps.push({
            array: toArrayElements(array).map((e, idx) => ({
              ...e,
              state: sortedIndices.has(idx) ? 'sorted' as const :
                     idx === high ? 'pivot' as const :
                     idx === i ? 'left-pointer' as const : 'default' as const,
            })),
            pivot: high,
            leftPointer: i,
            explanation: `${array[j]} < ${pivot}, increment i to ${i}`,
          });
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: sortedIndices.has(idx) ? 'sorted' as const :
                 idx === i + 1 || idx === high ? 'swapping' as const : 'default' as const,
        })),
        swapping: [i + 1, high],
        explanation: `Placing pivot at correct position. Swapping arr[${i + 1}] with arr[${high}]`,
      });
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
    }

    const pivotPos = i + 1;
    sortedIndices.add(pivotPos);

    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: sortedIndices.has(idx) ? 'sorted' as const : 'default' as const,
      })),
      sorted: Array.from(sortedIndices),
      explanation: `Pivot ${array[pivotPos]} is now at its final position (index ${pivotPos})`,
    });

    return pivotPos;
  }

  function quickSortRecursive(low: number, high: number): void {
    if (low < high) {
      const pi = partition(low, high);
      quickSortRecursive(low, pi - 1);
      quickSortRecursive(pi + 1, high);
    } else if (low === high && !sortedIndices.has(low)) {
      sortedIndices.add(low);
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: sortedIndices.has(idx) ? 'sorted' as const : 'default' as const,
        })),
        sorted: Array.from(sortedIndices),
        explanation: `Single element at index ${low} is sorted by default`,
      });
    }
  }

  quickSortRecursive(0, array.length - 1);

  steps.push({
    array: toArrayElements(array).map(e => ({ ...e, state: 'sorted' as const })),
    sorted: Array.from({ length: array.length }, (_, i) => i),
    explanation: `Quick Sort complete! Sorted array: [${array.join(', ')}]`,
  });

  return steps;
}

/**
 * Merge Sort Algorithm with step tracking
 */
export function mergeSort(arr: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const array = [...arr];
  const n = array.length;
  
  steps.push({
    array: toArrayElements(array),
    explanation: 'Starting Merge Sort. Will divide array and merge sorted halves.',
    highlightCode: [0],
  });

  function merge(left: number, mid: number, right: number): void {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: idx >= left && idx <= mid ? 'left-pointer' as const :
               idx > mid && idx <= right ? 'right-pointer' as const : 'default' as const,
      })),
      left,
      right,
      mergeLeft: leftArr,
      mergeRight: rightArr,
      explanation: `Merging [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      highlightCode: [5],
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx === k ? 'merging' as const :
                 idx >= left && idx <= right ? 'comparing' as const : 'default' as const,
        })),
        comparing: [k],
        explanation: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      k++;

      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx >= left && idx < k ? 'merging' as const : 'default' as const,
        })),
        explanation: `Placed ${array[k - 1]} at position ${k - 1}`,
      });
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      j++;
      k++;
    }

    steps.push({
      array: toArrayElements(array).map((e, idx) => ({
        ...e,
        state: idx >= left && idx <= right ? 'sorted' as const : 'default' as const,
      })),
      explanation: `Merged portion [${left}...${right}]: [${array.slice(left, right + 1).join(', ')}]`,
    });
  }

  function mergeSortRecursive(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        array: toArrayElements(array).map((e, idx) => ({
          ...e,
          state: idx >= left && idx <= mid ? 'left-pointer' as const :
                 idx > mid && idx <= right ? 'right-pointer' as const : 'default' as const,
        })),
        left,
        right,
        explanation: `Dividing [${left}...${right}] at mid = ${mid}`,
        highlightCode: [1, 2],
      });

      mergeSortRecursive(left, mid);
      mergeSortRecursive(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortRecursive(0, n - 1);

  steps.push({
    array: toArrayElements(array).map(e => ({ ...e, state: 'sorted' as const })),
    sorted: Array.from({ length: n }, (_, i) => i),
    explanation: `Merge Sort complete! Sorted array: [${array.join(', ')}]`,
  });

  return steps;
}

/**
 * Two-Pointer Technique with step tracking (finding pair with target sum)
 */
export function twoPointer(arr: number[], target: number): ArrayStep[] {
  const steps: ArrayStep[] = [];
  const sortedArr = [...arr].sort((a, b) => a - b);
  const elements = toArrayElements(sortedArr);
  
  steps.push({
    array: elements.map(e => ({ ...e })),
    explanation: `Starting Two-Pointer technique. Finding pairs that sum to ${target}. Array is sorted.`,
    highlightCode: [0],
  });

  let left = 0;
  let right = sortedArr.length - 1;

  steps.push({
    array: elements.map((e, idx) => ({
      ...e,
      state: idx === left ? 'left-pointer' as const :
             idx === right ? 'right-pointer' as const : 'default' as const,
    })),
    leftPointer: left,
    rightPointer: right,
    explanation: `Initialize left = ${left} (value ${sortedArr[left]}), right = ${right} (value ${sortedArr[right]})`,
    highlightCode: [1],
  });

  while (left < right) {
    const sum = sortedArr[left] + sortedArr[right];

    steps.push({
      array: elements.map((e, idx) => ({
        ...e,
        state: idx === left ? 'left-pointer' as const :
               idx === right ? 'right-pointer' as const : 'default' as const,
      })),
      leftPointer: left,
      rightPointer: right,
      comparing: [left, right],
      explanation: `Sum = arr[${left}] + arr[${right}] = ${sortedArr[left]} + ${sortedArr[right]} = ${sum}`,
      highlightCode: [2, 3],
    });

    if (sum === target) {
      steps.push({
        array: elements.map((e, idx) => ({
          ...e,
          state: idx === left || idx === right ? 'found' as const : 'default' as const,
        })),
        found: left,
        leftPointer: left,
        rightPointer: right,
        explanation: `Found pair! ${sortedArr[left]} + ${sortedArr[right]} = ${target} 🎉`,
        highlightCode: [4, 5],
      });
      return steps;
    } else if (sum < target) {
      steps.push({
        array: elements.map((e, idx) => ({
          ...e,
          state: idx === left + 1 ? 'left-pointer' as const :
                 idx === right ? 'right-pointer' as const : 
                 idx === left ? 'sorted' as const : 'default' as const,
        })),
        leftPointer: left + 1,
        rightPointer: right,
        explanation: `Sum ${sum} < target ${target}. Move left pointer right to increase sum.`,
        highlightCode: [6, 7],
      });
      left++;
    } else {
      steps.push({
        array: elements.map((e, idx) => ({
          ...e,
          state: idx === left ? 'left-pointer' as const :
                 idx === right - 1 ? 'right-pointer' as const : 
                 idx === right ? 'sorted' as const : 'default' as const,
        })),
        leftPointer: left,
        rightPointer: right - 1,
        explanation: `Sum ${sum} > target ${target}. Move right pointer left to decrease sum.`,
        highlightCode: [8, 9],
      });
      right--;
    }
  }

  steps.push({
    array: elements.map(e => ({ ...e, state: 'default' as const })),
    explanation: `No pair found that sums to ${target}.`,
    highlightCode: [10],
  });

  return steps;
}
