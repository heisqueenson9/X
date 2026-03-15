import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Zap, BookOpen, Shield, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Paraphrasing X',
  description: 'Learn about Paraphrasing X — the AI-powered academic writing tool built for Ghanaian students.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="bg-black py-20 relative overflow-hidden">
          <div className="absolute top-0 inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #00D1FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D1FF] to-[#0077AA] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#00D1FF]/30">
              <Zap size={36} className="text-black fill-black" />
            </div>
            <h1 className="text-5xl font-black text-white font-display mb-4">
              About <span className="text-[#00D1FF]">Paraphrasing X</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Built to empower African students and academics with world-class AI writing tools
              at affordable prices.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#0a0a0a] py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  icon: BookOpen,
                  title: 'Our Mission',
                  color: 'text-[#00D1FF]',
                  bg: 'bg-[#00D1FF]/10',
                  text: 'To democratize access to premium academic writing tools for Ghanaian and African students. We believe every student deserves the best chance at academic success, regardless of their economic background.',
                },
                {
                  icon: Globe,
                  title: 'Who We Serve',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                  text: 'University and polytechnic students, researchers, academics, and professional writers across Ghana and Africa. Our tool is tuned specifically for African educational institutions and their academic requirements.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-[#111] rounded-2xl p-6 border border-white/10">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                      <Icon size={24} className={item.color} />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-3">{item.title}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Tech */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-black text-white font-display mb-6 text-center">
                🤖 Our AI Technology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Llama 3 / Mistral 7B', desc: 'Core paraphrasing engine running locally', badge: 'Primary Model' },
                  { name: 'Ollama', desc: 'Local model serving — no API costs or data leaks', badge: 'Runtime' },
                  { name: 'Smart Chunking', desc: 'Handles unlimited text by intelligently splitting & reuniting content', badge: 'Innovation' },
                ].map((t) => (
                  <div key={t.name} className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <span className="text-xs font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-0.5 rounded-full mb-2 inline-block">{t.badge}</span>
                    <h3 className="text-white font-bold text-sm mb-1">{t.name}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic compliance */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={22} className="text-green-500" />
                <h2 className="text-lg font-bold text-green-400">Academic Integrity Compliance</h2>
              </div>
              <p className="text-sm text-green-500/80 leading-relaxed mb-4">
                Paraphrasing X is designed to assist students in restructuring &amp; improving their own work —
                not to enable academic dishonesty. Our tool follows international academic writing standards:
              </p>
              <ul className="space-y-2">
                {[
                  'Preserves original meaning and argument structure',
                  'Maintains proper citation placeholders',
                  'Improves grammar and coherence',
                  'Reduces unintentional similarity from common phrases',
                  'Encourages proper APA, MLA, and Chicago style usage',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-green-400/90">
                    <span className="text-green-500 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center">
              <h2 className="text-2xl font-black text-white font-display mb-4">Get in Touch</h2>
              <p className="text-gray-400 mb-5 text-sm">
                Have questions, feedback, or need support? We&apos;re here to help.
              </p>
              <a
                href="mailto:equeensoneduafo@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 btn-cyan rounded-2xl font-bold text-sm"
              >
                <Mail size={16} />
                equeensoneduafo@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
