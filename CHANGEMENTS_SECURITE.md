# 📝 Résumé des changements de sécurité

**Date**: 2025-11-19
**Objectif**: Sécuriser les clés API Supabase

---

## ✅ Changements effectués

### 1. Configuration de react-native-dotenv

**Fichier**: `babel.config.js`

Ajout du plugin `react-native-dotenv` pour charger les variables d'environnement depuis `.env`.

```javascript
plugins: [
    [
        'module:react-native-dotenv',
        {
            moduleName: '@env',
            path: '.env',
            safe: false,
            allowUndefined: true,
            verbose: false,
        },
    ],
]
```

### 2. Migration de lib/supabase.js

**Avant** (INSÉCURISÉ ❌):
```javascript
const SUPABASE_URL = 'https://sbhqmofubnwdoocsywqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...'; // Hardcodé !
```

**Après** (SÉCURISÉ ✅):
```javascript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Variables d\'environnement manquantes');
}
```

### 3. Mise à jour du fichier .env

**Avant**:
- Contenait `SUPABASE_SERVICE_KEY` (❌ DANGEREUX dans une app mobile)
- Pas de commentaires

**Après**:
- Seulement `SUPABASE_URL` et `SUPABASE_ANON_KEY`
- Commentaires explicites sur la sécurité
- Warning clair de ne jamais commiter

### 4. Mise à jour de .env.example

Fichier exemple clair avec instructions pour les nouveaux développeurs.

### 5. Documentation de sécurité

Création de 4 fichiers de documentation :

1. **`SECURITY.md`** (guide complet de sécurité)
   - Bonnes pratiques
   - Différence ANON_KEY vs SERVICE_KEY
   - Exemples de politiques RLS
   - Checklist de sécurité

2. **`PURGE_GIT_GUIDE.md`** (guide détaillé étape par étape)
   - 11 étapes numérotées avec checkpoints
   - Commandes exactes à copier-coller
   - Tests de validation
   - Troubleshooting

3. **`QUICK_FIX.md`** (solution rapide 5 minutes)
   - Commandes essentielles uniquement
   - Pas de théorie, juste l'action

4. **`purge-secrets.py`** (script automatique Python)
   - Sauvegarde automatique
   - Purge de .env de l'historique
   - Nettoyage Git complet

---

## ⚠️ Actions encore requises

### URGENT (à faire maintenant):

1. **Purger l'historique Git**
   ```bash
   # Option 1: Script automatique
   python3 purge-secrets.py

   # Option 2: Commandes manuelles (voir QUICK_FIX.md)
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" ...
   ```

2. **Force push vers GitHub**
   ```bash
   git push origin --force --all
   ```

3. **Révoquer les anciennes clés Supabase**
   - Aller sur: https://supabase.com/dashboard/project/sbhqmofubnwdoocsywqs/settings/api
   - Cliquer "Reset JWT secret"
   - Noter les nouvelles clés

4. **Mettre à jour .env local**
   - Remplacer l'ancienne `SUPABASE_ANON_KEY` par la nouvelle

5. **Tester l'application**
   ```bash
   npm start -- --clear
   ```

---

## 📊 Impact

### Avant
- 🔴 Clés API exposées dans le code source
- 🔴 Clés API dans l'historique Git
- 🔴 SERVICE_KEY dans l'app mobile
- 🔴 Pas de documentation sécurité
- 🔴 Risque de compromission totale

### Après
- ✅ Clés API dans variables d'environnement
- ✅ .env ignoré par Git
- ✅ Validation au démarrage
- ✅ Documentation complète
- ✅ SERVICE_KEY retirée de l'app
- ⚠️ Historique Git à purger (à faire)

---

## 🔧 Dépendances ajoutées

```json
{
  "devDependencies": {
    "react-native-dotenv": "^3.4.11"  // Nouveau
  }
}
```

---

## 📁 Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `babel.config.js` | Ajout plugin dotenv |
| `lib/supabase.js` | Migration vers @env |
| `.env` | Restructuration + commentaires |
| `.env.example` | Mise à jour avec instructions |
| **Nouveaux fichiers** | |
| `SECURITY.md` | Documentation sécurité complète |
| `PURGE_GIT_GUIDE.md` | Guide détaillé de purge |
| `QUICK_FIX.md` | Guide rapide |
| `purge-secrets.py` | Script automatique |
| `CHANGEMENTS_SECURITE.md` | Ce fichier |

---

## 🎯 Prochaines étapes

### Immédiat (aujourd'hui)
1. [ ] Lire `QUICK_FIX.md`
2. [ ] Exécuter la purge Git
3. [ ] Révoquer anciennes clés Supabase
4. [ ] Tester l'app avec nouvelles clés

### Court terme (cette semaine)
5. [ ] Configurer Git hooks pre-commit (détecter secrets)
6. [ ] Vérifier les politiques RLS sur Supabase
7. [ ] Documenter README.md avec setup instructions

### Moyen terme
8. [ ] Mettre en place monitoring (Sentry)
9. [ ] Audit de sécurité complet
10. [ ] CI/CD avec vérification des secrets

---

## 📚 Ressources créées

Tous les guides sont dans le dossier racine :

- `QUICK_FIX.md` → Pour commencer rapidement
- `PURGE_GIT_GUIDE.md` → Guide complet pas-à-pas
- `SECURITY.md` → Référence sécurité complète
- `purge-secrets.py` → Script automatique

**Commande recommandée**:
```bash
# Lire le guide rapide
cat QUICK_FIX.md

# OU exécuter le script Python
python3 purge-secrets.py
```

---

## ✅ Validation finale

Une fois tout terminé, vérifier :

```bash
# 1. .env n'est plus dans l'historique
git log --all -- .env
# Doit être vide

# 2. Aucune clé dans le code
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" . --exclude-dir=node_modules --exclude-dir=.git
# Ne doit trouver que dans .env (ignoré par git)

# 3. L'app démarre
npm start
# Doit se connecter à Supabase
```

---

**Besoin d'aide ?** Consultez `SECURITY.md` section "En cas de problème"
