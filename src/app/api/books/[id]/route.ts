import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getBookNookDb } from "@/lib/mongodb";
import { verifyRequestAuth } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const db = await getBookNookDb();
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const rawCopies =
      typeof book.copies === "number"
        ? book.copies
        : typeof book.totalCopies === "number"
        ? book.totalCopies
        : 3;

    // Check if the requesting user already borrowed this book
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    let alreadyBorrowed = false;

    if (userEmail) {
      const existingBorrow = await db.collection("booksBorrow").findOne({
        bookId: id,
        userEmail: userEmail,
      });
      alreadyBorrowed = Boolean(existingBorrow);
    }

    return NextResponse.json({
      ...book,
      _id: book._id.toString(),
      copies: rawCopies,
      totalCopies:
        typeof book.totalCopies === "number" ? book.totalCopies : rawCopies,
      status: rawCopies > 0 ? "Available" : "Not Available",
      alreadyBorrowed,
    });
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT required to update book" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      author,
      category,
      bookImage,
      description,
      copies,
      totalCopies,
    } = body;

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateFields.title = String(title).trim();
    if (author !== undefined) updateFields.author = String(author).trim();
    if (category !== undefined) updateFields.category = String(category).trim();
    if (bookImage !== undefined)
      updateFields.bookImage = String(bookImage).trim();
    if (description !== undefined)
      updateFields.description = String(description).trim();

    if (copies !== undefined || totalCopies !== undefined) {
      const parsedCopies = Math.max(
        0,
        parseInt(String(copies ?? totalCopies ?? 0), 10) || 0
      );
      updateFields.copies = parsedCopies;
      updateFields.totalCopies = parsedCopies;
      updateFields.status = parsedCopies > 0 ? "Available" : "Not Available";
    }

    const db = await getBookNookDb();
    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    return NextResponse.json({
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT required to delete book" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }

    const db = await getBookNookDb();
    const result = await db
      .collection("books")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}

