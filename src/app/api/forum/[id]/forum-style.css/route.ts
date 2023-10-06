import { getForum } from "@/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const forum = getForum(id);
  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  return new NextResponse(forum.customCss, {
    headers: {
      "content-type": "text/css",
    },
  });
};
