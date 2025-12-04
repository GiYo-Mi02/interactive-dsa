// Algorithm Sandbox types

export type SupportedLanguage = 'java' | 'csharp' | 'python';

export type AlgorithmTemplate = 
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'binary-search'
  | 'linear-search'
  | 'linked-list'
  | 'binary-tree'
  | 'graph-bfs'
  | 'graph-dfs'
  | 'dijkstra'
  | 'hash-table'
  | 'custom';

export type HintLevel = 'light' | 'medium' | 'full';
export type DifficultyMode = 'basic' | 'detailed' | 'technical';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: string;
}

export interface CodeTemplate {
  name: string;
  description: string;
  languages: {
    java: string;
    csharp: string;
    python: string;
  };
  testInput?: string;
  expectedOutput?: string;
}

export interface AITutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'hint' | 'explanation' | 'error' | 'quiz' | 'general';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: DifficultyMode;
}

export const LANGUAGE_CONFIG: Record<SupportedLanguage, {
  name: string;
  extension: string;
  pistonId: string;
  version: string;
  monacoLanguage: string;
}> = {
  java: {
    name: 'Java',
    extension: '.java',
    pistonId: 'java',
    version: '15.0.2',
    monacoLanguage: 'java',
  },
  csharp: {
    name: 'C#',
    extension: '.cs',
    pistonId: 'csharp',
    version: '6.12.0',
    monacoLanguage: 'csharp',
  },
  python: {
    name: 'Python',
    extension: '.py',
    pistonId: 'python',
    version: '3.10.0',
    monacoLanguage: 'python',
  },
};

export const ALGORITHM_TEMPLATES: Record<AlgorithmTemplate, CodeTemplate> = {
  'bubble-sort': {
    name: 'Bubble Sort',
    description: 'Simple sorting algorithm that repeatedly swaps adjacent elements if they are in wrong order.',
    languages: {
      java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Original array:");
        printArray(arr);
        
        bubbleSort(arr);
        
        System.out.println("Sorted array:");
        printArray(arr);
    }

    public static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      csharp: `using System;

class BubbleSort {
    static void Sort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    static void PrintArray(int[] arr) {
        foreach (int num in arr) {
            Console.Write(num + " ");
        }
        Console.WriteLine();
    }

    static void Main() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        Console.WriteLine("Original array:");
        PrintArray(arr);
        
        Sort(arr);
        
        Console.WriteLine("Sorted array:");
        PrintArray(arr);
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap arr[j] and arr[j+1]
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the algorithm
arr = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", arr)

bubble_sort(arr)

print("Sorted array:", arr)`,
    },
    testInput: '64, 34, 25, 12, 22, 11, 90',
    expectedOutput: '11 12 22 25 34 64 90',
  },
  'selection-sort': {
    name: 'Selection Sort',
    description: 'Sorts by repeatedly finding the minimum element and placing it at the beginning.',
    languages: {
      java: `public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // Swap arr[i] and arr[minIdx]
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 25, 12, 22, 11};
        System.out.println("Original array:");
        for (int num : arr) System.out.print(num + " ");
        System.out.println();
        
        selectionSort(arr);
        
        System.out.println("Sorted array:");
        for (int num : arr) System.out.print(num + " ");
    }
}`,
      csharp: `using System;

class SelectionSort {
    static void Sort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            // Swap
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }

    static void Main() {
        int[] arr = {64, 25, 12, 22, 11};
        Console.WriteLine("Original: " + string.Join(" ", arr));
        Sort(arr);
        Console.WriteLine("Sorted: " + string.Join(" ", arr));
    }
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr = [64, 25, 12, 22, 11]
print("Original:", arr)
selection_sort(arr)
print("Sorted:", arr)`,
    },
  },
  'insertion-sort': {
    name: 'Insertion Sort',
    description: 'Builds sorted array one element at a time by inserting each element in its correct position.',
    languages: {
      java: `public class InsertionSort {
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6};
        System.out.println("Original: ");
        for (int num : arr) System.out.print(num + " ");
        
        insertionSort(arr);
        
        System.out.println("\\nSorted: ");
        for (int num : arr) System.out.print(num + " ");
    }
}`,
      csharp: `using System;

class InsertionSort {
    static void Sort(int[] arr) {
        for (int i = 1; i < arr.Length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    static void Main() {
        int[] arr = {12, 11, 13, 5, 6};
        Console.WriteLine("Original: " + string.Join(" ", arr));
        Sort(arr);
        Console.WriteLine("Sorted: " + string.Join(" ", arr));
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

arr = [12, 11, 13, 5, 6]
print("Original:", arr)
insertion_sort(arr)
print("Sorted:", arr)`,
    },
  },
  'merge-sort': {
    name: 'Merge Sort',
    description: 'Divide and conquer algorithm that divides array, sorts halves, and merges them.',
    languages: {
      java: `public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    public static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        int[] L = new int[n1];
        int[] R = new int[n2];

        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        System.out.println("Original: ");
        for (int num : arr) System.out.print(num + " ");
        
        mergeSort(arr, 0, arr.length - 1);
        
        System.out.println("\\nSorted: ");
        for (int num : arr) System.out.print(num + " ");
    }
}`,
      csharp: `using System;

class MergeSort {
    static void Sort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            Sort(arr, left, mid);
            Sort(arr, mid + 1, right);
            Merge(arr, left, mid, right);
        }
    }

    static void Merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1, n2 = right - mid;
        int[] L = new int[n1], R = new int[n2];
        Array.Copy(arr, left, L, 0, n1);
        Array.Copy(arr, mid + 1, R, 0, n2);

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2)
            arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    static void Main() {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        Console.WriteLine("Original: " + string.Join(" ", arr));
        Sort(arr, 0, arr.Length - 1);
        Console.WriteLine("Sorted: " + string.Join(" ", arr));
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L, R = arr[:mid], arr[mid:]
        merge_sort(L)
        merge_sort(R)
        
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

arr = [38, 27, 43, 3, 9, 82, 10]
print("Original:", arr)
merge_sort(arr)
print("Sorted:", arr)`,
    },
  },
  'quick-sort': {
    name: 'Quick Sort',
    description: 'Efficient divide and conquer algorithm using pivot partitioning.',
    languages: {
      java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 7, 8, 9, 1, 5};
        System.out.println("Original: ");
        for (int num : arr) System.out.print(num + " ");
        
        quickSort(arr, 0, arr.length - 1);
        
        System.out.println("\\nSorted: ");
        for (int num : arr) System.out.print(num + " ");
    }
}`,
      csharp: `using System;

