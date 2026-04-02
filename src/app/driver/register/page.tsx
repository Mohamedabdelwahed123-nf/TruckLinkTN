"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, UploadCloud, Truck, FileText, UserCircle } from "lucide-react";

export default function DriverRegistrationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Info perso
  const [phone, setPhone] = useState("");
  const [cin, setCin] = useState("");

  // Step 4: Camion Info
  const [vin, setVin] = useState("");
  const [truckDetails, setTruckDetails] = useState<any>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const simulateVisionAPI = async () => {
    setLoading(true);
    // Simulate AI Vision API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLoading(false);
    nextStep();
  };

  const fetchVidangeAPI = async () => {
    setLoading(true);
    // Simulate Vidange.tn API fetch using VIN
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTruckDetails({
      brand: "Mercedes-Benz",
      model: "Actros",
      year: 2018,
      payloadMax: 30, // Tonnes
      truckType: "Tracteur routier"
    });
    setLoading(false);
  };

  const finishRegistration = async () => {
    setLoading(true);
    // Submit final payload to API
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push("/admin");
  };

  if (session?.user?.role !== "DRIVER" && process.env.NODE_ENV === "production" && session?.user?.role !== "ADMIN") {
    // In actual app, we would bounce them to login
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl flex-1 flex flex-col justify-center">
      <div className="mb-8 flex justify-between items-center relative z-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[
          { num: 1, icon: UserCircle, label: "Infos" },
          { num: 2, icon: UploadCloud, label: "Documents" },
          { num: 3, icon: FileText, label: "Vérification" },
          { num: 4, icon: Truck, label: "Véhicule" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${step >= s.num ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-background bg-muted text-muted-foreground"}`}>
              {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : <s.icon className="h-5 w-5" />}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="border-2">
        <CardHeader className="bg-muted/30 border-b mb-6">
          {step === 1 && (
            <>
              <CardTitle className="text-2xl">Informations Personnelles</CardTitle>
              <CardDescription>Complétez votre profil de chauffeur certifié.</CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="text-2xl">Documents Légaux</CardTitle>
              <CardDescription>Téléchargez vos justificatifs pour analyse.</CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="text-2xl">Vérification IA</CardTitle>
              <CardDescription>Notre IA OpenAI analyse vos documents en cours...</CardDescription>
            </>
          )}
          {step === 4 && (
            <>
              <CardTitle className="text-2xl">Informations du Véhicule</CardTitle>
              <CardDescription>Extraites depuis Vidange.tn via immatriculation.</CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Numéro de Téléphone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+216 2X XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Numéro de CIN</Label>
                  <Input value={cin} onChange={e => setCin(e.target.value)} placeholder="01234567" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold">CIN / Identité</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Recto / Verso</p>
                </div>
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold">Permis de conduire</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Catégorie C/CE (Poids Lourd)</p>
                </div>
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold">Carte Grise</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">Véhicule tracteur</p>
                </div>
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <p className="font-semibold">Attestation Assurance</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">En cours de validité</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
              {loading ? (
                <>
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">Extraction en cours...</h3>
                  <p className="text-muted-foreground max-w-md">Nous utilisons l'API Vision pour lire les informations de vos documents scannés.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Documents validés temporairement</h3>
                  <p className="text-muted-foreground max-w-md mb-6">Les données ont été extraites avec succès. Validation finale par un administrateur en attente.</p>
                  <div className="bg-card w-full border p-4 rounded-xl text-left text-sm font-mono text-muted-foreground shadow-sm">
                    <div className="text-green-500 mb-2">✔ Extraction réussie</div>
                    <div className="pl-4 border-l-2 border-primary/30 space-y-1">
                      <p>› CIN détectée: <span className="text-foreground">01234567 [Score: 99%]</span></p>
                      <p>› Concordance Nom: <span className="text-foreground">OK [Score: 95%]</span></p>
                      <p>› Validité Permis: <span className="text-foreground">Conforme (Expiration &gt; 6 mois)</span></p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2">
                <Label>Numéro de série (VIN) / Immatriculation</Label>
                <div className="flex gap-4">
                  <Input value={vin} onChange={e => setVin(e.target.value)} placeholder="Ex: WDBXXXXXX..." className="font-mono uppercase" />
                  <Button onClick={fetchVidangeAPI} disabled={!vin || loading} variant="default" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Recherche..." : "Vérifier Vidange.tn"}
                  </Button>
                </div>
              </div>

              {truckDetails && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg">Informations importées</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="border-b border-border/50 pb-2">
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Marque</span>
                      <p className="font-bold text-base">{truckDetails.brand}</p>
                    </div>
                    <div className="border-b border-border/50 pb-2">
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Modèle & Année</span>
                      <p className="font-bold text-base">{truckDetails.model} ({truckDetails.year})</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Type</span>
                      <p className="font-bold text-base">{truckDetails.truckType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block mb-1">Charge Max</span>
                      <p className="font-bold text-base">{truckDetails.payloadMax} Tonnes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6 bg-muted/10 rounded-b-xl">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} disabled={loading} className="w-24">Retour</Button>
          ) : <div></div>}
          
          {step < 4 ? (
            <Button onClick={step === 2 ? simulateVisionAPI : nextStep} disabled={loading} className="w-40">
              {step === 2 ? "Analyser via IA" : "Continuer"}
            </Button>
          ) : (
            <Button onClick={finishRegistration} disabled={!truckDetails || loading} className="w-56">
              Soumettre le dossier
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
