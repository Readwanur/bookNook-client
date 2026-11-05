"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  UserCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { ensureJwtToken, clearJwtToken } from "@/lib/api-client";
import { toast } from "@/components/ui/toast";

function subscribeTheme(callback: () => void) {
  window.addEventListener("booknook-theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("booknook-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): boolean {
  return localStorage.getItem("booknook_theme") === "dark";
}

function getThemeServerSnapshot(): boolean {
  return false;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Sync dark mode class on <html> after hydration
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    localStorage.setItem("booknook_theme", nextDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", nextDark);
    window.dispatchEvent(new Event("booknook-theme-change"));
  };

  // Issue/refresh JWT token whenever session user is present
  useEffect(() => {
    if (session?.user?.email) {
      ensureJwtToken(session.user.email, session.user.name || undefined);
    }
  }, [session?.user?.email, session?.user?.name]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setDropdownOpen(false);
      await clearJwtToken();
      await signOut();
      toast.add({
        title: "Signed Out",
        description: "You have been logged out successfully.",
        type: "success",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.add({
        title: "Sign Out Error",
        description: "Failed to log out. Please try again.",
        type: "error",
      });
    }
  };

  // Public routes shown to everyone; private routes shown ONLY when logged in
  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const navLinks = session?.user
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/add-book") {
      return pathname === "/add-book" || pathname === "/add-books";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm shadow-tomato/30 transition-colors group-hover:bg-tomato-hover">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-neutral-900 leading-none">
                  Book<span className="text-tomato">Nook</span>
                </span>
                <span className="text-[10px] uppercase font-medium tracking-wider text-neutral-400 mt-0.5">
                  Online Library
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      active
                        ? "text-tomato bg-tomato-light font-bold shadow-xs border border-tomato/25"
                        : "text-neutral-600 hover:text-tomato hover:bg-tomato-light/60"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-tomato rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Theme Toggle + User Photo Dropdown (when logged in) OR Login & Register (when logged out) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-10 h-10 rounded-xl border border-neutral-200/90 bg-neutral-50 hover:border-tomato/50 text-tomato flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-tomato" />
              ) : (
                <Moon className="w-4 h-4 text-tomato" />
              )}
            </button>

            {session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/90 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-tomato/25"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  title="Open user menu"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-tomato/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-tomato text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180 text-tomato" : ""
                    }`}
                  />
                </button>

                {/* User Photo Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-neutral-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Name & Email Header */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {session.user.name || "BookNook Reader"}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    {/* My Profile Link */}
                    <div className="py-1 px-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-tomato hover:bg-tomato-light/50 rounded-xl transition-colors"
                      >
                        <UserCircle2 className="w-4 h-4 text-neutral-400" />
                        <span>My Profile</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-1 mt-1 border-t border-neutral-100 px-1.5">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-neutral-800 hover:text-tomato transition-colors rounded-lg hover:bg-neutral-50"
                >
                  <User className="w-4 h-4 text-neutral-500" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm shadow-tomato/25 transition-all duration-200 hover:shadow-md hover:shadow-tomato/30 active:scale-[0.98]"
                >
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile theme toggle & menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-2 rounded-xl border border-neutral-200/90 bg-neutral-50 text-tomato transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-tomato" />
              ) : (
                <Moon className="w-5 h-5 text-tomato" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-base font-semibold rounded-xl transition-colors ${
                    active
                      ? "text-tomato bg-tomato-light border-l-4 border-tomato font-bold"
                      : "text-neutral-700 hover:text-tomato hover:bg-tomato-light/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-tomato text-white text-xs font-bold flex items-center justify-center">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {session.user.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 truncate">
                      {session.user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-colors"
                >
                  <UserCircle2 className="w-4 h-4 text-tomato" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-neutral-800 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-tomato hover:bg-tomato-hover rounded-xl shadow-sm shadow-tomato/25 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
