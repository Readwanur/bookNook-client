#  BookNook — Modern Online Library & Book Borrowing Platform

**BookNook** is a full-stack community-driven online library and book management platform where readers can discover curated books, contribute new titles to the catalog, borrow books with real-time copy tracking, and manage their personal reading shelf.

---

##  Live Site URL
- **Live Client URL:** [https://booknook-client.vercel.app](https://booknook-client.vercel.app)

---

##  Key Features

- ** Secure Authentication & Private Route Protection (BetterAuth + MongoDB Adapter + JWT):**
  - Supports Email/Password registration (with strict password validation requiring uppercase, lowercase, and 6+ characters) and one-click **Google Social Login**.
  - Protects private routes (`/add-book`, `/my-books`, `/my-borrows`, `/books/:id`, `/profile`) with automatic redirect to Login and callback navigation back to the user's intended page.
  - Secures API endpoints with **HS256 JWT token verification** (`Authorization: Bearer <token>` and HTTP-only cookies).

- ** Real-Time Book Borrowing System & Inventory Tracking (`$inc`):**
  - Users can borrow available books via an interactive modal with pre-filled borrower credentials and customizable return dates.
  - Automatically decrements available copies by `1` (`$inc: { copies: -1 }`) when a book is borrowed and increments copies by `1` (`$inc: { copies: 1 }`) when returned from the **My Borrows** page.
  - Disables borrowing and displays **"Not Available"** when available copies reach `0`.

- ** Anti-Double Borrow Safeguard:**
  - Prevents a user from borrowing the same book twice at the same time, displaying an instant toast error notification if a duplicate borrow is attempted.

- ** Complete Contributor Dashboard (`Add Book` & `My Books` CRUD):**
  - Authenticated members can add new books with cover images hosted on **ImgBB** or **PostImage**, live thumbnail previews, categories (`Fiction`, `Science`, `History`, `Kids`, `Others`), and total copy counts.
  - **My Books** allows contributors to switch between **Table** and **Card** views, edit existing book details via a pre-filled modal, and delete books using a custom confirmation modal.

- ** Dark / Light Theme Toggle & Smooth Framer Motion Animations:**
  - Features a persistent **Dark (`#202625`) / Light (`#FFFFFF`)** theme switcher in the Navbar with vibrant **Tomato (`#FF6347`)** accents.
  - Enhanced with **Framer Motion** entrance animations, staggered card grids, hover lifts, and animated dropdown transitions.

- **⚡ Responsive UI, Dynamic Page Titles & Toast Feedback:**
  - Fully responsive across mobile, tablet, and desktop viewports, complete with a Swiper.js hero slider, custom 404 page, loading spinners, dynamic route titles (`BookNook | All Books`, etc.), and toast notifications for every user action.

---

##  Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Animations & UI:** Framer Motion, Swiper.js, Lucide Icons, Base UI / Shadcn UI
- **Authentication & Security:** BetterAuth (`better-auth`, `@better-auth/mongo-adapter`), JSON Web Tokens (JWT)
- **Backend & Database:** Node.js, Express.js, MongoDB Atlas (`bookNook` database)
