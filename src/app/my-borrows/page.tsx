"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  Sparkles,
  User,
  ArrowRight,
  BookMarked,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";

interface BorrowedBook {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
  status?: string;
  createdAt?: string;
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Reader";

  // Redirect unauthenticated users to Login page and return back after login
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?callbackUrl=%2Fmy-borrows");
    }
  }, [isPending, session, router]);

  // Fetch borrowed books for the logged-in user once authenticated
  useEffect(() => {
    if (isPending || !userEmail) return;

    let isMounted = true;

    const loadBorrows = async () => {
      try {
        // Try /books/my-borrows first, fallback to /my-borrows
        let res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/books/my-borrows?email=${encodeURIComponent(
            userEmail
          )}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/my-borrows?email=${encodeURIComponent(
              userEmail
            )}`,
            { cache: "no-store" }
          );
        }

        if (res.ok) {
          const data = await res.json();
          let list: BorrowedBook[] = [];

          if (Array.isArray(data)) {
            list = data;
          } else if (
            data &&
            typeof data === "object" &&
            (data._id || data.bookTitle)
          ) {
            list = [data];
          } else if (data?.data && Array.isArray(data.data)) {
            list = data.data;
          }

          if (isMounted) {
            // Filter by logged-in user's email if backend returns all borrows
            const userBorrows = list.filter(
              (item) => !item.userEmail || item.userEmail === userEmail
            );
            setBorrows(userBorrows);
          }
        }
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBorrows();

    return () => {
      isMounted = false;
    };
  }, [isPending, userEmail]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-7 h-7 animate-spin text-tomato mb-2" />
        <p className="text-xs font-semibold text-neutral-500">
          Verifying authentication...
        </p>
      </div>
    );
  }

  // Handle "Return Book"
  const handleReturnBook = async (borrowId: string, bookTitle: string) => {
    const confirmReturn = window.confirm(
      `Are you sure you want to return "${bookTitle}"?`
    );
    if (!confirmReturn) return;

    setReturningId(borrowId);

    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/my-borrows/${borrowId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/my-borrows/${borrowId}`,
          {
            method: "DELETE",
          }
        );
      }

      const data = await res.json();
      console.log("Return result:", data);

      toast.add({
        title: "Book Returned!",
        description: `"${bookTitle}" has been returned to the library successfully.`,
        type: "success",
      });

      // Remove from table immediately
      setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
    } catch (error) {
      console.error("Error returning book:", error);
      toast.add({
        title: "Return Failed",
        description: "Could not return book. Please try again later.",
        type: "error",
      });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/40 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-neutral-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tomato-light text-tomato text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Shelf</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              My Borrowed Books
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Manage the books you currently have borrowed. Return them once you
              finish to keep the library circular.
            </p>
          </div>

          {/* User Credentials Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200/90 shadow-2xs self-start sm:self-auto text-xs">
            <div className="w-7 h-7 rounded-lg bg-tomato text-white flex items-center justify-center font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-800 leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-neutral-400">{userEmail}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tomato mx-auto mb-3" />
            <p className="text-xs font-semibold text-neutral-500">
              Loading your borrowed books...
            </p>
          </div>
        ) : borrows.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No Borrowed Books Yet
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto">
              Your borrowing shelf is currently empty. Explore our catalog and
              borrow a title to start reading!
            </p>
            <div className="mt-6">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm transition-all"
              >
                <span>Browse All Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">
                      Book
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Title
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Borrow Date
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Return Date
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 sm:px-6 text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {borrows.map((borrow) => {
                    const isReturning = returningId === borrow._id;

                    return (
                      <tr
                        key={borrow._id}
                        className="hover:bg-neutral-50/50 transition-colors"
                      >
                        {/* Book Image */}
                        <td className="py-3.5 px-4 sm:px-6 w-20">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                            {borrow.bookImage ? (
                              <img
                                src={borrow.bookImage}
                                alt={borrow.bookTitle || "Cover"}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookMarked className="w-5 h-5 text-neutral-400 opacity-60" />
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4 font-semibold text-neutral-900 max-w-xs">
                          <Link
                            href={`/books/${borrow.bookId}`}
                            className="hover:text-tomato transition-colors line-clamp-2 block leading-snug"
                            title={borrow.bookTitle}
                          >
                            {borrow.bookTitle}
                          </Link>
                          <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                            ID: {borrow.bookId}
                          </span>
                        </td>

                        {/* Borrow Date */}
                        <td className="py-3.5 px-4 text-neutral-600 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{borrow.borrowDate || "N/A"}</span>
                          </div>
                        </td>

                        {/* Return Date */}
                        <td className="py-3.5 px-4 text-neutral-700 font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-tomato" />
                            <span className="text-tomato font-semibold">
                              {borrow.returnDate || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Return Book Button */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleReturnBook(borrow._id, borrow.bookTitle)
                            }
                            disabled={isReturning}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-tomato hover:text-white rounded-lg border border-neutral-200 hover:border-tomato disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-2xs group"
                          >
                            {isReturning ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Returning...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                                <span>Return Book</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="px-6 py-3 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>
                Total borrowed: <strong>{borrows.length}</strong>{" "}
                {borrows.length === 1 ? "book" : "books"}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Free
                returns anytime
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
