"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  User,
  Mail,
  Tag,
  BookMarked,
  ShieldCheck,
  Loader2,
  Layers,
  Ban,
} from "lucide-react";
import BorrowModal from "@/components/borrow-modal";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

interface BookData {
  _id?: string;
  title?: string;
  author?: string;
  category?: string;
  bookImage?: string;
  image?: string;
  description?: string;
  copies?: number;
  totalCopies?: number;
  status?: string;
  createdAt?: string;
  alreadyBorrowed?: boolean;
  addedBy?:
    | {
        name?: string;
        email?: string;
      }
    | string;
}

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userEmail = session?.user?.email || "";

  // Private Route Protection: Redirect unauthenticated visitors to Login page
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(`/books/${id}`)}`);
    }
  }, [isPending, session, router, id]);

  // Fetch Book Details once authenticated
  useEffect(() => {
    if (isPending || !session?.user) return;

    let isMounted = true;

    const loadBook = async () => {
      try {
        // Fetch from /api/books/[id] which reads bookNook.books + checks alreadyBorrowed & copies
        let res = await fetch(
          `/api/books/${id}?userEmail=${encodeURIComponent(userEmail)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}?userEmail=${encodeURIComponent(
              userEmail
            )}`,
            { cache: "no-store" }
          );
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setBookData(data);
            document.title = data?.title
              ? `BookNook | ${data.title}`
              : "BookNook | Book Details";
          }
        } else {
          if (isMounted) {
            document.title = "BookNook | Book Not Found";
          }
        }
      } catch {
        // Handled gracefully by Book Not Found UI
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [id, isPending, session?.user, userEmail]);

  if (isPending || !session?.user || isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-tomato mb-3" />
        <p className="text-xs font-semibold text-neutral-500">
          Loading book details...
        </p>
      </div>
    );
  }

  // Fallback if book is not found
  if (!bookData || !bookData.title) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-neutral-50/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-tomato-light text-tomato flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Book Not Found
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            The book you are looking for doesn&apos;t exist or may have been
            removed.
          </p>
          <div className="mt-6">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Books</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = bookData.bookImage || bookData.image || "";
  const availableCopies =
    typeof bookData.copies === "number" ? bookData.copies : 3;
  const isAvailable = availableCopies > 0;

  const addedByName =
    typeof bookData.addedBy === "object"
      ? bookData.addedBy?.name || "BookNook Member"
      : bookData.addedBy || "BookNook Member";

  const addedByEmail =
    typeof bookData.addedBy === "object" ? bookData.addedBy?.email : null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/40 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 hover:text-tomato transition-colors text-neutral-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Books</span>
          </Link>
          <span>/</span>
          <span className="text-neutral-400 truncate max-w-[200px] sm:max-w-xs">
            {bookData.category}
          </span>
          <span>/</span>
          <span className="text-neutral-800 font-bold truncate max-w-[200px] sm:max-w-xs">
            {bookData.title}
          </span>
        </div>

        {/* Main Book Details Card */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Book Image & Borrow Action (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm">
                {/* Book Cover Image */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-md group">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={bookData.title || "Book Cover"}
                      width={450}
                      height={450}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 p-6">
                      <BookMarked className="w-16 h-16 opacity-40 mb-2" />
                      <span className="text-xs font-medium">
                        No cover image available
                      </span>
                    </div>
                  )}

                  {/* Category Badge on top of image */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-tomato rounded-lg shadow-xs border border-neutral-200/50">
                      {bookData.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-3 right-3">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/90 text-white rounded-md backdrop-blur-sm shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{availableCopies} Available</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-neutral-900/90 text-white rounded-md backdrop-blur-sm shadow-xs">
                        <Ban className="w-3 h-3" />
                        <span>Not Available</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Action Button: Borrow This Book Modal */}
                <div className="mt-5 space-y-2.5">
                  <BorrowModal
                    book={{
                      _id: id,
                      title: bookData.title || "",
                      author: bookData.author || "",
                      coverUrl: coverUrl,
                      category: bookData.category,
                      copies: availableCopies,
                    }}
                    alreadyBorrowed={Boolean(bookData.alreadyBorrowed)}
                    onBorrowSuccess={(remaining) => {
                      setBookData((prev) =>
                        prev
                          ? {
                              ...prev,
                              copies: remaining,
                              status:
                                remaining > 0 ? "Available" : "Not Available",
                              alreadyBorrowed: true,
                            }
                          : prev
                      );
                    }}
                  />

                  <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Free 14-day borrowing period • Return anytime</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Book Information (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tomato-light text-tomato text-xs font-bold uppercase tracking-wider mb-3">
                  <Tag className="w-3 h-3" />
                  <span>{bookData.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                  {bookData.title}
                </h1>

                {/* Author */}
                <p className="text-base sm:text-lg text-neutral-600 mt-2 font-medium">
                  by{" "}
                  <span className="text-neutral-900 font-bold">
                    {bookData.author}
                  </span>
                </p>

                {/* Key Details Strip */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                      Category
                    </span>
                    <span className="font-semibold text-neutral-800 mt-0.5 block truncate">
                      {bookData.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                      Available Copies
                    </span>
                    <span
                      className={`font-bold mt-0.5 inline-flex items-center gap-1 ${
                        isAvailable ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {isAvailable
                        ? `${availableCopies} ${
                            availableCopies === 1 ? "Copy" : "Copies"
                          }`
                        : "0 (Not Available)"}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">
                      Borrow Duration
                    </span>
                    <span className="font-semibold text-neutral-800 mt-0.5 block">
                      14 Days Standard
                    </span>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Description & Overview
                  </h2>
                  <div className="text-sm text-neutral-700 leading-relaxed space-y-2 whitespace-pre-line bg-white rounded-xl border border-neutral-100 p-4">
                    {bookData.description ||
                      "No description provided for this book."}
                  </div>
                </div>
              </div>

              {/* Contributor Card: Who Added It */}
              <div className="pt-6 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Added to Catalog By
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-400">
                    Verified Contributor
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                  <div className="w-10 h-10 rounded-xl bg-tomato text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-neutral-900 truncate">
                      {addedByName}
                    </div>
                    {addedByEmail && (
                      <div className="text-xs text-neutral-500 flex items-center gap-1.5 truncate mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{addedByEmail}</span>
                      </div>
                    )}
                  </div>

                  {bookData.createdAt && (
                    <div className="hidden sm:flex flex-col items-end text-right text-[11px] text-neutral-400 shrink-0">
                      <span className="font-medium text-neutral-500">
                        Added on
                      </span>
                      <span>
                        {new Date(bookData.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
