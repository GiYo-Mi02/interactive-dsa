'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Bot, Loader2, MessageSquare, X, ChevronDown, ChevronUp } from 'lucide-react';

interface AIExplanationPanelProps {
  algorithm: string;
  getState: () => {
    stepDescription: string;
    rawState: Record<string, unknown>;
  };
  autoExplain?: boolean;
  className?: string;
}

export default function AIExplanationPanel({
  algorithm,
  getState,
  autoExplain = false,
  className = '',
}: AIExplanationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  // Auto-explain when step changes (if enabled)
  useEffect(() => {
    if (autoExplain) {
      const state = getState();
      if (state.stepDescription) {
        handleExplain();
      }
    }
  }, [autoExplain, getState]);

  async function handleExplain() {
    setLoading(true);
    setError('');

    try {
      const { stepDescription, rawState } = getState();

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm,
          step: stepDescription,
          state: rawState,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setExplanation(data.explanation);
        setHistory((prev) => [data.explanation, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError('Failed to get AI explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`bg-gradient-to-br from-indigo-950/80 to-purple-950/60 backdrop-blur-xl rounded-2xl border border-indigo-500/20 overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.15)] ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-indigo-400" />
            <Sparkles className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h3 className="font-semibold text-white text-sm">AI Tutor</h3>
          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
            GPT-4o
          </span>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Explain Button */}
          <button
            onClick={handleExplain}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-800 disabled:to-purple-800 rounded-xl text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Explain This Step</span>
              </>
            )}
          </button>

          {/* Algorithm Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Currently analyzing:</span>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30 font-medium">
              {algorithm}
            </span>
          </div>

          {/* Explanation Display */}
          <div className="min-h-[100px] max-h-[200px] overflow-y-auto">
            {error ? (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            ) : explanation ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 p-3 bg-slate-800/50 rounded-xl rounded-tl-none border border-slate-700/50">
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {explanation}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[100px] text-slate-500">
                <Sparkles className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm text-center">
                  Click &quot;Explain This Step&quot; to get<br />
                  AI-powered insights about the algorithm
                </p>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 1 && (
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                Previous Explanations
              </p>
              <div className="space-y-1.5 max-h-[80px] overflow-y-auto">
                {history.slice(1).map((item, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-slate-400 p-2 bg-slate-800/30 rounded-lg truncate cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setExplanation(item)}
                    title={item}
                  >
                    {item.slice(0, 80)}...
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
