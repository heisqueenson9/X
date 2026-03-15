'use client';

import { useState, useRef, useEffect } from 'react';
import { Lock, TrendingDown, TrendingUp, ShieldCheck, Upload, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  paraphrasedText: string;
  stats: {
    plagiarismBefore: number;
    plagiarismAfter: number;
    aiDetectionBefore: number;
    aiDetectionAfter: number;
  };
  sessionId: string;
  originalText: string;
  onPaymentSuccess: (text: string) => void;
  onBack: () => void;
}

export default function ResultsPreview({
  paraphrasedText,
  stats,
  sessionId,
  originalText,
  onPaymentSuccess,
  onBack,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for payment status when paymentId is set
  useEffect(() => {
    if (!paymentId || paymentStatus === 'approved') return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status/${paymentId}`);
        if (!response.ok) return;

        const data = await response.json();

        if (data.paymentStatus === 'approved') {
          setPaymentStatus('approved');
          // Clear polling
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          // Notify parent to unlock result
          toast.success('Payment approved! Your full result is now unlocked. 🎉');
          setTimeout(() => {
            onPaymentSuccess(paraphrasedText);
          }, 1500);
        } else if (data.paymentStatus === 'rejected') {
          setPaymentStatus(null);
          setPaymentId(null);
          setSelectedFile(null);
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          toast.error('Payment was rejected. Please try again with a valid screenshot.');
        }
      } catch (err) {
        // Silently fail polling errors
      }
    };

    // Poll every 10 seconds
    pollingRef.current = setInterval(pollStatus, 10000);

    // Initial check
    pollStatus();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [paymentId, paymentStatus, paraphrasedText, onPaymentSuccess]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, JPEG, and PNG are accepted.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a screenshot file.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('screenshot', selectedFile);
      formData.append('textId', sessionId);

      const response = await fetch('/api/payment/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload payment screenshot.');
      }

      setPaymentId(data.paymentId);
      setPaymentStatus('approved');
      
      // Stop polling if we start auto-approving immediately
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      toast.success('Payment approved! Your full result is now unlocked. 🎉');
      setTimeout(() => {
        onPaymentSuccess(paraphrasedText);
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload screenshot.');
    } finally {
      setIsUploading(false);
    }
  };

  const getBlurredPreview = () => {
    const words = paraphrasedText.split(' ');
    const visibleCount = Math.min(40, Math.floor(words.length * 0.25));
    return {
      visible: words.slice(0, visibleCount).join(' '),
      blurred: words.slice(visibleCount).join(' '),
    };
  };

  const { visible, blurred } = getBlurredPreview();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to editor
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Plagiarism Before"
          value={`${stats.plagiarismBefore}%`}
          trend="danger"
          icon={<TrendingUp size={18} className="text-red-500" />}
          sub="Estimated"
        />
        <StatCard
          label="Plagiarism After"
          value={`${stats.plagiarismAfter}%`}
          trend="success"
          icon={<TrendingDown size={18} className="text-green-500" />}
          sub="Reduced"
        />
        <StatCard
          label="AI Detection Before"
          value={`${stats.aiDetectionBefore}%`}
          trend="danger"
          icon={<TrendingUp size={18} className="text-orange-500" />}
          sub="Estimated"
        />
        <StatCard
          label="AI Detection After"
          value={`${stats.aiDetectionAfter}%`}
          trend="success"
          icon={<ShieldCheck size={18} className="text-[#00D1FF]" />}
          sub="Human score"
        />
      </div>

      {/* Preview and Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Blurred Preview */}
        <div className="lg:col-span-3">
          <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/5">
              <span className="text-sm font-semibold text-gray-300">📄 Result Preview</span>
              <div className="flex items-center gap-1.5">
                <Lock size={13} className="text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">Locked</span>
              </div>
            </div>
            <div className="p-5 relative min-h-[300px] overflow-hidden">
              {/* Visible portion */}
              <p className="text-sm text-gray-300 leading-relaxed mb-2">{visible}...</p>
              {/* Blurred portion */}
              <div className="relative select-none">
                <p className="text-sm text-gray-300 leading-relaxed blur-preview opacity-60">{blurred}</p>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-[#1a1a1a]/95 backdrop-blur-sm rounded-2xl px-6 py-5 text-center shadow-2xl border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-[#00D1FF]/10 flex items-center justify-center mx-auto mb-3">
                      <Lock size={22} className="text-[#00D1FF]" />
                    </div>
                    <p className="font-bold text-white text-base mb-1">Result Locked</p>
                    <p className="text-xs text-gray-400">Pay GHS 11 to unlock the full text</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Watermark bar */}
            <div className="px-5 py-3 bg-gradient-to-r from-[#00D1FF]/5 to-transparent border-t border-white/5">
              <p className="text-xs text-gray-500 text-center">
                ✨ Your full result is ready · Unlock for GHS 11
              </p>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="lg:col-span-2">
          <div className="bg-[#111] rounded-2xl border border-white/10 shadow-sm overflow-hidden sticky top-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#000] to-[#1a1a1a] px-5 py-5 border-b border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#00D1FF] flex items-center justify-center">
                  <Lock size={12} className="text-black" />
                </div>
                <span className="text-white font-bold text-sm">Unlock Full Result</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[#00D1FF] font-black text-4xl font-display">GHS 11</span>
                <span className="text-gray-500 text-sm">one-time</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">via Telecel Cash</p>
            </div>

            {/* Payment Instructions */}
            {!paymentId ? (
              <>
                {/* Features */}
                <div className="px-5 py-4 border-b border-white/5">
                  {[
                    'Full result text unlocked',
                    'Copy & download options',
                    'Academic-safe result',
                    'AI detection bypassed',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 mb-2.5 last:mb-0">
                      <CheckCircle2 size={15} className="text-[#00D1FF] flex-shrink-0" />
                      <span className="text-xs text-gray-300 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Telecel Cash Instructions */}
                <div className="px-5 py-4 bg-white/[0.02] border-b border-white/5">
                  <p className="text-xs font-semibold text-gray-400 mb-3">Send GHS 11 to:</p>
                  <div className="bg-black/40 rounded-lg p-3 mb-3 border border-white/5">
                    <p className="text-sm font-mono text-white mb-2">0202979378</p>
                    <p className="text-xs text-gray-400">Telecel Cash</p>
                    <p className="text-xs text-gray-400">Name: Paraphrasing X</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    After sending the payment, upload a screenshot of the successful transaction below.
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="px-5 py-4">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Upload Payment Screenshot
                  </label>
                  <div className="relative mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-white/20 rounded-lg hover:border-[#00D1FF]/50 hover:bg-white/[0.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {selectedFile ? selectedFile.name : 'Click to select file'}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    JPG, JPEG, or PNG · Max 5MB
                  </p>
                  <button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full flex items-center justify-center gap-2 py-3 btn-cyan rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Submit Payment Screenshot
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Payment Status */
              <div className="px-5 py-6">
                <div className="flex flex-col items-center justify-center text-center">
                  {paymentStatus === 'pending' ? (
                    <>
                      <AlertCircle size={32} className="text-yellow-500 mb-3" />
                      <p className="font-bold text-white text-sm mb-1">Payment Pending</p>
                      <p className="text-xs text-gray-400 mb-4">
                        Your payment screenshot has been submitted and is awaiting admin verification. This usually takes a few minutes.
                      </p>
                      <div className="w-8 h-8 rounded-full border-2 border-gray-600 border-t-[#00D1FF] animate-spin mx-auto mb-4" />
                      <p className="text-xs text-gray-500">Checking automatically every 10 seconds...</p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={32} className="text-green-500 mb-3" />
                      <p className="font-bold text-white text-sm mb-1">Payment Approved! ✓</p>
                      <p className="text-xs text-gray-400">Your result has been unlocked. Redirecting...</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
  sub,
}: {
  label: string;
  value: string;
  trend: 'success' | 'danger';
  icon: React.ReactNode;
  sub: string;
}) {
  return (
    <div className={`stat-card rounded-2xl p-4 border border-white/10 bg-[#111]`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border border-white/5 ${
          trend === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>{sub}</span>
      </div>
      <p className={`text-2xl font-black font-display ${
        trend === 'success' ? 'text-green-400' : 'text-red-400'
      }`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
    </div>
  );
}
