"use client";

import Link from 'next/link';
import { Search, Truck, MapPin, ShieldCheck, Star } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 md:py-32 lg:py-40 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
          Le fret routier simplifié en <span className="text-primary">Tunisie</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
          Trouvez en quelques clics des milliers de chauffeurs semi-remorques certifiés pour vos expéditions longue distance. Suivi en temps réel et paiement sécurisé.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/search" className={buttonVariants({ size: "lg", className: "gap-2" })}>
            <Search className="h-5 w-5" />
            Chercher un camion
          </Link>
          <Link href="/driver/register" className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}>
            <Truck className="h-5 w-5" />
            Devenir chauffeur
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">500+</h3>
              <p className="text-sm font-medium text-muted-foreground">Chauffeurs vérifiés</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">24</h3>
              <p className="text-sm font-medium text-muted-foreground">Gouvernorats couverts</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">12k+</h3>
              <p className="text-sm font-medium text-muted-foreground">Livraisons effectuées</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">4.8/5</h3>
              <p className="text-sm font-medium text-muted-foreground">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Réserver un camion n'a jamais été aussi simple et sécurisé.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-border -z-10"></div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-background border-4 border-border text-primary flex items-center justify-center relative shadow-sm">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mt-4">1. Rechercher</h3>
              <p className="text-muted-foreground">Indiquez la ville de départ, la destination et le type de marchandise à transporter.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-background border-4 border-border text-primary flex items-center justify-center relative shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mt-4">2. Réserver</h3>
              <p className="text-muted-foreground">Validez votre réservation et payez en toute sécurité via ClickToPay.tn.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-background border-4 border-border text-primary flex items-center justify-center relative shadow-sm">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mt-4">3. Suivre</h3>
              <p className="text-muted-foreground">Suivez votre marchandise en temps réel sur la carte jusqu'à l'arrivée.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types de camions */}
      <section className="py-24 px-4 border-t bg-muted/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">La flotte de notre réseau</h2>
              <p className="text-muted-foreground max-w-lg">Nous disposons de plusieurs types de camions pour répondre à tout type de besoins de transport.</p>
            </div>
            <Link href="/search" className={buttonVariants({ variant: "outline", className: "mt-6 md:mt-0" })}>
              Voir les camions disponibles
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Frigorifique', 'Bâché', 'Plateau', 'Citerne'].map((type) => (
              <div key={type} className="group relative overflow-hidden rounded-2xl border bg-card hover:border-primary/50 transition-colors">
                <div className="aspect-video bg-muted/50 p-6 flex flex-col items-center justify-center">
                   <Truck className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                </div>
                <div className="p-4 border-t">
                  <h4 className="font-semibold text-lg">{type}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Spécialisé pour vos marchandises spécifiques.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-background border-t">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Témoignages clients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-2xl border flex flex-col space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-card-foreground italic flex-1 text-sm">
                "Une plateforme incroyable. J'ai pu trouver un camion frigorifique de Sfax à Tunis en moins de 10 minutes. Le suivi GPS est très rassurant."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Mohamed A.</h4>
                  <p className="text-xs text-muted-foreground">Industrie agroalimentaire</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border flex flex-col space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-card-foreground italic flex-1 text-sm">
                "En tant que chauffeur, ça m'a permis d'éviter les retours à vide. Je charge à l'aller comme au retour. Paiement toujours ponctuel."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  K
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Khaled S.</h4>
                  <p className="text-xs text-muted-foreground">Chauffeur indépendant</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border flex flex-col space-y-4">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-card-foreground italic flex-1 text-sm">
                "Le paiement sécurisé m'a rassuré au début, et maintenant je fais toutes mes expéditions via TruckLink TN."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  S
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Sarra M.</h4>
                  <p className="text-xs text-muted-foreground">Gérante d'entreprise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
