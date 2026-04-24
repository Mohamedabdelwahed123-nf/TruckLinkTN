import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  try {
    const driver = await prisma.driverProfile.findUnique({
      where: { userId }
    });

    if (!driver) {
      return NextResponse.json({
        negotiationsCount: 0,
        tripsCount: 0,
        revenue: 0,
        rating: 0
      });
    }

    // 1. Current negotiations count
    const negotiationsCount = await prisma.priceNegotiation.count({
      where: {
        booking: {
          trip: { driverId: driver.id }
        },
        status: "PENDING"
      }
    });

    // 2. Total trips count
    const tripsCount = await prisma.trip.count({
      where: { driverId: driver.id }
    });

    // 3. Net revenue = amount received minus admin commission
    const payments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        booking: { trip: { driverId: driver.id } },
      },
      select: { amount: true, adminCommission: true },
    });

    const revenue = payments.reduce(
      (sum, p) => sum + (p.amount - p.adminCommission),
      0
    );

    return NextResponse.json({
      negotiationsCount,
      tripsCount,
      revenue,
      rating: driver.rating || 0
    });
  } catch (error) {
    console.error("Database connection error in stats API:", error);
    // Return default stats instead of 500 to keep UI stable
    return NextResponse.json({
      negotiationsCount: 0,
      tripsCount: 0,
      revenue: 0,
      rating: 0,
      dbError: true
    });
  }
}
