import React from "react";
import Link from "next/link";
import { Search, BookMarked, RotateCcw, ArrowRight } from "lucide-react";
import { FadeIn, StaggerGrid, StaggerCard } from "@/components/ui/motion-wrapper";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Discover & Choose",
      description:
        "Browse our extensive catalog by title, author, or category. Check real-time copy availability before borrowing.",
    },
    {
      step: "02",
      icon: BookMarked,
      title: "Borrow with One Click",
      description:
        "Select your desired book and click 'Borrow'. The title is added to your personal shelf for a 14-day borrowing cycle.",
    },
    {
      step: "03",
      icon: RotateCcw,
      title: "Read & Return Easily",
      description:
        "Enjoy reading offline or on your device. Once you finish, click 'Return' from your dashboard to free up copies for others.",
    },
  ];

  return (
    <section className="py-20 bg-neutral-50/60 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-tomato-light text-tomato text-xs font-bold uppercase tracking-wider mb-3">
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How Borrowing Works
          </h2>
          <p className="text-base text-neutral-600 mt-2">
            No complex paperwork or hidden fees. Experience a community-first
            digital library built for effortless reading.
          </p>
        </FadeIn>

        {/* Steps Grid */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <StaggerCard
                key={item.step}
                className="relative bg-white rounded-2xl p-8 border border-neutral-200/90 shadow-sm hover:shadow-md hover:border-tomato/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-tomato-light group-hover:bg-tomato text-tomato group-hover:text-white flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-neutral-200 group-hover:text-tomato/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-tomato transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center text-xs font-semibold text-neutral-400 group-hover:text-tomato transition-colors">
                  <span>Step {index + 1} of 3</span>
                </div>
              </StaggerCard>
            );
          })}
        </StaggerGrid>

        {/* Bottom Banner Prompt */}
        <FadeIn delay={0.15} className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:px-6 sm:py-3.5 bg-white rounded-2xl border border-neutral-200 shadow-xs">
            <span className="text-sm text-neutral-700 font-medium">
              Ready to dive into your next reading journey?
            </span>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-lg transition-colors"
            >
              <span>Get Your Free Library Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

