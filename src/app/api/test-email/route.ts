import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = !!process.env.RESEND_API_KEY;
  const hasFrom = !!process.env.EMAIL_FROM;
  return NextResponse.json({
    RESEND_API_KEY: hasKey ? "configured" : "MISSING",
    EMAIL_FROM: hasFrom ? process.env.EMAIL_FROM : "MISSING",
  });
}
