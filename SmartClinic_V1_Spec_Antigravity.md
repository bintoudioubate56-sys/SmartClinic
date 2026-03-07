# SmartClinic V1 — Spec de développement pour Google Antigravity

> **Outil cible :** Google Antigravity (IDE agent-first, Gemini 3 Pro)  
> **Stack :** Next.js 14 (App Router) + Supabase  
> **Durée estimée :** 3 mois | Équipe : 2 développeurs  
> **Contexte :** Plateforme de gestion clinique & portail patient — Guinée

---

## 1. Comment utiliser ce spec dans Antigravity

Google Antigravity est un IDE agent-first : tu lui donnes un **objectif de haut niveau**, il planifie, code, teste et itère de façon autonome. Ce spec est structuré pour être utilisé directement comme **prompt de tâche** dans le Manager View d'Antigravity.

### Workflow recommandé

1. **Ouvrir Antigravity** → cloner le repo GitHub `smartclinic`
2. **Manager View** → créer un agent par module (voir section 4)
3. **Coller le prompt de tâche** correspondant à chaque agent
4. **Laisser l'agent planifier** → valider le plan avant exécution
5. **Reviewer les Artifacts** → commenter via l'interface doc-style d'Antigravity
6. **Itérer** jusqu'à validation du critère d'acceptation

