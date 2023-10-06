import { NextResponse } from "next/server";
import { z } from "zod";
import { createForum } from "@/database";

const schema = z.object({
  title: z.string(),
  customCss: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data = parsed.data;

  const forum = createForum(data.title, data.customCss);

  console.log("Created forum", forum)

  return NextResponse.json({ forum });
}
