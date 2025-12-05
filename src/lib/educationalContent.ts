import { AlgorithmInfo } from '@/components/AlgorithmEducationPanel';
import { TourStep } from '@/components/OnboardingTour';

// ==========================================
// GRAPH ALGORITHMS
// ==========================================

export const DIJKSTRA_INFO: AlgorithmInfo = {
  name: "Dijkstra's Algorithm",
  category: "Graph / Shortest Path",
  definition: "Dijkstra's algorithm is a greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It maintains a set of visited nodes and repeatedly selects the unvisited node with the smallest known distance.",
  howItWorks: [
    "Start at the source node and set its distance to 0, all others to infinity",
    "Mark all nodes as unvisited. Create a priority queue of all nodes",
    "Select the unvisited node with the smallest distance (initially the source)",
    "For each unvisited neighbor, calculate the distance through the current node",
    "If this distance is less than the known distance, update it",
    "Mark the current node as visited and repeat from step 3",
    "Stop when the destination is reached or all nodes are visited"
  ],
  timeComplexity: {
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O(V²)"
  },
  spaceComplexity: "O(V)",
  realLifeAnalogy: {
    title: "Like a GPS Navigation System! 🗺️",
    description: "Imagine you're using Google Maps to find the fastest route from your home to school. The GPS doesn't just pick a random road—it systematically checks all possible routes, always exploring the currently shortest path first, until it finds the quickest way to your destination.",
    steps: [
      "You start at home (distance = 0). All other locations have unknown distances (infinity)",
      "GPS checks all roads from your current location and calculates travel times",
      "It picks the nearest unvisited location and moves there",
      "From this new location, it checks if going through here creates shorter paths to other places",
      "Repeat until you reach your destination with the guaranteed shortest path!"
    ]
  },
  useCases: [
    "GPS navigation and mapping applications (Google Maps, Waze)",
    "Network routing protocols (OSPF) to find optimal data paths",
    "Social networks for finding degrees of separation",
    "Video games for AI pathfinding (enemies finding player)",
    "Airline route optimization and flight planning"
  ],
  pros: [
    "Guarantees the shortest path",
    "Works well with sparse graphs",
    "Can find paths to all nodes from source"
  ],
  cons: [
    "Doesn't work with negative edge weights",
    "Can be slow for very dense graphs",
    "Requires all edges to be known upfront"
  ],
  funFact: "Created by Edsger W. Dijkstra in 1956 in just 20 minutes while having coffee! He was thinking about how to demonstrate the power of computing to non-programmers."
};

// ==========================================
// ARRAY ALGORITHMS
// ==========================================

export const LINEAR_SEARCH_INFO: AlgorithmInfo = {
  name: "Linear Search",
  category: "Searching Algorithm",
  definition: "Linear search is the simplest searching algorithm that checks every element in a list sequentially until the target element is found or the list ends. It works on both sorted and unsorted arrays.",
  howItWorks: [
    "Start from the first element of the array",
    "Compare the current element with the target value",
    "If they match, return the current position",
    "If not, move to the next element",
    "Repeat until found or end of array is reached"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Finding Your Keys in Your Bag! 🔑",
    description: "Imagine you're looking for your keys in a messy bag. You reach in and check each item one by one: phone? No. Wallet? No. Pen? No. Keys? Yes! You don't skip items or use any special strategy—you just check everything until you find what you're looking for.",
    steps: [
      "Reach into your bag and grab the first item",
      "Is it your keys? If yes, you're done!",
      "If not, put it aside and grab the next item",
      "Keep going until you find your keys or empty the bag",
      "If the bag is empty and no keys, they're not in there!"
    ]
  },
  useCases: [
    "Searching in small, unsorted datasets",
    "Finding items in linked lists (no random access)",
    "Situations where data changes frequently",
    "When simplicity is more important than speed"
  ],
  pros: [
    "Simple to understand and implement",
    "Works on unsorted data",
    "No extra memory needed",
    "Works on any data structure"
  ],
  cons: [
    "Slow for large datasets",
    "Checks every element in worst case",
    "Not efficient when data is sorted"
  ],
  funFact: "Despite being 'slow', linear search is often the fastest choice for small arrays (< 10 elements) because it has no setup overhead!"
};

export const BINARY_SEARCH_INFO: AlgorithmInfo = {
  name: "Binary Search",
  category: "Searching Algorithm",
  definition: "Binary search is an efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half. It compares the target with the middle element and eliminates half of the remaining elements in each step.",
  howItWorks: [
    "Ensure the array is sorted (required!)",
    "Set two pointers: left at start, right at end",
    "Find the middle element: mid = (left + right) / 2",
    "If middle element equals target, we found it!",
    "If target is smaller, search the left half (right = mid - 1)",
    "If target is larger, search the right half (left = mid + 1)",
    "Repeat until found or left > right (not found)"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Finding a Word in a Dictionary! 📖",
    description: "When you look up a word in a physical dictionary, you don't start from page 1. If you're looking for 'Python', you open to the middle, see 'M', know 'P' comes after, so you go to the right half. Then middle of that half, and so on. You eliminate half the pages with each look!",
    steps: [
      "Open the dictionary to the middle page",
      "Check if your word would be before or after this page",
      "If before, focus on the left half; if after, focus on the right half",
      "Open to the middle of your new section",
      "Repeat until you find your word or narrow down to one page"
    ]
  },
  useCases: [
    "Database indexing and searching",
    "Finding entries in sorted log files",
    "Autocomplete and spell-check systems",
    "Version control systems (git bisect for finding bugs)",
    "Searching in any large sorted dataset"
  ],
  pros: [
    "Extremely fast - O(log n)",
    "Eliminates half the data each step",
    "Efficient for large datasets"
  ],
  cons: [
    "Requires sorted data",
    "Only works with random access (arrays)",
    "Sorting cost may outweigh benefits for one-time searches"
  ],
  funFact: "In a phonebook of 1 million names, binary search finds any name in at most 20 comparisons, while linear search might need 1 million!"
};

