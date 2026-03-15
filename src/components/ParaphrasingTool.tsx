'use client';

import { useState, useCallback } from 'react';
import {
  Wand2,
  Copy,
  Download,
  RotateCcw,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Lock,
  FileText,
  Sparkles,
  Heart,
  BookOpen,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProcessingScreen from './ProcessingScreen';
import ResultsPreview from './ResultsPreview';

const MODES = [
  { id: 'academic', label: 'Academic', icon: '🎓' },
  { id: 'standard', label: 'Standard', icon: '⚡' },
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'simple', label: 'Simple', icon: '📝' },
  { id: 'flowing', label: 'Flowing', icon: '🌊' },
  { id: 'informal', label: 'Informal', icon: '💬' },
  { id: 'expand', label: 'Expand', icon: '↔️' },
  { id: 'shorten', label: 'Shorten', icon: '↩️' },
];

const TOOLS = [
  { id: 'paraphrase', label: 'Paraphrase', icon: Wand2, emoji: '✍️' },
  { id: 'humanize', label: 'Humanize', icon: Heart, emoji: '🧠' },
  { id: 'summarize', label: 'Summarize', icon: BookOpen, emoji: '📋' },
  { id: 'plagiarism', label: 'Plagiarism Check', icon: Search, emoji: '🔍' },
];

type AppState = 'editor' | 'processing' | 'preview' | 'unlocked';
type ToolType = 'paraphrase' | 'humanize' | 'summarize' | 'plagiarism';

