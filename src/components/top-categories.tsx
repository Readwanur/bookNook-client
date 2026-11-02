import React from "react";
import Link from "next/link";
import {
  Compass,
  Atom,
  Flame,
  BrainCircuit,
  Briefcase,
  Skull,
  ArrowRight,
  Library,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

export default function TopCategories() {
  const categories = [
    {
      name: "Fiction & Literature",
      count: "3,400+ Books",
      icon: Flame,
      description: "Gripping narratives, contemporary voices & modern classics.",
      slug: "fiction",
    },
    {
      name: "Science & Tech",
      count: "1,850+ Books",
      icon: Atom,
      description: "Astrophysics, programming, AI breakthroughs & natural sciences.",
      slug: "science-tech",
    },
    {
      name: "Self-Development",
      count: "2,100+ Books",
      icon: BrainCircuit,
      description: "Mindset mastery, productivity, habit systems & wellness.",
      slug: "self-development",
    },
    {
      name: "Business & Finance",
      count: "1,420+ Books",
      icon: Briefcase,
      description: "Leadership, economic wisdom, investing & entrepreneurship.",
      slug: "business-finance",
    },
    {
      name: "Mystery & Thriller",
      count: "1,980+ Books",
      icon: Skull,
      description: "Edge-of-your-seat suspense, detective puzzles & noir tales.",
      slug: "mystery-thriller",
    },
    {
      name: "Philosophy & Arts",
      count: "1,150+ Books",
      icon: Compass,
      description: "Stoicism, existential thoughts, art history & cultural essays.",
      slug: "philosophy",
    },
  ];

  const stats = [
    { label: "Curated Books", value: "10,000+", icon: Library },
    { label: "Active Members", value: "5,800+", icon: Users },
    { label: "Average Borrow Time", value: "14 Days", icon: Clock },
    { label: "Community Rating", value: "4.9 / 5.0", icon: Sparkles },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-tomato-light text-tomato text-xs font-bold uppercase tracking-wider mb-3">
              Curated Shelves
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Top Categories
            </h2>
            <p className="text-base text-neutral-500 mt-2 max-w-xl">
              Whatever your mood or curiosity, dive straight into genres
              hand-selected by our library curators.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/all-books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-tomato transition-colors group"
            >
              <span>View all genres</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/all-books?category=${cat.slug}`}
                className="group p-6 rounded-2xl border border-neutral-200/90 hover:border-tomato/40 bg-white hover:bg-neutral-50/50 transition-all duration-300 flex flex-col justify-between hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-tomato-light text-tomato group-hover:bg-tomato group-hover:text-white flex items-center justify-center transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-neutral-400 group-hover:text-tomato transition-colors">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-tomato transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800 group-hover:text-tomato transition-colors">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Ribbon */}
        <div className="mt-16 rounded-3xl bg-neutral-900 text-white p-8 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center ${
                    i !== 0 ? "pt-6 md:pt-0 md:pl-6" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-tomato/20 text-tomato flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

