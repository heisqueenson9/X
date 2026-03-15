import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Paraphrasing X',
  description: 'Tips, guides, and resources for academic writing and AI paraphrasing.',
};

const POSTS = [
  {
    title: 'How to Reduce Your Turnitin Similarity Score Below 15%',
    excerpt: 'A step-by-step guide on how students can use AI paraphrasing tools ethically and effectively to improve their submission quality.',
    date: 'March 10, 2026',
    tag: 'Guide',
    tagColor: 'text-[#00D1FF] bg-[#00D1FF]/10 border-[#00D1FF]/20',
  },
  {
    title: '5 Academic Writing Mistakes That Trigger AI Detectors',
    excerpt: 'AI detection tools like Turnitin and GPTZero look for specific patterns. Learn what they are and how to write more naturally.',
    date: 'March 5, 2026',
    tag: 'Tips',
    tagColor: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    title: 'Why Local AI Models Are Better for Privacy Than ChatGPT',
    excerpt: 'When you use ChatGPT, your text is sent to OpenAI servers. Here\'s why local models like Llama 3 are a safer choice for students.',
    date: 'February 28, 2026',
    tag: 'Technology',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00D1FF] mb-3 block">
              Blog
            </span>
            <h1 className="text-4xl font-black font-display text-white mb-4">
              Academic Writing Tips & Guides
            </h1>
            <p className="text-gray-400">
              Resources to help you write better, smarter, and more confidently.
            </p>
          </div>

          <div className="space-y-6">
            {POSTS.map((post) => (
              <article
                key={post.title}
                className="bg-[#111] rounded-2xl border border-white/10 p-6 hover:border-[#00D1FF]/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#00D1FF] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
              </article>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-10">
            More articles coming soon. Stay tuned!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
