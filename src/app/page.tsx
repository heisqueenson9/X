'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParaphrasingTool from '@/components/ParaphrasingTool';
import { useEffect, useRef } from 'react';
import {
  Users,
  FileCheck,
  Award,
  ShieldCheck,
  BookOpen,
  Cpu,
  Zap,
  Globe,
  Star,
} from 'lucide-react';

const STATS = [
  { value: '500K+', label: 'Texts Paraphrased', icon: FileCheck },
  { value: '98%', label: 'Human Score Achieved', icon: Award },
  { value: '50K+', label: 'Students Helped', icon: Users },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Turnitin & Plagiarism Safe',
    desc: 'Our Academic mode specifically targets Turnitin detection with sentence restructuring, synonym replacement, and human flow patterns.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Cpu,
    title: 'Powered by Open-Source AI',
    desc: 'Uses Llama 3 and Mistral 7B models locally. No OpenAI API fees passed to you — keeping costs low and privacy intact.',
    color: 'text-[#00D1FF]',
    bg: 'bg-[#00D1FF]/5',
    border: 'border-[#00D1FF]/10',
  },
  {
    icon: BookOpen,
    title: 'Academic Rule-Compliant',
    desc: 'Follows international academic writing standards. Maintains original meaning while improving grammar, flow, and structure.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Zap,
    title: 'No Word Limit',
    desc: 'Submit entire dissertations, theses, or research papers. Our AI chunking engine handles any length automatically.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  {
    icon: Globe,
    title: 'Ghana & Africa First',
    desc: "Pay just GHS 11 via Mobile Money. Built for African students, priced for African budgets.",
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'All submissions are encrypted. We never share or sell your text. Strict data privacy following GDPR principles.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'Kwame Asante',
    role: 'UG Final Year Student, Legon',
    text: 'I was desperate before submission. Paraphrasing X rewrote my entire 4000-word essay in minutes and I passed Turnitin with 8% similarity. Literally a lifesaver!',
    rating: 5,
    avatar: 'KA',
  },
  {
    name: 'Abena Mensah',
    role: 'KNUST Masters Student',
    text: 'The Academic mode is incredible. It kept all my research points intact but made everything sound so much more naturally human. GHS 11 is great value for this quality.',
    rating: 5,
    avatar: 'AM',
  },
  {
    name: 'Kofi Osei',
    role: 'Research Assistant, Ghana',
    text: "I've tried other tools before but they all changed the meaning. Paraphrasing X actually understands academic context. Highly recommend for any student.",
    rating: 5,
    avatar: 'KO',
  },
];

const AI_MODELS = ['ChatGPT', 'GPT-4', 'Gemini', 'Claude', 'Copilot', 'Bard', 'Jasper', 'Llama'];

export default function HomePage() {
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black pt-16 pb-0 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #00D1FF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00D1FF]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D1FF]/10 border border-[#00D1FF]/20 text-[#00D1FF] text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
              New! Turnitin-Safe Academic Mode
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center leading-tight font-display mb-6">
            Paraphrase &amp;{' '}
            <span className="gradient-text">Humanize</span>
            <br />
            Your Essay Instantly
          </h1>

          <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-8 leading-relaxed">
            Paste your text and get a rewritten, human-sounding, academically correct version.
            Beat Turnitin &amp; AI detectors. Perfect for Ghanaian students.
          </p>

          {/* AI Models marquee */}
          <div className="flex justify-center gap-3 flex-wrap mb-10">
            <span className="text-sm text-gray-500 font-medium">Humanizes text from:</span>
            {AI_MODELS.map((model) => (
              <span
                key={model}
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-medium"
              >
                {model}
              </span>
            ))}
          </div>
        </div>

        {/* Tool Section — sits on the dark hero, transitions into dark dot grid */}
        <div className="bg-black dot-grid-bg relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <ParaphrasingTool />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black dot-grid-bg py-16">
        <div
          ref={addRef}
          className="section-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="stat-card bg-[#111] rounded-2xl border border-white/10 shadow-sm p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00D1FF]/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-[#00D1FF]" />
                </div>
                <p className="text-3xl font-black font-display text-white mb-1">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRef} className="section-fade text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] mb-3 block">
              Why Paraphrasing X
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
              Built for Academic Excellence
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              Designed specifically for students and researchers who need accurate, ethical,
              and academically compliant paraphrasing.
            </p>
          </div>

          <div ref={addRef} className="section-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`feature-card bg-[#111] rounded-2xl p-6 border ${feat.border}`}
                >
                  <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={feat.color} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRef} className="section-fade text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] mb-3 block">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
              3 Simple Steps
            </h2>
          </div>
          <div ref={addRef} className="section-fade grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Your Text',
                desc: 'Paste any text — essays, assignments, research papers. No word limit.',
                emoji: '📋',
              },
              {
                step: '02',
                title: 'AI Paraphrases',
                desc: 'Our local AI engine analyzes, rewrites, and humanizes your text in academic style.',
                emoji: '🤖',
              },
              {
                step: '03',
                title: 'Pay & Download',
                desc: 'Pay GHS 11 via Telecel Cash. Instantly unlock, copy, or download your result.',
                emoji: '💰',
              },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 text-white flex items-center justify-center text-xl font-black mx-auto mb-4 font-display">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={addRef} className="section-fade text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] mb-3 block">
              Student Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
              Loved by Ghanaian Students
            </h2>
          </div>
          <div ref={addRef} className="section-fade grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="glass-card bg-[#111] rounded-2xl p-6 border border-white/5 hover:border-[#00D1FF]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#00D1FF] fill-[#00D1FF]" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#0077AA] flex items-center justify-center text-black font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#00D1FF] to-[#0099CC] py-16">
        <div ref={addRef} className="section-fade max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black font-display text-black mb-4">
            Ready to Ace Your Submission?
          </h2>
          <p className="text-black/70 mb-8 text-lg">
            Join 50,000+ students who trusted Paraphrasing X with their academic work.
          </p>
          <a
            href="#tool"
            className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-2xl font-bold text-base hover:bg-gray-900 transition-all duration-200 shadow-2xl"
          >
            Paraphrase for GHS 11 →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
