# TruckLink TN

Plateforme de réservation de camions semi-remorques pour le transport de marchandises longue distance en Tunisie.

## Tech Stack
- **Frontend** : Next.js 14 (App Router), TailwindCSS, shadcn/ui
- **Backend / DB** : API Routes Next.js, Prisma ORM, PostgreSQL
- **Auth** : NextAuth.js
- **API Externes** : Google Maps, ClickToPay.tn, Vidange.tn, OpenAI Vision API

## Prérequis
- Node.js >= 18
- PostgreSQL local ou distant

## Installation & Démarrage

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configuration**
   Copiez `.env.example` vers `.env` et ajustez `DATABASE_URL` et `NEXTAUTH_SECRET`.
   ```bash
   cp .env.example .env
   ```

3. **Base de données**
   Générez le client Prisma et synchronisez la base de données.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

La plateforme sera accessible sur `http://localhost:3000`.

## Déploiement
- **Frontend / API** : Déploiement optimal sur Vercel : connectez votre dépôt GitHub.
- **Base de données** : Supabase, Railway ou Render recommandés pour PostgreSQL.

## Structure Clé
- `src/app/` : Pages (Home, Auth, Search, Driver, Admin, Tracking, Checkout).
- `src/components/` : Composants UI réutilisables.
- `src/lib/integrations.ts` : Centralise la logique des APIs Tiers (Vision, Maps, Paiement).
- `prisma/schema.prisma` : Architecture DB.
