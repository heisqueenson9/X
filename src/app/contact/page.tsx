import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black font-display text-white mb-6">Contact Us</h1>
          <p className="text-gray-400 mb-8">
            Have questions or need support? We&apos;re here to help!
          </p>
          <a
            href="mailto:equeensoneduafo@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 btn-cyan rounded-xl font-bold text-sm"
          >
            Email us: equeensoneduafo@gmail.com
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
