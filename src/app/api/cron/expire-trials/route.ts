import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const expiredTrials = await prisma.subscription.updateMany({
      where: {
        status: "TRIAL",
        trialEndsAt: { lt: now },
      },
      data: {
        status: "EXPIRED",
        endDate: now,
      },
    });

    const expiredSubscriptions = await prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: now },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return NextResponse.json({
      success: true,
      expiredTrials: expiredTrials.count,
      expiredSubscriptions: expiredSubscriptions.count,
    });
  } catch (error) {
    console.error("[Cron] Trial expiry check failed:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
