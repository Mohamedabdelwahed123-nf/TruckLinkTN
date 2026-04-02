/**
 * TruckLink TN - API Integrations Logic
 * Ce fichier centralise la logique d'appel aux APIs tierces requises.
 */

// 1. OpenAI Vision API (GPT-4o) pour la validation des documents
export async function analyzeDocumentWithVision(base64Image: string) {
  /*
  const payload = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extrait le nom complet, le numéro de CIN et la date d'expiration de ce document légal Tunisien. Renvoie au format JSON strict." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ]
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  const extract = JSON.parse(data.choices[0].message.content);
  return extract; // { nom: "Sami", cin: "01234567", expire: "2028" }
  */
  console.log("Simulation Vision API sur document...");
  return { nom: "Sami", cin: "01234567", isValid: true };
}

// 2. Vidange.tn API pour les caractéristiques du camion via CIN/Gris Moteur (N° Série)
export async function fetchTruckDataFromVidange(vin: string) {
  /*
  const res = await fetch(`https://api.vidange.tn/v1/vehicles/${vin}`, {
    headers: { "Authorization": `Bearer ${process.env.VIDANGE_API_KEY}` }
  });
  
  if (!res.ok) throw new Error("Véhicule introuvable");
  return await res.json(); 
  // { brand: "Mercedes", model: "Actros", payloadMax: 30 }
  */
  console.log(`Simulation Vidange.tn API pour le VIN: ${vin}`);
  return { brand: "Mercedes-Benz", model: "Actros", year: 2018, payloadMax: 30, truckType: "Tracteur routier" };
}

// 3. ClickToPay.tn Integration pour le paiement sécurisé
export async function createClickToPaySession(amountTND: number, orderId: string) {
  /*
  // ClickToPay utilise l'API REST de la SMPT (Monétique Tunisie).
  // Le montant est typiquement en millimes (TND * 1000).
  const amountMillimes = Math.round(amountTND * 1000);

  const res = await fetch("https://api.clicktopay.tn/gateway/api/v1/checkout", {
    method: "POST",
    headers: { 
      "Authorization": `Basic ${Buffer.from(process.env.CLICKTOPAY_MERCHANT_ID + ":" + process.env.CLICKTOPAY_SECRET).toString('base64')}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      amount: amountMillimes, 
      currency: "788", // Code devise ISO pour TND
      orderNumber: orderId, 
      returnUrl: `${process.env.NEXTAUTH_URL}/checkout/callback` 
    })
  });
  
  const data = await res.json();
  return data.formUrl; // URL vers laquelle rediriger le client.
  */
  console.log(`Simulation création session ClickToPay pour ${amountTND} TND`);
  return `/tracking/${orderId}?payment_status=success`;
}

// 4. Google Maps Directions API pour l'ETA et le Tracking
export async function getDirectionsETA(origin: string, destination: string) {
  /*
  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.append("origin", origin);
  url.searchParams.append("destination", destination);
  url.searchParams.append("key", process.env.GOOGLE_MAPS_API_KEY!);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status === "OK") {
    const route = data.routes[0].legs[0];
    return {
      distance: route.distance.text,
      duration: route.duration.text,
      durationSeconds: route.duration.value,
      polyline: data.routes[0].overview_polyline.points
    };
  }
  throw new Error("Impossible de calculer l'itinéraire.");
  */
  console.log(`Simulation Google Directions de ${origin} à ${destination}`);
  return { distance: "270 km", duration: "3 heures 15 mins", durationSeconds: 11700 };
}
