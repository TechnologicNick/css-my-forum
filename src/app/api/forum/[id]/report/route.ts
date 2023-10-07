import asGlobalService from "@/as-global-service";
import { admin, getForum } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

const browser = asGlobalService(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  console.log("Browser launched");

  return browser;
}, "puppeteer-browser");

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const forum = getForum(id);
  if (!forum) {
    return NextResponse.json({ error: "Forum not found" }, { status: 404 });
  }

  const user = await admin;

  const ctx = await(await browser).createIncognitoBrowserContext();
  const page = await ctx.newPage();

  const url = `http://localhost:3000/forum/${id}`;
  console.log(`[${forum.id}]`, "Navigating to", url);

  await page.goto(url, { waitUntil: "networkidle0" });
  console.log(`[${forum.id}]`, "Page loaded");

  // Open login modal
  await page.click("#login");

  // Fill in username and password
  await page.click("#username");
  await page.keyboard.type(user.name, { delay: 250 });
  await page.click("#password");
  await page.keyboard.type(user.password, { delay: 250 });

  // Submit login form
  await page.keyboard.press("Enter");

  await page.waitForNetworkIdle({ idleTime: 500 });

  await page.close();
  await ctx.close();

  console.log(`[${forum.id}]`, "Logged in");

  return NextResponse.json({ verified: true });
};
