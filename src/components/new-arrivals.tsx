import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Sparkles, Eye } from "lucide-react";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  createdAt?: string;
  rating?: number;
  availableCopies?: number;
}

// 6 latest mock books ordered by newest first
// Backend query reference: db.books.find().sort({ createdAt: -1 }).limit(6)
export const initialLatestBooks: Book[] = [
  {
    _id: "book-001",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance & Psychology",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-11-01T12:00:00Z",
    rating: 4.8,
    availableCopies: 5,
  },
  {
    _id: "book-002",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    category: "Sci-Fi & Literary Fiction",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-10-30T10:30:00Z",
    rating: 4.7,
    availableCopies: 3,
  },
  {
    _id: "book-003",
    title: "Deep Work: Rules for Focused Success",
    author: "Cal Newport",
    category: "Productivity",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-10-28T09:15:00Z",
    rating: 4.9,
    availableCopies: 4,
  },
  {
    _id: "book-004",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    category: "Historical Fiction",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-10-25T14:45:00Z",
    rating: 4.8,
    availableCopies: 2,
  },
  {
    _id: "book-005",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-10-22T08:00:00Z",
    rating: 4.9,
    availableCopies: 6,
  },
  {
    _id: "book-006",
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop",
    createdAt: "2026-10-20T16:20:00Z",
    rating: 4.9,
    availableCopies: 4,
  },
];

interface NewArrivalsProps {
  books?: Book[];
}

export default function NewArrivals({ books = initialLatestBooks }: NewArrivalsProps) {
  // Take top 6 newest books (sort and limit)
  const displayBooks = books.slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tomato uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Shelf</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm text-neutral-500 mt-1 max-w-xl">
              Recently added to our library collection. Discover fresh voices,
              critical acclaim, and timely non-fiction.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/all-books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-tomato hover:text-tomato-hover transition-colors group"
            >
              <span>Explore full catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Books Grid: 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayBooks.map((book) => (
            <div
              key={book._id}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 p-3 hover:border-tomato/40 hover:shadow-lg hover:shadow-tomato/5 transition-all duration-300"
            >
              {/* Book Cover Image Container */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 mb-3.5">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* New Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                  New
                </div>
              </div>

              {/* Book Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Category Pill */}
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-tomato-light text-tomato rounded-md mb-1.5 truncate max-w-full">
                    {book.category}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-bold text-neutral-900 text-sm leading-snug line-clamp-2 group-hover:text-tomato transition-colors"
                    title={book.title}
                  >
                    {book.title}
                  </h3>

                  {/* Author */}
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    by {book.author}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="pt-4 mt-auto">
                  <Link
                    href={`/books/${book._id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-tomato hover:text-white rounded-lg border border-neutral-200 hover:border-tomato transition-all duration-200 group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 opacity-70 group-hover/btn:opacity-100" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Books Button below the cards */}
        <div className="mt-12 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-tomato rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-neutral-400 mt-2">
            Explore our complete database of thousands of titles.
          </p>
        </div>
      </div>
    </section>
  );
}

