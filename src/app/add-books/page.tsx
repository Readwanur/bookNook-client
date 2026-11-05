"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookPlus,
  CheckCircle2,
  Lock,
  User,
  Mail,
  ArrowLeft,
  Link as LinkIcon,
  ExternalLink,
  ImageIcon,
  X,
  Loader2,
  Layers,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/api-client";

// Categories requested: Fiction, Science, History, Kids, Others
const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<string>("");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [bookImage, setBookImage] = useState("");
  const [description, setDescription] = useState("");

  // Preview & image error tracking
  const [imageLoadError, setImageLoadError] = useState(false);

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // Redirect unauthenticated users to Login page and return back after login
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?callbackUrl=%2Fadd-book");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-tomato mb-2" />
        <p className="text-xs font-semibold text-neutral-500">
          Loading Add Book form...
        </p>
      </div>
    );
  }

  const userName = session.user.name || "";
  const userEmail = session.user.email || "";

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !author.trim() ||
      !category ||
      !bookImage.trim() ||
      !description.trim()
    ) {
      toast.add({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before adding the book.",
        type: "error",
      });
      return;
    }

    const copiesValue = Number(totalCopies);
    if (isNaN(copiesValue) || copiesValue < 1) {
      toast.add({
        title: "Invalid Total Copies",
        description: "Total copies must be at least 1.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const newBookPayload = {
      title: title.trim(),
      author: author.trim(),
      category,
      totalCopies: copiesValue,
      copies: copiesValue,
      bookImage: bookImage.trim(),
      description: description.trim(),
      addedBy: {
        name: userName,
        email: userEmail,
      },
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
      status: "Available",
    };

    try {
      const headers = await getAuthHeaders(userEmail, userName);

      // Save to MongoDB via /api/books (which guarantees copies & totalCopies are saved cleanly)
      const result = await fetch("/api/books", {
        method: "POST",
        headers,
        body: JSON.stringify(newBookPayload),
      });

      const data = await result.json();

      if (result.ok && data.acknowledged) {
        toast.add({
          title: `${newBookPayload.title} added successfully!`,
          description: `Added ${copiesValue} ${
            copiesValue === 1 ? "copy" : "copies"
          } to BookNook catalog.`,
          type: "success",
        });

        // Reset form fields
        setTitle("");
        setAuthor("");
        setCategory("");
        setTotalCopies(3);
        setBookImage("");
        setDescription("");
        setImageLoadError(false);
      } else {
        toast.add({
          title: "Failed to Add Book",
          description: data.error || "Could not save the book. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.add({
        title: "Error Adding Book",
        description: "An unexpected network error occurred.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
      {/* Main Compact Add Book Form Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-sm">
        {/* Header Row: Title & Back link */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-tomato-light text-tomato flex items-center justify-center">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-tight">
                Add a New Book
              </h1>
              <p className="text-[11px] text-neutral-400">
                Fill in the book details to contribute to the catalog.
              </p>
            </div>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-tomato transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to All Books</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Top Section: Logged-in User Information (Read-only & Compact) */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Logged-in User Credentials
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-white border border-neutral-200 text-[9px] font-semibold text-neutral-500">
                  <Lock className="w-2.5 h-2.5" />
                  Read-only
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 hidden sm:inline">
                Book will be attributed to your account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* User Name */}
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={userName}
                  title="User Name"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white/90 text-neutral-700 font-medium cursor-not-allowed select-none"
                />
              </div>

              {/* User Email */}
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="email"
                  readOnly
                  disabled
                  value={userEmail}
                  title="User Email"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white/90 text-neutral-700 font-medium cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>

          {/* 2-Column Side-by-Side Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Title, Author, Category & Total Copies */}
            <div className="space-y-3">
              {/* Book Title */}
              <div>
                <label
                  htmlFor="book-title"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                >
                  Book Title <span className="text-tomato">*</span>
                </label>
                <input
                  id="book-title"
                  type="text"
                  required
                  placeholder="e.g. Love You All"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
                />
              </div>

              {/* Author Name */}
              <div>
                <label
                  htmlFor="author-name"
                  className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                >
                  Author Name <span className="text-tomato">*</span>
                </label>
                <input
                  id="author-name"
                  type="text"
                  required
                  placeholder="e.g. Humayun Ahmed"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
                />
              </div>

              {/* Category & Total Copies side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category Select Box (2 cols) */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="book-category"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Category <span className="text-tomato">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="book-category"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a category...
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Copies (1 col) */}
                <div>
                  <label
                    htmlFor="total-copies"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1"
                  >
                    Total Copies <span className="text-tomato">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                    <input
                      id="total-copies"
                      type="number"
                      min={1}
                      max={999}
                      required
                      value={totalCopies}
                      onChange={(e) =>
                        setTotalCopies(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Book Image Link & Short Description */}
            <div className="space-y-3">
              {/* Book Image Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="book-image"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Book Image Link <span className="text-tomato">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span>Host on:</span>
                    <a
                      href="https://imgbb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tomato font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      ImgBB <ExternalLink className="w-2 h-2" />
                    </a>
                    <span>•</span>
                    <a
                      href="https://postimages.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tomato font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      PostImage <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    id="book-image"
                    type="url"
                    required
                    placeholder="https://i.ibb.co/... or https://i.postimg.cc/..."
                    value={bookImage}
                    onChange={(e) => {
                      setBookImage(e.target.value);
                      setImageLoadError(false);
                    }}
                    className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
                  />
                  {bookImage && (
                    <button
                      type="button"
                      onClick={() => setBookImage("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Compact Live Thumbnail Preview */}
                {bookImage.trim() && (
                  <div className="mt-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50/70 flex items-center gap-2">
                    <div className="relative w-8 h-10 rounded overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200 flex items-center justify-center">
                      {!imageLoadError ? (
                        <img
                          src={bookImage.trim()}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={() => setImageLoadError(true)}
                        />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {bookImage.includes("ibb.co/") &&
                      !bookImage.includes("i.ibb.co") ? (
                        <span className="text-[10px] text-amber-600 font-semibold block leading-tight">
                          ⚠️ Page link detected! On ImgBB, select{" "}
                          <strong>&quot;Direct links&quot;</strong> (starts with{" "}
                          <code className="text-neutral-800">i.ibb.co/...</code>
                          ).
                        </span>
                      ) : imageLoadError ? (
                        <span className="text-[10px] text-amber-600 font-medium block truncate">
                          ⚠️ Preview unavailable (check image URL)
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Image linked
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="book-description"
                    className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
                  >
                    Short Description <span className="text-tomato">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    {description.length}/400
                  </span>
                </div>
                <textarea
                  id="book-description"
                  required
                  rows={2}
                  maxLength={400}
                  placeholder="Brief synopsis and themes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-tomato hover:bg-tomato-hover disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding Book...</span>
                </>
              ) : (
                <>
                  <BookPlus className="w-3.5 h-3.5" />
                  <span>Add Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