export const BUBBLE_SORT_INFO: AlgorithmInfo = {
  name: "Bubble Sort",
  category: "Sorting Algorithm",
  definition: "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order. The largest elements 'bubble up' to the end of the list with each pass.",
  howItWorks: [
    "Start at the beginning of the array",
    "Compare the first two adjacent elements",
    "If the first is greater than the second, swap them",
    "Move to the next pair and repeat",
    "After one pass, the largest element is at the end",
    "Repeat the process for the remaining unsorted portion",
    "Continue until no swaps are needed (array is sorted)"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Bubbles Rising in Soda! 🥤",
    description: "Imagine a glass of soda where bigger bubbles rise faster than smaller ones. In bubble sort, larger numbers 'bubble up' to the top (end of array) just like big bubbles in a drink rise to the surface. After each pass through the array, the next largest number floats to its correct position!",
    steps: [
      "Compare two adjacent students by height",
      "If the taller one is in front of shorter, they swap places",
      "Move down the line comparing each pair",
      "After one pass, the tallest student is at the end",
      "Repeat, ignoring the already-sorted tall students at the end"
    ]
  },
  useCases: [
    "Educational purposes - easiest sort to understand",
    "Small datasets where simplicity matters",
    "Nearly sorted data (can detect sorted arrays early)",
    "Embedded systems with limited memory"
  ],
  pros: [
    "Very simple to understand and implement",
    "No extra memory needed",
    "Can detect if array is already sorted",
    "Stable sort (maintains relative order of equal elements)"
  ],
  cons: [
    "Very slow for large datasets O(n²)",
    "Makes many unnecessary comparisons",
    "Not practical for real-world large-scale sorting"
  ],
  funFact: "Bubble sort is sometimes called 'sinking sort' because you can also view it as heavy elements sinking to the bottom instead of light ones bubbling up!"
};

export const SELECTION_SORT_INFO: AlgorithmInfo = {
  name: "Selection Sort",
  category: "Sorting Algorithm",
  definition: "Selection sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region by swapping with the first unsorted element.",
  howItWorks: [
    "Start with the entire array as 'unsorted'",
    "Find the minimum element in the unsorted portion",
    "Swap it with the first element of the unsorted portion",
    "Move the boundary between sorted and unsorted one position right",
    "Repeat until the entire array is sorted",
    "The sorted portion grows from left to right"
  ],
  timeComplexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Sorting Playing Cards in Your Hand! 🃏",
    description: "Imagine you're dealt a hand of cards and want to sort them. You look through all your cards, find the lowest one, and move it to the far left. Then you look through the remaining cards, find the next lowest, and place it next to the first. You keep selecting the minimum from what's left!",
    steps: [
      "Look at all cards in your hand",
      "Find the card with the smallest value",
      "Move it to the leftmost position",
      "Now ignore that card and find the smallest among the rest",
      "Place it next to the first card, and repeat!"
    ]
  },
  useCases: [
    "When memory is extremely limited",
    "Small arrays where simplicity matters",
    "When swap operations are expensive (selection sort minimizes swaps)",
    "Educational demonstrations of sorting concepts"
  ],
  pros: [
    "Simple to understand",
    "Minimal memory usage O(1)",
    "Minimizes the number of swaps (only n-1 swaps needed)",
    "Performs well on small arrays"
  ],
  cons: [
    "Always O(n²) even if array is sorted",
    "Slower than other O(n²) sorts in practice",
    "Not stable (may change relative order of equal elements)"
  ],
  funFact: "Selection sort makes exactly n-1 swaps regardless of the input, making it optimal when swapping is expensive (like swapping large objects in memory)!"
};

export const QUICK_SORT_INFO: AlgorithmInfo = {
  name: "Quick Sort",
  category: "Sorting Algorithm",
  definition: "Quick sort is a highly efficient, divide-and-conquer sorting algorithm. It selects a 'pivot' element and partitions the array so that elements smaller than the pivot go to its left, and larger elements go to its right. This process is recursively applied to the sub-arrays.",
  howItWorks: [
    "Choose a pivot element (often the last or random element)",
    "Partition: rearrange so smaller elements are left, larger are right of pivot",
    "After partitioning, the pivot is in its final sorted position",
    "Recursively apply the same process to the left sub-array",
    "Recursively apply the same process to the right sub-array",
    "Base case: arrays of 0 or 1 element are already sorted"
  ],
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)"
  },
  spaceComplexity: "O(log n)",
  realLifeAnalogy: {
    title: "Like Organizing Students by Height! 📏",
    description: "Imagine a teacher organizing students by height. She picks one student as the 'pivot' and tells everyone shorter to go left, everyone taller to go right. Then she does the same for each group separately. Soon, everyone is in height order without comparing everyone to everyone else!",
    steps: [
      "Teacher picks a student (the pivot) to stand in the middle",
      "Students shorter than the pivot move to the left side",
      "Students taller than the pivot move to the right side",
      "The pivot student is now in their correct final position",
      "A helper teacher does the same for the left and right groups"
    ]
  },
  useCases: [
    "General-purpose sorting in programming languages",
    "Database query optimization",
    "Numerical computations and scientific computing",
    "Any scenario needing fast average-case sorting"
  ],
  pros: [
    "Very fast in practice - often fastest sort",
    "In-place sorting (low memory overhead)",
    "Cache-efficient (good locality of reference)",
    "Easily parallelizable"
  ],
  cons: [
    "Worst case O(n²) with bad pivot choices",
    "Not stable",
    "Recursive (can cause stack overflow on huge arrays)"
  ],
  funFact: "Quick sort was invented by Tony Hoare in 1959 while trying to sort words for a machine translation project. He later called it his 'greatest contribution to computer science'!"
};

