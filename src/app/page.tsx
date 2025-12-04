import Link from "next/link";
import { 
  Network, 
  ArrowRight,
  LayoutList,
  Link2,
  GitBranch,
  Hash,
  Code2,
  Zap,
  BookOpen,
  Cpu,
  Layers,
  Target,
  ChevronRight,
  Github,
  ExternalLink
} from "lucide-react";

const algorithmCategories = [
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    description: 'Pathfinding & traversal',
    href: '/visualizer',
    icon: Network,
    color: 'cyan',
    algorithms: ["Dijkstra's", 'Shortest Path'],
    stats: '3 algorithms',
  },
  {
    id: 'arrays',
    title: 'Array Algorithms',
    description: 'Search & sort operations',
    href: '/arrays',
    icon: LayoutList,
    color: 'violet',
    algorithms: ['Binary Search', 'Quick Sort', 'Merge Sort'],
    stats: '5 algorithms',
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    description: 'Pointer manipulation',
    href: '/linked-list',
    icon: Link2,
    color: 'emerald',
    algorithms: ['Traversal', 'Cycle Detection'],
    stats: '4 algorithms',
  },
  {
    id: 'trees',
    title: 'Tree Algorithms',
    description: 'Traversals & balancing',
    href: '/trees',
    icon: GitBranch,
    color: 'amber',
    algorithms: ['DFS', 'BFS', 'AVL Rotations'],
    stats: '5 algorithms',
  },
  {
    id: 'hashing',
    title: 'Hashing',
    description: 'Hash functions & collision',
    href: '/hashing',
    icon: Hash,
    color: 'rose',
    algorithms: ['Linear Probing', 'Chaining'],
    stats: '3 algorithms',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Real-time Visualization',
    description: 'Watch algorithms execute step-by-step with smooth animations',
  },
  {
    icon: Code2,
    title: 'Live Code Execution',
    description: 'Write and run code in Java, C#, and Python instantly',
  },
  {
    icon: BookOpen,
    title: 'AI-Powered Learning',
    description: 'Get personalized explanations adapted to your level',
  },
  {
    icon: Target,
    title: 'Interactive Practice',
    description: 'Test your understanding with prediction challenges',
  },
];