class QuickSort {
    static void Sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = Partition(arr, low, high);
            Sort(arr, low, pi - 1);
            Sort(arr, pi + 1, high);
        }
    }

    static int Partition(int[] arr, int low, int high) {
        int pivot = arr[high], i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                (arr[i], arr[j]) = (arr[j], arr[i]);
            }
        }
        (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);
        return i + 1;
    }

    static void Main() {
        int[] arr = {10, 7, 8, 9, 1, 5};
        Console.WriteLine("Original: " + string.Join(" ", arr));
        Sort(arr, 0, arr.Length - 1);
        Console.WriteLine("Sorted: " + string.Join(" ", arr));
    }
}`,
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

arr = [10, 7, 8, 9, 1, 5]
print("Original:", arr)
quick_sort(arr, 0, len(arr) - 1)
print("Sorted:", arr)`,
    },
  },
  'binary-search': {
    name: 'Binary Search',
    description: 'Efficient search algorithm that finds target by repeatedly dividing search space in half.',
    languages: {
      java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 4, 10, 40, 50, 60};
        int target = 10;
        
        int result = binarySearch(arr, target);
        
        if (result != -1)
            System.out.println("Element " + target + " found at index " + result);
        else
            System.out.println("Element not found");
    }
}`,
      csharp: `using System;

class BinarySearch {
    static int Search(int[] arr, int target) {
        int left = 0, right = arr.Length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    static void Main() {
        int[] arr = {2, 3, 4, 10, 40, 50, 60};
        int target = 10;
        int result = Search(arr, target);
        Console.WriteLine(result != -1 
            ? $"Element {target} found at index {result}"
            : "Element not found");
    }
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [2, 3, 4, 10, 40, 50, 60]
target = 10
result = binary_search(arr, target)
print(f"Element {target} found at index {result}" if result != -1 else "Element not found")`,
    },
  },
  'linear-search': {
    name: 'Linear Search',
    description: 'Simple search algorithm that checks each element sequentially.',
    languages: {
      java: `public class LinearSearch {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 80, 30, 60, 50, 110};
        int target = 30;
        int result = linearSearch(arr, target);
        System.out.println(result != -1 
            ? "Element found at index " + result 
            : "Element not found");
    }
}`,
      csharp: `using System;

