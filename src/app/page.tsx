import Link from "next/link";
import { 
  Rocket, 
  Network, 
  Route, 
  ShieldOff, 
  ArrowRight,
  Sparkles
} from "lucide-react";

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

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12">
        <div className="text-center space-y-6 sm:space-y-8 max-w-5xl">
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
          <p className="text-base sm:text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            Experience Dijkstra&apos;s Algorithm through stunning, interactive
            visualizations. Navigate through space as you discover the shortest paths.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16 px-2">
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:bg-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/25">
                <Network className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Interactive Graphs</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Generate dynamic mesh graphs and select nodes with intuitive click interactions
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                <Route className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                Step-by-Step Animation
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Watch the algorithm explore nodes and discover the optimal path in real-time
              </p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:bg-white/10 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/25">
                <ShieldOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Dynamic Rerouting</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Block nodes and observe how the algorithm intelligently adapts to find new routes
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10 sm:mt-16">
            <Link
              href="/visualizer"
              className="group inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-full text-base sm:text-xl font-semibold
                hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105
                shadow-lg shadow-purple-500/20"
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
              <span>Launch Visualizer</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-12 sm:mt-20 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Powered by</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-slate-400 px-4">
              {["Next.js 15", "React 19", "TypeScript", "p5.js", "D3.js", "TailwindCSS"].map((tech) => (
                <span key={tech} className="bg-white/5 backdrop-blur px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/5 hover:border-white/20 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
