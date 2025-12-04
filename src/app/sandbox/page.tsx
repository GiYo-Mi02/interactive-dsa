"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  ArrowLeft,
  Play,
  Lightbulb,
  FileText,
  ChevronDown,
  GraduationCap,
  Sparkles,
  BookOpen,
  Microscope,
  Wand2,
  Terminal,
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  ALGORITHM_TEMPLATES, 
  SupportedLanguage, 
  ExecutionResult,
  AlgorithmTemplate
} from "./types";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-cyan-400 text-sm">Loading Editor...</span>
        </div>
      </div>
    )
  }
);

type DifficultyMode = "basic" | "detailed" | "technical";

interface AIExplanation {
  content: string;
  timestamp: Date;
  difficulty: DifficultyMode;
}

// Algorithm options derived from templates
const ALGORITHM_OPTIONS = Object.entries(ALGORITHM_TEMPLATES).map(([key, value]) => ({
  value: key as AlgorithmTemplate,
  label: value.name,
}));

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

export default function SandboxPage() {
  const isMobile = useIsMobile();
  
  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("python");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmTemplate>("bubble-sort");
  const [code, setCode] = useState(ALGORITHM_TEMPLATES["bubble-sort"]?.languages.python || "");
  const [input, setInput] = useState("");
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  // AI Tutor state
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>("basic");
  const [aiExplanation, setAIExplanation] = useState<AIExplanation | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showTryItYourself, setShowTryItYourself] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);
  
  // Refs
  const editorRef = useRef<unknown>(null);

  // Load template when algorithm or language changes
  useEffect(() => {
    const template = ALGORITHM_TEMPLATES[selectedAlgorithm]?.languages[selectedLanguage];
    if (template) {
      setCode(template);
    }
  }, [selectedAlgorithm, selectedLanguage]);

  // Run code
  const runCode = useCallback(async () => {
    setIsRunning(true);
    setExecutionResult(null);
    
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          input,
        }),
      });
      
      const result = await response.json();
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        success: false,
        output: "",
        error: "Failed to execute code. Please try again.",
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, input]);

  // Get AI explanation
  const getAIExplanation = useCallback(async () => {
    setIsLoadingAI(true);
    
    const difficultyPrompts = {
      basic: "Explain this simply, like teaching a beginner. Use everyday analogies and avoid jargon.",
      detailed: "Provide a comprehensive explanation with examples and edge cases. Balance technical accuracy with clarity.",
      technical: "Give an expert-level explanation including time/space complexity analysis, optimization strategies, and implementation nuances.",
    };
    
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${difficultyPrompts[difficultyMode]}\n\nAnalyze and explain this ${selectedLanguage} code:\n\`\`\`${selectedLanguage}\n${code}\n\`\`\`\n\nAlso explain what output to expect and how the algorithm works step by step.`,
        }),
      });
      
      const data = await response.json();
      setAIExplanation({
        content: data.explanation || "Unable to generate explanation.",
        timestamp: new Date(),
        difficulty: difficultyMode,
      });
    } catch (error) {
      setAIExplanation({
        content: "Failed to get AI explanation. Please try again.",
        timestamp: new Date(),
        difficulty: difficultyMode,
      });
    } finally {
      setIsLoadingAI(false);
    }
  }, [code, selectedLanguage, difficultyMode]);

  // Check prediction
  const checkPrediction = useCallback(async () => {
    if (!prediction.trim()) {
      setPredictionFeedback("Please enter your prediction first.");
      return;
    }
    
    setIsLoadingAI(true);
    
    try {
      // First run the code to get actual output
      const execResponse = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          input,
        }),
      });
      
      const execResult = await execResponse.json();
      const actualOutput = execResult.success ? execResult.output : `Error: ${execResult.error}`;
      
      // Then ask AI to compare
      const compareResponse = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `A student predicted the output of this code would be:\n"${prediction}"\n\nThe actual output was:\n"${actualOutput}"\n\nCompare the prediction to the actual output. If correct (or essentially correct), congratulate them. If incorrect, explain what they might have misunderstood and guide them to the right understanding. Be encouraging and educational.`,
        }),
      });
      
      const compareData = await compareResponse.json();
      setPredictionFeedback(compareData.explanation || "Unable to check prediction.");
      setExecutionResult(execResult);
    } catch (error) {
      setPredictionFeedback("Failed to check prediction. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  }, [prediction, code, selectedLanguage, input]);

  // Get Monaco language ID
  const getMonacoLanguage = (lang: SupportedLanguage): string => {
    switch (lang) {
      case "java": return "java";
      case "csharp": return "csharp";
      case "python": return "python";
      default: return "plaintext";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 p-3 sm:p-4 border-b border-cyan-500/20 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/"
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              Algorithm Sandbox
            </h1>
          </div>
          
          {/* Language & Algorithm Selectors */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmTemplate)}
              className="flex-1 sm:flex-none px-2 sm:px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm focus:outline-none focus:border-cyan-500"
            >
              {ALGORITHM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1 border border-cyan-500/30">
              {(["python", "java", "csharp"] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all text-xs sm:text-sm ${
                    selectedLanguage === lang
                      ? "bg-cyan-500 text-white"
                      : "text-cyan-400 hover:bg-slate-700"
                  }`}
                >
                  {lang === "csharp" ? "C#" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable on mobile */}
      <div className="max-w-[1800px] mx-auto p-3 sm:p-4 flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:h-[calc(100vh-80px)]">
        {/* Code Editor Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Editor */}
          <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden flex flex-col min-h-[300px] sm:min-h-[400px] lg:flex-1">
            <div className="px-3 sm:px-4 py-2 bg-slate-800/50 border-b border-cyan-500/20 flex items-center justify-between gap-2">
              <span className="text-cyan-400 text-xs sm:text-sm font-mono truncate">
                {selectedAlgorithm.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} 
                <span className="text-slate-500 ml-1 sm:ml-2 hidden sm:inline">
                  ({selectedLanguage === "csharp" ? "C#" : selectedLanguage})
                </span>
              </span>
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`px-3 sm:px-4 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 sm:gap-2 text-sm ${
                  isRunning
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-400 text-white"
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 min-h-[250px] sm:min-h-[300px]">
              {isMobile ? (
                /* Mobile: Use textarea fallback */
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-slate-950 text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              ) : (
                /* Desktop: Use Monaco Editor */
                <MonacoEditor
                  height="100%"
                  language={getMonacoLanguage(selectedLanguage)}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  onMount={(editor) => { editorRef.current = editor; }}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    lineNumbers: "on",
                    roundedSelection: true,
                    automaticLayout: true,
                    tabSize: 4,
                    wordWrap: "on",
                  }}
                />
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="h-36 sm:h-48 bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden flex flex-col">
            <div className="px-3 sm:px-4 py-2 bg-slate-800/50 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
              <span className="text-cyan-400 text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Output
              </span>
              {executionResult && (
                <span className={`text-xs flex items-center gap-1 ${executionResult.success ? "text-green-400" : "text-red-400"}`}>
                  {executionResult.success ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {executionResult.success ? "Success" : "Error"} 
                  {executionResult.executionTime && ` (${executionResult.executionTime}ms)`}
                </span>
              )}
            </div>
            <div className="flex-1 p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-y-auto overscroll-contain">
              {executionResult ? (
                <div>
                  {executionResult.output && (
                    <pre className="text-green-400 whitespace-pre-wrap break-words">{executionResult.output}</pre>
                  )}
                  {executionResult.error && (
                    <pre className="text-red-400 whitespace-pre-wrap break-words">{executionResult.error}</pre>
                  )}
                </div>
              ) : (
                <span className="text-slate-500 italic">
                  Click &quot;Run&quot; to see output...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Tutor Section */}
        <div className="flex flex-col gap-4 lg:overflow-hidden">
          {/* Difficulty Selector */}
          <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-3 sm:p-4 shrink-0">
            <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              AI Tutor Mode
            </h3>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {(["basic", "detailed", "technical"] as DifficultyMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDifficultyMode(mode)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center gap-1 ${
                    difficultyMode === mode
                      ? "bg-purple-500 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {mode === "basic" && <><Sparkles className="w-3 h-3" /> Basic</>}
                  {mode === "detailed" && <><BookOpen className="w-3 h-3" /> Detailed</>}
                  {mode === "technical" && <><Microscope className="w-3 h-3" /> Technical</>}
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={getAIExplanation}
                disabled={isLoadingAI}
                className="px-2 sm:px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all text-xs sm:text-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" />
                Explain
              </button>
              <Link
                href="/quiz"
                className="px-2 sm:px-3 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all text-xs sm:text-sm text-center flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                Take Quiz
              </Link>
            </div>
          </div>

          {/* Try It Yourself */}
          <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-3 sm:p-4 shrink-0">
            <button
              onClick={() => setShowTryItYourself(!showTryItYourself)}
              className="w-full flex items-center justify-between text-cyan-400 font-semibold text-sm sm:text-base"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Try It Yourself
              </span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform ${showTryItYourself ? "rotate-180" : ""}`} 
              />
            </button>
            
            {showTryItYourself && (
              <div className="mt-3 sm:mt-4 space-y-3">
                <p className="text-slate-400 text-xs sm:text-sm">
                  Predict what the output will be before running the code!
                </p>
                <textarea
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  placeholder="Enter your prediction..."
                  className="w-full h-20 sm:h-24 bg-slate-800 border border-slate-600 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
                <button
                  onClick={checkPrediction}
                  disabled={isLoadingAI}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isLoadingAI ? "Checking..." : "Check My Prediction"}
                </button>
                
                {predictionFeedback && (
                  <div className="mt-3 p-2.5 sm:p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20 max-h-32 overflow-y-auto overscroll-contain">
                    <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap">{predictionFeedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Explanation Display */}
          <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden flex flex-col min-h-[250px] sm:min-h-[300px] lg:flex-1">
            <div className="px-3 sm:px-4 py-2 bg-slate-800/50 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
              <span className="text-cyan-400 text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                AI Explanation
              </span>
              {aiExplanation && (
                <span className="text-xs text-slate-500">
                  {aiExplanation.difficulty} mode
                </span>
              )}
            </div>
            <div 
              className="flex-1 p-3 sm:p-4 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {isLoadingAI ? (
                <div className="flex items-center justify-center h-full min-h-[150px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-cyan-400 text-sm">Thinking...</span>
                  </div>
                </div>
              ) : aiExplanation ? (
                <div className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
                  {aiExplanation.content}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[150px] text-slate-500 text-xs sm:text-sm text-center px-4">
                  Click &quot;Explain&quot; to get AI-powered explanations
                </div>
              )}
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-3 sm:p-4 shrink-0">
            <label className="text-cyan-400 text-xs sm:text-sm block mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Program Input (stdin)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program..."
              className="w-full h-16 sm:h-20 bg-slate-800 border border-slate-600 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-mono"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
