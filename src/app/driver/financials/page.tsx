"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Wallet, TrendingUp, Loader2, Banknote, CreditCard,
  ArrowDownCircle, ArrowUpCircle, CheckCircle2, Clock, RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";

const COMMISSION_RATE = 0.05;

interface PaymentRow {
  id: string;
  amount: number;
  adminCommission: number;
  paymentMethod: "CASH" | "ONLINE";
  settlementStatus: "PENDING" | "SETTLED";
  createdAt: string;
  booking: {
    client: { name: string | null };
    trip: {
      departureCity: string;
      arrivalCity: string;
      departureDate: string | null;
    };
  };
}

interface CashSummary {
  totalReceived: number;
  totalOwedToAdmin: number;
  totalNetKept: number;
  pendingOwedToAdmin: number;
}

interface OnlineSummary {
  totalClientPaid: number;
  totalDueFromAdmin: number;
  pendingDueFromAdmin: number;
}

interface FinancialData {
  cashPayments: PaymentRow[];
  onlinePayments: PaymentRow[];
  cashSummary: CashSummary;
  onlineSummary: OnlineSummary;
  totalNetRevenue: number;
}

function fmt(n: number) {
  return n.toLocaleString("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-TN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function SettlementBadge({ status }: { status: "PENDING" | "SETTLED" }) {
  if (status === "SETTLED") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
        <CheckCircle2 className="w-3 h-3" /> Réglé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
      <Clock className="w-3 h-3" /> En attente
    </span>
  );
}

export default function FinancialsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/driver/financials");
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("Impossible de charger les données financières.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) fetchData();
  }, [session, fetchData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Mon Bilan</h1>
          <p className="text-slate-400 mt-1 font-medium">Vos revenus nets, commissions et versements détaillés.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 border border-slate-800 hover:border-orange-500/40 rounded-xl px-4 py-2.5 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── Totaux globaux ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Revenu net total */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenu net total</p>
              </div>
              <p className="text-3xl font-black text-white">{fmt(data.totalNetRevenue)}</p>
              <p className="text-xs text-slate-500 mt-1">TND · après commission {(COMMISSION_RATE * 100).toFixed(0)}%</p>
            </div>

            {/* Cash : à donner à l'admin */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <ArrowUpCircle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[10px] font-bold text-amber-400/70 uppercase tracking-widest">À reverser à l'admin</p>
              </div>
              <p className="text-3xl font-black text-amber-400">{fmt(data.cashSummary.pendingOwedToAdmin)}</p>
              <p className="text-xs text-slate-500 mt-1">TND · commissions cash non réglées</p>
            </div>

            {/* Online : à recevoir de l'admin */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest">À recevoir de l'admin</p>
              </div>
              <p className="text-3xl font-black text-emerald-400">{fmt(data.onlineSummary.pendingDueFromAdmin)}</p>
              <p className="text-xs text-slate-500 mt-1">TND · paiements en ligne non versés</p>
            </div>
          </div>

          {/* ══════════ SECTION CASH ══════════ */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">Paiements Cash — ce que vous devez à l'admin</h2>
                <p className="text-xs text-slate-500 mt-0.5">Le client vous a payé directement en cash. Vous devez reverser la commission à l'admin.</p>
              </div>
            </div>

            {/* Récap cash */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total encaissé clients</p>
                <p className="text-lg font-black text-white">{fmt(data.cashSummary.totalReceived)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND</p>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest mb-1">Total commission due</p>
                <p className="text-lg font-black text-amber-400">{fmt(data.cashSummary.totalOwedToAdmin)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND · {(COMMISSION_RATE * 100).toFixed(0)}%</p>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-orange-400/60 uppercase tracking-widest mb-1">Votre net (cash)</p>
                <p className="text-lg font-black text-orange-400">{fmt(data.cashSummary.totalNetKept)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND · ce que vous gardez</p>
              </div>
            </div>

            {data.cashPayments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl py-10 text-center text-slate-500 text-sm">
                Aucun paiement cash enregistré.
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[750px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60">
                        {["Trajet", "Client", "Date", "Encaissé client", "Commission admin (-)", "Votre net", "Statut"].map((h) => (
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.cashPayments.map((p) => {
                        const net = p.amount - p.adminCommission;
                        return (
                          <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-bold text-white whitespace-nowrap">
                                {p.booking.trip.departureCity} → {p.booking.trip.arrivalCity}
                              </p>
                              {p.booking.trip.departureDate && (
                                <p className="text-[10px] text-slate-500 mt-0.5">{fmtDate(p.booking.trip.departureDate)}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300">{p.booking.client.name ?? "—"}</td>
                            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDate(p.createdAt)}</td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold font-mono text-white">{fmt(p.amount)} TND</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold font-mono text-amber-400">−{fmt(p.adminCommission)} TND</span>
                              <p className="text-[10px] text-slate-600 mt-0.5">à reverser</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-black font-mono text-orange-400">{fmt(net)} TND</span>
                              <p className="text-[10px] text-slate-600 mt-0.5">vous gardez</p>
                            </td>
                            <td className="px-4 py-3">
                              <SettlementBadge status={p.settlementStatus} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ══════════ SECTION EN LIGNE ══════════ */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">Paiements En Ligne — ce que l'admin vous doit</h2>
                <p className="text-xs text-slate-500 mt-0.5">Le client a payé en ligne sur le compte de la plateforme. L'admin vous verse votre net.</p>
              </div>
            </div>

            {/* Récap online */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total payé par clients</p>
                <p className="text-lg font-black text-white">{fmt(data.onlineSummary.totalClientPaid)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND · reçu par la plateforme</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Commission plateforme</p>
                <p className="text-lg font-black text-slate-400">
                  {fmt(data.onlineSummary.totalClientPaid - data.onlineSummary.totalDueFromAdmin)}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND · {(COMMISSION_RATE * 100).toFixed(0)}% gardé par admin</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Votre net (ligne)</p>
                <p className="text-lg font-black text-emerald-400">{fmt(data.onlineSummary.totalDueFromAdmin)}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">TND · dû par l'admin</p>
              </div>
            </div>

            {data.onlinePayments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl py-10 text-center text-slate-500 text-sm">
                Aucun paiement en ligne enregistré.
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[750px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60">
                        {["Trajet", "Client", "Date", "Payé par client", "Commission plateforme (−)", "Votre net", "Statut versement"].map((h) => (
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.onlinePayments.map((p) => {
                        const net = p.amount - p.adminCommission;
                        return (
                          <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-bold text-white whitespace-nowrap">
                                {p.booking.trip.departureCity} → {p.booking.trip.arrivalCity}
                              </p>
                              {p.booking.trip.departureDate && (
                                <p className="text-[10px] text-slate-500 mt-0.5">{fmtDate(p.booking.trip.departureDate)}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300">{p.booking.client.name ?? "—"}</td>
                            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDate(p.createdAt)}</td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold font-mono text-white">{fmt(p.amount)} TND</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold font-mono text-slate-400">−{fmt(p.adminCommission)} TND</span>
                              <p className="text-[10px] text-slate-600 mt-0.5">gardé par admin</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-black font-mono text-emerald-400">{fmt(net)} TND</span>
                              <p className="text-[10px] text-slate-600 mt-0.5">
                                {p.settlementStatus === "SETTLED" ? "versé" : "à recevoir"}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <SettlementBadge status={p.settlementStatus} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
