"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import { Truck, User, LogOut, LayoutDashboard, UserCircle, TruckIcon, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/presentation/components/ui/dropdown-menu";

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "DRIVER") return "/driver/dashboard";
  return "/client/dashboard";
}

export function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href={role === "DRIVER" ? "/driver/dashboard" : role === "ADMIN" ? "/admin" : "/"}
          className="flex items-center gap-2 group transition-all"
        >
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Truck<span className="text-primary">Go</span></span>
        </Link>

        {role !== "DRIVER" && role !== "ADMIN" && (
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Accueil</Link>
            <Link href="/search" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Chercher un camion</Link>
            <Link href="/driver/register" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Devenir chauffeur</Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {loading ? (
             <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700">
                    <User className="h-5 w-5 text-slate-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-100" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                      {role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Administrateur
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem asChild className="focus:bg-slate-800 cursor-pointer">
                    <Link href={getDashboardHref(role)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </Link>
                  </DropdownMenuItem>
                  {role === "CLIENT" && (
                    <>
                      <DropdownMenuItem asChild className="focus:bg-slate-800 cursor-pointer">
                        <Link href="/client/profile">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Mes informations</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-slate-800 cursor-pointer">
                        <Link href="/driver/register">
                          <TruckIcon className="mr-2 h-4 w-4 text-orange-400" />
                          <span className="text-orange-400">Devenir chauffeur</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    className="focus:bg-red-900/20 text-red-500 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "text-slate-300 font-bold" })}>
                Connexion
              </Link>
              <Link href="/auth/register" className={buttonVariants({ className: "bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl" })}>
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

