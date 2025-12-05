'use client';

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Clock, 
  Cpu, 
  Lightbulb, 
  Code2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface AlgorithmInfo {
  name: string;
  category: string;
  definition: string;
  howItWorks: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  realLifeAnalogy: {
    title: string;
    description: string;
    steps?: string[];
  };
  useCases: string[];
  pros: string[];
  cons: string[];
  funFact?: string;
}

interface AlgorithmEducationPanelProps {
  algorithm: AlgorithmInfo;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlgorithmEducationPanel({ 
  algorithm, 
  isOpen, 
  onClose 
}: AlgorithmEducationPanelProps) {
  const { isDark } = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>('analogy');

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children,
    defaultExpanded = false
  }: { 
    id: string; 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className={`border rounded-xl overflow-hidden ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-4 transition-colors ${
            isDark 
              ? 'hover:bg-slate-800/50' 
              : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-slate-800' : 'bg-slate-100'
            }`}>
              <Icon className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          )}
        </button>
        {isExpanded && (
          <div className={`px-4 pb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
        isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 px-6 py-4 border-b ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {algorithm.name}
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {algorithm.category}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-4">
          {/* Definition */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              📚 Definition
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {algorithm.definition}
            </p>
          </div>

          {/* Real-Life Analogy - Always Prominent */}
          <Section id="analogy" title="Real-Life Analogy" icon={Lightbulb}>
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20' 
                     : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    {algorithm.realLifeAnalogy.title}
                  </h4>
                  <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-amber-100/80' : 'text-amber-800/80'}`}>
                    {algorithm.realLifeAnalogy.description}
                  </p>
                  {algorithm.realLifeAnalogy.steps && (
                    <div className="space-y-2">
                      {algorithm.realLifeAnalogy.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-200 text-amber-700'
                          }`}>
                            {index + 1}
                          </span>
                          <span className={`text-sm ${isDark ? 'text-amber-100/70' : 'text-amber-800/70'}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* How It Works */}
          <Section id="howItWorks" title="How It Works" icon={Zap}>
            <ol className="space-y-2">
              {algorithm.howItWorks.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Time & Space Complexity */}
          <Section id="complexity" title="Time & Space Complexity" icon={Clock}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Time Complexity
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Best</span>
                    <code className={`text-sm px-2 py-0.5 rounded ${
                      isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>{algorithm.timeComplexity.best}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Average</span>
                    <code className={`text-sm px-2 py-0.5 rounded ${
                      isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                    }`}>{algorithm.timeComplexity.average}</code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Worst</span>
                    <code className={`text-sm px-2 py-0.5 rounded ${
                      isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700'
                    }`}>{algorithm.timeComplexity.worst}</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Space Complexity
                </h4>
                <code className={`text-sm px-2 py-0.5 rounded ${
                  isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'
                }`}>{algorithm.spaceComplexity}</code>
              </div>
            </div>
          </Section>

          {/* Use Cases */}
          <Section id="useCases" title="Real-World Use Cases" icon={Target}>
            <ul className="space-y-2">
              {algorithm.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cyan-500">•</span>
                  <span className="text-sm">{useCase}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Pros & Cons */}
          <Section id="proscons" title="Pros & Cons" icon={Code2}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className={`text-sm font-medium mb-2 flex items-center gap-1 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  ✓ Advantages
                </h4>
                <ul className="space-y-1">
                  {algorithm.pros.map((pro, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 flex items-center gap-1 ${
                  isDark ? 'text-rose-400' : 'text-rose-600'
                }`}>
                  ✗ Disadvantages
                </h4>
                <ul className="space-y-1">
                  {algorithm.cons.map((con, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-rose-500 shrink-0">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Fun Fact */}
          {algorithm.funFact && (
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20' 
                     : 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200'
            }`}>
              <div className="flex items-start gap-3">
                <Sparkles className={`w-5 h-5 shrink-0 ${isDark ? 'text-violet-400' : 'text-violet-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-1 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                    Fun Fact
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-violet-200/80' : 'text-violet-800/80'}`}>
                    {algorithm.funFact}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
