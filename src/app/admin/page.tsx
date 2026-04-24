"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Users, Truck, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  Loader2, DollarSign, Route, ArrowDownCircle, ArrowUpCircle,
  RefreshCw, ShieldCheck, ShieldX, Banknote, CreditCard, Settings,
  UserCog, FileText, LayoutDashboard,
} from "lucide-react";

const COMMISSION_RATE = 0.05;

interface Stats {
  totalUsers: number; totalDrivers: number; totalClients: number;
  pendingDrivers: number; totalBookings: number; activeTrips: number;
  totalRevenue: number; toCollectFromDrivers: number; toPayToDrivers: number;
}

interface UserRow {
  id: string; name: string | null; email: string | null;
  phoneNumber: string | null; role: string; createdAt: string;
  driverProfile: { id?: string; isVerified: boolean; rating: number; totalTrips: number; cinNumber: string | null } | null;
  _count: { bookings: number };
}

interface PaymentRow {
  id: string; amount: number; adminCommission: number;
  paymentMethod: "CASH" | "ONLINE"; settlementStatus: "PENDING" | "SETTLED";
  status: string; createdAt: string;
  booking: {
    agreedPrice: number | null;
    client: { id: string; name: string | null; email: string | null };
    trip: { departureCity: string; arrivalCity: string; driver: { user: { id: string; name: string | null; email: string | null } } };
  };
}

interface FinanceData {
  cashPayments: PaymentRow[];
  onlinePayments: PaymentRow[];
  summary: { totalCommissionsEarned: number; pendingCashCommissions: number; pendingDriverPayouts: number };
}

function fmt(n: number) {
  return n.toLocaleString("fr-TN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} j`;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
    </div>
  );
}

function Empty({ text = "Aucune donnée disponible" }: { text?: string }) {
  return (
    <div className="py-12 text-center text-slate-500 text-sm">{text}</div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    SETTLED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    SUCCESS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
    CONFIRMED: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    IN_TRANSIT: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    CANCELLED: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    PENDING_NEGOTIATION: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };
  const labels: Record<string, string> = {
    PENDING: "En attente", SETTLED: "Réglé", SUCCESS: "Succès", FAILED: "Échoué",
    CONFIRMED: "Confirmé", PAID: "Payé", IN_TRANSIT: "En transit",
    DELIVERED: "Livré", CANCELLED: "Annulé", PENDING_NEGOTIATION: "Négociation",
  };
  const cls = map[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${cls}`}>
      {labels[status] ?? status}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent, iconColor }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string; iconColor: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-colors">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function FinanceRow({
  row, mode, onSettle, loading,
}: {
  row: PaymentRow; mode: "CASH" | "ONLINE"; onSettle: (id: string) => void; loading: boolean;
}) {
  const net = row.amount - row.adminCommission;
  const isSettled = row.settlementStatus === "SETTLED";

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3">
        <div className="font-semibold text-white text-sm">{row.booking.trip.driver.user.name ?? "—"}</div>
        <div className="text-xs text-slate-500">{row.booking.trip.driver.user.email ?? "—"}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-slate-300">{row.booking.client.name ?? "—"}</div>
        <div className="text-xs text-slate-500">{row.booking.client.email ?? "—"}</div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-300">
        {row.booking.trip.departureCity} → {row.booking.trip.arrivalCity}
      </td>
      <td className="px-4 py-3 text-sm font-mono text-white">{fmt(row.amount)} TND</td>
      {mode === "CASH" ? (
        <td className="px-4 py-3">
          <div className="text-sm font-bold font-mono text-amber-400">{fmt(row.adminCommission)} TND</div>
          <div className="text-[10px] text-slate-500">Commission {(COMMISSION_RATE * 100).toFixed(0)}%</div>
        </td>
      ) : (
        <td className="px-4 py-3">
          <div className="text-sm font-bold font-mono text-orange-400">{fmt(net)} TND</div>
          <div className="text-[10px] text-slate-500">Net après commission</div>
        </td>
      )}
      <td className="px-4 py-3"><StatusPill status={row.settlementStatus} /></td>
      <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(row.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        {!isSettled ? (
          <button
            onClick={() => onSettle(row.id)}
            disabled={loading}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
              mode === "CASH"
                ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10 disabled:opacity-40"
                : "border-orange-500/40 text-orange-400 hover:bg-orange-500/10 disabled:opacity-40"
            }`}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : mode === "CASH" ? "Encaissé ✓" : "Payé ✓"}
          </button>
        ) : (
          <span className="text-xs text-slate-600 font-medium">Réglé</span>
        )}
      </td>
    </tr>
  );
}