export const MERGE_SORT_INFO: AlgorithmInfo = {
  name: "Merge Sort",
  category: "Sorting Algorithm",
  definition: "Merge sort is a stable, divide-and-conquer sorting algorithm that divides the array into halves, recursively sorts each half, and then merges the sorted halves back together. It guarantees O(n log n) time complexity in all cases.",
  howItWorks: [
    "Divide the array into two halves",
    "Recursively sort the left half",
    "Recursively sort the right half",
    "Merge the two sorted halves by comparing elements",
    "During merge, always pick the smaller element from either half",
    "Base case: a single element is already sorted"
  ],
  timeComplexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)"
  },
  spaceComplexity: "O(n)",
  realLifeAnalogy: {
    title: "Like Merging Two Sorted Piles of Exams! 📝",
    description: "Imagine a teacher with two already-sorted piles of exams (by score). To combine them into one sorted pile, she looks at the top exam of each pile, picks the one with the lower score, and places it in the new pile. She keeps doing this until both piles are empty. Merge sort does this recursively!",
    steps: [
      "Start with one big unsorted pile of exams",
      "Split it into two equal piles",
      "Have two assistants sort each pile separately (they split further!)",
      "Once both piles are sorted, merge them back together",
      "Always pick the smaller of the two top exams for the merged pile"
    ]
  },
  useCases: [
    "External sorting (sorting data too large for memory)",
    "Linked list sorting (merge sort is optimal for linked lists)",
    "When guaranteed O(n log n) is required",
    "Parallel computing environments"
  ],
  pros: [
    "Guaranteed O(n log n) in all cases",
    "Stable sort (preserves order of equal elements)",
    "Excellent for linked lists",
    "Highly parallelizable"
  ],
  cons: [
    "Requires O(n) extra space",
    "Slower than quick sort in practice for arrays",
    "Not in-place"
  ],
  funFact: "Merge sort was invented by John von Neumann in 1945, making it one of the oldest sorting algorithms still widely used today!"
};

export const TWO_POINTER_INFO: AlgorithmInfo = {
  name: "Two-Pointer Technique",
  category: "Array Algorithm / Pattern",
  definition: "The two-pointer technique uses two pointers that move through an array in a coordinated way. It's commonly used on sorted arrays to find pairs that satisfy certain conditions, like finding two numbers that sum to a target.",
  howItWorks: [
    "Sort the array if not already sorted",
    "Initialize two pointers: one at the start, one at the end",
    "Calculate the sum of elements at both pointers",
    "If sum equals target, we found our pair!",
    "If sum is too small, move left pointer right (need larger number)",
    "If sum is too large, move right pointer left (need smaller number)",
    "Continue until pointers meet or pair is found"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Finding Dance Partners by Height! 💃🕺",
    description: "Imagine arranging dance partners where combined height should be a specific number. Line up all dancers by height. The shortest and tallest try dancing together - if too tall combined, the tallest sits out and the next tallest tries. If too short combined, the shortest sits out. Keep adjusting until perfect match!",
    steps: [
      "Line up all dancers from shortest to tallest",
      "Shortest dancer (left) pairs with tallest dancer (right)",
      "Measure their combined height against the target",
      "Too tall? The tallest dancer steps out, next tallest tries",
      "Too short? The shortest dancer steps out, next shortest tries",
      "Perfect match? They're dance partners!"
    ]
  },
  useCases: [
    "Finding pairs with a target sum (Two Sum problem)",
    "Container with most water problem",
    "Removing duplicates from sorted arrays",
    "Palindrome checking",
    "Merging sorted arrays"
  ],
  pros: [
    "Very efficient O(n) time",
    "Constant space O(1)",
    "Simple and elegant solution",
    "Avoids nested loops"
  ],
  cons: [
    "Usually requires sorted data",
    "Only works for specific problem types",
    "May miss multiple solutions if only looking for one"
  ],
  funFact: "The two-pointer technique is a favorite in coding interviews at top tech companies because it elegantly solves problems that seem to require O(n²) in O(n) time!"
};

// ==========================================
// TREE ALGORITHMS
// ==========================================

