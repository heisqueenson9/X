'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface PlagiarismResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  wordCount: number;
  uniquenessPct: number;
  suggestions: string[];
}

export default function PlagiarismPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [loading, setLoading] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const analyze = async () => {
    if (!text.trim() || wordCount < 20) {
      toast.error('Please enter at least 20 words to check.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/plagiarism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Plagiarism check failed');

      const level: PlagiarismResult['level'] = data.plagiarismScore < 25 ? 'low' : data.plagiarismScore < 55 ? 'medium' : 'high';

      setResult({
        score: data.plagiarismScore,
        level,
        wordCount: data.wordCount,
        uniquenessPct: 100 - data.plagiarismScore,
        suggestions: [
          'Rephrase sentences that closely match source material.',
          'Add more original analysis and commentary.',
          'Cite sources properly using APA or MLA format.',
          'Use our Paraphrasing X tool to rewrite flagged sections.',
          'Avoid copying more than 5–10 words in a row from any source.',
        ],
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to check plagiarism. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const levelConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Low Plagiarism', icon: CheckCircle2 },
    medium: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Moderate Plagiarism', icon: AlertCircle },
    high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High Plagiarism', icon: AlertCircle },
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header */}
        <section className="bg-black py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-4">
              🆕 New Feature
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-display mb-4">
              Plagiarism{' '}
              <span className="text-[#00D1FF]">Checker</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Check your text for potential plagiarism issues before submission.
              Get a detailed analysis and actionable suggestions.
            </p>
          </div>
        </section>

        {/* Tool */}
        <section className="bg-[#0a0a0a] dot-grid-bg py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Input */}
            <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden mb-6">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Paste Your Text</span>
                </div>
                <span className="text-xs text-gray-500">{wordCount} words</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your essay, assignment, or research paper here to check for plagiarism..."
                className="w-full p-5 min-h-[300px] text-sm text-gray-300 leading-relaxed resize-none outline-none font-sans placeholder:text-gray-500 bg-transparent"
              />
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={analyze}
                disabled={loading || wordCount < 20}
                className="flex items-center gap-3 px-10 py-4 btn-cyan rounded-2xl text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                {loading ? 'Analyzing...' : 'Check for Plagiarism'}
              </button>
            </div>

            {/* Results */}
            {result && !loading && (
              <div className="space-y-6 animate-fade-in">
                {/* Score */}
                <div className={`rounded-2xl border p-6 ${levelConfig[result.level].bg} ${levelConfig[result.level].border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`text-3xl font-black font-display ${levelConfig[result.level].color}`}>
                        {result.score}% Similarity
                      </p>
                      <p className={`text-sm font-medium mt-1 ${levelConfig[result.level].color}`}>
                        {levelConfig[result.level].label}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full ${levelConfig[result.level].bg} border-2 ${levelConfig[result.level].border} flex items-center justify-center`}>
                      <span className={`text-2xl font-black font-display ${levelConfig[result.level].color}`}>{result.score}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.level === 'low' ? 'bg-green-500' : result.level === 'medium' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 opacity-60 text-white">
                    <span>0% (Original)</span>
                    <span>100% (Plagiarized)</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Words', value: result.wordCount, color: 'text-white' },
                    { label: 'Unique Content', value: `${result.uniquenessPct}%`, color: 'text-green-400' },
                    { label: 'Similarity Score', value: `${result.score}%`, color: result.level === 'low' ? 'text-green-400' : result.level === 'medium' ? 'text-orange-400' : 'text-red-400' },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#111] rounded-2xl border border-white/10 p-4 text-center shadow-sm">
                      <p className={`text-2xl font-black font-display ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-sm">
                  <h3 className="font-bold text-white mb-4">💡 Improvement Suggestions</h3>
                  <ul className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA to paraphrase */}
                {result.level !== 'low' && (
                  <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                    <p className="text-white font-bold text-lg mb-2">
                      🎯 Reduce your plagiarism score automatically
                    </p>
                    <p className="text-gray-400 text-sm mb-5">
                      Our AI paraphrasing tool can rewrite your text to reduce similarity to under 15%.
                    </p>
                    <a
                      href="/#tool"
                      className="inline-flex items-center gap-2 px-8 py-3.5 btn-cyan rounded-xl font-bold text-sm"
                    >
                      Paraphrase This Text — GHS 11 →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
