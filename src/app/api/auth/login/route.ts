import { env } from "@/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type LoginRequest } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as LoginRequest;

    if (username === env.APP_USERNAME && password === env.APP_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