export const INORDER_TRAVERSAL_INFO: AlgorithmInfo = {
  name: "In-Order Traversal",
  category: "Tree Traversal",
  definition: "In-order traversal visits nodes in a binary tree in the order: Left subtree → Root → Right subtree. For a Binary Search Tree (BST), this produces nodes in ascending sorted order.",
  howItWorks: [
    "Start at the root of the tree",
    "Recursively traverse the entire left subtree first",
    "Visit (process) the current node",
    "Recursively traverse the entire right subtree",
    "For BST, this visits nodes in ascending order!"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(h) where h is height",
  realLifeAnalogy: {
    title: "Like Reading a Book in Order! 📚",
    description: "Imagine a book where each chapter has sub-chapters (left) before the main content and sub-chapters (right) after. To read in-order, you read all the 'before' sub-chapters first, then the main chapter content, then all the 'after' sub-chapters. This way you read everything in the intended sequence!",
    steps: [
      "Before reading any chapter, read all its 'before' sub-chapters first",
      "Then read the main chapter content",
      "Then read all the 'after' sub-chapters",
      "Apply this rule to every sub-chapter too!",
      "Result: You read everything in perfect order"
    ]
  },
  useCases: [
    "Getting sorted elements from a BST",
    "Expression tree evaluation",
    "Validating if a tree is a valid BST",
    "Creating a sorted list from BST data"
  ],
  pros: [
    "Produces sorted output for BST",
    "Simple recursive implementation",
    "Visits every node exactly once"
  ],
  cons: [
    "Recursive calls use stack space",
    "Order depends on tree structure"
  ],
  funFact: "In-order traversal on a BST is often called 'the natural order' because it gives you elements in sorted sequence automatically!"
};

export const PREORDER_TRAVERSAL_INFO: AlgorithmInfo = {
  name: "Pre-Order Traversal",
  category: "Tree Traversal",
  definition: "Pre-order traversal visits nodes in a binary tree in the order: Root → Left subtree → Right subtree. The root is always visited first before its descendants, making it useful for copying trees.",
  howItWorks: [
    "Visit (process) the current node FIRST",
    "Then recursively traverse the left subtree",
    "Then recursively traverse the right subtree",
    "Root is always processed before children"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(h) where h is height",
  realLifeAnalogy: {
    title: "Like Exploring a Company Hierarchy! 🏢",
    description: "Imagine visiting a company to understand its structure. You meet the CEO first (root), then visit all departments under the first VP (left), then visit all departments under the second VP (right). You always meet the boss of each section before meeting their subordinates!",
    steps: [
      "Meet the CEO first (process the root)",
      "Then tour everything under the first VP (left subtree)",
      "In each department, meet the manager first, then staff",
      "Then tour everything under the second VP (right subtree)",
      "Bosses before subordinates, always!"
    ]
  },
  useCases: [
    "Creating a copy of the tree",
    "Serializing a tree structure to save/transmit",
    "Prefix expression evaluation",
    "Generating prefix notation of expressions"
  ],
  pros: [
    "Useful for tree copying",
    "Root is always processed first",
    "Good for tree serialization"
  ],
  cons: [
    "Doesn't give sorted output for BST",
    "Recursive stack space needed"
  ],
  funFact: "Pre-order traversal is used in compilers to generate prefix notation (Polish notation), invented by Polish mathematician Jan Łukasiewicz!"
};

export const POSTORDER_TRAVERSAL_INFO: AlgorithmInfo = {
  name: "Post-Order Traversal",
  category: "Tree Traversal",
  definition: "Post-order traversal visits nodes in a binary tree in the order: Left subtree → Right subtree → Root. The root is visited last after all its descendants, making it ideal for deletion operations.",
  howItWorks: [
    "First recursively traverse the left subtree",
    "Then recursively traverse the right subtree",
    "Finally visit (process) the current node",
    "Children are always processed before parents"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(h) where h is height",
  realLifeAnalogy: {
    title: "Like Cleaning Up After a Party! 🧹",
    description: "Imagine cleaning a house after a party. You start with the rooms deepest in the house (children), clean them first, and work your way back to the entrance (root). You can't clean the living room until all the bedrooms and bathrooms connected to it are clean!",
    steps: [
      "Go to the deepest rooms first (leaf nodes)",
      "Clean each room (process node)",
      "Only after all connected rooms are clean, clean the hallway",
      "Work your way back to the entrance",
      "The entrance (root) is cleaned last!"
    ]
  },
  useCases: [
    "Deleting a tree (must delete children before parent)",
    "Calculating directory size (need child sizes first)",
    "Postfix expression evaluation",
    "Dependency resolution (do dependencies first)"
  ],
  pros: [
    "Perfect for safe tree deletion",
    "Good for expression evaluation",
    "Processes children before parent"
  ],
  cons: [
    "Doesn't give sorted output for BST",
    "Root processed last might be inconvenient"
  ],
  funFact: "Post-order traversal is how calculators evaluate expressions in Reverse Polish Notation (RPN), where '3 4 + 5 *' means (3+4)*5!"
};

export const LEVELORDER_TRAVERSAL_INFO: AlgorithmInfo = {
  name: "Level-Order Traversal (BFS)",
  category: "Tree Traversal",
  definition: "Level-order traversal visits nodes level by level, from top to bottom and left to right. It uses a queue (FIFO) to process nodes in breadth-first order, visiting all nodes at depth d before nodes at depth d+1.",
  howItWorks: [
    "Create a queue and add the root node",
    "While the queue is not empty:",
    "Remove the front node from the queue",
    "Visit (process) this node",
    "Add its left child to the queue (if exists)",
    "Add its right child to the queue (if exists)",
    "Repeat until queue is empty"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(w) where w is max width",
  realLifeAnalogy: {
    title: "Like Taking a Class Photo! 📸",
    description: "When arranging students for a class photo, you line them up row by row. First row is the shortest students (level 0), next row slightly taller (level 1), and so on. You photograph each complete row before moving to the next. Level-order visits the tree the same way - complete levels first!",
    steps: [
      "Start with the principal in front (root) - Level 0",
      "Then all vice-principals stand behind (Level 1)",
      "Then all department heads (Level 2)",
      "Then all teachers (Level 3)",
      "Everyone at the same level is photographed together!"
    ]
  },
  useCases: [
    "Finding the shortest path in unweighted graphs",
    "Printing tree level by level",
    "Finding minimum depth of a tree",
    "Serializing/deserializing trees",
    "Finding nodes at a specific depth"
  ],
  pros: [
    "Visits nodes in level order",
    "Finds shortest paths first",
    "Good for level-based problems",
    "Iterative (no recursion needed)"
  ],
  cons: [
    "Uses extra space for the queue",
    "Queue can be large for wide trees"
  ],
  funFact: "Level-order traversal is also known as Breadth-First Search (BFS) and was first described by Konrad Zuse in 1945, the same person who built the first programmable computer!"
};

export const AVL_ROTATION_INFO: AlgorithmInfo = {
  name: "AVL Tree Rotations",
  category: "Self-Balancing BST",
  definition: "AVL trees are self-balancing Binary Search Trees where the height difference (balance factor) between left and right subtrees of any node is at most 1. When this balance is violated after insertion/deletion, rotations are performed to restore balance.",
  howItWorks: [
    "After every insertion/deletion, check balance factors",
    "Balance factor = height(left) - height(right)",
    "If balance factor > 1 (left-heavy), perform right rotation(s)",
    "If balance factor < -1 (right-heavy), perform left rotation(s)",
    "Four cases: LL (right rotate), RR (left rotate), LR (left-right), RL (right-left)",
    "After rotation, the tree is balanced again!"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Balancing a Seesaw! ⚖️",
    description: "Imagine a playground seesaw that must stay level. If too many kids sit on the left side, it tips over. To fix it, you move some kids (nodes) to the right side through a 'rotation'. The seesaw (tree) stays usable (balanced) and nobody falls off (performance stays good)!",
    steps: [
      "Check if the seesaw is balanced (balance factor between -1 and 1)",
      "If left side is too heavy (balance factor > 1), rotate right",
      "If right side is too heavy (balance factor < -1), rotate left",
      "Sometimes need double rotations for complex imbalances",
      "After rotation, the seesaw is perfectly balanced again!"
    ]
  },
  useCases: [
    "Database indexing where balanced access is critical",
    "Memory management systems",
    "Applications requiring guaranteed O(log n) lookups",
    "Any scenario where worst-case performance matters"
  ],
  pros: [
    "Guarantees O(log n) height",
    "All operations stay O(log n)",
    "Strictly balanced (better than regular BST)",
    "Deterministic balancing"
  ],
  cons: [
    "More complex to implement",
    "Rotations add overhead to insertions/deletions",
    "Slower insertions/deletions than Red-Black trees"
  ],
  funFact: "AVL trees are named after their inventors Adelson-Velsky and Landis, who published them in 1962. They were the first self-balancing binary search tree ever invented!"
};

// ==========================================
// LINKED LIST ALGORITHMS
// ==========================================

export const TRAVERSAL_INFO: AlgorithmInfo = {
  name: "Linked List Traversal",
  category: "Linked List Operation",
  definition: "Linked list traversal is the process of visiting each node in a linked list exactly once, starting from the head and following the 'next' pointers until reaching the end (null). It's the most fundamental linked list operation.",
  howItWorks: [
    "Start at the head node",
    "Process/visit the current node",
    "Follow the 'next' pointer to move to the next node",
    "Repeat until 'next' is null (end of list)",
    "Each node is visited exactly once"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like a Treasure Hunt with Clues! 🗺️",
    description: "Imagine a treasure hunt where each location has a clue pointing to the next location. You start at the first clue (head), follow it to the next location, find another clue there, and keep following clues until you reach the treasure (end of list with null)!",
    steps: [
      "Start at the first clue location (head node)",
      "Read the clue and collect any treasure there (process node)",
      "The clue tells you where to go next (follow 'next' pointer)",
      "Go to the next location and repeat",
      "Stop when a clue says 'The End!' (next = null)"
    ]
  },
  useCases: [
    "Printing all elements in a list",
    "Searching for a specific value",
    "Calculating the length of a list",
    "Finding the last node"
  ],
  pros: [
    "Simple and straightforward",
    "No extra space needed",
    "Works for any size list"
  ],
  cons: [
    "Must visit every node (no random access)",
    "Can't go backwards in singly linked list",
    "O(n) time even for simple tasks"
  ],
  funFact: "Unlike arrays where you can jump to any element instantly, linked lists are like a chain of paperclips - you must follow the chain from the beginning to reach any specific paperclip!"
};

export const FLOYD_CYCLE_INFO: AlgorithmInfo = {
  name: "Floyd's Cycle Detection",
  category: "Linked List Algorithm",
  definition: "Floyd's cycle detection algorithm (also called the Tortoise and Hare algorithm) uses two pointers moving at different speeds to detect if a linked list contains a cycle. If there's a cycle, the fast pointer will eventually meet the slow pointer.",
  howItWorks: [
    "Initialize two pointers: slow (tortoise) and fast (hare) at head",
    "Move slow one step at a time",
    "Move fast two steps at a time",
    "If fast reaches null, there's no cycle",
    "If slow and fast meet, there's a cycle!",
    "They will meet within the cycle if one exists"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Runners on a Circular Track! 🏃‍♂️🏃‍♀️",
    description: "Imagine two runners on a track. One runs twice as fast as the other. If the track is straight (no cycle), the fast runner finishes and leaves. But if the track is circular (has a cycle), the fast runner will eventually lap the slow runner and they'll be at the same spot!",
    steps: [
      "Two runners start at the same position",
      "Slow runner takes 1 step per second",
      "Fast runner takes 2 steps per second",
      "On a straight track, fast runner reaches the end alone",
      "On a circular track, fast runner catches up to slow runner!"
    ]
  },
  useCases: [
    "Detecting infinite loops in linked lists",
    "Finding the start of a cycle",
    "Detecting cycles in graph algorithms",
    "Memory leak detection in systems"
  ],
  pros: [
    "Only O(1) extra space",
    "Elegant and efficient",
    "Can also find cycle start point"
  ],
  cons: [
    "Only detects presence, not cycle length directly",
    "Requires modification to find cycle start"
  ],
  funFact: "This algorithm is named after Robert W. Floyd, who discovered it in the 1960s. It's also called the 'Tortoise and Hare' algorithm, referencing Aesop's famous fable!"
};

export const REVERSAL_INFO: AlgorithmInfo = {
  name: "Linked List Reversal",
  category: "Linked List Algorithm",
  definition: "Linked list reversal changes the direction of all pointers in a linked list so that the last node becomes the head and the head becomes the last node. It's a fundamental operation that can be done iteratively in O(1) space.",
  howItWorks: [
    "Initialize three pointers: prev (null), current (head), next (null)",
    "Save the next node before changing links",
    "Reverse the current node's pointer to point to prev",
    "Move prev and current one step forward",
    "Repeat until current becomes null",
    "prev now points to the new head"
  ],
  timeComplexity: {
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Reversing a Conga Line! 💃",
    description: "Imagine a conga line where everyone has their hands on the shoulders of the person in front. To reverse it, each person turns around and puts their hands on the person who was behind them. The last person becomes the leader, and the leader becomes the last!",
    steps: [
      "Start at the front of the conga line",
      "The first person has no one in front (prev = null)",
      "Each person remembers who was in front of them",
      "Then they turn around and face the opposite direction",
      "Now they're holding the person who was behind them",
      "The person at the back is now leading!"
    ]
  },
  useCases: [
    "Palindrome checking in linked lists",
    "Reversing sections of a list",
    "Undo functionality in applications",
    "Processing data in reverse order"
  ],
  pros: [
    "O(1) space - very memory efficient",
    "Simple iterative solution",
    "Can reverse in-place without extra list"
  ],
  cons: [
    "Must traverse entire list",
    "Tricky to implement correctly (pointer management)",
    "Original order is lost unless copied"
  ],
  funFact: "Reversing a linked list is one of the most commonly asked interview questions at tech companies. It tests understanding of pointers, a fundamental concept in computer science!"
};

export const MERGE_SORTED_INFO: AlgorithmInfo = {
  name: "Merge Two Sorted Lists",
  category: "Linked List Algorithm",
  definition: "Merging two sorted linked lists combines them into a single sorted linked list. By comparing the heads of both lists and always picking the smaller element, we maintain sorted order in the result.",
  howItWorks: [
    "Create a dummy node to build the result list",
    "Compare the heads of both lists",
    "Append the smaller node to the result",
    "Move the pointer forward in the list we took from",
    "Repeat until one list is empty",
    "Append any remaining nodes from the other list"
  ],
  timeComplexity: {
    best: "O(n + m)",
    average: "O(n + m)",
    worst: "O(n + m)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Merging Two Lines at a Store! 🛒",
    description: "Imagine two checkout lines where customers are arranged by the number of items they have (fewer items first). To merge them fairly, you look at the front person of each line and let the one with fewer items go first. Keep doing this until both lines are combined into one!",
    steps: [
      "Look at the first customer in each line",
      "The customer with fewer items goes to the merged line first",
      "Move to the next customer in that original line",
      "Compare again: who has fewer items?",
      "Keep going until one line is empty",
      "Everyone remaining from the other line joins the back"
    ]
  },
  useCases: [
    "Merge sort implementation",
    "Combining sorted datasets",
    "Database query result merging",
    "K-way merge in external sorting"
  ],
  pros: [
    "Efficient O(n+m) time",
    "Can be done in-place",
    "Straightforward logic"
  ],
  cons: [
    "Both lists must be pre-sorted",
    "Modifies original lists if done in-place"
  ],
  funFact: "This technique is the 'merge' part of merge sort and is also used in external sorting when data is too large to fit in memory - sorted chunks are merged together!"
};

// ==========================================
// HASHING ALGORITHMS
// ==========================================

export const HASH_FUNCTION_INFO: AlgorithmInfo = {
  name: "Hash Function",
  category: "Hashing",
  definition: "A hash function converts a key (like a number or string) into an index in a fixed-size array called a hash table. The simplest hash function for integers is the modulo operation: hash(key) = key % tableSize.",
  howItWorks: [
    "Take the input key (e.g., a number or string)",
    "Apply the hash function: key % tableSize",
    "The result is an index (0 to tableSize-1)",
    "Store the value at that index in the hash table",
    "To retrieve: apply same hash function to find the index",
    "Handle collisions when multiple keys hash to same index"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)"
  },
  spaceComplexity: "O(n)",
  realLifeAnalogy: {
    title: "Like a Library Shelf System! 📚",
    description: "Libraries organize books by a code (like Dewey Decimal). The code is like a hash function - it tells you exactly which shelf to look at. Book about cooking? Check shelf 641! The hash function converts the book topic into a location without searching every shelf.",
    steps: [
      "You want to store/find a book about 'Python Programming'",
      "The library code system (hash function) computes: 'Programming' → 005.13",
      "You go directly to shelf 005.13",
      "Store your book there or find existing books on that topic",
      "No need to search every shelf - direct access!"
    ]
  },
  useCases: [
    "Database indexing for fast lookups",
    "Caching systems (Redis, Memcached)",
    "Password storage (one-way hashing)",
    "Data deduplication"
  ],
  pros: [
    "O(1) average access time",
    "Simple to implement",
    "Works with any data type"
  ],
  cons: [
    "Collisions must be handled",
    "Bad hash functions cause many collisions",
    "Worst case O(n) with many collisions"
  ],
  funFact: "Good hash functions should produce a uniform distribution - like a fair dice where every number has equal probability. Cryptographic hash functions add the property that you can't reverse them!"
};

export const LINEAR_PROBING_INFO: AlgorithmInfo = {
  name: "Linear Probing",
  category: "Collision Resolution",
  definition: "Linear probing is a collision resolution technique for hash tables. When a collision occurs (two keys hash to the same index), linear probing searches for the next available slot by checking indices sequentially: index, index+1, index+2, and so on.",
  howItWorks: [
    "Calculate hash index using hash function",
    "If the slot is empty, insert the element",
    "If the slot is occupied (collision), probe next slot",
    "Keep probing: (hash + 1) % size, (hash + 2) % size, ...",
    "Insert in the first empty slot found",
    "Wrap around to the beginning if needed"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)"
  },
  spaceComplexity: "O(1)",
  realLifeAnalogy: {
    title: "Like Finding Parking at a Mall! 🚗",
    description: "Imagine looking for parking at a busy mall. Your GPS says 'Park in spot A5'. You drive there but it's taken! So you check A6 (taken), A7 (taken), A8 (empty!) and park there. When leaving, you remember you parked 'starting from A5, probe until found.'",
    steps: [
      "GPS says your spot is A5 (your hash index)",
      "A5 is taken (collision!)",
      "Check A6, A7, A8... one by one",
      "A8 is empty - park there!",
      "To find your car later: start at A5, keep looking until you find it"
    ]
  },
  useCases: [
    "Open addressing hash tables",
    "CPU caches",
    "Simple embedded systems",
    "When memory is at a premium"
  ],
  pros: [
    "Simple to implement",
    "Good cache performance (contiguous memory)",
    "No extra memory for links"
  ],
  cons: [
    "Primary clustering - consecutive slots fill up",
    "Performance degrades as table fills",
    "Deletion is complicated (needs markers)"
  ],
  funFact: "Linear probing was one of the first collision resolution techniques, analyzed by Donald Knuth in his famous book 'The Art of Computer Programming' in 1963!"
};

export const CHAINING_INFO: AlgorithmInfo = {
  name: "Chaining (Separate Chaining)",
  category: "Collision Resolution",
  definition: "Chaining is a collision resolution technique where each hash table slot contains a linked list (chain) of all elements that hash to that index. When a collision occurs, the new element is simply added to the chain at that slot.",
  howItWorks: [
    "Each hash table slot is a linked list (initially empty)",
    "Calculate hash index using hash function",
    "Go to that index in the table",
    "If collision, simply add to the linked list at that slot",
    "To search: go to the index, search through the chain",
    "Multiple elements can share the same index"
  ],
  timeComplexity: {
    best: "O(1)",
    average: "O(1 + α)",
    worst: "O(n)"
  },
  spaceComplexity: "O(n)",
  realLifeAnalogy: {
    title: "Like Coat Hooks at a Party! 🧥",
    description: "Imagine coat hooks at a party numbered 0-9. Your coat check number is your name's first letter mod 10. Everyone named 'Alice', 'Abby', 'Arnold' (all hash to hook #1) just hangs their coats on the same hook, creating a chain of coats. To find yours, you search through the coats on your hook!",
    steps: [
      "Calculate your hook number: first letter → number mod 10",
      "Go to that hook",
      "Hang your coat on that hook (might already have coats!)",
      "If the hook has coats, yours joins the chain",
      "To retrieve: go to hook, search through coats until you find yours"
    ]
  },
  useCases: [
    "General-purpose hash tables",
    "Symbol tables in compilers",
    "Databases with frequent insertions",
    "When deletion is frequent"
  ],
  pros: [
    "Simple collision handling",
    "Table never 'fills up'",
    "Deletion is easy",
    "Performance degrades gracefully"
  ],
  cons: [
    "Extra memory for linked list pointers",
    "Cache performance worse than open addressing",
    "Long chains with bad hash functions"
  ],
  funFact: "Chaining is used in Java's HashMap implementation! When chains get too long (> 8 elements), Java 8+ converts them to balanced trees for better performance!"
};

// ==========================================
// TOUR STEPS FOR EACH VISUALIZER
// ==========================================

export const GRAPH_VISUALIZER_TOUR: TourStep[] = [
  {
    target: '[data-tour="graph-canvas"]',
    title: "Welcome to Graph Visualizer! 🎉",
    content: "This is your interactive canvas where you'll see Dijkstra's algorithm in action. Nodes represent locations, and edges represent weighted connections between them.",
    position: 'right',
    spotlightPadding: 15
  },
  {
    target: '[data-tour="control-panel"]',
    title: "Control Panel 🎮",
    content: "Use these controls to run the algorithm. Click Play to start, use Step Forward/Back to move through the algorithm one step at a time, or Reset to start over.",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="speed-control"]',
    title: "Animation Speed ⚡",
    content: "Adjust how fast the visualization runs. Slower speeds are great for learning, while faster speeds help you see the big picture.",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="node-selector"]',
    title: "Select Start & End Nodes 📍",
    content: "Choose which node to start from and which node is your destination. The algorithm will find the shortest path between them!",
    position: 'bottom',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="generate-graph"]',
    title: "Generate New Graph 🔄",
    content: "Click here to create a new random graph. Each graph has different nodes and edge weights, giving you fresh problems to solve!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="algorithm-table"]',
    title: "Distance Table 📊",
    content: "Watch the distances update in real-time as the algorithm runs. This shows the current shortest known distance to each node.",
    position: 'top',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="ai-tutor"]',
    title: "AI Tutor 🤖",
    content: "Have questions? The AI Tutor can explain what's happening at each step, help you understand the algorithm, and answer your questions!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="legend"]',
    title: "Color Legend 🎨",
    content: "Different colors represent different states: current node, visited nodes, nodes in the priority queue, and the final shortest path. Check here when you're unsure!",
    position: 'top',
    spotlightPadding: 10
  },
  {
    target: 'body',
    title: "You're Ready! 🚀",
    content: "Start by clicking Play to watch Dijkstra's algorithm find the shortest path. Use Step mode to go slowly and really understand each decision the algorithm makes. Happy learning!",
    position: 'center'
  }
];

