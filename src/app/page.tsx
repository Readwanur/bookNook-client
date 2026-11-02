import React from "react";
import BannerSlider from "@/components/banner-slider";
import NewArrivals from "@/components/new-arrivals";
import HowItWorks from "@/components/how-it-works";
import TopCategories from "@/components/top-categories";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Banner / Slider (Swiper.js with 3+ slides) */}
      <BannerSlider />

      {/* 2. New Arrivals (Latest 6 books from DB, sort + limit ready) */}
      <NewArrivals />

      {/* 3. Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Top Categories & Library Highlights */}
      <TopCategories />
    </div>
  );
}