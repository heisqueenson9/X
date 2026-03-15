import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy — Paraphrasing X',
  description: 'Our refund policy — learn when and how you can get a refund.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-black font-display text-white mb-4">Refund Policy</h1>
          <p className="text-gray-400 mb-10">Last updated: March 2026</p>
          <div className="space-y-8 text-gray-300">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">When You Are Eligible for a Refund</h2>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-green-400 font-bold">✓</span> A technical error prevented your text from being paraphrased.</li>
                <li className="flex gap-2"><span className="text-green-400 font-bold">✓</span> Payment was deducted but you were not redirected to your result.</li>
                <li className="flex gap-2"><span className="text-green-400 font-bold">✓</span> The output was blank or corrupted due to a system fault.</li>
              </ul>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Non-Refundable Situations</h2>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-red-400 font-bold">✗</span> You simply did not like the paraphrasing style.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold">✗</span> You accidentally submitted text you did not intend to.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold">✗</span> The AI output did not achieve a particular plagiarism score.</li>
              </ul>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">How to Request a Refund</h2>
              <p className="text-sm leading-relaxed mb-4">
                Email us within 48 hours of your transaction with your payment reference number.
              </p>
              <a
                href="mailto:equeensoneduafo@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 btn-cyan rounded-xl font-bold text-sm"
              >
                Contact Support: equeensoneduafo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
