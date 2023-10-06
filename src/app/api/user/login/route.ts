import { createSession, login } from "@/database";
import { ApiResponse } from "@/type-helpers";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  username: z.string(),
  hash: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;

  const user = await login(data.username, data.hash);
  if (!user) {
    return NextResponse.json({ error: "Username or password is incorrect" }, { status: 401 });
  }

  const session = createSession(user);

  return NextResponse.json({ session });
}

export type LoginResponse = ApiResponse<ReturnType<typeof POST>>;