export const ARRAY_VISUALIZER_TOUR: TourStep[] = [
  {
    target: '[data-tour="array-canvas"]',
    title: "Welcome to Array Visualizer! 📊",
    content: "This is where you'll see sorting and searching algorithms come to life! Watch as bars move, swap, and sort themselves.",
    position: 'right',
    spotlightPadding: 15
  },
  {
    target: '[data-tour="algorithm-selector"]',
    title: "Choose Your Algorithm 🔬",
    content: "Select from various algorithms: Binary Search, Linear Search, Bubble Sort, Selection Sort, Quick Sort, Merge Sort, and Two-Pointer technique!",
    position: 'bottom',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="control-panel"]',
    title: "Playback Controls 🎮",
    content: "Control the visualization: Play/Pause, Step Forward, Step Back, or Reset. Step mode is perfect for understanding each comparison and swap!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="speed-control"]',
    title: "Speed Adjustment ⚡",
    content: "Change animation speed to match your learning pace. Go slow to see every detail, or speed up once you understand!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="generate-array"]',
    title: "New Array 🔄",
    content: "Generate a fresh random array to sort or search. Experiment with different data to see how algorithms handle various inputs!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="info-panel"]',
    title: "Algorithm Info 📚",
    content: "Learn about the current algorithm: its time complexity, how it works, and see the pseudocode that corresponds to each step!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: 'body',
    title: "Let's Sort! 🎉",
    content: "Try different algorithms on the same array and compare how they work. Notice which ones are faster and why. The colors show comparisons (yellow), swaps (red), and sorted elements (green)!",
    position: 'center'
  }
];

