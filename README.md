# 🏥 SmartClinic — Système de Gestion Clinique Moderne

SmartClinic est une plateforme SaaS de pointe conçue pour moderniser la gestion des cliniques et le suivi des patients en Guinée. Alliant une interface utilisateur **Ultra-Premium** (Glassmorphism) et une infrastructure robuste, elle offre une expérience fluide tant pour le personnel médical que pour les patients.

## ✨ Caractéristiques Principales

- **💎 Design Ultra-Premium** : Interface moderne, réactive et élégante utilisant le Glassmorphism et des animations fluides.
- **🔐 Authentification Multi-Rôles** : Accès sécurisé basé sur 5 rôles distincts (SuperAdmin, Admin, Médecin, Réception, Patient).
- **📋 Gestion des Patients** : Fiche patient complète avec historique médical, ordonnances et rendez-vous.
- **🆔 Cartes Patient PVC & QR Code** : Génération automatique de QR Codes et export de cartes PVC pour un accès rapide aux informations vitales.
- **📅 Gestion des Rendez-vous** : Calendrier interactif pour le personnel et prise de rendez-vous en ligne pour les patients.
- **📂 Dossier Médical Numérique** : Stockage sécurisé des documents (PDF, images) et suivi chronologique des soins.
- **🛡️ Sécurité & Audit** : Journal d'audit complet de toutes les actions sensibles et politiques Row Level Security (RLS) sur Supabase.

## 🛠️ Stack Technique

- **Frontend** : [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Backend/Base de données** : [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions)
- **Gestion d'état** : [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Validation** : [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Utilitaires** : `date-fns`, `clsx`, `tailwind-merge`

## 📁 Structure du Projet

```text
/app
  ├── (auth)          # Pages d'authentification (Login, Register, Reset)
  ├── dashboard       # Espaces par rôles (/superadmin, /admin, /doctor, etc.)
  ├── api             # Routes API (Export, Webhooks)
  └── qr              # Accès d'urgence via QR Code
/components           # Composants UI réutilisables et atomiques
/lib                  # Clients Supabase, utilitaires, hooks
/supabase             # Migrations SQL, RLS policies, Edge Functions
/types                # Définitions TypeScript
/public               # Assets statiques
```

## 🚀 Installation & Démarrage

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/bintoudioubate56-sys/SmartClinic.git
   cd SmartClinic
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration de l'environnement** :
   Copiez `.env.example` en `.env.local` et renseignez vos clés Supabase.
   ```bash
   cp .env.example .env.local
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 📄 Licence

Propriété de **Bintou Dioubate**. Tous droits réservés.

