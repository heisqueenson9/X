'use client';

import { useEffect, useState } from 'react';
import { Brain, PenLine, UserCheck, ShieldCheck, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Analyzing text structure', icon: Brain, delay: 0 },
  { id: 2, label: 'Rewriting sentences', icon: PenLine, delay: 2500 },
  { id: 3, label: 'Humanizing academic tone', icon: UserCheck, delay: 5500 },
  { id: 4, label: 'Reducing plagiarism signals', icon: ShieldCheck, delay: 9000 },
];

export default function ProcessingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        setProgress(Math.round(((index + 1) / STEPS.length) * 95));
      }, step.delay);
    });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center">
      {/* Animated Logo */}
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00D1FF]/20 to-[#00D1FF]/5 border-2 border-[#00D1FF]/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#0099CC] flex items-center justify-center animate-pulse">
            <Brain size={32} className="text-black" />
          </div>
        </div>
        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-[#00D1FF]/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-[-8px] rounded-full border border-[#00D1FF]/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 text-center font-display">
        AI is working its magic...
      </h2>
      <p className="text-sm text-gray-400 mb-8 text-center">
        Processing your text with our academic AI model
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="progress-bar h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="w-full flex flex-col gap-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index + 1;
          const isDone = currentStep > index + 1;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                isActive
                  ? 'bg-[#111] border-[#00D1FF]/30 shadow-sm'
                  : isDone
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-[#0a0a0a] border-white/5 opacity-40'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isActive
                    ? 'bg-[#00D1FF] text-black'
                    : isDone
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1A1A1A] text-gray-500'
                }`}
              >
                {isActive ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isDone ? (
                  <span className="text-base">✓</span>
                ) : (
                  <Icon size={18} />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-[#00B8E0]' : isDone ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-gray-500 mt-0.5 animate-pulse">In progress...</p>
                )}
                {isDone && (
                  <p className="text-xs text-green-500 mt-0.5">Completed</p>
                )}
              </div>
              {isDone && (
                <span className="text-green-500 text-lg">✅</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Large texts are split into chunks and processed sequentially. Please wait...
      </p>
    </div>
  );
}
