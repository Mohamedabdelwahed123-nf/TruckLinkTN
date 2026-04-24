import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "DRIVER") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const driver = await prisma.driverProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!driver) {
      return NextResponse.json({ error: "Profil chauffeur introuvable" }, { status: 404 });
    }

    const payments = await prisma.payment.findMany({
      where: {
        status: "SUCCESS",
        booking: {
          trip: { driverId: driver.id },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            client: { select: { name: true } },
            trip: {
              select: {
                departureCity: true,
                arrivalCity: true,
                departureDate: true,
              },
            },
          },
        },
      },
    });

    const cashPayments = payments.filter((p) => p.paymentMethod === "CASH");
    const onlinePayments = payments.filter((p) => p.paymentMethod === "ONLINE");

    // CASH: client paid driver directly → driver owes commission to admin
    const cashSummary = {
      totalReceived: cashPayments.reduce((s, p) => s + p.amount, 0),
      totalOwedToAdmin: cashPayments.reduce((s, p) => s + p.adminCommission, 0),
      totalNetKept: cashPayments.reduce((s, p) => s + (p.amount - p.adminCommission), 0),
      pendingOwedToAdmin: cashPayments
        .filter((p) => p.settlementStatus === "PENDING")
        .reduce((s, p) => s + p.adminCommission, 0),
    };

    // ONLINE: admin received from client → admin owes net to driver
    const onlineSummary = {
      totalClientPaid: onlinePayments.reduce((s, p) => s + p.amount, 0),
      totalDueFromAdmin: onlinePayments.reduce((s, p) => s + (p.amount - p.adminCommission), 0),
      pendingDueFromAdmin: onlinePayments
        .filter((p) => p.settlementStatus === "PENDING")
        .reduce((s, p) => s + (p.amount - p.adminCommission), 0),
    };

    const totalNetRevenue =
      cashSummary.totalNetKept + onlineSummary.totalDueFromAdmin;

    return NextResponse.json({
      cashPayments,
      onlinePayments,
      cashSummary,
      onlineSummary,
      totalNetRevenue,
    });
  } catch (error) {
    console.error("[DRIVER_FINANCIALS]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
