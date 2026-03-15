import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Paraphrasing X — Humanize & Paraphrase AI Text Instantly',
  description:
    'Paraphrasing X helps students and academics paraphrase, humanize, and reduce plagiarism in their text using cutting-edge AI. Beat Turnitin. Get human-sounding results instantly.',
  manifest: '/manifest.json',
  keywords: [
    'paraphrasing',
    'humanize AI text',
    'plagiarism checker',
    'turnitin bypass',
    'AI paraphraser',
    'academic writing',
    'Ghana',
  ],
  openGraph: {
    title: 'Paraphrasing X — Humanize & Paraphrase AI Text Instantly',
    description:
      'Paste your text and get an academia-ready, human-written version in seconds. Pay only GHS 11.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #00D1FF',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#00D1FF', secondary: '#000' },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
