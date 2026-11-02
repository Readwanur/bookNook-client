"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, BookmarkCheck } from "lucide-react";

// Import Swiper core and required module styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SlideData {
  id: number;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  featuredBook: {
    title: string;
    author: string;
    category: string;
    image: string;
  };
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "Welcome to BookNook",
    title: "Feed Your Curiosity, One Book at a Time.",
    description:
      "Explore thousands of curated titles across fiction, science, history, and literature. Borrow instantly and embark on your next great literary adventure.",
    ctaText: "Browse Books",
    ctaLink: "/books",
    featuredBook: {
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      category: "Fiction / Contemporary",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=700&auto=format&fit=crop",
    },
  },
  {
    id: 2,
    badge: "Effortless Online Borrowing",
    title: "Borrow Today, Expand Your World Tomorrow.",
    description:
      "No tedious paperwork, no overdue stress. Reserve your favorite titles with a single click and enjoy 14 days of uninterrupted reading bliss.",
    ctaText: "Browse Books",
    ctaLink: "/books",
    featuredBook: {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Personal Development",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=700&auto=format&fit=crop",
    },
  },
  {
    id: 3,
    badge: "Curated Weekly Additions",
    title: "A Cozy Haven for Curious Minds & Book Lovers.",
    description:
      "From timeless classics to this week's breakthrough bestsellers, discover stories that inspire, educate, and stay with you long after the final chapter.",
    ctaText: "Browse Books",
    ctaLink: "/books",
    featuredBook: {
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fantasy / Philosophy",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=700&auto=format&fit=crop",
    },
  },
];

export default function BannerSlider() {
  return (
    <section className="relative w-full bg-white py-6 md:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-neutral-50/70 border border-neutral-100 overflow-hidden booknook-swiper shadow-sm">
          {/* Subtle Tomato Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-tomato/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-tomato/5 rounded-full blur-3xl pointer-events-none" />

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            className="w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="min-h-[460px] md:min-h-[500px] flex items-center px-6 sm:px-12 md:px-16 py-12 md:py-16">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                    {/* Left Column: Text Info */}
                    <div className="lg:col-span-7 space-y-5 text-left">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-tomato" />
                        <span>{slide.badge}</span>
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15]">
                        {slide.title}
                      </h1>

                      {/* Description */}
                      <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTA Button */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={slide.ctaLink}
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-md shadow-tomato/25 hover:shadow-lg hover:shadow-tomato/30 transition-all duration-200 active:scale-[0.98]"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                          <BookmarkCheck className="w-4 h-4 text-tomato" />
                          <span>Free Digital Membership</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Book Presentation Graphic */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                      <div className="relative group">
                        {/* Book Glow / Drop Shadow */}
                        <div className="absolute inset-0 bg-neutral-900/10 blur-xl transform translate-y-4 rounded-2xl" />

                        {/* Card Container */}
                        <div className="relative w-64 sm:w-72 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100">
                            <Image
                              src={slide.featuredBook.image}
                              alt={slide.featuredBook.title}
                              fill
                              sizes="(max-width: 768px) 250px, 300px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              priority
                            />
                            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                              Trending
                            </div>
                          </div>

                          <div className="pt-3 px-1">
                            <span className="text-[11px] font-semibold text-tomato uppercase tracking-wider block">
                              {slide.featuredBook.category}
                            </span>
                            <h3 className="font-bold text-neutral-900 text-sm truncate mt-0.5">
                              {slide.featuredBook.title}
                            </h3>
                            <p className="text-xs text-neutral-500 truncate">
                              by {slide.featuredBook.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

