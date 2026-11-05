"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Edit3,
  Trash2,
  Loader2,
  Plus,
  BookMarked,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  Eye,
  LayoutGrid,
  List,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/api-client";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"] as const;

interface MyBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  bookImage?: string;
  image?: string;
  description?: string;
  copies?: number;
  totalCopies?: number;
  status?: string;
  createdAt?: string;
}

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState<MyBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Edit Modal state
  const [editingBook, setEditingBook] = useState<MyBook | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCopies, setEditCopies] = useState<number>(1);
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Custom Confirm Delete Modal state
  const [deletingBook, setDeletingBook] = useState<MyBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Reader";

  // Set page title
  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  // Private Route Protection
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?callbackUrl=%2Fmy-books");
    }
  }, [isPending, session, router]);

  // Fetch logged-in user's added books
  useEffect(() => {
    if (isPending || !userEmail) return;

    let isMounted = true;

    const loadMyBooks = async () => {
      try {
        const headers = await getAuthHeaders(userEmail, userName);
        const res = await fetch(
          `/api/books?email=${encodeURIComponent(userEmail)}`,
          {
            headers,
            cache: "no-store",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setBooks(data);
          }
        }
      } catch (error) {
        console.error("Error loading user's books:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMyBooks();

    return () => {
      isMounted = false;
    };
  }, [isPending, userEmail, userName]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-tomato mb-2" />
        <p className="text-xs font-semibold text-neutral-500">
          Verifying authentication...
        </p>
      </div>
    );
  }

  // Open Edit Modal pre-filled with existing book data
  const handleOpenEdit = (book: MyBook) => {
    setEditingBook(book);
    setEditTitle(book.title || "");
    setEditAuthor(book.author || "");
    setEditCategory(book.category || "Fiction");
    setEditCopies(
      typeof book.copies === "number"
        ? book.copies
        : typeof book.totalCopies === "number"
        ? book.totalCopies
        : 3
    );
    setEditImage(book.bookImage || book.image || "");
    setEditDescription(book.description || "");
  };

  // Save Updated Book
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    if (
      !editTitle.trim() ||
      !editAuthor.trim() ||
      !editCategory ||
      !editImage.trim() ||
      !editDescription.trim()
    ) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setIsUpdating(true);

    const updatedPayload = {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      category: editCategory,
      copies: Math.max(0, Number(editCopies) || 0),
      totalCopies: Math.max(0, Number(editCopies) || 0),
      bookImage: editImage.trim(),
      description: editDescription.trim(),
    };

    try {
      const headers = await getAuthHeaders(userEmail, userName);
      const res = await fetch(`/api/books/${editingBook._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();

      if (res.ok && data.acknowledged) {
        // Update state in UI immediately
        setBooks((prev) =>
          prev.map((item) =>
            item._id === editingBook._id
              ? {
                  ...item,
                  ...updatedPayload,
                  status:
                    updatedPayload.copies > 0 ? "Available" : "Not Available",
                }
              : item
          )
        );

        toast.add({
          title: "Book Updated!",
          description: `"${updatedPayload.title}" has been updated successfully.`,
          type: "success",
        });

        setEditingBook(null);
      } else {
        toast.add({
          title: "Update Failed",
          description: data.error || "Could not update book details.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.add({
        title: "Update Error",
        description: "An unexpected error occurred while saving changes.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm & Execute Delete Book
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);

    try {
      const headers = await getAuthHeaders(userEmail, userName);
      const res = await fetch(`/api/books/${deletingBook._id}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (res.ok && data.acknowledged) {
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));

        toast.add({
          title: "Book Deleted!",
          description: `"${deletingBook.title}" has been removed from BookNook.`,
          type: "success",
        });

        setDeletingBook(null);
      } else {
        toast.add({
          title: "Delete Failed",
          description: data.error || "Could not delete the book.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.add({
        title: "Delete Error",
        description: "An unexpected error occurred while deleting the book.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/40 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-neutral-200/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tomato-light text-tomato text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Contributor Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              My Added Books
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Manage the books you have contributed to BookNook. Edit details,
              update available copies, or remove listings anytime.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* View Toggle (Table / Cards) */}
            <div className="inline-flex items-center bg-white border border-neutral-200 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-tomato text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-tomato text-white"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            <Link
              href="/add-book"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-tomato mx-auto mb-3" />
            <p className="text-xs font-semibold text-neutral-500">
              Loading your contributed books...
            </p>
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-tomato-light text-tomato flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              You Haven&apos;t Added Any Books Yet
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto">
              Share your favorite reads with the community by adding your first
              book to the catalog.
            </p>
            <div className="mt-6">
              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Book</span>
              </Link>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <th scope="col" className="py-3.5 px-4 sm:px-6">
                      Cover
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Title & Author
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Category
                    </th>
                    <th scope="col" className="py-3.5 px-4">
                      Copies
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 sm:px-6 text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {books.map((book) => {
                    const coverUrl = book.bookImage || book.image || "";
                    const copiesCount =
                      typeof book.copies === "number" ? book.copies : 3;

                    return (
                      <tr
                        key={book._id}
                        className="hover:bg-neutral-50/50 transition-colors"
                      >
                        {/* Book Cover */}
                        <td className="py-3.5 px-4 sm:px-6 w-20">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={book.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookMarked className="w-5 h-5 text-neutral-400 opacity-60" />
                            )}
                          </div>
                        </td>

                        {/* Title & Author */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <Link
                            href={`/books/${book._id}`}
                            className="font-bold text-neutral-900 hover:text-tomato transition-colors line-clamp-1 block text-xs sm:text-sm"
                          >
                            {book.title}
                          </Link>
                          <span className="text-neutral-500 text-[11px] block mt-0.5">
                            by {book.author}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-tomato-light text-tomato text-[10px] font-bold uppercase tracking-wider">
                            {book.category}
                          </span>
                        </td>

                        {/* Copies */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              copiesCount > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            {copiesCount > 0
                              ? `${copiesCount} Available`
                              : "0 (Not Available)"}
                          </span>
                        </td>

                        {/* Edit & Delete Buttons */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(book)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg border border-neutral-200 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingBook(book)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg border border-red-200/80 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>
                Showing <strong>{books.length}</strong>{" "}
                {books.length === 1 ? "book" : "books"} added by {userName}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Synced
                with MongoDB
              </span>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => {
              const coverUrl = book.bookImage || book.image || "";
              const copiesCount =
                typeof book.copies === "number" ? book.copies : 3;

              return (
                <div
                  key={book._id}
                  className="flex flex-col bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-neutral-100 mb-3 border border-neutral-100 flex items-center justify-center">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookMarked className="w-8 h-8 text-neutral-400 opacity-50" />
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-white/95 text-tomato rounded shadow-2xs">
                        {book.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-neutral-900/85 text-white rounded">
                        {copiesCount} Copies
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      by {book.author}
                    </p>
                    {book.description && (
                      <p className="text-[11px] text-neutral-500 mt-1.5 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(book)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingBook(book)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <Link
                      href={`/books/${book._id}`}
                      className="p-2 text-neutral-500 hover:text-tomato bg-neutral-50 rounded-lg border border-neutral-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* EDIT BOOK MODAL (Pre-filled with old data) */}
      {/* ===================================================================== */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => !isUpdating && setEditingBook(null)}
              disabled={isUpdating}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close edit modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3.5 mb-4 border-b border-neutral-100">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tomato-light text-tomato text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Edit3 className="w-3 h-3" />
                <span>Update Book</span>
              </div>
              <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                Edit Book Information
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Modify the fields below and click Save Changes.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              {/* Book Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Book Title <span className="text-tomato">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Author Name <span className="text-tomato">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato"
                />
              </div>

              {/* Category & Total Copies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Category <span className="text-tomato">*</span>
                  </label>
                  <select
                    required
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Available Copies <span className="text-tomato">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    required
                    value={editCopies}
                    onChange={(e) =>
                      setEditCopies(
                        Math.max(0, parseInt(e.target.value, 10) || 0)
                      )
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato"
                  />
                </div>
              </div>

              {/* Book Image URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Book Image URL (ImgBB / PostImage){" "}
                  <span className="text-tomato">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="url"
                    required
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Short Description <span className="text-tomato">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={400}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isUpdating}
                  className="w-1/3 py-2.5 px-4 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-2/3 inline-flex items-center justify-center gap-2 py-2.5 px-5 text-xs font-bold text-white bg-tomato hover:bg-tomato-hover disabled:bg-neutral-300 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CUSTOM CONFIRM DELETE MODAL (Replaces default browser confirm) */}
      {/* ===================================================================== */}
      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Delete This Book?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-neutral-900">
                &ldquo;{deletingBook.title}&rdquo;
              </strong>
              ? This action will remove the book from the catalog and cannot be
              undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