const complexityData = [
  { notation: 'O(1)', name: 'Constant', color: 'emerald', example: 'Array access' },
  { notation: 'O(log n)', name: 'Logarithmic', color: 'cyan', example: 'Binary search' },
  { notation: 'O(n)', name: 'Linear', color: 'amber', example: 'Linear search' },
  { notation: 'O(n log n)', name: 'Linearithmic', color: 'orange', example: 'Merge sort' },
  { notation: 'O(n²)', name: 'Quadratic', color: 'rose', example: 'Bubble sort' },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; shadow: string; gradient: string }> = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/20',
      gradient: 'from-cyan-500 to-blue-600',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20 hover:border-violet-500/40',
      text: 'text-violet-400',
      shadow: 'shadow-violet-500/20',
      gradient: 'from-violet-500 to-purple-600',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/20',
      gradient: 'from-emerald-500 to-teal-600',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      text: 'text-amber-400',
      shadow: 'shadow-amber-500/20',
      gradient: 'from-amber-500 to-orange-600',
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      text: 'text-rose-400',
      shadow: 'shadow-rose-500/20',
      gradient: 'from-rose-500 to-pink-600',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      shadow: 'shadow-orange-500/20',
      gradient: 'from-orange-500 to-red-600',
    },
  };
  return colors[color] || colors.cyan;
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient accents */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">DSA Visualizer</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/sandbox" className="text-sm text-slate-400 hover:text-white transition-colors">
                Sandbox
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-400">Interactive Learning Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Master{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Data Structures
              </span>
              <br />
              & Algorithms
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
              Visualize, understand, and master DSA through interactive animations, 
              real-time code execution, and AI-powered explanations.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sandbox"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all"
              >
                <Code2 className="w-5 h-5" />
                Open Sandbox
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/visualizer"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Cpu className="w-5 h-5" />
                Start Visualizing
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/5">
              <div>
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-sm text-slate-500">Algorithms</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-sm text-slate-500">Data Structures</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-sm text-slate-500">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">∞</div>
                <div className="text-sm text-slate-500">Practice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Categories */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Explore Algorithms</h2>
              <p className="text-slate-400 max-w-xl">
                Choose a category to start visualizing algorithms with interactive step-by-step animations
              </p>
            </div>
            <Link 
              href="/sandbox"
              className="hidden sm:flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all in Sandbox
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {algorithmCategories.map((category) => {
              const colors = getColorClasses(category.color);
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`group relative p-6 rounded-2xl bg-slate-900/50 border ${colors.border} transition-all duration-300 hover:bg-slate-900/80 hover:-translate-y-1`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg ${colors.shadow}`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-white transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {category.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {category.algorithms.map((algo) => (
                      <span
                        key={algo}
                        className={`text-xs px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}
                      >
                        {algo}
                      </span>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-slate-500">{category.stats}</span>
                    <ChevronRight className={`w-4 h-4 ${colors.text} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sandbox Feature */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/sandbox"
            className="group block relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/5 to-transparent" />
            
            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">New Feature</span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 group-hover:text-cyan-50 transition-colors">
                    Algorithm Sandbox
                  </h2>
                  
                  <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                    Write, execute, and learn algorithms in real-time. Features Monaco Editor, 
                    AI-powered tutoring, and instant code execution in Java, C#, and Python.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {['Monaco Editor', 'AI Tutor', 'Java', 'C#', 'Python', 'Live Execution'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-sm bg-white/5 rounded-lg text-slate-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="inline-flex items-center gap-3 text-cyan-400 font-semibold group-hover:gap-4 transition-all">
                    <span>Launch Sandbox</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Code preview mockup */}
                <div className="lg:w-[400px] shrink-0">
                  <div className="rounded-xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-xs text-slate-500 ml-2">bubble_sort.py</span>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <div className="text-slate-500">
                        <span className="text-violet-400">def</span>{" "}
                        <span className="text-cyan-400">bubble_sort</span>
                        <span className="text-slate-300">(arr):</span>
                      </div>
                      <div className="text-slate-500 pl-4">
                        <span className="text-violet-400">for</span>{" "}
                        <span className="text-slate-300">i</span>{" "}
                        <span className="text-violet-400">in</span>{" "}
                        <span className="text-cyan-400">range</span>
                        <span className="text-slate-300">(len(arr)):</span>
                      </div>
                      <div className="text-slate-500 pl-8">
                        <span className="text-violet-400">for</span>{" "}
                        <span className="text-slate-300">j</span>{" "}
                        <span className="text-violet-400">in</span>{" "}
                        <span className="text-cyan-400">range</span>
                        <span className="text-slate-300">(...):</span>
                      </div>
                      <div className="text-slate-600 pl-12 mt-1">
                        # Compare and swap
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <Link
              href="/quiz"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 to-slate-900 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 p-8 sm:p-12"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Test Yourself</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 group-hover:text-purple-50 transition-colors flex items-center gap-3">
                  <span className="text-4xl">📝</span> DSA Quiz
                </h2>
                
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Challenge yourself with AI-generated quizzes on data structures and algorithms. 
                  Choose your topic, difficulty, and track your progress.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Multiple Choice', '8 Topics', '3 Difficulty Levels', 'Instant Feedback', 'Explanations'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 text-sm bg-purple-500/10 rounded-lg text-purple-300 border border-purple-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="inline-flex items-center gap-3 text-purple-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Start Quiz</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Quick Stats */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quiz Topics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['🔢 Arrays', '🔄 Sorting', '🔍 Searching', '🌳 Trees', '🕸️ Graphs', '🔐 Hashing', '🔗 Linked Lists', '🎯 All Topics'].map((topic) => (
                    <div key={topic} className="px-3 py-2 bg-slate-800/50 rounded-lg text-sm text-slate-300">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 p-6 rounded-2xl bg-slate-900/50 border border-white/5">
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Learning Path</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">1</span>
                    <span className="text-slate-300">Visualize algorithms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-bold">2</span>
                    <span className="text-slate-300">Practice in Sandbox</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">3</span>
                    <span className="text-slate-300">Test with Quiz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Learn Here?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A comprehensive platform designed to make algorithm learning intuitive and engaging
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-white/10 hover:bg-slate-900/50 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${idx === 0 ? 'from-cyan-500 to-blue-600' : idx === 1 ? 'from-violet-500 to-purple-600' : idx === 2 ? 'from-emerald-500 to-teal-600' : 'from-amber-500 to-orange-600'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complexity Reference */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Time Complexity</h2>
            <p className="text-slate-400">Quick reference for Big O notation</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {complexityData.map((item) => {
              const colors = getColorClasses(item.color);
              return (
                <div
                  key={item.notation}
                  className={`p-5 rounded-xl bg-slate-900/50 border ${colors.border.split(' ')[0]} text-center transition-all hover:scale-105`}
                >
                  <div className={`text-2xl sm:text-3xl font-mono font-bold ${colors.text} mb-1`}>
                    {item.notation}
                  </div>
                  <div className="text-sm text-slate-400 mb-2">{item.name}</div>
                  <div className="text-xs text-slate-600">{item.example}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to master algorithms?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Start visualizing and coding today. No signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sandbox"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25"
            >
              Start Learning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Explore Visualizers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-slate-500">Interactive DSA Visualizer</span>
            </div>
            <div className="text-sm text-slate-600">
              Made by Gio Joshua Gonzales • 2ACSAD UMak
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
