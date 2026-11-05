import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getBookNookDb } from "@/lib/mongodb";
import { verifyRequestAuth } from "@/lib/jwt";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyRequestAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized: valid JWT required to return book" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid borrow ID" }, { status: 400 });
    }

    const db = await getBookNookDb();
    const borrowsCollection = db.collection("booksBorrow");
    const booksCollection = db.collection("books");

    // Find the borrow record so we know which book's copies to increment
    const borrowDoc = await borrowsCollection.findOne({
      _id: new ObjectId(id),
    });

    const deleteResult = await borrowsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    // Increase available copies by 1 using $inc
    if (borrowDoc?.bookId && ObjectId.isValid(borrowDoc.bookId)) {
      const bookObjId = new ObjectId(borrowDoc.bookId);
      const bookDoc = await booksCollection.findOne({ _id: bookObjId });

      if (bookDoc) {
        if (typeof bookDoc.copies !== "number") {
          const initial =
            typeof bookDoc.totalCopies === "number" ? bookDoc.totalCopies : 3;
          await booksCollection.updateOne(
            { _id: bookObjId },
            { $set: { copies: initial, totalCopies: initial } }
          );
        }

        await booksCollection.updateOne(
          { _id: bookObjId },
          {
            $inc: { copies: 1 },
            $set: { status: "Available" },
          }
        );
      }
    }

    return NextResponse.json({
      acknowledged: deleteResult.acknowledged,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("DELETE /api/borrows/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to return book" },
      { status: 500 }
    );
  }
}