export const TREE_VISUALIZER_TOUR: TourStep[] = [
  {
    target: '[data-tour="tree-canvas"]',
    title: "Welcome to Tree Visualizer! 🌳",
    content: "Explore tree data structures! This canvas shows a Binary Search Tree where left children are smaller and right children are larger than the parent.",
    position: 'right',
    spotlightPadding: 15
  },
  {
    target: '[data-tour="algorithm-selector"]',
    title: "Choose a Traversal 🔍",
    content: "Select from In-Order (L-Root-R), Pre-Order (Root-L-R), Post-Order (L-R-Root), Level-Order (BFS), or learn about AVL rotations!",
    position: 'bottom',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="control-panel"]',
    title: "Traversal Controls 🎮",
    content: "Watch the tree traversal step by step. Each node lights up as it's visited, showing you exactly what order the algorithm follows!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="result-display"]',
    title: "Traversal Result 📝",
    content: "See the order in which nodes are visited. For a BST, In-Order traversal gives you sorted output - magic!",
    position: 'top',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="generate-tree"]',
    title: "New Tree 🌲",
    content: "Generate different random BSTs to see how tree shape affects traversal order. Try to predict the output before running!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: 'body',
    title: "Explore Trees! 🎉",
    content: "Run each traversal on the same tree and compare the results. In-Order gives sorted output, Pre-Order is great for copying trees, and Post-Order is perfect for deletion!",
    position: 'center'
  }
];

