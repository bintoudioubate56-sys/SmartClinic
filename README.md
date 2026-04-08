# SmartClinic — L'excellence médicale en Guinée 🇬🇳

SmartClinic est une plateforme de gestion clinique Next.js 14 conçue pour digitaliser et sécuriser le parcours de soin en Guinée. Elle allie **performance médicale**, **résilience technologique** (offline-first) et **traçabilité totale** (logs d'audit).

---

## 🌟 Points Forts

- **📱 Offline-First & Sync** : Continuez les consultations même sans connexion Internet. Synchronisation automatique dès le retour du Wi-Fi ou de la 4G.
- **🚨 Accès d'Urgence QR** : Un simple scan permet aux secours d'accéder aux données vitales (sang, allergies) sans authentification.
- **🔐 Audit Centralisé** : Chaque accès à un dossier médical est tracé (IP, Utilisateur, Horodatage) pour une conformité clinique totale.
- **📅 Rappels SMS** : Réduction des RDV manqués via des notifications automatisées Africa's Talking.
- **🎨 Design "Medical Modernism"** : Une interface ultra-fluide (Tailwind v4, Framer Motion) optimisée pour la concentration des praticiens.

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (+ Server Actions)
- **Base de données** : Supabase (PostgreSQL)
- **Gestion Hors-ligne** : Dexie.js (IndexedDB)
- **Authentification** : Supabase Auth (RBAC : Doctor, Admin, Reception, Patient)

## 🚀 Installation Rapide

1.  **Cloner le projet** :
    ```bash
    git clone https://github.com/votre-repo/smart-clinic.git
    cd smart-clinic
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement** :
    Créez un fichier `.env.local` en vous basant sur `.env.local.example`.

4.  **Lancer le serveur** :
    ```bash
    npm run dev
    ```

## 📖 Documentation Détaillée

Pour un plongeon profond dans l'architecture, les schémas de base de données et les flux de synchronisation, consultez le dossier technique :
👉 **[TECHNICAL_SPECIFICATIONS.md](./TECHNICAL_SPECIFICATIONS.md)**

---

*SmartClinic — Révolutionner la santé, un patient à la fois.*
