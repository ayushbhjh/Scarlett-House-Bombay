import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminPassword,
  getAdminSessionToken,
  getAdminUserId
} from "@/lib/admin-auth";

export const runtime = "nodejs";

type LoginBody = {
  userId?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const userId = (body.userId ?? "").trim();
    const password = body.password ?? "";

    if (userId !== getAdminUserId() || password !== getAdminPassword()) {
      return NextResponse.json({ ok: false, error: "Invalid user ID or password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: getAdminSessionToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid login request" }, { status: 400 });
  }
}
