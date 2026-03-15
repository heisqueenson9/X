'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Copy,
  Download,
  RotateCcw,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('sessionId');
  const ref = searchParams.get('ref');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    paraphrasedText: string;
    stats: {
      plagiarismBefore: number;
      plagiarismAfter: number;
      aiDetectionBefore: number;
      aiDetectionAfter: number;
    };
    mode: string;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session. Please try again.');
      setLoading(false);
      return;
    }

    fetch(`/api/result?sessionId=${sessionId}&ref=${ref || ''}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setResult(data);
        } else {
          setError(data.error || 'Could not load your result.');
        }
      })
      .catch(() => setError('Network error. Please refresh the page.'))
      .finally(() => setLoading(false));
  }, [sessionId, ref]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.paraphrasedText);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.paraphrasedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paraphrased-result.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="w-16 h-16 rounded-full bg-[#00D1FF]/10 flex items-center justify-center mb-4">
          <Loader2 size={28} className="text-[#00D1FF] animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Loading your result...</h2>
        <p className="text-sm text-gray-400">Verifying payment and retrieving your text</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-sm">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 btn-cyan rounded-xl font-bold text-sm"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!result) return null;

  const wordCount = result.paraphrasedText.split(/\s+/).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success Banner */}
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4 mb-8">
        <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
        <div>
          <p className="text-green-400 font-bold">🎉 Payment Successful! Your result is unlocked.</p>
          <p className="text-green-500/80 text-sm mt-0.5">
            Your paraphrased text is ready. Copy, download, or save it below.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Plagiarism Before', value: `${result.stats.plagiarismBefore}%`, color: 'text-red-400', bg: 'bg-[#111]', border: 'border-white/10' },
          { label: 'Plagiarism After', value: `${result.stats.plagiarismAfter}%`, color: 'text-green-400', bg: 'bg-[#111]', border: 'border-white/10' },
          { label: 'AI Detection Before', value: `${result.stats.aiDetectionBefore}%`, color: 'text-orange-400', bg: 'bg-[#111]', border: 'border-white/10' },
          { label: 'AI Detection After', value: `${result.stats.aiDetectionAfter}%`, color: 'text-[#00D1FF]', bg: 'bg-[#111]', border: 'border-white/10' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-4 border ${stat.bg} ${stat.border} shadow-sm`}>
            <p className={`text-2xl font-black font-display ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Full Result */}
      <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#00D1FF]" />
            <span className="text-sm font-bold text-gray-300">Your Paraphrased Result</span>
            <span className="ml-2 text-xs bg-[#00D1FF]/10 text-[#00D1FF] px-2 py-0.5 rounded-full font-medium border border-[#00D1FF]/20">
              {result.mode.charAt(0).toUpperCase() + result.mode.slice(1)} Mode
            </span>
          </div>
          <span className="text-xs text-gray-500">{wordCount} words</span>
        </div>
        <div className="p-6 bg-black/40">
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
            {result.paraphrasedText}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold text-sm hover:bg-white/10 border border-white/10 transition-colors shadow-md"
        >
          <Copy size={16} />
          Copy Text
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold text-sm hover:bg-white/10 border border-white/10 transition-colors shadow-md"
        >
          <Download size={16} />
          Download .txt
        </button>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-6 py-3 btn-cyan rounded-xl font-semibold text-sm"
        >
          <RotateCcw size={16} />
          Paraphrase Another
        </button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-gray-400 mt-6">
        💡 Tip: Save your text now. This result will be auto-deleted after 24 hours for your privacy.
      </p>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin text-[#00D1FF]" />
            </div>
          }
        >
          <ResultContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
