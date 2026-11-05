"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  BookOpen,
  BookPlus,
  BookmarkCheck,
  ShieldCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?callbackUrl=%2Fprofile");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-tomato mb-2" />
        <p className="text-xs font-semibold text-neutral-500">
          Loading your profile...
        </p>
      </div>
    );
  }

  const { name, email, image } = session.user;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/40 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
          {/* Top Banner */}
          <div className="h-28 bg-linear-to-r from-neutral-900 via-neutral-800 to-tomato/90 relative" />

          <div className="px-6 sm:px-10 pb-8">
            {/* Avatar */}
            <div className="relative -mt-14 mb-4 flex items-end justify-between">
              <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md border border-neutral-200">
                {image ? (
                  <img
                    src={image}
                    alt={name || "User"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-tomato text-white text-3xl font-extrabold flex items-center justify-center">
                    {(name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Reader</span>
              </span>
            </div>

            {/* User Details */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {name || "BookNook Member"}
            </h1>
            <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-tomato" />
              <span>{email}</span>
            </p>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-tomato">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Full Name
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-tomato">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Email Address
                  </span>
                  <span className="text-xs font-bold text-neutral-800 truncate block">
                    {email}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Link
                href="/my-books"
                className="group p-4 rounded-2xl border border-neutral-200 hover:border-tomato/40 bg-white hover:bg-tomato-light/20 transition-all flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-xl bg-tomato-light text-tomato flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-tomato flex items-center justify-between">
                    <span>My Books</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Edit or delete books you added
                  </p>
                </div>
              </Link>

              <Link
                href="/my-borrows"
                className="group p-4 rounded-2xl border border-neutral-200 hover:border-tomato/40 bg-white hover:bg-tomato-light/20 transition-all flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-xl bg-tomato-light text-tomato flex items-center justify-center mb-3">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-tomato flex items-center justify-between">
                    <span>My Borrows</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    View & return borrowed books
                  </p>
                </div>
              </Link>

              <Link
                href="/add-book"
                className="group p-4 rounded-2xl border border-neutral-200 hover:border-tomato/40 bg-white hover:bg-tomato-light/20 transition-all flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-xl bg-tomato-light text-tomato flex items-center justify-center mb-3">
                  <BookPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 group-hover:text-tomato flex items-center justify-between">
                    <span>Add Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Contribute a new title
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

