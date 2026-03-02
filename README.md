# TodoList App

Application de gestion de tâches full-stack, déployée sur **GitHub Pages** avec **Supabase** comme backend-as-a-service.

**Live demo** : [https://a11y-project.github.io/todolist/](https://a11y-project.github.io/todolist/)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Authentification | Supabase Auth (email/mot de passe) |
| Base de données | Supabase (PostgreSQL) |
| Déploiement | GitHub Pages |

---

## Architecture

```
Navigateur (React)
       ↓
Supabase
  ├── Auth     → inscription, connexion, sessions
  └── Database → PostgreSQL avec Row Level Security
```

Aucun backend Express — le frontend communique **directement** avec Supabase. Chaque utilisateur ne peut accéder qu'à ses propres données grâce au **Row Level Security (RLS)**.

---

## Fonctionnalités

- **Authentification** : inscription, connexion, déconnexion, "Se souvenir de moi"
- **Tâches** : création, modification, suppression
- **Statuts** : `en attente` / `en cours` / `terminé`
- **Priorités** : `faible` / `moyenne` / `haute`
- **Catégories** : libres, filtrables
- **Tri et filtres** : par statut, priorité, catégorie, date
- **Interface responsive** : mobile et desktop

---

## Structure du projet

```
todolist/
└── client/
    ├── public/
    │   └── 404.html              # Redirection SPA pour GitHub Pages
    ├── src/
    │   ├── components/
    │   │   ├── Auth/             # Login, Register
    │   │   ├── Layout/           # Navbar, Footer, ProtectedRoute
    │   │   └── Tasks/            # TaskList, TaskItem, TaskForm, TaskFilters
    │   ├── context/
    │   │   └── AuthContext.jsx   # Gestion session Supabase Auth
    │   ├── lib/
    │   │   └── supabase.js       # Client Supabase
    │   └── services/
    │       └── api.js            # Requêtes Supabase (CRUD tâches)
    ├── .env                      # Variables d'environnement (non versionné)
    └── vite.config.js
```

---

## Base de données Supabase

### Tables

**`profiles`** — informations utilisateur (lié à `auth.users`)
| Colonne | Type | Description |
|---|---|---|
| id | UUID | Clé primaire (= auth.users.id) |
| name | TEXT | Nom affiché |
| created_at | TIMESTAMPTZ | Date de création |

**`tasks`** — tâches de l'utilisateur
| Colonne | Type | Description |
|---|---|---|
| id | SERIAL | Clé primaire |
| user_id | UUID | Référence auth.users |
| title | TEXT | Titre |
| description | TEXT | Description (optionnel) |
| deadline | TIMESTAMPTZ | Échéance (optionnel) |
| priority | TEXT | `low` / `medium` / `high` |
| status | TEXT | `pending` / `in_progress` / `completed` |
| category | TEXT | Catégorie libre (optionnel) |
| created_at | TIMESTAMPTZ | Date de création |

### Sécurité (RLS)

Row Level Security activé sur les deux tables. Chaque utilisateur ne peut lire/écrire que ses propres données (`auth.uid() = user_id`).

Un **trigger PostgreSQL** crée automatiquement un profil dans `profiles` à chaque nouvelle inscription.

---

## Installation locale

### Prérequis
- Node.js 18+
- Un projet Supabase ([supabase.com](https://supabase.com))

### 1. Cloner le projet

```bash
git clone https://github.com/a11y-project/todolist.git
cd todolist/client
npm install
```

### 2. Configurer les variables d'environnement

Crée un fichier `client/.env` :

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta_cle_anon
```

Ces valeurs sont disponibles dans ton dashboard Supabase : **Connect → API Keys**.

### 3. Configurer la base de données Supabase

Dans le **SQL Editor** de Supabase, exécute :

```sql
-- Table profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger auto-création profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Dans **Authentication → Providers → Email**, désactive **"Confirm email"** pour les tests.

### 4. Lancer en local

```bash
npm run dev
# → http://localhost:3000
```

---

## Déploiement GitHub Pages

```bash
cd client
npm run deploy
```

Le script build automatiquement l'app et publie le dossier `dist/` sur la branche `gh-pages`.

> **Note** : les URLs utilisent le `HashRouter` (`/#/login`) pour assurer la compatibilité avec GitHub Pages lors des rechargements de page.

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase (anon key) |

> Le fichier `.env` n'est pas versionné. Les valeurs sont intégrées dans le build au moment du déploiement.