const TABS = [
  { id: "overview", label: "Vue Globale", icon: LayoutDashboard },
  { id: "finance", label: "Finance", icon: TrendingUp },
  { id: "drivers", label: "Chauffeurs", icon: Truck },
  { id: "clients", label: "Clients", icon: Users },
  { id: "bookings", label: "Réservations", icon: Route },
  { id: "settings", label: "Paramètres", icon: Settings },
];

function SectionHeader({ icon: Icon, iconClass, bgClass, title, subtitle }: {
  icon: React.ElementType; iconClass: string; bgClass: string; title: string; subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      <div>
        <h2 className="font-bold text-white text-sm tracking-wide">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState<Stats | null>(null);
  const [finance, setFinance] = useState<FinanceData | null>(null);
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [drivers, setDrivers] = useState<UserRow[]>([]);
  const [clients, setClients] = useState<UserRow[]>([]);
  const [commissionInput, setCommissionInput] = useState("5");
  const [platformStatus, setPlatformStatus] = useState<"operational" | "maintenance">("operational");

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFinance, setLoadingFinance] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [settleLoading, setSettleLoading] = useState<Record<string, boolean>>({});
  const [verifyLoading, setVerifyLoading] = useState<Record<string, boolean>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error();
      setStats(await res.json());
    } catch { showToast("Impossible de charger les statistiques", "error"); }
    finally { setLoadingStats(false); }
  }, [showToast]);

  const fetchFinance = useCallback(async () => {
    setLoadingFinance(true);
    try {
      const res = await fetch("/api/admin/finance");
      if (!res.ok) throw new Error();
      setFinance(await res.json());
    } catch { showToast("Impossible de charger les données financières", "error"); }
    finally { setLoadingFinance(false); }
  }, [showToast]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const [allRes, driversRes, clientsRes] = await Promise.all([
        fetch("/api/admin/users?limit=200"),
        fetch("/api/admin/users?role=DRIVER&limit=200"),
        fetch("/api/admin/users?role=CLIENT&limit=200"),
      ]);
      const [allData, driversData, clientsData] = await Promise.all([
        allRes.json(), driversRes.json(), clientsRes.json(),
      ]);
      setAllUsers(allData.users ?? []);
      setDrivers(driversData.users ?? []);
      setClients(clientsData.users ?? []);
    } catch { showToast("Impossible de charger les utilisateurs", "error"); }
    finally { setLoadingUsers(false); }
  }, [showToast]);

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") return;
    fetchStats(); fetchFinance(); fetchUsers();
  }, [session, fetchStats, fetchFinance, fetchUsers]);

  const handleSettle = async (paymentId: string) => {
    setSettleLoading((p) => ({ ...p, [paymentId]: true }));
    try {
      const res = await fetch(`/api/admin/finance/${paymentId}/settle`, { method: "PUT" });
      if (!res.ok) throw new Error();
      showToast("Règlement enregistré");
      fetchFinance(); fetchStats();
    } catch { showToast("Erreur lors du règlement", "error"); }
    finally { setSettleLoading((p) => ({ ...p, [paymentId]: false })); }
  };

  const handleVerify = async (driverProfileId: string, action: "APPROVE" | "REJECT") => {
    const key = `${driverProfileId}-${action}`;
    setVerifyLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fetch(`/api/admin/drivers/${driverProfileId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();
      showToast(action === "APPROVE" ? "Chauffeur approuvé ✓" : "Chauffeur rejeté");
      fetchUsers(); fetchStats();
    } catch { showToast("Erreur lors de la vérification", "error"); }
    finally { setVerifyLoading((p) => ({ ...p, [key]: false })); }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionRate: parseFloat(commissionInput) / 100, platformStatus }),
      });
      showToast("Paramètres enregistrés");
    } catch { showToast("Erreur lors de la sauvegarde", "error"); }
    finally { setSavingSettings(false); }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-white">Accès Refusé</h1>
        <p className="text-slate-500">Vous devez être administrateur pour accéder à cette page.</p>
      </div>
    );
  }

  const pendingDrivers = allUsers.filter((u) => u.driverProfile && !u.driverProfile.isVerified);
  const verifiedDrivers = drivers.filter((u) => u.driverProfile?.isVerified);
  const allPayments = [
    ...(finance?.cashPayments ?? []),
    ...(finance?.onlinePayments ?? []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const TH_CLS = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-slate-950">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold transition-all ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Espace Administrateur</h1>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString("fr-TN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => { fetchStats(); fetchFinance(); fetchUsers(); }}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 hover:border-orange-500/40 hover:text-orange-400 rounded-xl px-4 py-2.5 transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all relative ${
                activeTab === t.id
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === "drivers" && stats && stats.pendingDrivers > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {stats.pendingDrivers}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════ VUE GLOBALE ════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {loadingStats ? <Spinner /> : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Revenus Totaux"
                    value={`${fmt(stats?.totalRevenue ?? 0)} TND`}
                    sub="Commissions encaissées"
                    icon={DollarSign}
                    accent="bg-emerald-500/15"
                    iconColor="text-emerald-400"
                  />
                  <StatCard
                    label="En attente validation"
                    value={stats?.pendingDrivers ?? 0}
                    sub={stats?.pendingDrivers ? "Action requise" : "À jour"}
                    icon={Truck}
                    accent={stats?.pendingDrivers ? "bg-red-500/15" : "bg-emerald-500/15"}
                    iconColor={stats?.pendingDrivers ? "text-red-400" : "text-emerald-400"}
                  />
                  <StatCard
                    label="Total Utilisateurs"
                    value={stats?.totalUsers ?? 0}
                    sub={`${stats?.totalDrivers ?? 0} chauffeurs · ${stats?.totalClients ?? 0} clients`}
                    icon={Users}
                    accent="bg-orange-500/15"
                    iconColor="text-orange-400"
                  />
                  <StatCard
                    label="Voyages actifs"
                    value={stats?.activeTrips ?? 0}
                    sub={`${stats?.totalBookings ?? 0} réservations total`}
                    icon={Route}
                    accent="bg-slate-700"
                    iconColor="text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center">
                        <ArrowDownCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">À encaisser des chauffeurs</p>
                        <p className="text-xs text-amber-400/70 mt-0.5">Commissions cash non collectées</p>
                      </div>
                    </div>
                    <p className="text-4xl font-black text-amber-400">{fmt(stats?.toCollectFromDrivers ?? 0)}</p>
                    <p className="text-xs text-slate-500 mt-1">TND · Taux {(COMMISSION_RATE * 100).toFixed(0)}%</p>
                    <button onClick={() => setActiveTab("finance")} className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2">
                      Voir le détail →
                    </button>
                  </div>

                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center">
                        <ArrowUpCircle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">À payer aux chauffeurs</p>
                        <p className="text-xs text-orange-400/70 mt-0.5">Net dû après paiement en ligne</p>
                      </div>
                    </div>
                    <p className="text-4xl font-black text-orange-400">{fmt(stats?.toPayToDrivers ?? 0)}</p>
                    <p className="text-xs text-slate-500 mt-1">TND · montants reçus via Paymee</p>
                    <button onClick={() => setActiveTab("finance")} className="mt-4 text-xs font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2">
                      Voir le détail →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════ FINANCE ════════════ */}
        {activeTab === "finance" && (
          <div className="space-y-8">
            {loadingFinance ? <Spinner /> : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Revenus totaux</p>
                    <p className="text-2xl font-black text-emerald-400">{fmt(finance?.summary.totalCommissionsEarned ?? 0)} TND</p>
                    <p className="text-xs text-slate-500 mt-1">Commissions perçues</p>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Commissions cash en attente</p>
                    <p className="text-2xl font-black text-amber-400">{fmt(finance?.summary.pendingCashCommissions ?? 0)} TND</p>
                    <p className="text-xs text-slate-500 mt-1">À encaisser des chauffeurs</p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Net à verser</p>
                    <p className="text-2xl font-black text-orange-400">{fmt(finance?.summary.pendingDriverPayouts ?? 0)} TND</p>
                    <p className="text-xs text-slate-500 mt-1">À payer aux chauffeurs</p>
                  </div>
                </div>

                <div>
                  <SectionHeader
                    icon={Banknote}
                    iconClass="text-amber-400"
                    bgClass="bg-amber-500/15"
                    title="Paiements CASH — Commission due par chauffeur"
                    subtitle="Le client a payé le chauffeur en cash. Le chauffeur vous doit votre commission."
                  />
                  <TableWrapper>
                    <table className="w-full text-left min-w-[900px]">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60">
                          {["Chauffeur", "Client", "Trajet", "Montant total", "Commission due", "Statut", "Date", "Action"].map((h) => (
                            <th key={h} className={TH_CLS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(finance?.cashPayments ?? []).length === 0 ? (
                          <tr><td colSpan={8}><Empty text="Aucun paiement cash en attente" /></td></tr>
                        ) : (
                          (finance?.cashPayments ?? []).map((row) => (
                            <FinanceRow key={row.id} row={row} mode="CASH" onSettle={handleSettle} loading={!!settleLoading[row.id]} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </TableWrapper>
                </div>

                <div>
                  <SectionHeader
                    icon={CreditCard}
                    iconClass="text-orange-400"
                    bgClass="bg-orange-500/15"
                    title="Paiements EN LIGNE — Net à verser au chauffeur"
                    subtitle="Le client a payé en ligne sur votre compte. Vous devez verser le net au chauffeur."
                  />
                  <TableWrapper>
                    <table className="w-full text-left min-w-[900px]">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60">
                          {["Chauffeur", "Client", "Trajet", "Montant reçu", "Net à payer", "Statut", "Date", "Action"].map((h) => (
                            <th key={h} className={TH_CLS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(finance?.onlinePayments ?? []).length === 0 ? (
                          <tr><td colSpan={8}><Empty text="Aucun paiement en ligne en attente" /></td></tr>
                        ) : (
                          (finance?.onlinePayments ?? []).map((row) => (
                            <FinanceRow key={row.id} row={row} mode="ONLINE" onSettle={handleSettle} loading={!!settleLoading[row.id]} />
                          ))
                        )}
                      </tbody>
                    </table>
                  </TableWrapper>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════ CHAUFFEURS ════════════ */}
        {activeTab === "drivers" && (
          <div className="space-y-8">
            {loadingUsers ? <Spinner /> : (
              <>
                <div>
                  <SectionHeader
                    icon={AlertCircle}
                    iconClass="text-amber-400"
                    bgClass="bg-amber-500/15"
                    title="En attente de validation"
                    subtitle={`${pendingDrivers.length} dossier(s) à examiner`}
                  />
                  <TableWrapper>
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60">
                          {["Chauffeur", "Email", "Téléphone", "CIN", "Inscrit", "Actions"].map((h) => (
                            <th key={h} className={TH_CLS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDrivers.length === 0 ? (
                          <tr><td colSpan={6}><Empty text="Aucun dossier en attente ✓" /></td></tr>
                        ) : (
                          pendingDrivers.map((u) => {
                            const approveKey = `${u.driverProfile?.id}-APPROVE`;
                            const rejectKey = `${u.driverProfile?.id}-REJECT`;
                            return (
                              <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 font-semibold text-white text-sm">{u.name ?? "—"}</td>
                                <td className="px-4 py-3 text-slate-400 text-sm">{u.email ?? "—"}</td>
                                <td className="px-4 py-3 text-slate-400 text-sm">{u.phoneNumber ?? "—"}</td>
                                <td className="px-4 py-3 text-slate-400 text-sm font-mono">{u.driverProfile?.cinNumber ?? "—"}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs">{timeAgo(u.createdAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => u.driverProfile?.id && handleVerify(u.driverProfile.id, "APPROVE")}
                                      disabled={!!verifyLoading[approveKey]}
                                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40 transition-all"
                                    >
                                      {verifyLoading[approveKey] ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                                      Approuver
                                    </button>
                                    <button
                                      onClick={() => u.driverProfile?.id && handleVerify(u.driverProfile.id, "REJECT")}
                                      disabled={!!verifyLoading[rejectKey]}
                                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all"
                                    >
                                      {verifyLoading[rejectKey] ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldX className="w-3 h-3" />}
                                      Rejeter
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </TableWrapper>
                </div>

                <div>
                  <SectionHeader
                    icon={Truck}
                    iconClass="text-emerald-400"
                    bgClass="bg-emerald-500/15"
                    title="Chauffeurs vérifiés"
                    subtitle={`${verifiedDrivers.length} chauffeur(s) actif(s)`}
                  />
                  <TableWrapper>
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60">
                          {["Chauffeur", "Email", "Voyages", "Note", "Statut"].map((h) => (
                            <th key={h} className={TH_CLS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {verifiedDrivers.length === 0 ? (
                          <tr><td colSpan={5}><Empty /></td></tr>
                        ) : (
                          verifiedDrivers.map((u) => (
                            <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3 font-semibold text-white text-sm">{u.name ?? "—"}</td>
                              <td className="px-4 py-3 text-slate-400 text-sm">{u.email ?? "—"}</td>
                              <td className="px-4 py-3 text-slate-300 text-sm">{u.driverProfile?.totalTrips ?? 0}</td>
                              <td className="px-4 py-3 text-slate-300 text-sm">{u.driverProfile?.rating?.toFixed(1) ?? "—"} ★</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3 h-3" /> Vérifié
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </TableWrapper>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════ CLIENTS ════════════ */}
        {activeTab === "clients" && (
          <div className="space-y-4">
            <SectionHeader
              icon={Users}
              iconClass="text-orange-400"
              bgClass="bg-orange-500/15"
              title="Tous les clients"
              subtitle={`${clients.length} client(s) inscrit(s)`}
            />
            {loadingUsers ? <Spinner /> : (
              <TableWrapper>
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60">
                      {["Nom", "Email", "Téléphone", "Réservations", "Inscrit"].map((h) => (
                        <th key={h} className={TH_CLS}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr><td colSpan={5}><Empty /></td></tr>
                    ) : (
                      clients.map((u) => (
                        <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-white text-sm">{u.name ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{u.email ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{u.phoneNumber ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-orange-400">{u._count?.bookings ?? 0}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{timeAgo(u.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </TableWrapper>
            )}
          </div>
        )}

        {/* ════════════ RÉSERVATIONS ════════════ */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <SectionHeader
              icon={FileText}
              iconClass="text-slate-300"
              bgClass="bg-slate-700"
              title="Toutes les réservations"
              subtitle={`${allPayments.length} transaction(s)`}
            />
            {loadingFinance ? <Spinner /> : (
              <TableWrapper>
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60">
                      {["Chauffeur", "Client", "Trajet", "Montant", "Commission", "Mode", "Statut paiement", "Règlement", "Date"].map((h) => (
                        <th key={h} className={TH_CLS}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPayments.length === 0 ? (
                      <tr><td colSpan={9}><Empty /></td></tr>
                    ) : (
                      allPayments.map((row) => (
                        <tr key={row.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-white text-sm font-semibold">{row.booking.trip.driver.user.name ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{row.booking.client.name ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-300 text-sm">{row.booking.trip.departureCity} → {row.booking.trip.arrivalCity}</td>
                          <td className="px-4 py-3 text-white text-sm font-mono">{fmt(row.amount)} TND</td>
                          <td className="px-4 py-3 text-amber-400 text-sm font-mono">{fmt(row.adminCommission)} TND</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                              row.paymentMethod === "CASH"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                                : "bg-orange-500/15 text-orange-400 border-orange-500/20"
                            }`}>
                              {row.paymentMethod === "CASH" ? "💵 Cash" : "💳 En ligne"}
                            </span>
                          </td>
                          <td className="px-4 py-3"><StatusPill status={row.status} /></td>
                          <td className="px-4 py-3"><StatusPill status={row.settlementStatus} /></td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{timeAgo(row.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </TableWrapper>
            )}
          </div>
        )}

        {/* ════════════ PARAMÈTRES ════════════ */}
        {activeTab === "settings" && (
          <div className="max-w-xl space-y-6">
            <SectionHeader
              icon={UserCog}
              iconClass="text-slate-300"
              bgClass="bg-slate-700"
              title="Paramètres Plateforme"
              subtitle="Configuration globale de TruckGo"
            />

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Taux de commission (%)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    min="0" max="100" step="0.5"
                    value={commissionInput}
                    onChange={(e) => setCommissionInput(e.target.value)}
                    className="flex-1 h-12 bg-slate-950 border border-slate-700 rounded-xl px-4 text-white text-lg font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <span className="text-slate-400 font-bold text-xl">%</span>
                </div>
                <p className="text-xs text-slate-600">S'applique sur tous les nouveaux voyages réservés.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Statut de la plateforme</label>
                <div className="flex gap-3">
                  {(["operational", "maintenance"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlatformStatus(s)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        platformStatus === s
                          ? s === "operational"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                            : "bg-red-500/15 border-red-500/40 text-red-400"
                          : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      {s === "operational" ? "✓ Opérationnel" : "⚠ Maintenance"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full h-12 bg-orange-500 hover:bg-orange-400 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Sauvegarder les paramètres
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