class LinearSearch {
    static int Search(int[] arr, int target) {
        for (int i = 0; i < arr.Length; i++)
            if (arr[i] == target) return i;
        return -1;
    }

    static void Main() {
        int[] arr = {10, 20, 80, 30, 60, 50, 110};
        int target = 30;
        int result = Search(arr, target);
        Console.WriteLine(result != -1 
            ? $"Element found at index {result}" 
            : "Element not found");
    }
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

arr = [10, 20, 80, 30, 60, 50, 110]
target = 30
result = linear_search(arr, target)
print(f"Element found at index {result}" if result != -1 else "Element not found")`,
    },
  },
  'linked-list': {
    name: 'Linked List Operations',
    description: 'Basic linked list implementation with insert, delete, and traversal.',
    languages: {
      java: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

public class LinkedList {
    Node head;

    public void insertAtEnd(int data) {
        Node newNode = new Node(data);
        if (head == null) { head = newNode; return; }
        Node temp = head;
        while (temp.next != null) temp = temp.next;
        temp.next = newNode;
    }

    public void printList() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " -> ");
            temp = temp.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        list.insertAtEnd(1);
        list.insertAtEnd(2);
        list.insertAtEnd(3);
        list.insertAtEnd(4);
        System.out.println("Linked List:");
        list.printList();
    }
}`,
      csharp: `using System;

class Node {
    public int Data;
    public Node Next;
    public Node(int d) { Data = d; Next = null; }
}

class LinkedList {
    Node head;

    public void InsertAtEnd(int data) {
        Node newNode = new Node(data);
        if (head == null) { head = newNode; return; }
        Node temp = head;
        while (temp.Next != null) temp = temp.Next;
        temp.Next = newNode;
    }

    public void PrintList() {
        Node temp = head;
        while (temp != null) {
            Console.Write(temp.Data + " -> ");
            temp = temp.Next;
        }
        Console.WriteLine("null");
    }

    static void Main() {
        LinkedList list = new LinkedList();
        list.InsertAtEnd(1);
        list.InsertAtEnd(2);
        list.InsertAtEnd(3);
        list.InsertAtEnd(4);
        Console.WriteLine("Linked List:");
        list.PrintList();
    }
}`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_end(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node

    def print_list(self):
        temp = self.head
        while temp:
            print(f"{temp.data} -> ", end="")
            temp = temp.next
        print("null")

# Test
ll = LinkedList()
ll.insert_at_end(1)
ll.insert_at_end(2)
ll.insert_at_end(3)
ll.insert_at_end(4)
print("Linked List:")
ll.print_list()`,
    },
  },
  'binary-tree': {
    name: 'Binary Search Tree',
    description: 'BST implementation with insert and inorder traversal.',
    languages: {
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { val = v; left = right = null; }
}

public class BinaryTree {
    TreeNode root;

    void insert(int val) {
        root = insertRec(root, val);
    }

    TreeNode insertRec(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insertRec(root.left, val);
        else if (val > root.val) root.right = insertRec(root.right, val);
        return root;
    }

    void inorder(TreeNode root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.val + " ");
            inorder(root.right);
        }
    }

    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        for (int v : values) tree.insert(v);
        System.out.println("Inorder traversal:");
        tree.inorder(tree.root);
    }
}`,
      csharp: `using System;

class TreeNode {
    public int Val;
    public TreeNode Left, Right;
    public TreeNode(int v) { Val = v; }
}

class BinaryTree {
    TreeNode root;

    public void Insert(int val) {
        root = InsertRec(root, val);
    }

    TreeNode InsertRec(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.Val) root.Left = InsertRec(root.Left, val);
        else if (val > root.Val) root.Right = InsertRec(root.Right, val);
        return root;
    }

    void Inorder(TreeNode root) {
        if (root != null) {
            Inorder(root.Left);
            Console.Write(root.Val + " ");
            Inorder(root.Right);
        }
    }

    static void Main() {
        BinaryTree tree = new BinaryTree();
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        foreach (int v in values) tree.Insert(v);
        Console.WriteLine("Inorder traversal:");
        tree.Inorder(tree.root);
    }
}`,
      python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert_rec(self.root, val)

    def _insert_rec(self, root, val):
        if not root:
            return TreeNode(val)
        if val < root.val:
            root.left = self._insert_rec(root.left, val)
        elif val > root.val:
            root.right = self._insert_rec(root.right, val)
        return root

    def inorder(self, root):
        if root:
            self.inorder(root.left)
            print(root.val, end=" ")
            self.inorder(root.right)

# Test
tree = BinaryTree()
for v in [50, 30, 70, 20, 40, 60, 80]:
    tree.insert(v)
print("Inorder traversal:")
tree.inorder(tree.root)`,
    },
  },
  'graph-bfs': {
    name: 'Graph BFS',
    description: 'Breadth-First Search traversal using a queue.',
    languages: {
      java: `import java.util.*;

public class GraphBFS {
    private Map<Integer, List<Integer>> adj = new HashMap<>();

    void addEdge(int u, int v) {
        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    void bfs(int start) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        
        visited.add(start);
        queue.add(start);
        
        System.out.print("BFS: ");
        while (!queue.isEmpty()) {
            int node = queue.poll();
            System.out.print(node + " ");
            
            for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
    }

    public static void main(String[] args) {
        GraphBFS g = new GraphBFS();
        g.addEdge(0, 1); g.addEdge(0, 2);
        g.addEdge(1, 2); g.addEdge(2, 3);
        g.addEdge(3, 4);
        g.bfs(0);
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

class GraphBFS {
    Dictionary<int, List<int>> adj = new Dictionary<int, List<int>>();

    void AddEdge(int u, int v) {
        if (!adj.ContainsKey(u)) adj[u] = new List<int>();
        if (!adj.ContainsKey(v)) adj[v] = new List<int>();
        adj[u].Add(v);
        adj[v].Add(u);
    }

    void BFS(int start) {
        HashSet<int> visited = new HashSet<int>();
        Queue<int> queue = new Queue<int>();
        
        visited.Add(start);
        queue.Enqueue(start);
        
        Console.Write("BFS: ");
        while (queue.Count > 0) {
            int node = queue.Dequeue();
            Console.Write(node + " ");
            
            foreach (int neighbor in adj.GetValueOrDefault(node, new List<int>())) {
                if (!visited.Contains(neighbor)) {
                    visited.Add(neighbor);
                    queue.Enqueue(neighbor);
                }
            }
        }
    }

    static void Main() {
        GraphBFS g = new GraphBFS();
        g.AddEdge(0, 1); g.AddEdge(0, 2);
        g.AddEdge(1, 2); g.AddEdge(2, 3);
        g.AddEdge(3, 4);
        g.BFS(0);
    }
}`,
      python: `from collections import deque, defaultdict

class Graph:
    def __init__(self):
        self.adj = defaultdict(list)

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)

    def bfs(self, start):
        visited = set([start])
        queue = deque([start])
        result = []
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor in self.adj[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        print("BFS:", " ".join(map(str, result)))

g = Graph()
g.add_edge(0, 1); g.add_edge(0, 2)
g.add_edge(1, 2); g.add_edge(2, 3)
g.add_edge(3, 4)
g.bfs(0)`,
    },
  },
  'graph-dfs': {
    name: 'Graph DFS',
    description: 'Depth-First Search traversal using recursion or stack.',
    languages: {
      java: `import java.util.*;

public class GraphDFS {
    private Map<Integer, List<Integer>> adj = new HashMap<>();

    void addEdge(int u, int v) {
        adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
    }

    void dfs(int node, Set<Integer> visited) {
        visited.add(node);
        System.out.print(node + " ");
        
        for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                dfs(neighbor, visited);
            }
        }
    }

    public static void main(String[] args) {
        GraphDFS g = new GraphDFS();
        g.addEdge(0, 1); g.addEdge(0, 2);
        g.addEdge(1, 2); g.addEdge(2, 3);
        g.addEdge(3, 4);
        System.out.print("DFS: ");
        g.dfs(0, new HashSet<>());
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

class GraphDFS {
    Dictionary<int, List<int>> adj = new Dictionary<int, List<int>>();

    void AddEdge(int u, int v) {
        if (!adj.ContainsKey(u)) adj[u] = new List<int>();
        if (!adj.ContainsKey(v)) adj[v] = new List<int>();
        adj[u].Add(v);
        adj[v].Add(u);
    }

    void DFS(int node, HashSet<int> visited) {
        visited.Add(node);
        Console.Write(node + " ");
        
        foreach (int neighbor in adj.GetValueOrDefault(node, new List<int>())) {
            if (!visited.Contains(neighbor)) {
                DFS(neighbor, visited);
            }
        }
    }

    static void Main() {
        GraphDFS g = new GraphDFS();
        g.AddEdge(0, 1); g.AddEdge(0, 2);
        g.AddEdge(1, 2); g.AddEdge(2, 3);
        g.AddEdge(3, 4);
        Console.Write("DFS: ");
        g.DFS(0, new HashSet<int>());
    }
}`,
      python: `from collections import defaultdict

class Graph:
    def __init__(self):
        self.adj = defaultdict(list)

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)

    def dfs(self, node, visited=None):
        if visited is None:
            visited = set()
        visited.add(node)
        print(node, end=" ")
        
        for neighbor in self.adj[node]:
            if neighbor not in visited:
                self.dfs(neighbor, visited)

g = Graph()
g.add_edge(0, 1); g.add_edge(0, 2)
g.add_edge(1, 2); g.add_edge(2, 3)
g.add_edge(3, 4)
print("DFS:", end=" ")
g.dfs(0)`,
    },
  },
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    description: 'Finds shortest paths from source to all vertices in weighted graph.',
    languages: {
      java: `import java.util.*;

public class Dijkstra {
    public static void dijkstra(int[][] graph, int src) {
        int n = graph.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        pq.add(new int[]{src, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            if (visited[u]) continue;
            visited[u] = true;

            for (int v = 0; v < n; v++) {
                if (graph[u][v] > 0 && !visited[v]) {
                    int newDist = dist[u] + graph[u][v];
                    if (newDist < dist[v]) {
                        dist[v] = newDist;
                        pq.add(new int[]{v, dist[v]});
                    }
                }
            }
        }

        System.out.println("Shortest distances from node " + src + ":");
        for (int i = 0; i < n; i++)
            System.out.println("To " + i + ": " + dist[i]);
    }

    public static void main(String[] args) {
        int[][] graph = {
            {0, 4, 0, 0, 0, 0, 0, 8, 0},
            {4, 0, 8, 0, 0, 0, 0, 11, 0},
            {0, 8, 0, 7, 0, 4, 0, 0, 2},
            {0, 0, 7, 0, 9, 14, 0, 0, 0},
            {0, 0, 0, 9, 0, 10, 0, 0, 0},
            {0, 0, 4, 14, 10, 0, 2, 0, 0},
            {0, 0, 0, 0, 0, 2, 0, 1, 6},
            {8, 11, 0, 0, 0, 0, 1, 0, 7},
            {0, 0, 2, 0, 0, 0, 6, 7, 0}
        };
        dijkstra(graph, 0);
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

class Dijkstra {
    static void FindShortestPaths(int[,] graph, int src) {
        int n = graph.GetLength(0);
        int[] dist = new int[n];
        bool[] visited = new bool[n];
        
        for (int i = 0; i < n; i++) dist[i] = int.MaxValue;
        dist[src] = 0;

        var pq = new SortedSet<(int dist, int node)>();
        pq.Add((0, src));

        while (pq.Count > 0) {
            var (d, u) = pq.Min;
            pq.Remove(pq.Min);
            if (visited[u]) continue;
            visited[u] = true;

            for (int v = 0; v < n; v++) {
                if (graph[u, v] > 0 && !visited[v]) {
                    int newDist = dist[u] + graph[u, v];
                    if (newDist < dist[v]) {
                        dist[v] = newDist;
                        pq.Add((dist[v], v));
                    }
                }
            }
        }

        Console.WriteLine($"Shortest distances from node {src}:");
        for (int i = 0; i < n; i++)
            Console.WriteLine($"To {i}: {dist[i]}");
    }

    static void Main() {
        int[,] graph = {
            {0, 4, 0, 0, 8},
            {4, 0, 8, 0, 11},
            {0, 8, 0, 7, 4},
            {0, 0, 7, 0, 9},
            {8, 11, 4, 9, 0}
        };
        FindShortestPaths(graph, 0);
    }
}`,
      python: `import heapq

def dijkstra(graph, src):
    n = len(graph)
    dist = [float('inf')] * n
    dist[src] = 0
    visited = set()
    pq = [(0, src)]  # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)

        for v in range(n):
            if graph[u][v] > 0 and v not in visited:
                new_dist = dist[u] + graph[u][v]
                if new_dist < dist[v]:
                    dist[v] = new_dist
                    heapq.heappush(pq, (dist[v], v))

    print(f"Shortest distances from node {src}:")
    for i in range(n):
        print(f"To {i}: {dist[i]}")

graph = [
    [0, 4, 0, 0, 8],
    [4, 0, 8, 0, 11],
    [0, 8, 0, 7, 4],
    [0, 0, 7, 0, 9],
    [8, 11, 4, 9, 0]
]
dijkstra(graph, 0)`,
    },
  },
  'hash-table': {
    name: 'Hash Table',
    description: 'Hash table implementation with simple hash function and collision handling.',
    languages: {
      java: `import java.util.*;

public class HashTable {
    private int size = 10;
    private LinkedList<int[]>[] table;

    @SuppressWarnings("unchecked")
    public HashTable() {
        table = new LinkedList[size];
        for (int i = 0; i < size; i++)
            table[i] = new LinkedList<>();
    }

    private int hash(int key) {
        return key % size;
    }

    public void put(int key, int value) {
        int idx = hash(key);
        for (int[] pair : table[idx]) {
            if (pair[0] == key) { pair[1] = value; return; }
        }
        table[idx].add(new int[]{key, value});
        System.out.println("Inserted (" + key + ", " + value + ") at index " + idx);
    }

    public Integer get(int key) {
        int idx = hash(key);
        for (int[] pair : table[idx]) {
            if (pair[0] == key) return pair[1];
        }
        return null;
    }

    public static void main(String[] args) {
        HashTable ht = new HashTable();
        ht.put(1, 100);
        ht.put(11, 200);  // Collision with 1
        ht.put(21, 300);  // Collision
        ht.put(2, 400);
        
        System.out.println("Get 11: " + ht.get(11));
        System.out.println("Get 21: " + ht.get(21));
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

class HashTable {
    private int size = 10;
    private List<(int key, int value)>[] table;

    public HashTable() {
        table = new List<(int, int)>[size];
        for (int i = 0; i < size; i++)
            table[i] = new List<(int, int)>();
    }

    private int Hash(int key) => key % size;

    public void Put(int key, int value) {
        int idx = Hash(key);
        for (int i = 0; i < table[idx].Count; i++) {
            if (table[idx][i].key == key) {
                table[idx][i] = (key, value);
                return;
            }
        }
        table[idx].Add((key, value));
        Console.WriteLine($"Inserted ({key}, {value}) at index {idx}");
    }

    public int? Get(int key) {
        int idx = Hash(key);
        foreach (var pair in table[idx])
            if (pair.key == key) return pair.value;
        return null;
    }

    static void Main() {
        HashTable ht = new HashTable();
        ht.Put(1, 100);
        ht.Put(11, 200);
        ht.Put(21, 300);
        ht.Put(2, 400);
        
        Console.WriteLine("Get 11: " + ht.Get(11));
        Console.WriteLine("Get 21: " + ht.Get(21));
    }
}`,
      python: `class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return key % self.size

    def put(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.table[idx]):
            if k == key:
                self.table[idx][i] = (key, value)
                return
        self.table[idx].append((key, value))
        print(f"Inserted ({key}, {value}) at index {idx}")

    def get(self, key):
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key:
                return v
        return None

ht = HashTable()
ht.put(1, 100)
ht.put(11, 200)  # Collision
ht.put(21, 300)  # Collision
ht.put(2, 400)

print("Get 11:", ht.get(11))
print("Get 21:", ht.get(21))`,
    },
  },
  'custom': {
    name: 'Custom Code',
    description: 'Write your own algorithm from scratch.',
    languages: {
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, World!");
    }
}`,
      csharp: `using System;

class Program {
    static void Main() {
        // Write your code here
        Console.WriteLine("Hello, World!");
    }
}`,
      python: `# Write your code here
print("Hello, World!")`,
    },
  },
};
