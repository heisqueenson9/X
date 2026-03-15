import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 prose prose-invert">
          <h1 className="text-4xl font-black font-display text-white mb-6">Terms of Service</h1>
          <p className="text-gray-400 mb-8">
            Last updated: March 2026
          </p>
          <div className="space-y-6 text-gray-300">
            <p>Welcome to Paraphrasing X. By using our service, you agree to these terms.</p>
            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Use of Service</h2>
            <p>You must not use the service for illegal activities or submit malicious content. The tool is designed to assist students and professionals in refining their writing.</p>
            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Payment & Refunds</h2>
            <p>All payments are processed securely via Paystack. Refunds are only issued if a technical error prevents you from receiving your paraphrased result.</p>
            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Academic Integrity</h2>
            <p>Paraphrasing X is a writing assistant. You are responsible for ensuring that your use complies with the academic integrity policies of your institution.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
