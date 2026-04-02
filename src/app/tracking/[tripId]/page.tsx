"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrackingPage({ params }: { params: { tripId: string } }) {
  const [eta, setEta] = useState(120);

  useEffect(() => {
    // Simulate real-time ETA updates
    const interval = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const formatEta = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)]">
      {/* Map View (Mocked) */}
      <div className="flex-1 relative bg-muted/30 overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="text-center p-6 bg-background/80 backdrop-blur rounded-xl border border-primary/20 shadow-lg max-w-sm">
            <Navigation className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-bold mb-2">Carte Live Google Maps</h2>
            <p className="text-muted-foreground text-sm">
              L'intégration de l'API Google Maps avec les WebSockets affichera le camion se déplaçant en temps réel ici.
            </p>
          </div>
        </div>
        
        {/* Overlay Info Card */}
        <div className="absolute top-4 left-4 z-10 w-full max-w-sm">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 bg-green-500/10 text-green-500 border-green-500/20">En transit</Badge>
                  <CardTitle className="text-lg">Voyage #{params.tripId}</CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground block">ETA estimé</span>
                  <span className="text-2xl font-bold text-primary">{formatEta(eta)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Sami C. (Volvo FH16)</p>
                  <p className="text-xs text-muted-foreground">Immatriculation: 234 TUN 1234</p>
                </div>
              </div>
              
              <div className="pl-2 space-y-4 relative border-l-2 border-muted ml-3 mt-4">
                <div className="flex gap-4 items-start relative -left-[11px]">
                  <div className="bg-background border-2 border-primary w-5 h-5 rounded-full mt-0.5"></div>
                  <div>
                    <h5 className="font-semibold text-sm">Départ: Tunis</h5>
                    <p className="text-xs text-muted-foreground">Aujourd'hui, 08:30</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start relative -left-[11px]">
                  <div className="bg-background border-2 border-muted-foreground w-5 h-5 rounded-full mt-0.5"></div>
                  <div>
                    <h5 className="font-semibold text-sm">Arrivée: Sfax</h5>
                    <p className="text-xs text-muted-foreground">Prévu vers 14:00</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4 flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Appeler
                </Button>
                <Button className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10">
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
