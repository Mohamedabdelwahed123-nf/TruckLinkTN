import Link from "next/link";
import { Truck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 pb-8 pt-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TruckLink<span className="text-primary">TN</span></span>
            </Link>
            <p className="text-sm text-muted-foreground w-11/12">
              La plateforme de réservation de camions semi-remorques en Tunisie pour le transport longue distance.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-primary transition-colors">Chercher un camion</Link></li>
              <li><Link href="/driver/register" className="hover:text-primary transition-colors">Devenir chauffeur</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">Se connecter</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions générales</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contact@trucklink.tn</li>
              <li>+216 71 000 000</li>
              <li>Tunis, Tunisie</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TruckLink TN. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
