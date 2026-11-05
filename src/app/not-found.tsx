"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "BookNook | Page Not Found";
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm text-center max-w-lg w-full">
        {/* 404 Badge & Icon */}
        <div className="w-16 h-16 rounded-2xl bg-tomato-light text-tomato flex items-center justify-center mx-auto mb-5 shadow-xs">
          <BookOpen className="w-8 h-8" strokeWidth={2.2} />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-extrabold uppercase tracking-widest mb-3">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          Chapter Not Found
        </h1>

        <p className="text-xs sm:text-sm text-neutral-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Oops! The page or book shelf you are looking for seems to be missing
          from our library catalog.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-md shadow-tomato/25 transition-all active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Browse All Books</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

