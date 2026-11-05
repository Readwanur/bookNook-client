import React from "react";
import { Loader2, BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-neutral-50/40">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-tomato-light text-tomato flex items-center justify-center shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <Loader2 className="w-14 h-14 animate-spin text-tomato absolute" />
      </div>
      <p className="text-xs font-bold text-neutral-600 tracking-wide">
        Loading BookNook...
      </p>
    </div>
  );
}

