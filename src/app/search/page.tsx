import { Search, Filter, MapPin, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters & Search */}
      <aside className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Search className="h-5 w-5" />
                Rechercher
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="departure">Ville de départ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="departure" placeholder="Ex: Tunis" className="pl-9" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival">Ville d'arrivée</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="arrival" placeholder="Ex: Sfax" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date souhaitée</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="date" type="date" className="pl-9" />
                </div>
              </div>

              <Button className="w-full">Rechercher</Button>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </h3>
              
              <div className="space-y-2">
                <Label>Type de marchandise</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Générale</SelectItem>
                    <SelectItem value="refrigerated">Frigorifique</SelectItem>
                    <SelectItem value="dangerous">Matières dangereuses</SelectItem>
                    <SelectItem value="bulk">Vrac</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type de camion</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bache">Bâché</SelectItem>
                    <SelectItem value="frigorifique">Frigorifique</SelectItem>
                    <SelectItem value="plateau">Plateau</SelectItem>
                    <SelectItem value="citerne">Citerne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Results */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Camions disponibles</h1>
          <p className="text-muted-foreground text-sm">3 résultats trouvés</p>
        </div>

        {/* Truck Card Mock */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-muted/20 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-primary">SC</span>
                    </div>
                    <p className="font-semibold">Sami C.</p>
                    <p className="text-xs text-muted-foreground">⭐ 4.8 (120 avis)</p>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-xl font-bold">Camion Bâché - 30 Tonnes</h3>
                        <p className="text-muted-foreground text-sm">Mercedes-Benz Actros (2019)</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-bold text-primary">~450 TND</p>
                        <p className="text-xs text-muted-foreground">Tarif estimé total</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                      <div className="flex gap-2 items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span><strong>Départ:</strong> Tunis (Dispo: Aujourd'hui)</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span><strong>Destination prévue:</strong> Sfax</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>Capacité dispo: 15 Tonnes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline">Voir profil</Button>
                    <Button>Réserver cette capacité</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
