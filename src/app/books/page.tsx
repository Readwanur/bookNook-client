import React from "react";
import Link from "next/link";
import { Eye, BookOpen, BookMarked } from "lucide-react";
import Image from "next/image";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  bookImage?: string;
  image?: string;
  description?: string;
  status?: string;
}

const page = async () => {
  let booksData: Book[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      booksData = Array.isArray(data) ? data : data?.data || [];
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }


  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/40 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-neutral-200/80 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tomato-light text-tomato text-[11px] font-bold uppercase tracking-wider mb-1.5">
              
              <span>Library Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              All Books
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Browse our collection of titles available for borrowing.
            </p>
          </div>

          <div className="text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
            Showing <span className="text-tomato font-bold">{booksData.length}</span> {booksData.length === 1 ? "Book" : "Books"}
          </div>
        </div>

        {/* Empty State */}
        {booksData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No Books Found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              There are currently no books in the collection. Be the first to contribute a title!
            </p>
            <div className="mt-4">
              <Link
                href="/add-books"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-lg shadow-sm transition-colors"
              >
                <span>Add a Book</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Compact Responsive Grid: 3 cards per row on desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {booksData.map((book) => {
              const coverUrl = book.bookImage || book.image || "";

              return (
                <div
                  key={book._id}
                  className="group flex flex-col bg-white rounded-xl border border-neutral-200/90 p-3 hover:border-tomato/40 hover:shadow-md hover:shadow-tomato/5 transition-all duration-300"
                >
                  {/* Compact Book Image Container */}
                  <div className="relative h-48 sm:h-52 w-full rounded-lg overflow-hidden bg-neutral-100 mb-3 border border-neutral-100 flex items-center justify-center">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={book.title || "Book Cover"}
                        referrerPolicy="no-referrer"
                        width={450}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400 p-3">
                        <BookMarked className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[10px] font-medium">No cover image</span>
                      </div>
                    )}

                    {/* Category Tag on top of image */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-tomato rounded shadow-2xs border border-neutral-200/40">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h2
                        className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-tomato transition-colors line-clamp-1 leading-snug"
                        title={book.title}
                      >
                        {book.title}
                      </h2>

                      {/* Author */}
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        by <span className="text-neutral-700 font-medium">{book.author}</span>
                      </p>

                      {/* Short Description */}
                      {book.description && (
                        <p className="text-[11px] text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="pt-3 mt-3 border-t border-neutral-100">
                      <Link
                        href={`/books/${book._id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-tomato hover:text-white rounded-lg border border-neutral-200/80 hover:border-tomato transition-all duration-200 group/btn"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white transition-colors" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
