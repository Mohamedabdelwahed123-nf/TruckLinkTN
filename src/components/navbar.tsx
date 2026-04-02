"use client";

import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Truck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">TruckLink<span className="text-primary">TN</span></span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Accueil</Link>
          <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">Chercher un camion</Link>
          <Link href="/driver/register" className="text-sm font-medium hover:text-primary transition-colors">Devenir chauffeur</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>
            Connexion
          </Link>
          <Link href="/auth/register" className={buttonVariants()}>
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