### Politique terminal recommandée
- Terminal Auto Execution : **Request review** (sécurité — ne pas laisser l'agent exécuter des migrations Supabase sans validation)
- Review Policy : **Always Proceed** pour le code, **Request review** pour les commandes DB

---

## 2. Setup initial du projet (Prompt Agent 0)

### Prompt à donner à l'agent Antigravity

```
Initialise un projet Next.js 14 (App Router) avec TypeScript et Tailwind CSS.
Configure Supabase comme backend (variables d'env dans .env.local).
Structure de dossiers :
- /app → routes Next.js (App Router)
- /app/dashboard/[role] → espaces par rôle
- /components → composants réutilisables
- /lib → clients Supabase, helpers
- /supabase → migrations SQL, RLS policies
- /types → types TypeScript générés depuis Supabase

Installe les dépendances : @supabase/supabase-js, @supabase/ssr, zod, 
react-hook-form, qrcode, @react-pdf/renderer, zustand, date-fns, 
lucide-react, clsx, tailwind-merge.

Configure le middleware Next.js pour vérifier le JWT Supabase et le rôle 
utilisateur à chaque route protégée. Redirige automatiquement selon le rôle :
- superadmin → /dashboard/superadmin
- admin → /dashboard/admin
- doctor → /dashboard/doctor
- reception → /dashboard/reception
- patient → /dashboard/patient

Critère de succès : `npm run dev` démarre sans erreur, middleware actif.
```

---

## 3. Modèle de données Supabase (Prompt Agent 1)

### Prompt à donner à l'agent Antigravity

```
Crée les migrations SQL Supabase pour les tables suivantes.
Place chaque migration dans /supabase/migrations/ avec un timestamp.

--- TABLE: clinics ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
nom text NOT NULL
adresse text
phone text
specialties text[]
heures_ouverture jsonb
created_at timestamptz DEFAULT now()

--- TABLE: users (extends auth.users via foreign key) ---
id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
nom text NOT NULL
email text UNIQUE NOT NULL
tel text
role text CHECK (role IN ('superadmin','admin','doctor','reception','patient'))
clinique_id uuid REFERENCES clinics(id)
created_at timestamptz DEFAULT now()

--- TABLE: patients ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
nom text NOT NULL
dob date NOT NULL
tel text
email text
patient_number text UNIQUE NOT NULL  -- format: SC-YYYY-XXXXX
qr_code_url text
group_sanguin text
allergies text[]
antecedents_critiques text
clinique_id uuid REFERENCES clinics(id) NOT NULL
created_by uuid REFERENCES users(id)
created_at timestamptz DEFAULT now()

--- TABLE: appointments ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id uuid REFERENCES patients(id) NOT NULL
clinic_id uuid REFERENCES clinics(id) NOT NULL
doctor_id uuid REFERENCES users(id) NOT NULL
datetime timestamptz NOT NULL
status text CHECK (status IN ('pending','confirmed','cancelled','done')) DEFAULT 'pending'
notes text
created_by uuid REFERENCES users(id)
created_at timestamptz DEFAULT now()

--- TABLE: medical_records ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id uuid REFERENCES patients(id) NOT NULL
clinic_id uuid REFERENCES clinics(id) NOT NULL
type text CHECK (type IN ('result','prescription','note','file'))
content_text text
file_path text
created_by uuid REFERENCES users(id) NOT NULL
created_at timestamptz DEFAULT now()

--- TABLE: audit_logs ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id uuid REFERENCES users(id)
action text NOT NULL
target_type text
target_id uuid
ip_address text
timestamp timestamptz DEFAULT now()
meta_json jsonb

--- TABLE: consents ---
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
patient_id uuid REFERENCES patients(id) NOT NULL
clinic_id uuid REFERENCES clinics(id) NOT NULL
granted_at timestamptz DEFAULT now()
revoked_at timestamptz

Critère de succès : migrations exécutées sans erreur dans Supabase Studio.
```

---

## 4. Row Level Security — RBAC (Prompt Agent 2)

### Prompt à donner à l'agent Antigravity

```
Crée les politiques RLS Supabase dans /supabase/rls_policies.sql.
Active RLS sur toutes les tables. Applique les règles suivantes :

PATIENTS :
- superadmin : accès total
- admin/reception/doctor : SELECT/INSERT/UPDATE sur patients de leur clinique uniquement
  (WHERE clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid()))
- patient : SELECT sur son propre dossier uniquement (WHERE id = auth.uid() via lien email)

MEDICAL_RECORDS :
- doctor : SELECT/INSERT sur les records de sa clinique
- patient : SELECT sur ses propres records (lecture seule)
- reception : SELECT uniquement

APPOINTMENTS :
- doctor/reception/admin : SELECT/INSERT/UPDATE/DELETE sur leur clinique
- patient : SELECT/INSERT sur ses propres RDV

AUDIT_LOGS :
- Pas de UPDATE ni DELETE permis pour aucun rôle (append-only)
- superadmin/admin : SELECT sur leur périmètre

CONSENTS :
- patient : INSERT/UPDATE sur ses propres consentements
- doctor/reception : SELECT uniquement (pour vérifier avant accès inter-cliniques)

Critère de succès : test avec rôle 'patient' → accès refusé aux dossiers d'autres patients.
```

---

## 5. Authentification & Gestion des rôles (Prompt Agent 3)

### Prompt à donner à l'agent Antigravity

```
Implémente l'authentification complète avec Supabase Auth dans Next.js 14.

PAGES À CRÉER :
1. /app/(auth)/login/page.tsx
   - Formulaire email + mot de passe (react-hook-form + zod)
   - Gestion erreurs (401, email non confirmé)
   - Après login : lire le rôle depuis la table users → rediriger vers /dashboard/[role]

2. /app/(auth)/register/page.tsx (pour les patients uniquement)
   - Formulaire multi-étapes : infos personnelles → consentement RGPD → confirmation
   - Validation Zod côté client + Server Action côté serveur
   - Après inscription : insérer dans table users avec role='patient'

3. /app/(auth)/reset-password/page.tsx
   - Envoi lien reset via Supabase Auth (expiration 30 min)

MIDDLEWARE (/middleware.ts) :
- Vérifier JWT Supabase à chaque requête sur /dashboard/*
- Lire le rôle depuis user metadata ou table users
- Rediriger si rôle ne correspond pas à la route
- Rediriger vers /login si non authentifié

SERVER ACTION (createUser) :
- Réservée à admin/superadmin pour créer médecins et réceptionnistes
- Utilise supabaseAdmin (service role) côté serveur uniquement

Critère de succès : 
- Patient ne peut pas accéder à /dashboard/doctor → redirection automatique
- JWT expiré → redirection /login
```

---

## 6. Module Patients & QR Code (Prompt Agent 4)

### Prompt à donner à l'agent Antigravity

```
Implémente le CRUD complet des patients et la génération QR code.

COMPOSANTS :
1. PatientForm — formulaire création/édition patient
   - Champs : nom, dob, tel, email, groupe sanguin, allergies, antécédents
   - Validation Zod
   - Server Action : insert dans patients + générer patient_number (SC-YYYY-XXXXX auto-incrémenté)

2. PatientSearch — recherche temps réel
   - Input debounced (300ms)
   - Recherche par nom, numéro patient, téléphone
   - Résultats en dropdown avec lien vers fiche

3. PatientCard — fiche patient complète
   - Onglets : Infos | Dossier médical | RDV | Ordonnances
   - QR code affiché (composant QRDisplay)
   - Bouton export carte PVC

QR CODE GENERATION (Edge Function Supabase) :
- À la création du patient, appeler l'Edge Function generate-qr
- Générer QR avec la librairie `qrcode` (npm)
- QR encode : { patient_number, emergency_token: uuid_unique }
- Stocker le QR dans Supabase Storage → bucket 'qr-codes' (public)
- Sauvegarder l'URL dans patients.qr_code_url

ACCÈS VIA QR (/app/qr/[patient_number]/page.tsx) :
- Route publique (pas de login requis)
- Affiche UNIQUEMENT : nom, groupe sanguin, allergies, antécédents critiques
- Enregistre automatiquement dans audit_logs (action: 'qr_access', user_id: null)
- Message d'avertissement visible : "Accès d'urgence — données limitées"

AUDIT AUTOMATIQUE :
- Chaque ouverture de fiche patient → insert dans audit_logs
- Server Action dédiée logAudit(action, target_type, target_id)

Critère de succès :
- Création patient → QR visible dans profil en < 5s
- Scan QR urgence → données vitales sans login + log créé
```

---

## 7. Dossier Médical (Prompt Agent 5)

### Prompt à donner à l'agent Antigravity

```
Implémente le module dossier médical complet.

COMPOSANTS :
1. MedicalRecordList — liste des entrées du dossier
   - Filtres : type (résultat/ordonnance/note/fichier), date
   - Tri par date décroissante
   - Chaque entrée : date, type, auteur, aperçu contenu

2. AddRecordForm — ajout d'une entrée médicale (réservé aux médecins)
   - Type 'text/prescription' : textarea riche
   - Type 'file' : upload PDF/image → Supabase Storage (bucket 'medical-files', privé)
   - Validation : taille max 10MB, types autorisés (pdf, jpg, png)
   - Server Action avec vérification rôle='doctor' avant insert

3. FileViewer — visualisation fichiers
   - PDF : iframe ou lien signé Supabase (createSignedUrl, expiration 1h)
   - Images : affichage direct

PARTAGE INTER-CLINIQUES :
- Vérifier existence d'un consent actif avant d'afficher le dossier
- Si pas de consentement → afficher UI de demande de consentement patient
- RLS gère le blocage au niveau base de données (double protection)

RÈGLES D'ACCÈS :
- Médecin : lecture + écriture (sa clinique uniquement sauf consentement)
- Réceptionniste : lecture seule
- Patient : lecture seule de son propre dossier

Critère de succès :
- Médecin peut uploader un PDF → visible dans le dossier en < 3s
- Patient ne voit pas les records d'un autre patient (RLS)
```

---

## 8. Planning RDV & Notifications (Prompt Agent 6)

### Prompt à donner à l'agent Antigravity

```
Implémente le module prise de rendez-vous avec notifications.

PAGES :
1. /app/dashboard/reception/appointments/page.tsx
   - Vue calendrier hebdomadaire (librairie : react-big-calendar ou custom)
   - Création RDV : modal avec sélection patient, médecin, créneau
   - Modification/annulation inline
   - Liste RDV du jour en sidebar

2. /app/dashboard/patient/book/page.tsx
   - Stepper : Sélection clinique → Sélection médecin → Sélection créneau → Confirmation
   - Afficher seulement les créneaux disponibles (requête Supabase avec exclusion des RDV existants)
   - Confirmation immédiate après création

SERVER ACTIONS :
- createAppointment(data) : insert + déclenchement notifications
- updateAppointment(id, data) : update + notification si changement
- cancelAppointment(id) : update status='cancelled' + notification

NOTIFICATIONS (Edge Function Supabase : send-notifications) :
- Déclenchée par webhook Supabase sur INSERT/UPDATE dans appointments
- SMS via AfricasTalking API (Guinée) : confirmation + rappel 24h avant
- Email via Supabase (template HTML) : même contenu
- Rappel 24h : cron job Supabase (pg_cron) ou Edge Function schedulée

CRON RAPPELS :
- Edge Function schedulée toutes les heures
- Requête : SELECT appointments WHERE datetime BETWEEN now()+23h AND now()+25h AND status='confirmed'
- Envoyer SMS/email pour chaque résultat

Critère de succès :
- Patient crée RDV → SMS reçu en < 30s
- RDV visible dans dashboard réception immédiatement
```

---

## 9. Export Carte PVC (Prompt Agent 7)

### Prompt à donner à l'agent Antigravity

```
Implémente l'export de la carte patient au format PDF (credit card layout).

SERVER ACTION ou EDGE FUNCTION (generate-pvc-card) :
- Input : patient_id
- Récupérer : nom, patient_number, qr_code_url depuis Supabase
- Générer PDF avec @react-pdf/renderer

LAYOUT CARTE PVC (format 85.6mm × 54mm = 242px × 153px @ 72dpi) :
- Fond blanc avec gradient bleu médical en header
- Header : logo "SmartClinic" + nom clinique
- Corps gauche : nom patient (bold), date de naissance, numéro patient
- Corps droit : QR code (64×64px)
- Footer : "Guinée · Carte médicale officielle"
- Police : Inter ou Helvetica (incluse dans @react-pdf/renderer)

OUTPUT :
- PDF retourné comme buffer → téléchargement côté client
- Route API : /api/export/pvc-card?patientId=xxx
- Protégée : rôle admin ou reception uniquement

COMPOSANT UI :
- Bouton "Exporter carte PVC" dans la fiche patient
- Loading state pendant génération
- Download automatique du PDF

Critère de succès :
- Clic export → PDF téléchargé en < 3s
- PDF imprimable au format carte de crédit avec QR code lisible
```

---

## 10. Dashboards par rôle (Prompt Agent 8)

### Prompt à donner à l'agent Antigravity

```
Crée les 5 dashboards Next.js avec leurs layouts et contenus.

LAYOUT PARTAGÉ (/app/dashboard/layout.tsx) :
- Sidebar responsive (Tailwind)
- Logo SmartClinic + nom clinique
- Navigation items selon le rôle (lus depuis le JWT)
- Bouton déconnexion (supabase.auth.signOut)
- Mobile : sidebar en drawer

/dashboard/superadmin :
- Liste toutes les cliniques du réseau
- Bouton "Créer clinique" → modal formulaire
- Bouton "Créer Admin" → Server Action createUser
- Tableau audit logs global (filtrable par clinique, date, action)
- KPIs : nb cliniques, nb patients total, nb RDV aujourd'hui

/dashboard/admin :
- KPIs clinique : RDV aujourd'hui, patients enregistrés, médecins actifs
- Graphique simple : RDV par jour (7 derniers jours) — recharts
- Gestion utilisateurs (médecins + réceptionnistes de sa clinique)
- Fusion doublons patients : recherche 2 patients → bouton fusion → Server Action mergePatientsAction

/dashboard/reception :
- Barre de recherche patient en haut (recherche temps réel)
- Liste RDV du jour avec status
- Bouton "Nouveau patient" → PatientForm modal
- Bouton "Imprimer carte PVC" dans chaque ligne patient
- Quick actions : scan/saisie numéro patient

/dashboard/doctor :
- Liste patients du jour (depuis appointments du jour avec doctor_id=auth.uid())
- Chaque patient : bouton "Ouvrir dossier"
- Dossier : onglets Infos | Résultats | Ordonnances | Historique RDV
- Formulaire ajout résultat/ordonnance inline

/dashboard/patient :
- Prochains RDV (max 3 affichés)
- Bouton "Prendre un RDV" → /dashboard/patient/book
- QR code affiché (grand format)
- Bouton "Télécharger mon QR" (PNG via canvas)
- Dossier médical en lecture seule (onglet)

Critère de succès :
- Chaque dashboard charge en < 2s
- Navigation cross-rôle impossible (middleware)
```

---

## 11. Journal d'Audit UI (Prompt Agent 9)

### Prompt à donner à l'agent Antigravity

```
Crée la page de consultation du journal d'audit.

PAGE /app/dashboard/admin/audit/page.tsx (et /superadmin/audit) :

TABLEAU FILTRABLE :
- Colonnes : Date/Heure | Utilisateur | Action | Type cible | ID cible | IP
- Filtres : date range (date-fns), utilisateur (dropdown), action type (dropdown)
- Pagination côté serveur (Supabase range query)
- Export CSV des résultats filtrés

ACTIONS LOGUÉES (dans Server Actions) :
- 'patient_view' : ouverture fiche patient
- 'patient_create' : création patient
- 'record_add' : ajout résultat/ordonnance
- 'qr_access' : accès urgence via QR
- 'appointment_create/update/cancel'
- 'login' / 'logout'

HELPER FUNCTION logAudit(action, target_type, target_id, meta?) :
- Insert dans audit_logs avec user_id=auth.uid(), IP depuis headers
- Appelée depuis toutes les Server Actions concernées

RLS SUR AUDIT_LOGS :
- Admin clinique : voit uniquement les logs de sa clinique
- SuperAdmin : voit tous les logs
- Pas de UPDATE/DELETE permis (append-only)

Critère de succès :
- Après lecture d'un dossier → entrée visible dans journal en temps réel
- Filtres fonctionnels + export CSV
```

---

## 12. Sécurité & Tests (Prompt Agent 10)

### Prompt à donner à l'agent Antigravity

```
Implémente les tests d'acceptation et les vérifications de sécurité.

TESTS FONCTIONNELS (fichiers dans /tests/) :
- TF01 : Création patient → vérifier patient_number unique + QR généré
- TF02 : Login email/mdp → JWT retourné. Mauvais mdp → 401
- TF03 : Accès dossier via QR → affiché en < 3s + log audit créé
- TF04 : Prise de RDV → RDV en BDD + SMS déclenché
- TF05 : Upload PDF médical → stocké + visible dans dossier
- TF06 : Export carte PVC → PDF avec QR code
- TF07 : Accès urgence QR → données vitales sans login + log
- TF08 : Patient accède /dashboard/doctor → redirection 403
- TF09 : Lecture dossier → entrée audit_logs avec IP + timestamp
- TF10 : Médecin clinique B sans consentement → accès refusé (RLS)

VALIDATION SÉCURITÉ :
- Toutes les Server Actions : vérifier rôle via supabase.auth.getUser() avant tout traitement
- Validation Zod sur tous les inputs
- Pas d'interpolation directe de données utilisateur dans les requêtes
- Headers sécurité Next.js (CSP, X-Frame-Options) dans next.config.js
- Variables sensibles uniquement en .env.local (jamais dans le code)

CHECKLIST DÉPLOIEMENT :
□ Variables d'env configurées sur Vercel
□ HTTPS actif (automatique Vercel)
□ RLS activé sur toutes les tables Supabase
□ Supabase service role key JAMAIS exposée côté client
□ Backup quotidien Supabase Cloud activé
□ Cron job rappels SMS configuré

Critère de succès : tous les scénarios TF01-TF10 passent en environnement staging.
```

---

## 13. Récapitulatif des agents Antigravity

| Agent | Module | Semaine | Développeur |
|-------|--------|---------|-------------|
| Agent 0 | Setup projet | S1 | A+B |
| Agent 1 | Schéma DB + migrations | S1-2 | A |
| Agent 2 | RLS + RBAC policies | S2 | A |
| Agent 3 | Auth + Middleware | S3 | A+B |
| Agent 4 | Patients + QR Code | S3-4 | A+B |
| Agent 5 | Dossier médical | S5-6 | A |
| Agent 6 | RDV + Notifications SMS | S7-8 | A+B |
| Agent 7 | Export carte PVC | S9 | B |
| Agent 8 | Dashboards 5 rôles | S9-10 | B |
| Agent 9 | Journal d'audit UI | S11 | B |
| Agent 10 | Tests + Sécurité | S11-12 | A+B |

---

## 14. Tips Antigravity pour ce projet

- **Manager View** : lancer Agent 1 (DB) et Agent 8 (UI dashboards) en parallèle dès S2 — ils sont indépendants
- **Skills Antigravity** : créer un skill `supabase-rls` qui codifie les patterns RLS du projet pour que l'agent les réutilise systématiquement
- **Rules** : définir une rule globale "toujours valider les inputs avec Zod dans les Server Actions" — l'agent l'appliquera à chaque génération
- **Browser Agent** : utiliser le browser subagent pour tester automatiquement les redirections de rôles et les flux utilisateurs
- **Artifacts** : commenter directement les plans de tâche générés par l'agent avant de les approuver (interface doc-style)
- **Modèle recommandé** : Gemini 3 Pro pour la logique métier complexe (RLS, Edge Functions) — Claude Sonnet pour les composants UI

---

*Spec généré pour Google Antigravity — SmartClinic V1 — Mars 2026*
