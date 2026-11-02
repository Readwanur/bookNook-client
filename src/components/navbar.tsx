"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, ArrowRight, User } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo & Name */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm shadow-tomato/30 transition-colors group-hover:bg-tomato-hover">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 leading-none">
                  Book<span className="text-tomato">Nook</span>
                </span>
                <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-400 mt-0.5">
                  Online Library
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-semibold text-neutral-900 rounded-lg hover:text-tomato hover:bg-neutral-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/all-books"
                className="px-4 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:text-tomato hover:bg-neutral-50 transition-colors"
              >
                All Books
              </Link>
            </nav>
          </div>

          {/* Right: Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-neutral-800 hover:text-tomato transition-colors rounded-lg hover:bg-neutral-50"
            >
              <User className="w-4 h-4 text-neutral-500" />
              <span>Login</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm shadow-tomato/25 transition-all duration-200 hover:shadow-md hover:shadow-tomato/30 active:scale-[0.98]"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-base font-semibold text-tomato rounded-lg bg-tomato-light/60"
            >
              Home
            </Link>
            <Link
              href="/all-books"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-base font-medium text-neutral-700 hover:text-tomato hover:bg-neutral-50 rounded-lg transition-colors"
            >
              All Books
            </Link>
          </nav>
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-neutral-800 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm shadow-tomato/25 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

