import type { NextResponse } from "next/server";

export type ApiResponse<T extends Promise<NextResponse>> = T extends Promise<
  NextResponse<infer R>
>
  ? R
  : never;
