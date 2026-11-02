import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-100 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Brand & About Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm shadow-tomato/30">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                Book<span className="text-tomato">Nook</span>
              </span>
            </Link>

            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
              Your cozy neighborhood digital library. Discover new worlds, borrow
              handpicked books, and cultivate your lifelong reading habit with ease.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  { name: "Twitter", href: "https://twitter.com", label: "𝕏" },
                  { name: "GitHub", href: "https://github.com", label: "GH" },
                  { name: "Instagram", href: "https://instagram.com", label: "IG" },
                  { name: "Facebook", href: "https://facebook.com", label: "FB" },
                  { name: "LinkedIn", href: "https://linkedin.com", label: "IN" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-700 hover:text-white hover:bg-tomato hover:border-tomato transition-all duration-200"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-tomato transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books"
                  className="hover:text-tomato transition-colors inline-block"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/all-books?category=Fiction"
                  className="hover:text-tomato transition-colors inline-block"
                >
                  Popular Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-tomato transition-colors inline-block"
                >
                  Borrowing Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-tomato transition-colors inline-block"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-tomato mt-0.5 shrink-0" />
                <span>42 Reading Corner St, Library Lane, Bookshelf City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-tomato shrink-0" />
                <span>+1 (800) 555-BOOK (2665)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-tomato shrink-0" />
                <a
                  href="mailto:support@booknook.lib"
                  className="hover:text-tomato transition-colors"
                >
                  support@booknook.lib
                </a>
              </li>
            </ul>
            <div className="pt-2 text-xs text-neutral-400">
              Open for digital borrowing 24/7. Curbside pickup Mon-Sat, 9am - 7pm.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright line */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {currentYear} BookNook Online Library. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for book lovers with{" "}
            <Heart className="w-3.5 h-3.5 text-tomato fill-tomato" /> everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}

