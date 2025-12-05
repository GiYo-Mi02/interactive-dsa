'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  spotlightPadding?: number;
}

interface OnboardingTourProps {
  steps: TourStep[];
  tourKey: string; // Unique key for localStorage to track if tour was completed
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function OnboardingTour({ 
  steps, 
  tourKey, 
  onComplete, 
  onSkip 
}: OnboardingTourProps) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Check if tour should show (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
    if (!hasSeenTour) {
      // Delay to let page render
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  // Update target element position
  const updateTargetPosition = useCallback(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target);
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Responsive tooltip dimensions
    const isMobile = viewportWidth < 640;
    const tooltipWidth = isMobile ? Math.min(viewportWidth - 32, 320) : 380;
    const tooltipHeight = isMobile ? 180 : 200;
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate tooltip position
      const padding = step.spotlightPadding || 10;

      let top = 0;
      let left = 0;

      // On mobile, prefer bottom or center positioning for better UX
      const position = isMobile && (step.position === 'left' || step.position === 'right') 
        ? 'bottom' 
        : (step.position || 'bottom');

      switch (position) {
        case 'top':
          top = rect.top - tooltipHeight - padding - 20;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + padding + 20;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - padding - 20;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + padding + 20;
          break;
        case 'center':
          top = viewportHeight / 2 - tooltipHeight / 2;
          left = viewportWidth / 2 - tooltipWidth / 2;
          break;
      }

      // Keep tooltip within viewport with smaller margins on mobile
      const margin = isMobile ? 12 : 20;
      if (left < margin) left = margin;
      if (left + tooltipWidth > viewportWidth - margin) left = viewportWidth - tooltipWidth - margin;
      if (top < margin) top = margin;
      if (top + tooltipHeight > viewportHeight - margin) top = viewportHeight - tooltipHeight - margin;

      setTooltipPosition({ top, left });
    } else {
      // Element not found, show centered
      setTargetRect(null);
      setTooltipPosition({
        top: viewportHeight / 2 - tooltipHeight / 2,
        left: viewportWidth / 2 - tooltipWidth / 2,
      });
    }
  }, [currentStep, steps, isVisible]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);
    
    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem(`tour_${tourKey}`, 'completed');
    setIsVisible(false);
    onComplete?.();
  };

  const skipTour = () => {
    localStorage.setItem(`tour_${tourKey}`, 'skipped');
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible || steps.length === 0) return null;

  const step = steps[currentStep];
  const padding = step.spotlightPadding || 10;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border/glow */}
      {targetRect && (
        <div
          className="absolute border-2 border-cyan-400 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(34, 211, 238, 0.3)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={`absolute w-[calc(100vw-24px)] sm:w-[380px] max-w-[380px] rounded-xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isDark
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-slate-200'
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className={`font-semibold text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step.title}
              </h3>
              <p className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={skipTour}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
              isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {step.content}
          </p>
        </div>

        {/* Progress bar */}
        <div className={`mx-3 sm:mx-5 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-t ${
          isDark ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <button
            onClick={skipTour}
            className={`text-xs sm:text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Skip
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className={`flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 transition-opacity"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to manually trigger tour
export function useTour(tourKey: string) {
  const [shouldShowTour, setShouldShowTour] = useState(false);
  
  const startTour = useCallback(() => {
    if (typeof window === 'undefined') return;
    // Remove the tour completion from localStorage
    localStorage.removeItem(`tour_${tourKey}`);
    // Set flag to show tour
    setShouldShowTour(true);
    // Force a small delay then reload to trigger the tour
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }, [tourKey]);
  
  const resetTour = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`tour_${tourKey}`);
    window.location.reload();
  }, [tourKey]);

  const hasCompletedTour = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`tour_${tourKey}`) !== null;
  }, [tourKey]);
  
  const isTourActive = typeof window !== 'undefined' && (!hasCompletedTour() || shouldShowTour);

  return { startTour, resetTour, hasCompletedTour, isTourActive };
}
