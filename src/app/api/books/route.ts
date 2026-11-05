import { NextRequest, NextResponse } from "next/server";
import { getBookNookDb } from "@/lib/mongodb";
import { verifyRequestAuth } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");

    // If querying user's own added books (?email=...), verify JWT
    if (email) {
      const authUser = await verifyRequestAuth(req);
      if (!authUser) {
        return NextResponse.json(
          { error: "Unauthorized: valid JWT token required" },
          { status: 401 }
        );
      }
    }

    const db = await getBookNookDb();
    const booksCollection = db.collection("books");

    const filter: Record<string, unknown> = {};
    if (email) {
      filter.$or = [{ "addedBy.email": email }, { userEmail: email }];
    }
    if (category && category !== "All") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    let cursor = booksCollection.find(filter).sort({ _id: -1 });
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        cursor = cursor.limit(limit);
      }
    }

    const books = await cursor.toArray();

    // Ensure copies & totalCopies are always numeric on returned documents
    const normalized = books.map((b) => {
      const rawCopies =
        typeof b.copies === "number"
          ? b.copies
          : typeof b.totalCopies === "number"
          ? b.totalCopies
          : 3;
      return {
        ...b,
        _id: b._id.toString(),
        copies: rawCopies,
        totalCopies:
          typeof b.totalCopies === "number" ? b.totalCopies : rawCopies,
      };
    });

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT required to add a book" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      author,
      category,
      bookImage,
      description,
      totalCopies,
      copies,
      addedBy,
    } = body;

    if (!title || !author || !category || !bookImage || !description) {
      return NextResponse.json(
        { error: "All required book fields must be provided" },
        { status: 400 }
      );
    }

    const parsedCopies = Math.max(
      0,
      parseInt(String(copies ?? totalCopies ?? 1), 10) || 1
    );

    const newBook = {
      title: String(title).trim(),
      author: String(author).trim(),
      category: String(category).trim(),
      bookImage: String(bookImage).trim(),
      description: String(description).trim(),
      totalCopies: parsedCopies,
      copies: parsedCopies,
      addedBy: {
        name: addedBy?.name || authUser.name || "Reader",
        email: addedBy?.email || authUser.email,
      },
      userEmail: addedBy?.email || authUser.email,
      createdAt: body.createdAt || new Date().toISOString(),
      status: parsedCopies > 0 ? "Available" : "Not Available",
    };

    const db = await getBookNookDb();
    const result = await db.collection("books").insertOne(newBook);

    return NextResponse.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId.toString(),
      book: { ...newBook, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to add book" },
      { status: 500 }
    );
  }
}