export const LINKEDLIST_VISUALIZER_TOUR: TourStep[] = [
  {
    target: '[data-tour="list-canvas"]',
    title: "Welcome to Linked List Visualizer! 🔗",
    content: "Linked lists are chains of nodes where each node points to the next. Unlike arrays, they don't need contiguous memory!",
    position: 'right',
    spotlightPadding: 15
  },
  {
    target: '[data-tour="algorithm-selector"]',
    title: "Choose an Operation 🔬",
    content: "Learn Traversal, Floyd's Cycle Detection (Tortoise & Hare), List Reversal, or Merging Sorted Lists!",
    position: 'bottom',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="control-panel"]',
    title: "Animation Controls 🎮",
    content: "Watch pointers move through the list! The slow pointer (🐢) and fast pointer (🐇) in Floyd's algorithm are especially fun to watch!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="pointer-legend"]',
    title: "Pointer Colors 🎨",
    content: "Different colors show different pointers: current node, slow pointer, fast pointer, and reversed links. Follow along as they move!",
    position: 'top',
    spotlightPadding: 8
  },
  {
    target: '[data-tour="generate-list"]',
    title: "New List 🔄",
    content: "Generate new linked lists to practice with. For cycle detection, a special cyclic list is created where the last node points back!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: 'body',
    title: "Follow the Links! 🎉",
    content: "Watch how reversal changes link directions, or see the tortoise and hare race around a cycle. These visual patterns will help you remember the algorithms forever!",
    position: 'center'
  }
];

