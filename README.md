# 🔮 Interactive DSA Visualizer

A comprehensive, interactive data structures and algorithms visualizer built with modern web technologies. This educational platform provides step-by-step visualizations for **Graph Algorithms**, **Arrays**, **Linked Lists**, **Trees**, and **Hashing** — making complex concepts intuitive and engaging.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)
![p5.js](https://img.shields.io/badge/p5.js-1.11-pink)
![D3.js](https://img.shields.io/badge/D3.js-7-orange)

---

## 📚 Table of Contents

- [Features Overview](#-features-overview)
- [Algorithm Categories](#-algorithm-categories)
  - [Graph Algorithms](#-graph-algorithms-dijkstras)
  - [Array Algorithms](#-array-algorithms)
  - [Linked List Algorithms](#-linked-list-algorithms)
  - [Tree Algorithms](#-tree-algorithms)
  - [Hashing Algorithms](#-hashing-algorithms)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Educational Value](#-educational-value)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features Overview

| Feature                           | Description                                                            |
| --------------------------------- | ---------------------------------------------------------------------- |
| 🎯 **Step-by-Step Visualization** | Watch algorithms execute one step at a time with detailed explanations |
| ⏯️ **Playback Controls**          | Play, pause, step forward/backward, and adjust animation speed         |
| 📝 **Animated Pseudocode**        | See which line of code is executing in real-time                       |
| 🎨 **Custom Input Mode**          | Enter your own data or generate random inputs                          |
| 📊 **Real-time Data Tables**      | D3.js-powered tables showing algorithm state                           |
| 🌙 **Space-Themed UI**            | Beautiful dark theme with neon accents and glassmorphism               |
| 📱 **Fully Responsive**           | Works seamlessly on desktop, tablet, and mobile                        |
| 🔍 **Zoom & Pan**                 | Navigate large visualizations with intuitive controls                  |

---

## 🧮 Algorithm Categories

### 📈 Graph Algorithms (Dijkstra's)

**Route:** `/visualizer`

Interactive weighted graph visualization with Dijkstra's shortest path algorithm.

#### Features:

- **Graph Generation**: Create random mesh graphs with customizable node count
- **Node Selection**: Click to set start node, end node, or block nodes
- **Dynamic Rerouting**: Block nodes and watch the algorithm find alternative paths
- **Visual Feedback**:
  - 🟢 Start Node
  - 🔴 End Node
  - 🟡 Current Node (being processed)
  - 🟣 Visited Nodes
  - 🩵 Shortest Path
  - ⬛ Blocked Nodes

#### Algorithm Details:

| Property             | Value                     |
| -------------------- | ------------------------- |
| **Time Complexity**  | O((V + E) log V)          |
| **Space Complexity** | O(V)                      |
| **Data Structure**   | Priority Queue (Min-Heap) |

---

### 📊 Array Algorithms

**Route:** `/arrays`

Comprehensive array algorithm visualizations with bar-chart style representation.

#### Supported Algorithms:

| Algorithm          | Type      | Time Complexity | Description                             |
| ------------------ | --------- | --------------- | --------------------------------------- |
| **Linear Search**  | Search    | O(n)            | Sequential search through array         |
| **Binary Search**  | Search    | O(log n)        | Divide-and-conquer on sorted arrays     |
| **Bubble Sort**    | Sort      | O(n²)           | Compare adjacent pairs, swap if needed  |
| **Selection Sort** | Sort      | O(n²)           | Find minimum, place at correct position |
| **Merge Sort**     | Sort      | O(n log n)      | Divide, sort, merge recursively         |
| **Quick Sort**     | Sort      | O(n log n) avg  | Partition around pivot element          |
| **Two Pointer**    | Technique | O(n)            | Find pairs that sum to target           |

#### Visual States:

- 🔵 **Default** - Unprocessed element
- 🟡 **Comparing** - Currently being compared
- 🟢 **Sorted/Found** - In final position or search result
- 🟣 **Pivot** - Quick sort pivot element
- 🔴 **Swapping** - Elements being swapped

---

### 🔗 Linked List Algorithms

**Route:** `/linked-list`

Node-based visualization with animated pointer connections.

#### Supported Algorithms:

| Algorithm                   | Time Complexity | Description                            |
| --------------------------- | --------------- | -------------------------------------- |
| **Traversal**               | O(n)            | Visit each node sequentially           |
| **Floyd's Cycle Detection** | O(n)            | Detect cycles using slow/fast pointers |
| **Reverse List**            | O(n)            | Reverse node connections in-place      |
| **Merge Sorted Lists**      | O(n + m)        | Combine two sorted lists into one      |

#### Visual Elements:

- **Nodes**: Circular elements containing values
- **Arrows**: Animated connections showing `next` pointers
- **Slow Pointer** 🐢: Moves one step at a time
- **Fast Pointer** 🐇: Moves two steps at a time
- **Current Node**: Highlighted during traversal

---

### 🌳 Tree Algorithms

**Route:** `/trees`

Binary tree visualization with hierarchical node positioning.

#### Supported Algorithms:

| Algorithm               | Type      | Time Complexity | Description                     |
| ----------------------- | --------- | --------------- | ------------------------------- |
| **BST Insert**          | Operation | O(log n) avg    | Insert maintaining BST property |
| **BST Search**          | Operation | O(log n) avg    | Find value in BST               |
| **Inorder Traversal**   | Traversal | O(n)            | Left → Root → Right             |
| **Preorder Traversal**  | Traversal | O(n)            | Root → Left → Right             |
| **Postorder Traversal** | Traversal | O(n)            | Left → Right → Root             |
| **Level Order (BFS)**   | Traversal | O(n)            | Breadth-first, level by level   |
| **AVL Rotation**        | Balancing | O(1)            | Self-balancing with rotations   |

#### AVL Rotation Details:

- **Left Rotation (LL)**: Single rotation for right-heavy subtree
- **Right Rotation (RR)**: Single rotation for left-heavy subtree
- **Left-Right (LR)**: Double rotation for left-right imbalance
- **Right-Left (RL)**: Double rotation for right-left imbalance

#### Visual States:

- 🟢 **Current Node**: Being processed
- 🟣 **Visited**: Already traversed
- 🟡 **Comparing**: Search/insert comparison
- 🔴 **Imbalanced**: Node requiring rotation
- 🩵 **Path**: Traversal path highlight

---

### #️⃣ Hashing Algorithms

**Route:** `/hashing`

Hash table visualization showing bucket-based storage and collision handling.

#### Supported Algorithms:

| Algorithm             | Type      | Description                       |
| --------------------- | --------- | --------------------------------- |
| **Hash Function**     | Core      | Modulo-based key distribution     |
| **Linear Probing**    | Collision | Find next empty slot sequentially |
| **Separate Chaining** | Collision | Store collisions in linked lists  |

#### Visual Elements:

- **Buckets**: Array slots showing stored values
- **Hash Calculation**: Step-by-step modulo operation
- **Collision Indicator**: 💥 Shows when collision occurs
- **Probe Sequence**: Arrows showing linear probing path
- **Chain Links**: Connected nodes for chaining

#### Hash Function:

```
hash(key) = key % tableSize
```

---

## 🛠️ Tech Stack

| Technology       | Version | Purpose                                       |
| ---------------- | ------- | --------------------------------------------- |
| **Next.js**      | 16.0.6  | React framework with App Router & Turbopack   |
| **React**        | 19      | UI component library with hooks               |
| **TypeScript**   | 5       | Type safety and enhanced developer experience |
| **TailwindCSS**  | 4       | Utility-first CSS with custom theme           |
| **p5.js**        | 1.11    | Canvas-based graph visualization              |
| **D3.js**        | 7       | Data-driven algorithm tables                  |
| **Lucide React** | -       | Beautiful icon library                        |

---

## 📁 Project Structure

```
interactive-dsa/
├── src/
│   └── app/
│       ├── page.tsx                 # Landing page with algorithm cards
│       ├── layout.tsx               # Root layout with metadata
│       ├── globals.css              # Global styles & animations
│       │
│       ├── visualizer/              # 📈 Graph/Dijkstra Visualizer
│       │   ├── page.tsx             # Main visualizer page
│       │   ├── GraphCanvas.tsx      # p5.js canvas (optimized)
│       │   ├── ControlPanel.tsx     # Playback & selection controls
│       │   ├── InfoPanel.tsx        # Algorithm info & pseudocode
│       │   ├── AlgorithmTable.tsx   # D3.js distance table
│       │   ├── Legend.tsx           # Color legend
│       │   └── types.ts             # TypeScript definitions
│       │
│       ├── arrays/                  # 📊 Array Algorithms
│       │   ├── page.tsx             # Array visualizer page
│       │   ├── ArrayVisualizer.tsx  # Bar chart visualization
│       │   ├── algorithms.ts        # Search & sort implementations
│       │   └── types.ts             # Array type definitions
│       │
│       ├── linked-list/             # 🔗 Linked List Algorithms
│       │   ├── page.tsx             # Linked list page
│       │   ├── LinkedListVisualizer.tsx
│       │   ├── algorithms.ts        # List operations
│       │   └── types.ts             # Node type definitions
│       │
│       ├── trees/                   # 🌳 Tree Algorithms
│       │   ├── page.tsx             # Tree visualizer page
│       │   ├── TreeVisualizer.tsx   # SVG tree rendering
│       │   ├── algorithms.ts        # BST & traversals
│       │   └── types.ts             # Tree node definitions
│       │
│       ├── hashing/                 # #️⃣ Hashing Algorithms
│       │   ├── page.tsx             # Hash table page
│       │   ├── HashingVisualizer.tsx
│       │   ├── algorithms.ts        # Hash & collision handling
│       │   └── types.ts             # Hash table definitions
│       │
│       └── api/
│           └── generate-graph/
│               └── route.ts         # Graph generation API
│
├── lib/
│   ├── dijkstra.ts                  # Dijkstra's algorithm
│   ├── graphGenerator.ts            # Random graph generation
│   ├── reroute.ts                   # Dynamic rerouting logic
│   └── utils.ts                     # Helper functions
│
├── components/
│   ├── Button.tsx                   # Reusable button component
│   ├── Slider.tsx                   # Speed control slider
│   └── Dropdown.tsx                 # Algorithm selector
│
└── public/                          # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/GiYo-Mi02/interactive-dsa.git
cd interactive-dsa
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm run dev
```

4. **Open in browser:**

```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

---

## 📖 Usage Guide

### General Controls (All Visualizers)

| Control             | Action                             |
| ------------------- | ---------------------------------- |
| ▶️ **Play**         | Start automatic animation          |
| ⏸️ **Pause**        | Pause at current step              |
| ⏮️ **Previous**     | Go back one step                   |
| ⏭️ **Next**         | Advance one step                   |
| 🔄 **Reset**        | Return to initial state            |
| 🎚️ **Speed Slider** | Adjust animation speed (0.5x - 3x) |

### Input Modes

1. **Random Mode**: Auto-generate random data
2. **Custom Mode**: Enter your own values
   - Arrays: Comma-separated numbers (e.g., `5, 3, 8, 1, 9`)
   - Trees: Space-separated values (e.g., `50 30 70 20 40`)
   - Hash: Comma-separated keys (e.g., `15, 25, 35, 45`)

### Graph Visualizer Specific

| Control            | Action                                  |
| ------------------ | --------------------------------------- |
| 🟢 **Set Start**   | Click button, then click a node         |
| 🔴 **Set End**     | Click button, then click a node         |
| ⬛ **Block Nodes** | Click button, then click nodes to block |
| 🔍 **Zoom In/Out** | Use zoom buttons or scroll wheel        |
| ✋ **Pan Mode**    | Toggle pan, then drag to move           |

---

## 🎓 Educational Value

This platform helps students understand:

### Fundamental Concepts

- **Algorithm Analysis**: Time & space complexity
- **Data Structure Operations**: Insert, delete, search, traverse
- **Problem-Solving Patterns**: Divide & conquer, greedy, two pointers

### Specific Topics

| Category         | Concepts Learned                                       |
| ---------------- | ------------------------------------------------------ |
| **Graphs**       | Weighted graphs, shortest paths, priority queues       |
| **Arrays**       | Searching, sorting, partitioning, comparisons          |
| **Linked Lists** | Pointer manipulation, cycle detection, reversal        |
| **Trees**        | Binary trees, BST property, tree balancing, traversals |
| **Hashing**      | Hash functions, collision resolution, load factor      |

### Real-World Applications

- 🗺️ **GPS Navigation** (Dijkstra's algorithm)
- 🔍 **Database Indexing** (Binary search, hashing)
- 📁 **File Systems** (Tree structures)
- 🌐 **Network Routing** (Graph algorithms)
- 💾 **Memory Management** (Linked lists)

---

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code analysis
npm run type-check   # Run TypeScript compiler check
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-algorithm`)
3. **Commit** your changes (`git commit -m 'Add new algorithm'`)
4. **Push** to the branch (`git push origin feature/new-algorithm`)
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Add more sorting algorithms (Heap Sort, Radix Sort)
- [ ] Implement graph algorithms (BFS, DFS, A\*)
- [ ] Add stack and queue visualizations
- [ ] Create algorithm comparison mode
- [ ] Add sound effects for operations

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Gio Joshua Gonzales**

---

<div align="center">

Built with ❤️ for learning algorithms visually

**[🔮 Live Demo](https://interactive-dsa.vercel.app)** · **[📝 Report Bug](https://github.com/GiYo-Mi02/interactive-dsa/issues)** · **[✨ Request Feature](https://github.com/GiYo-Mi02/interactive-dsa/issues)**

</div>
