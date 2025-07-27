// app/api/protected/route.ts
import { auth } from "@/auth"; // your auth.tsの場所に合わせて
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth({ request });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Hello, authenticated user!" });
}
