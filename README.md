# 🔮 Interactive DSA Visualizer

An interactive, animated algorithm visualizer built using modern frontend technologies. This web application allows students to generate mesh graphs, pick start & end nodes, visualize Dijkstra's algorithm step-by-step, simulate node blockages, and watch dynamic rerouting animations.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)
![p5.js](https://img.shields.io/badge/p5.js-1.9-pink)
![D3.js](https://img.shields.io/badge/D3.js-7-orange)

## ✨ Features

- **📊 Interactive Graph Generation**: Generate random spaced mesh graphs with adjustable parameters
- **📍 Node Selection**: Click to select start and end nodes for pathfinding
- **🎯 Step-by-Step Visualization**: Watch Dijkstra's algorithm explore the graph in real-time
- **🚧 Node Blocking**: Block nodes to simulate obstacles and see dynamic rerouting
- **⏯️ Playback Controls**: Play, pause, step forward, and step backward through the algorithm
- **📋 Algorithm Table**: Real-time D3.js-powered table showing distances, previous nodes, and status
- **📖 Educational Info Panel**: Explanations for each step of the algorithm

## 🛠️ Tech Stack

| Technology      | Purpose                                   |
| --------------- | ----------------------------------------- |
| **Next.js 15**  | React framework with App Router           |
| **React 19**    | UI component library                      |
| **TypeScript**  | Type safety and better DX                 |
| **TailwindCSS** | Utility-first CSS styling                 |
| **p5.js**       | Canvas-based graph drawing and animations |
| **D3.js**       | Data visualization for algorithm table    |

## 📁 Project Structure

```
/src
  /app
    /visualizer
      page.tsx           # Main visualizer page
      GraphCanvas.tsx    # p5.js canvas component
      ControlPanel.tsx   # Controls and buttons
      InfoPanel.tsx      # Algorithm info display
      AlgorithmTable.tsx # D3.js-powered data table
      Legend.tsx         # Color legend
      types.ts           # TypeScript type definitions
    /api
      /generate-graph
        route.ts         # API endpoint for graph generation
    page.tsx             # Landing page
    layout.tsx           # Root layout
    globals.css          # Global styles

  /components
    Button.tsx           # Reusable button component
    Slider.tsx           # Speed slider component
    Dropdown.tsx         # Dropdown selector

/lib
  graphGenerator.ts      # Graph generation algorithm
  dijkstra.ts           # Dijkstra's algorithm implementation
  reroute.ts            # Rerouting logic
  animationEngine.ts    # Animation utilities
  utils.ts              # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/interactive-dsa.git
cd interactive-dsa
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

1. **Generate Graph**: Click "Generate Graph" to create a new random graph
2. **Select Start Node**: Click "Start Node" then click on a node in the graph
3. **Select End Node**: Click "End Node" then click on a different node
4. **Run Algorithm**: Click "Run Dijkstra's Algorithm" to start the visualization
5. **Watch & Learn**: Observe the algorithm exploring nodes and finding the shortest path
6. **Block Nodes**: Try blocking nodes to see how the algorithm finds alternative routes

## 🧮 Algorithm Details

### Dijkstra's Algorithm

- **Purpose**: Finds the shortest path in a weighted graph
- **Data Structure**: Priority Queue (min-heap)
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)

The visualization shows:

- 🟡 **Current Node**: Being processed
- 🟣 **Visited Nodes**: Already explored
- 🔵 **In Queue**: Waiting to be processed
- 🟢 **Start Node**: Source
- 🔴 **End Node**: Destination
- 🩵 **Shortest Path**: Final result

## 🎓 Educational Value

This tool helps students understand:

- Graph theory fundamentals
- Priority queue data structures
- Greedy algorithm strategies
- Shortest path problems
- Real-world applications (GPS, network routing, etc.)

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for learning algorithms visually
