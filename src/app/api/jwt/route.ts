import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signJwt } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    let email = "";
    let name = "";
    let sub = "";

    // Check BetterAuth session first
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session?.user?.email) {
      email = session.user.email;
      name = session.user.name || "";
      sub = session.user.id;
    } else {
      // Allow body email if just authenticated
      const body = await req.json().catch(() => ({}));
      if (body?.email) {
        email = String(body.email);
        name = String(body.name || "");
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized: valid user email required to issue JWT" },
        { status: 401 }
      );
    }

    const token = signJwt({ email, name, sub });

    const response = NextResponse.json({
      success: true,
      token,
    });

    response.cookies.set("booknook_jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error generating JWT:", error);
    return NextResponse.json(
      { error: "Failed to issue JWT token" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("booknook_jwt");
  return response;
}