export const HASHING_VISUALIZER_TOUR: TourStep[] = [
  {
    target: '[data-tour="hash-table"]',
    title: "Welcome to Hash Table Visualizer! #️⃣",
    content: "Hash tables store key-value pairs using a hash function to compute indices. They enable O(1) average access time!",
    position: 'right',
    spotlightPadding: 15
  },
  {
    target: '[data-tour="algorithm-selector"]',
    title: "Choose Collision Resolution 🔬",
    content: "Learn about Hash Functions, Linear Probing (find next empty slot), or Chaining (linked lists at each slot)!",
    position: 'bottom',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="hash-calculation"]',
    title: "Hash Calculation 🔢",
    content: "Watch the hash function compute: key % tableSize. See which index each key maps to and observe collisions in action!",
    position: 'top',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="control-panel"]',
    title: "Insert Controls 🎮",
    content: "Step through insertions one by one. Watch as collisions are detected and resolved using the chosen method!",
    position: 'left',
    spotlightPadding: 10
  },
  {
    target: '[data-tour="load-factor"]',
    title: "Load Factor 📊",
    content: "The load factor (items/slots) affects performance. Higher load factors mean more collisions. Watch it change as you insert!",
    position: 'bottom',
    spotlightPadding: 8
  },
  {
    target: 'body',
    title: "Hash Away! 🎉",
    content: "Compare Linear Probing vs Chaining - notice how Linear Probing fills gaps while Chaining creates chains. Both solve collisions differently!",
    position: 'center'
  }
];

// Helper to get algorithm info by name
export function getAlgorithmInfo(algorithmName: string): AlgorithmInfo | null {
  const algorithms: Record<string, AlgorithmInfo> = {
    'dijkstra': DIJKSTRA_INFO,
    'linear-search': LINEAR_SEARCH_INFO,
    'binary-search': BINARY_SEARCH_INFO,
    'bubble-sort': BUBBLE_SORT_INFO,
    'selection-sort': SELECTION_SORT_INFO,
    'quick-sort': QUICK_SORT_INFO,
    'merge-sort': MERGE_SORT_INFO,
    'two-pointer': TWO_POINTER_INFO,
    'inorder': INORDER_TRAVERSAL_INFO,
    'preorder': PREORDER_TRAVERSAL_INFO,
    'postorder': POSTORDER_TRAVERSAL_INFO,
    'levelorder': LEVELORDER_TRAVERSAL_INFO,
    'avl': AVL_ROTATION_INFO,
    'traversal': TRAVERSAL_INFO,
    'floyd': FLOYD_CYCLE_INFO,
    'reversal': REVERSAL_INFO,
    'merge-lists': MERGE_SORTED_INFO,
    'hash-function': HASH_FUNCTION_INFO,
    'linear-probing': LINEAR_PROBING_INFO,
    'chaining': CHAINING_INFO,
  };

  return algorithms[algorithmName] || null;
}
