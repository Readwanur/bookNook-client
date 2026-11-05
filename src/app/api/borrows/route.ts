import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getBookNookDb } from "@/lib/mongodb";
import { verifyRequestAuth } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT token required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || authUser.email;

    const db = await getBookNookDb();
    const borrows = await db
      .collection("booksBorrow")
      .find({ userEmail: email })
      .sort({ _id: -1 })
      .toArray();

    const normalized = borrows.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("GET /api/borrows error:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrowed books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT token required to borrow a book" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookId,
      bookTitle,
      bookImage,
      userName,
      userEmail,
      borrowDate,
      returnDate,
    } = body;

    const targetEmail = userEmail || authUser.email;

    if (!bookId || !targetEmail || !returnDate) {
      return NextResponse.json(
        { error: "Missing required borrow information" },
        { status: 400 }
      );
    }

    const db = await getBookNookDb();
    const booksCollection = db.collection("books");
    const borrowsCollection = db.collection("booksBorrow");

    // 1. Check No Double Borrow: A user cannot borrow the same book two times at the same time
    const existingBorrow = await borrowsCollection.findOne({
      bookId: String(bookId),
      userEmail: targetEmail,
    });

    if (existingBorrow) {
      return NextResponse.json(
        {
          error:
            "You have already borrowed this book! You cannot borrow the same book twice at the same time.",
          code: "DOUBLE_BORROW",
        },
        { status: 409 }
      );
    }

    // 2. Check book availability and decrement copies with $inc
    let remainingCopies = 0;

    if (ObjectId.isValid(bookId)) {
      const bookDoc = await booksCollection.findOne({
        _id: new ObjectId(bookId),
      });

      if (!bookDoc) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }

      // If legacy book has no numeric `copies` field yet, initialize it first
      if (typeof bookDoc.copies !== "number") {
        const initialCopies =
          typeof bookDoc.totalCopies === "number" ? bookDoc.totalCopies : 3;
        await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          {
            $set: {
              copies: initialCopies,
              totalCopies: initialCopies,
            },
          }
        );
      }

      const currentCopies =
        typeof bookDoc.copies === "number"
          ? bookDoc.copies
          : typeof bookDoc.totalCopies === "number"
          ? bookDoc.totalCopies
          : 3;

      if (currentCopies <= 0) {
        return NextResponse.json(
          {
            error: "This book is currently Not Available (0 copies left).",
            code: "OUT_OF_STOCK",
          },
          { status: 400 }
        );
      }

      // Decrease copies by 1 using MongoDB $inc operator
      await booksCollection.updateOne(
        { _id: new ObjectId(bookId) },
        { $inc: { copies: -1 } }
      );

      remainingCopies = currentCopies - 1;
      await booksCollection.updateOne(
        { _id: new ObjectId(bookId) },
        {
          $set: {
            status: remainingCopies > 0 ? "Available" : "Not Available",
          },
        }
      );
    }

    // 3. Save borrow record in borrows collection (booksBorrow)
    const borrowRecord = {
      bookId: String(bookId),
      bookTitle: String(bookTitle || ""),
      bookImage: String(bookImage || ""),
      userName: String(userName || authUser.name || "Reader"),
      userEmail: targetEmail,
      borrowDate: borrowDate || new Date().toISOString().split("T")[0],
      returnDate: String(returnDate),
      status: "Borrowed",
      createdAt: new Date().toISOString(),
    };

    const result = await borrowsCollection.insertOne(borrowRecord);

    return NextResponse.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId.toString(),
      remainingCopies,
    });
  } catch (error) {
    console.error("POST /api/borrows error:", error);
    return NextResponse.json(
      { error: "Failed to process borrow request" },
      { status: 500 }
    );
  }
}

