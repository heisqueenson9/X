'use client';

import Link from 'next/link';
import { Zap, Mail, Twitter, Linkedin, Github, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { href: '/', label: 'Home' },
    { href: '/#tool', label: 'Paraphraser' },
    { href: '/plagiarism', label: 'Plagiarism Checker' },
    { href: '/pricing', label: 'Pricing' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund', label: 'Refund Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D1FF] to-[#0077AA] flex items-center justify-center shadow-lg shadow-[#00D1FF]/20">
                <Zap size={18} className="text-black fill-black" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-base font-display">Paraphrasing</span>
                <span className="text-[#00D1FF] font-black text-lg font-display leading-none">X</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-5">
              The smartest AI-powered paraphrasing and humanizing tool for students, academics,
              and professionals in Ghana and beyond.
            </p>
            {/* Contact */}
            <a
              href="mailto:equeensoneduafo@gmail.com"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00D1FF] transition-colors duration-200 mb-4"
            >
              <Mail size={15} />
              equeensoneduafo@gmail.com
            </a>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, href: "https://x.com/heisqueenson?s=21" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/enock-queenson-eduafo-7628852a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#00D1FF]/20 hover:text-[#00D1FF] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[#00D1FF] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Paraphrasing X. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              Made with <Heart size={12} className="text-[#00D1FF] fill-[#00D1FF]" /> for students &amp; academics
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
