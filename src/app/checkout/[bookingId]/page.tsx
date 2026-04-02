"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock } from "lucide-react";

export default function CheckoutPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate redirection to ClickToPay.tn
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Instead of real redirect, we simulate a successful callback
    router.push(`/tracking/${params.bookingId}?payment_status=success`);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-16rem)] flex-1">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Récapitulatif de la commande</h2>
            <p className="text-muted-foreground">Vérifiez les détails de votre réservation avant de valider.</p>
          </div>
          
          <Card className="bg-muted/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <span className="text-muted-foreground">Trajet</span>
                <span className="font-semibold text-right">Tunis → Sfax</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-muted-foreground">Marchandise</span>
                <span className="font-semibold text-right">Matériaux de construction (12 Tonnes)</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-muted-foreground">Chauffeur assigné</span>
                <span className="font-semibold text-right">Sami C.</span>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <span className="text-muted-foreground">Frais de service (5%)</span>
                <span className="font-semibold text-right">22.5 TND</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold">Total à payer</span>
                <span className="text-3xl font-bold text-primary">472.5 TND</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Zone */}
        <div>
          <Card className="h-full flex flex-col justify-between border-2 border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="text-center pb-8 border-b bg-muted/5">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Paiement Sécurisé</CardTitle>
              <CardDescription>
                Vous allez être redirigé vers la passerelle officielle de la Poste Tunisienne.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12 flex flex-col items-center justify-center gap-6">
              <div className="text-3xl font-bold text-foreground tracking-tighter shadow-sm p-4 bg-background border rounded-xl">
                ClickToPay<span className="text-primary">.tn</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mt-4">
                <Lock className="h-5 w-5 text-green-500" />
                <span>Transaction chiffrée de bout en bout</span>
                <span className="text-xs text-balance text-center">Les informations de votre carte ne sont jamais stockées sur nos serveurs.</span>
              </div>
            </CardContent>
            <CardFooter className="pt-6 border-t bg-muted/5">
              <Button size="lg" className="w-full text-lg h-14" onClick={handlePayment} disabled={loading}>
                {loading ? "Connexion sécurisée en cours..." : "Payer 472.5 TND"}
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
