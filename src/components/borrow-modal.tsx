"use client";

import React, { useState } from "react";
import {
  BookmarkCheck,
  Calendar,
  Lock,
  Mail,
  User,
  X,
  Loader2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { DUMMY_USER } from "@/lib/constants";
import Image from "next/image";

interface BorrowModalProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverUrl?: string;
    category?: string;
  };
}

export default function BorrowModal({ book }: BorrowModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [today, setToday] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleOpen = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const defaultReturn = new Date(now);
    defaultReturn.setDate(defaultReturn.getDate() + 14);
    setToday(todayStr);
    setReturnDate(defaultReturn.toISOString().split("T")[0]);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
    }
  };

  const handleConfirmBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!returnDate) {
      alert("Please select a return date.");
      return;
    }

    setIsSubmitting(true);

    const borrowPayload = {
      bookId: book._id,
      bookTitle: book.title,
      bookImage: book.coverUrl || "",
      userName: DUMMY_USER.name,
      userEmail: DUMMY_USER.email,
      borrowDate: today,
      returnDate: returnDate,
      status: "Borrowed",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowPayload),
      });

      const data = await res.json();
      console.log("Borrow response:", data);

      toast.add({
        title: "Borrow Confirmed!",
        description: `You have successfully borrowed "${book.title}". Return by ${returnDate}.`,
        type: "success",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error borrowing book:", error);
      toast.add({
        title: "Borrow Failed",
        description: "An error occurred while submitting your borrow request. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button on Book Details Page */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 text-sm font-bold text-white bg-tomato hover:bg-tomato-hover active:scale-[0.99] rounded-xl shadow-md shadow-tomato/25 hover:shadow-lg hover:shadow-tomato/30 transition-all duration-200 cursor-pointer"
      >
        <BookmarkCheck className="w-4 h-4" />
        <span>Borrow This Book</span>
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pb-4 mb-5 border-b border-neutral-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tomato-light text-tomato text-[10px] font-bold uppercase tracking-wider mb-2">
                <BookmarkCheck className="w-3 h-3" />
                <span>Library Borrowing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                Borrow Book
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Confirm your borrowing request. The title will be added to your reading shelf.
              </p>
            </div>

            {/* Selected Book Mini Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-5">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    width={100}
                    height={100}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-neutral-900 truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  by {book.author}
                </p>
                {book.category && (
                  <span className="inline-block text-[10px] font-semibold text-tomato uppercase mt-1">
                    {book.category}
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              {/* User Credentials (Read-only) */}
              <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  <span>Borrower Information</span>
                  <span className="inline-flex items-center gap-0.5 text-neutral-400">
                    <Lock className="w-2.5 h-2.5" /> Read-only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* User Name */}
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                      User Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={DUMMY_USER.name}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white text-neutral-700 font-medium cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* User Email */}
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-500 mb-1">
                      User Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                      <input
                        type="email"
                        readOnly
                        disabled
                        value={DUMMY_USER.email}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white text-neutral-700 font-medium cursor-not-allowed select-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Row: Borrow Date & Return Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Borrow Date */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Borrow Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="date"
                      readOnly
                      disabled
                      value={today}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-100/70 text-neutral-600 font-medium cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                {/* Return Date */}
                <div>
                  <label
                    htmlFor="return-date"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Return Date <span className="text-tomato">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-2.5 text-tomato" />
                    <input
                      id="return-date"
                      type="date"
                      required
                      min={today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms note */}
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>You can return this book anytime from your &quot;My Borrows&quot; dashboard.</span>
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-1/3 py-2.5 px-4 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover disabled:bg-neutral-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Confirm Borrow</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

