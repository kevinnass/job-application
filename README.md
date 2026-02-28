# JobTracker 📋

Application web de suivi de candidatures pour centraliser et gérer ses recherches d'emploi.

## Stack

- **Frontend** — Nuxt 4, Vue 3, Tailwind CSS, Pinia
- **Backend** — Supabase (Auth, PostgreSQL, Edge Functions)
- **IA** — Groq (LLaMA 3.1) pour l'analyse automatique d'offres d'emploi
- **Extension** — Chrome extension pour capturer des offres depuis n'importe quel site
- **Déploiement** — Vercel

## Fonctionnalités

- 🔐 Authentification (Supabase Auth, PKCE)
- 📊 Dashboard avec stats par statut (brouillon, postulé, entretien, accepté, refusé)
- ➕ Ajout / édition / suppression de candidatures
- 🔍 Recherche et filtrage par statut, entreprise, compétences
- 🤖 Analyse automatique d'offres via IA (extraction entreprise, poste, salaire, missions, compétences)
- 🧩 Extension Chrome pour scraper et sauvegarder des offres en un clic
- 🌙 Mode sombre / clair (préférence système)

## Installation

```bash
# Cloner le repo
git clone https://github.com/kevinnass/job-application.git
cd job-application

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env

# Lancer en dev
pnpm dev
```

## Base de données

Exécuter le fichier `supabase/schema.sql` dans l'éditeur SQL de Supabase pour créer la table `job_applications` avec les policies RLS.

## Extension Chrome

1. Ouvrir `chrome://extensions`
2. Activer le mode développeur
3. Charger le dossier `extension/` comme extension non empaquetée
4. Naviguer sur une offre d'emploi et cliquer sur l'extension pour la capturer

## License

MIT
