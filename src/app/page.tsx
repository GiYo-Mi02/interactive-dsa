import Link from "next/link";
import { 
  Network, 
  ArrowRight,
  Sparkles,
  LayoutList,
  Link2,
  GitBranch,
  Hash,
  Search,
  ArrowUpDown,
  Repeat,
  ListTree,
  RotateCcw,
  SplitSquareHorizontal
} from "lucide-react";

const algorithmCategories = [
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    description: 'Explore pathfinding and graph traversal algorithms',
    href: '/visualizer',
    icon: Network,
    gradient: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-500/25',
    borderHover: 'hover:border-cyan-500/50',
    algorithms: ["Dijkstra's Algorithm", 'Dynamic Rerouting', 'Shortest Path'],
  },
  {
    id: 'arrays',
    title: 'Array Algorithms',
    description: 'Searching, sorting, and manipulation techniques',
    href: '/arrays',
    icon: LayoutList,
    gradient: 'from-purple-500 to-pink-600',
    shadowColor: 'shadow-purple-500/25',
    borderHover: 'hover:border-purple-500/50',
    algorithms: ['Linear Search', 'Binary Search', 'Bubble Sort', 'Quick Sort', 'Merge Sort'],
  },
  {
    id: 'linked-lists',
    title: 'Linked List Algorithms',
    description: 'Pointer manipulation and list operations',
    href: '/linked-list',
    icon: Link2,
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/25',
    borderHover: 'hover:border-emerald-500/50',
    algorithms: ['Traversal', "Floyd's Cycle Detection", 'Reversal', 'Merge Sorted Lists'],
  },
  {
    id: 'trees',
    title: 'Tree Algorithms',
    description: 'Traversals, balancing, and tree operations',
    href: '/trees',
    icon: GitBranch,
    gradient: 'from-orange-500 to-amber-600',
    shadowColor: 'shadow-orange-500/25',
    borderHover: 'hover:border-orange-500/50',
    algorithms: ['In-Order DFS', 'Pre-Order DFS', 'Post-Order DFS', 'Level-Order BFS', 'AVL Rotations'],
  },
  {
    id: 'hashing',
    title: 'Hashing Algorithms',
    description: 'Hash functions and collision resolution',
    href: '/hashing',
    icon: Hash,
    gradient: 'from-rose-500 to-red-600',
    shadowColor: 'shadow-rose-500/25',
    borderHover: 'hover:border-rose-500/50',
    algorithms: ['Hash Functions', 'Linear Probing', 'Chaining'],
  },
];

const features = [
  {
    icon: Search,
    title: 'Search Algorithms',
    description: 'Linear O(n) and Binary O(log n) search techniques',
  },
  {
    icon: ArrowUpDown,
    title: 'Sorting Algorithms',
    description: 'From O(n²) bubble sort to O(n log n) merge sort',
  },
  {
    icon: Repeat,
    title: "Floyd's Cycle Detection",
    description: 'Tortoise and Hare pointer technique',
  },
  {
    icon: ListTree,
    title: 'Tree Traversals',
    description: 'DFS (In/Pre/Post-Order) and BFS (Level-Order)',
  },
  {
    icon: RotateCcw,
    title: 'AVL Rotations',
    description: 'Left/Right rotations for balanced trees',
  },
  {
    icon: SplitSquareHorizontal,
    title: 'Collision Resolution',
    description: 'Linear probing and chaining techniques',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] overflow-hidden relative">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center space-y-6 sm:space-y-8 max-w-6xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 sm:p-6 rounded-full border border-white/10">
                <Network className="w-10 h-10 sm:w-16 sm:h-16 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            Interactive{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DSA
            </span>{" "}
            Visualizer
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-2">
            Master Data Structures & Algorithms through stunning, interactive visualizations. 
            Explore arrays, linked lists, trees, graphs, and hashing with step-by-step animations.
          </p>
        </div>
      </div>

      {/* Algorithm Categories */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Choose Your Algorithm
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Select a category to start visualizing algorithms with interactive animations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {algorithmCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 ${category.borderHover} transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg ${category.shadowColor}`}>
                <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              
              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {category.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              
              {/* Algorithm Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {category.algorithms.slice(0, 3).map((algo) => (
                  <span
                    key={algo}
                    className="bg-white/5 text-slate-300 px-2 py-1 rounded-md text-xs border border-white/5"
                  >
                    {algo}
                  </span>
                ))}
                {category.algorithms.length > 3 && (
                  <span className="bg-white/5 text-slate-400 px-2 py-1 rounded-md text-xs border border-white/5">
                    +{category.algorithms.length - 3} more
                  </span>
                )}
              </div>
              
              {/* CTA */}
              <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            What You&apos;ll Learn
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Comprehensive coverage of essential algorithms and data structures
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10 text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-white/10">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <h3 className="text-white text-xs sm:text-sm font-semibold mb-1">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed hidden sm:block">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Complexity Reference */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            Time Complexity Reference
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mb-1">O(1)</div>
              <div className="text-slate-400 text-xs sm:text-sm">Constant</div>
              <div className="text-slate-500 text-xs mt-1">Hash lookup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 mb-1">O(log n)</div>
              <div className="text-slate-400 text-xs sm:text-sm">Logarithmic</div>
              <div className="text-slate-500 text-xs mt-1">Binary Search</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-yellow-400 mb-1">O(n)</div>
              <div className="text-slate-400 text-xs sm:text-sm">Linear</div>
              <div className="text-slate-500 text-xs mt-1">Linear Search</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-orange-400 mb-1">O(n log n)</div>
              <div className="text-slate-400 text-xs sm:text-sm">Linearithmic</div>
              <div className="text-slate-500 text-xs mt-1">Merge Sort</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Powered by</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-slate-400 px-4">
            {["Next.js 15", "React 19", "TypeScript", "p5.js", "TailwindCSS"].map((tech) => (
              <span key={tech} className="bg-white/5 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/5 hover:border-white/20 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center">
          <p className="text-slate-500 text-sm">
            Interactive DSA Visualizer — An educational tool for understanding algorithms and data structures
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Made by Gio Joshua Gonzales from 2ACSAD of UMak
          </p>
        </div>
      </footer>
    </div>
  );
}
