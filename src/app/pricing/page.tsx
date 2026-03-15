import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, X, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Paraphrasing X',
  description: 'Simple, affordable pricing. Pay just GHS 11 per paraphrase. No subscriptions.',
};

const PLANS = [
  {
    name: 'Pay Per Use',
    price: 'GHS 11',
    period: 'per paraphrase',
    description: 'Perfect for students with occasional assignments',
    featured: true,
    features: [
      { text: 'Full paraphrased result', included: true },
      { text: 'Academic, Formal, Standard modes', included: true },
      { text: 'No word limit', included: true },
      { text: 'Copy & Download', included: true },
      { text: 'AI detection reduction', included: true },
      { text: 'Plagiarism score estimates', included: true },
      { text: 'Mobile Money payment', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started — GHS 11',
    href: '/#tool',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="bg-black py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] mb-4 block">
              Pricing
            </span>
            <h1 className="text-5xl font-black text-white font-display mb-4">
              Simple, Transparent{' '}
              <span className="text-[#00D1FF]">Pricing</span>
            </h1>
            <p className="text-gray-400 text-lg">
              No subscriptions. No hidden fees. Just GHS 11 per result.
            </p>
          </div>
        </section>

        {/* Plan Card */}
        <section className="py-20 bg-black dot-grid-bg">
          <div className="max-w-lg mx-auto px-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="bg-[#111] rounded-3xl border-2 border-[#00D1FF] shadow-2xl shadow-[#00D1FF]/10 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-black to-[#111] px-8 py-8 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] text-xs font-bold mb-4">
                    <Zap size={11} fill="currentColor" />
                    Most Popular
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mb-1">{plan.name}</h2>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-[#00D1FF] font-black text-5xl font-display">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="px-8 py-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feat) => (
                      <li key={feat.text} className="flex items-center gap-3">
                        {feat.included ? (
                          <CheckCircle2 size={18} className="text-[#00D1FF] flex-shrink-0" />
                        ) : (
                          <X size={18} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${feat.included ? 'text-gray-300' : 'text-gray-500 line-through'}`}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.href}
                    className="block w-full text-center py-4 btn-cyan rounded-2xl font-bold text-base"
                  >
                    {plan.cta}
                  </a>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    🔒 Powered by Paystack · Mobile Money, Card & Bank
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-[#0a0a0a] max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black font-display text-center text-white mb-10">
            Frequently Asked Questions
          </h2>
          {[
            {
              q: 'What payment methods are accepted?',
              a: 'We accept Mobile Money (MTN, Vodafone, AirtelTigo), Credit/Debit Cards, and Bank transfers via Paystack.',
            },
            {
              q: 'Is there a word limit?',
              a: 'No! You can submit entire dissertations or research papers. Our AI automatically splits large texts into manageable chunks.',
            },
            {
              q: 'Will my text pass Turnitin?',
              a: 'Our Academic mode is specifically designed to reduce Turnitin similarity scores. Most users see plagiarism scores drop to under 20%. Results may vary.',
            },
            {
              q: 'Is my text kept private?',
              a: 'Yes. All texts are encrypted and auto-deleted after 24 hours. We never share or sell your data.',
            },
            {
              q: 'Can I get a refund?',
              a: 'If the AI fails to process your text due to a technical error, we will issue a full refund. Contact equeensoneduafo@gmail.com.',
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-white/10 py-5">
              <h3 className="text-sm font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
