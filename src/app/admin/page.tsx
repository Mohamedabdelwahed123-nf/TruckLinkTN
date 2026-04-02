"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Route, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  // Protect admin route theoretically
  if (session?.user?.role !== "ADMIN" && process.env.NODE_ENV === "production") {
    // Usually redirect, but we return a generic forbidden element for safety
    return <div className="p-8 text-center text-destructive font-bold text-xl">Accès Refusé. Role ADMIN requis.</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 container mx-auto bg-muted/10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espace Administrateur</h1>
          <p className="text-muted-foreground mt-2">Vue globale et gestion de la plateforme TruckLink TN.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full max-w-4xl bg-background border h-auto overflow-x-auto justify-start mb-6 rounded-lg p-1">
          <TabsTrigger value="overview" className="whitespace-nowrap rounded-md">Vue Globale</TabsTrigger>
          <TabsTrigger value="drivers" className="whitespace-nowrap rounded-md relative">
            Chauffeurs
            <div className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </TabsTrigger>
          <TabsTrigger value="trips" className="whitespace-nowrap rounded-md">Voyages</TabsTrigger>
          <TabsTrigger value="clients" className="whitespace-nowrap rounded-md">Clients</TabsTrigger>
          <TabsTrigger value="litiges" className="whitespace-nowrap rounded-md">Litiges</TabsTrigger>
          <TabsTrigger value="settings" className="whitespace-nowrap rounded-md">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0 animate-in fade-in zoom-in-95">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <span className="text-muted-foreground text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">TND</span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">45,231.89</div>
                <p className="text-xs text-muted-foreground mt-1">+20.1% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Voyages Actifs</CardTitle>
                <div className="p-2 bg-primary/10 rounded-md">
                  <Route className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">573</div>
                <p className="text-xs text-muted-foreground mt-1">+201 depuis hier</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux Inscrits</CardTitle>
                <div className="p-2 bg-primary/10 rounded-md">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground mt-1">+19% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-destructive/20 bg-destructive/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Litiges Ouverts</CardTitle>
                <div className="p-2 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">12</div>
                <p className="text-xs text-destructive/80 mt-1">-4 par rapport la semaine dernière</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6 mt-0 animate-in fade-in slide-in-from-right-4">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle>Validation des Chauffeurs</CardTitle>
              <CardDescription>
                Examinez les documents extraits par l'IA et approuvez les comptes en attente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                {/* Table Mock */}
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-5 bg-muted/40 p-4 text-sm font-semibold border-b text-muted-foreground">
                    <div>Nom & Prénom</div>
                    <div>Statut Documents</div>
                    <div>Type Véhicule</div>
                    <div>Score IA</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="grid grid-cols-5 p-4 text-sm items-center border-b hover:bg-muted/20 transition-colors">
                    <div className="font-semibold text-foreground">Sami C.</div>
                    <div><Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">En attente (Vision IA OK)</Badge></div>
                    <div className="text-muted-foreground">Mercedes Actros / Plateau 20T</div>
                    <div className="font-mono bg-green-500/10 text-green-500 px-2 py-1 rounded inline-block text-xs font-bold">98% Match</div>
                    <div className="text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-green-500 border-green-500 hover:bg-green-500/10"><CheckCircle2 className="h-4 w-4 mr-1" /> Valider</Button>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10"><XCircle className="h-4 w-4 mr-1" /> Rejeter</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 p-4 text-sm items-center hover:bg-muted/20 transition-colors">
                    <div className="font-semibold text-foreground">Ahmed B.</div>
                    <div><Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Validé</Badge></div>
                    <div className="text-muted-foreground">Volvo FH16 / Frigorifique 15T</div>
                    <div className="font-mono bg-green-500/10 text-green-500 px-2 py-1 rounded inline-block text-xs font-bold">95% Match</div>
                    <div className="text-right flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="border">Détails</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 p-4 text-sm items-center border-t bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <div className="font-semibold text-foreground">Tarak K.</div>
                    <div><Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Rejété (Permis Invalide)</Badge></div>
                    <div className="text-muted-foreground">Inconnu / Bâché</div>
                    <div className="font-mono bg-destructive/10 text-destructive px-2 py-1 rounded inline-block text-xs font-bold">45% Match</div>
                    <div className="text-right flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="border">Détails</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0 animate-in fade-in zoom-in-95">
          <Card className="shadow-sm max-w-xl">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle>Paramètres Plateforme</CardTitle>
              <CardDescription>Ajustez les commissions et la configuration globale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Commission par défaut (%)</label>
                <div className="flex gap-4">
                   <div className="flex-[2] px-4 py-2 border rounded-md bg-background text-lg font-mono flex items-center shadow-inner">
                     <span className="flex-1">5.0</span>
                     <span className="text-muted-foreground">%</span>
                   </div>
                   <Button size="lg" className="flex-1">Mettre à jour</Button>
                </div>
                <p className="text-xs text-muted-foreground">S'applique sur tous les nouveaux voyages réservés.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
