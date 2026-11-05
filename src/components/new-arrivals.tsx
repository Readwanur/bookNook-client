import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Eye, BookMarked } from "lucide-react";
import Image from "next/image";
import { getBookNookDb } from "@/lib/mongodb";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  bookImage?: string;
  image?: string;
  createdAt?: string;
  description?: string;
  rating?: number;
  availableCopies?: number;
}

interface NewArrivalsProps {
  books?: Book[];
}

export default async function NewArrivals({ books }: NewArrivalsProps) {
  let booksData: Book[] = books || [];

  // Fetch directly from MongoDB if books prop is not provided
  if (!books) {
    try {
      const db = await getBookNookDb();
      const docs = await db
        .collection("books")
        .find({})
        .sort({ _id: -1 })
        .limit(6)
        .toArray();

      booksData = docs.map((doc) => ({
        _id: doc._id.toString(),
        title: String(doc.title || ""),
        author: String(doc.author || ""),
        category: String(doc.category || "Others"),
        bookImage: doc.bookImage ? String(doc.bookImage) : undefined,
        image: doc.image ? String(doc.image) : undefined,
        createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
        description: doc.description ? String(doc.description) : undefined,
      }));
    } catch (error) {
      console.error("Error fetching latest books for New Arrivals:", error);
    }
  }

  // Sort newest first by createdAt (if available) and limit to latest 6 books
  const latestBooks = [...booksData]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (!isNaN(dateA) && !isNaN(dateB) && (dateA > 0 || dateB > 0)) {
        return dateB - dateA;
      }
      return 0;
    })
    .slice(0, 6);

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-100 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tomato uppercase tracking-wider mb-1.5">
              <span>Fresh Off The Shelf</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Recently added to our library collection. Discover fresh voices
              and latest contributions.
            </p>
          </div>

          <div>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-tomato hover:text-tomato-hover transition-colors group"
            >
              <span>Explore full catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {latestBooks.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50/60 rounded-2xl border border-neutral-200/80 p-6 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-neutral-800">
              No New Arrivals Yet
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Add books to the database to see them featured here.
            </p>
            <div className="mt-4">
              <Link
                href="/add-book"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-lg transition-colors shadow-2xs"
              >
                <span>Add First Book</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Books Grid: Latest 6 cards (responsive 6-col on lg, 3 on md, 2 on sm, 1 on mobile) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {latestBooks.map((book) => {
              const coverUrl = book.bookImage || book.image || "";

              return (
                <div
                  key={book._id}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200/90 p-3 hover:border-tomato/40 hover:shadow-md hover:shadow-tomato/5 transition-all duration-300"
                >
                  {/* Book Cover Image Container */}
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-100 mb-3 border border-neutral-100 flex items-center justify-center">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={book.title || "Book Cover"}
                        referrerPolicy="no-referrer"
                        width={250}
                        height={250}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400 p-2">
                        <BookMarked className="w-7 h-7 opacity-40 mb-1" />
                        <span className="text-[9px] font-medium">No cover</span>
                      </div>
                    )}

                    {/* New Badge */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-neutral-900/80 backdrop-blur-md text-white text-[9px] font-bold tracking-wide">
                      New
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category Pill */}
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase bg-tomato-light text-tomato rounded mb-1 truncate max-w-full">
                        {book.category}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-bold text-neutral-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-tomato transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h3>

                      {/* Author */}
                      <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                        by {book.author}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-3 mt-3 border-t border-neutral-100">
                      <Link
                        href={`/books/${book._id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-[11px] font-semibold text-neutral-800 bg-neutral-50 hover:bg-tomato hover:text-white rounded-lg border border-neutral-200/80 hover:border-tomato transition-all duration-200 group/btn"
                      >
                        <Eye className="w-3 h-3 text-neutral-400 group-hover/btn:text-white transition-colors" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* See All Books Button below the cards */}
        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-7 py-3 text-xs sm:text-sm font-bold text-white bg-neutral-900 hover:bg-tomato rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-neutral-400 mt-2">
            Explore our complete database of titles available for borrowing.
          </p>
        </div>
      </div>
    </section>
  );
}
