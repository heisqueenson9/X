import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white dot-grid-bg">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 prose prose-invert">
          <h1 className="text-4xl font-black font-display text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">
            Last updated: March 2026
          </p>
          <div className="space-y-6 text-gray-300">
            <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Data Deletion</h2>
            <p>Your privacy is our priority. All uploaded text and paraphrased results are automatically deleted from our servers 24 hours after processing via automated Database TTL indexes.</p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Payments & Financial Data</h2>
            <p>We do not store your credit card or Mobile Money PINs. All transactions are securely processed via standard 256-bit AES encryption through our partner gateway, Paystack.</p>
            
            <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Data Sharing</h2>
            <p>Because we use local AI models (Llama 3 / Mistral via Ollama), your data is NEVER sent to third-party open LLM providers like OpenAI or Google for processing. It stays strictly secured within our private server instances.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