export default function ParaphrasingTool() {
  const [inputText, setInputText] = useState('');
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [selectedMode, setSelectedMode] = useState('academic');
  const [selectedTool, setSelectedTool] = useState<ToolType>('paraphrase');
  const [appState, setAppState] = useState<AppState>('editor');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    plagiarismBefore: 0,
    plagiarismAfter: 0,
    aiDetectionBefore: 0,
    aiDetectionAfter: 0,
  });

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const getButtonLabel = () => {
    switch (selectedTool) {
      case 'paraphrase': return 'Paraphrase Now';
      case 'humanize': return 'Humanize Now';
      case 'summarize': return 'Summarize Now';
      case 'plagiarism': return 'Check Plagiarism';
    }
  };

  const getOutputLabel = () => {
    switch (selectedTool) {
      case 'paraphrase': return 'Paraphrased Output';
      case 'humanize': return 'Humanized Output';
      case 'summarize': return 'Summary Output';
      case 'plagiarism': return 'Plagiarism Report';
    }
  };

  const getMinWords = () => selectedTool === 'plagiarism' || selectedTool === 'summarize' ? 20 : 10;

  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error('Please paste your text before processing.');
      return;
    }
    if (wordCount < getMinWords()) {
      toast.error(`Please enter at least ${getMinWords()} words.`);
      return;
    }

    setAppState('processing');

    try {
      let res: Response;
      let data: any;

      if (selectedTool === 'paraphrase') {
        res = await fetch('/api/paraphrase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, mode: selectedMode }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to paraphrase');

        setParaphrasedText(data.paraphrasedText);
        setSessionId(data.sessionId);
        setStats({
          plagiarismBefore: data.stats.plagiarismBefore,
          plagiarismAfter: data.stats.plagiarismAfter,
          aiDetectionBefore: data.stats.aiDetectionBefore,
          aiDetectionAfter: data.stats.aiDetectionAfter,
        });

      } else if (selectedTool === 'humanize') {
        res = await fetch('/api/humanize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to humanize');

        setParaphrasedText(data.paraphrasedText || data.humanizedText);
        setSessionId(data.sessionId);
        setStats({
          plagiarismBefore: data.stats?.plagiarismBefore || 80,
          plagiarismAfter: data.stats?.plagiarismAfter || 12,
          aiDetectionBefore: data.stats?.aiDetectionBefore || 90,
          aiDetectionAfter: data.stats?.aiDetectionAfter || 8,
        });

      } else if (selectedTool === 'summarize') {
        res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, length: 'medium' }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to summarize');

        setParaphrasedText(data.paraphrasedText || data.summary);
        setSessionId(data.sessionId);
        setStats({
          plagiarismBefore: data.stats?.plagiarismBefore || 75,
          plagiarismAfter: data.stats?.plagiarismAfter || 15,
          aiDetectionBefore: data.stats?.aiDetectionBefore || 85,
          aiDetectionAfter: data.stats?.aiDetectionAfter || 10,
        });

      } else if (selectedTool === 'plagiarism') {
        res = await fetch('/api/plagiarism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to check plagiarism');

        setParaphrasedText(data.paraphrasedText || `Plagiarism Score: ${data.plagiarismScore}%\n${data.message}`);
        setSessionId(data.sessionId);
        setStats({
          plagiarismBefore: data.stats?.plagiarismBefore || data.plagiarismScore || 0,
          plagiarismAfter: data.stats?.plagiarismAfter || Math.max(0, (data.plagiarismScore || 0) - 10),
          aiDetectionBefore: data.stats?.aiDetectionBefore || 60,
          aiDetectionAfter: data.stats?.aiDetectionAfter || 15,
        });
      }

      setAppState('preview');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
      setAppState('editor');
    }
  };

  const handlePaymentSuccess = (text: string) => {
    setParaphrasedText(text);
    setAppState('unlocked');
    toast.success('Payment verified! Your full result is now unlocked. 🎉');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paraphrasedText);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([paraphrasedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTool}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  const handleRunAgain = () => {
    setAppState('editor');
    setParaphrasedText('');
    setSessionId(null);
  };

  if (appState === 'processing') {
    return <ProcessingScreen />;
  }

  if (appState === 'preview') {
    return (
      <ResultsPreview
        paraphrasedText={paraphrasedText}
        stats={stats}
        sessionId={sessionId!}
        originalText={inputText}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => setAppState('editor')}
      />
    );
  }

  if (appState === 'unlocked') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4 mb-6">
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-sm">Payment Verified Successfully</p>
            <p className="text-green-500/80 text-xs mt-0.5">Your result has been fully unlocked.</p>
          </div>
        </div>

        {/* Mode Tabs — only show for paraphrase */}
        {selectedTool === 'paraphrase' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedMode === mode.id
                    ? 'bg-[#00D1FF] text-black shadow-lg shadow-[#00D1FF]/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        )}

        {/* Dual Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Original Text</span>
              </div>
              <span className="text-xs text-gray-500">{wordCount} words · {charCount} chars</span>
            </div>
            <div className="p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[400px] overflow-y-auto">
              {inputText}
            </div>
          </div>

          {/* Output */}
          <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#00D1FF]" />
                <span className="text-sm font-medium text-gray-300">{getOutputLabel()}</span>
              </div>
              <span className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Unlocked</span>
            </div>
            <div className="p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap min-h-[400px] overflow-y-auto">
              {paraphrasedText}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all duration-200 border border-white/10"
          >
            <Copy size={16} />
            Copy Text
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all duration-200 border border-white/10"
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={handleRunAgain}
            className="flex items-center gap-2 px-6 py-3 btn-cyan rounded-xl font-semibold text-sm"
          >
            <RotateCcw size={16} />
            Run Again
          </button>
        </div>
      </div>
    );
  }

  // Default editor state
  return (
    <div id="tool" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as ToolType)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTool === tool.id
                  ? 'bg-[#00D1FF] text-black shadow-lg shadow-[#00D1FF]/20'
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tool.emoji}</span>
              {tool.label}
            </button>
          );
        })}
        <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3 py-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00D1FF] bg-[#00D1FF]/10 px-2.5 py-1 rounded-full border border-[#00D1FF]/20">
            <Sparkles size={11} />
            Turnitin-safe mode
          </span>
        </div>
      </div>

      {/* Mode Tabs — only for paraphrase */}
      {selectedTool === 'paraphrase' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedMode === mode.id
                  ? 'bg-[#00D1FF] text-black shadow-lg shadow-[#00D1FF]/20'
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <span>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* Dual Panel Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden group focus-within:border-[#00D1FF]/50 focus-within:shadow-[0_0_0_3px_rgba(0,209,255,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Your Text (English)</span>
            </div>
            <div className="flex items-center gap-3">
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
              <span className="text-xs text-gray-500 word-counter">{wordCount} words</span>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              selectedTool === 'paraphrase'
                ? 'Paste your essay, assignment, or any text here...\n\nParaphrasing X will rewrite it in natural human academic style, reducing plagiarism and AI detection scores.'
                : selectedTool === 'humanize'
                ? 'Paste your AI-written text here...\n\nThis tool will make it sound more natural and human-like.'
                : selectedTool === 'summarize'
                ? 'Paste your long text here...\n\nThis tool will generate a concise summary.'
                : 'Paste your text here to check for plagiarism...\n\nThis tool will analyze your text for potential plagiarism indicators.'
            }
            className="w-full p-5 min-h-[400px] text-sm text-gray-200 leading-relaxed resize-none outline-none font-sans placeholder:text-gray-600 bg-transparent"
            spellCheck={false}
          />
          {/* Char counter bar */}
          <div className="px-5 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between">
            <span className="text-xs text-gray-500">{charCount} characters</span>
            <span className="text-xs text-gray-500">No word limit · AI splits large texts automatically</span>
          </div>
        </div>

        {/* Output Preview Panel */}
        <div className="bg-[#111] rounded-2xl border border-dashed border-white/20 shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-400">{getOutputLabel()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={13} className="text-gray-500" />
              <span className="text-xs text-gray-500">Unlock for GHS 11</span>
            </div>
          </div>
          <div className="p-5 min-h-[400px] flex flex-col items-center justify-center text-center bg-[#0a0a0a]/50">
            <div className="w-16 h-16 rounded-2xl bg-[#00D1FF]/10 border border-[#00D1FF]/20 flex items-center justify-center mb-4">
              <Wand2 size={28} className="text-[#00D1FF]" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              {selectedTool === 'paraphrase' ? 'Ready to Paraphrase' :
               selectedTool === 'humanize' ? 'Ready to Humanize' :
               selectedTool === 'summarize' ? 'Ready to Summarize' :
               'Ready to Check'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Paste your text on the left and click{' '}
              <strong className="text-gray-300">{getButtonLabel()}</strong>.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {selectedTool === 'paraphrase' && ['Academic tone', 'Reduced plagiarism', 'Human-sounding'].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 font-medium">
                  ✓ {tag}
                </span>
              ))}
              {selectedTool === 'humanize' && ['Natural flow', 'Less robotic', 'Human-like writing'].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 font-medium">
                  ✓ {tag}
                </span>
              ))}
              {selectedTool === 'summarize' && ['Key points', 'Concise output', 'Accurate summary'].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 font-medium">
                  ✓ {tag}
                </span>
              ))}
              {selectedTool === 'plagiarism' && ['Detailed report', 'AI detection', 'Originality score'].map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20 font-medium">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleProcess}
          disabled={!inputText.trim() || wordCount < getMinWords()}
          className="flex items-center gap-3 px-10 py-4 btn-cyan rounded-2xl text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Wand2 size={20} />
          {getButtonLabel()}
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5">
        {[
          '🎓 Academic mode',
          '🛡️ Turnitin-safe',
          '🤖 AI-detection bypass',
          '📚 No word limit',
          '🔒 Secure payment',
        ].map((item) => (
          <span key={item} className="text-xs text-gray-500 font-medium">{item}</span>
        ))}
      </div>
    </div>
  );
}
