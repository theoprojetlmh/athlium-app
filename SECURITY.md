# 🔒 Guide de sécurité - Athlium App

## ⚠️ URGENT : Clés API compromises

Si vous lisez ce fichier car vos clés API ont été exposées dans Git, suivez immédiatement ces étapes :

### 1. Purger l'historique Git

```bash
# Exécuter le script de purge
python3 purge-secrets.py

# OU manuellement:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Nettoyer
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Vérifier que .env n'est plus dans l'historique
git log --all --full-history -- .env
# ⬆️ Cette commande ne doit RIEN afficher

# Forcer le push
git push origin --force --all
git push origin --force --tags
```

### 2. Révoquer les clés compromises

1. Aller sur le dashboard Supabase : https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
2. Cliquer sur "Reset JWT secret" ou générer de nouvelles clés
3. Noter les nouvelles clés dans un endroit sécurisé (gestionnaire de mots de passe)

### 3. Mettre à jour les clés

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et remplir les NOUVELLES clés
nano .env  # ou votre éditeur préféré
```

### 4. Redémarrer l'application

```bash
# Nettoyer le cache
npm start -- --clear

# Ou redémarrer Expo
npm start
```

---

## 🛡️ Bonnes pratiques de sécurité

### Variables d'environnement

#### ✅ À FAIRE

- **Toujours** utiliser `.env` pour les secrets
- **Toujours** vérifier que `.env` est dans `.gitignore`
- **Toujours** utiliser `@env` pour importer les variables
- **Toujours** fournir un `.env.example` avec des valeurs fictives

#### ❌ À NE JAMAIS FAIRE

- ❌ Hardcoder des clés API dans le code source
- ❌ Commiter le fichier `.env` dans Git
- ❌ Partager des clés API par email/Slack/Discord
- ❌ Mettre la `SERVICE_KEY` dans l'application mobile
- ❌ Publier des screenshots contenant des clés
- ❌ Utiliser les mêmes clés en dev et en production

### Clés Supabase : Différence ANON vs SERVICE

| Clé | Usage | Risque si exposée |
|-----|-------|-------------------|
| **ANON_KEY** | ✅ Application mobile/web | 🟡 Moyen - Protégée par RLS |
| **SERVICE_KEY** | ❌ Serveur Node.js uniquement | 🔴 CRITIQUE - Accès admin complet |

**Règle d'or** : La `SERVICE_KEY` ne doit **JAMAIS** être dans l'application client.

### Exemple de configuration sécurisée

```javascript
// ✅ BON - lib/supabase.js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Variables d\'environnement manquantes');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

```javascript
// ❌ MAUVAIS
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🔍 Row Level Security (RLS)

Puisque la `ANON_KEY` est exposée dans l'app mobile, **il est CRUCIAL** d'avoir des politiques RLS sur toutes vos tables Supabase.

### Vérifier vos politiques RLS

```sql
-- Lister toutes les tables sans RLS
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
    SELECT tablename
    FROM pg_policies
    WHERE schemaname = 'public'
);
```

### Exemples de politiques RLS

```sql
-- Exercices : lecture publique, écriture admin uniquement
CREATE POLICY "Lecture publique des exercices"
ON exercises FOR SELECT
TO anon
USING (true);

-- Feedback : création autorisée, lecture uniquement par l'auteur
CREATE POLICY "Création feedback anonyme"
ON feedback FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Lecture feedback privée"
ON feedback FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

---

## 📱 Sécurité spécifique React Native

### 1. Ne jamais logger les secrets

```javascript
// ❌ MAUVAIS
console.log('Supabase URL:', SUPABASE_URL);
console.log('API Response:', response);

// ✅ BON
if (__DEV__) {
    console.log('API Response:', sanitizeData(response));
}
```

### 2. Utiliser un logger conditionnel

```javascript
// utils/logger.js
export const logger = {
    log: (msg, data) => {
        if (__DEV__) {
            console.log(`[LOG] ${msg}`, data);
        }
    },
    error: (msg, err) => {
        // Les erreurs sont toujours loggées
        console.error(`[ERROR] ${msg}`, err);
    }
};
```

### 3. Validation des entrées utilisateur

```javascript
// ❌ MAUVAIS - Pas de validation
const handleSubmit = async () => {
    await supabase.from('feedback').insert({ message });
};

// ✅ BON - Validation stricte
const handleSubmit = async () => {
    const sanitized = message.trim();

    if (sanitized.length < 10 || sanitized.length > 5000) {
        throw new Error('Message invalide');
    }

    await supabase.from('feedback').insert({ message: sanitized });
};
```

---

## 🔐 Checklist de sécurité

Avant chaque release :

- [ ] `.env` est dans `.gitignore`
- [ ] Aucune clé API hardcodée dans le code
- [ ] Toutes les tables Supabase ont des politiques RLS
- [ ] Les console.logs sensibles sont retirés
- [ ] Les dépendances npm sont à jour (`npm audit`)
- [ ] Les variables d'environnement sont validées au démarrage
- [ ] La `SERVICE_KEY` n'est pas dans l'application
- [ ] Les erreurs n'exposent pas d'informations sensibles
- [ ] Les inputs utilisateurs sont validés côté client ET serveur

---

## 📞 En cas de problème

### Clés exposées sur GitHub public

1. **IMMÉDIAT** : Révoquer les clés dans Supabase
2. Purger l'historique Git (voir section 1)
3. Générer de nouvelles clés
4. Force push le repository nettoyé
5. Analyser les logs Supabase pour détecter des accès suspects

### Ressources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [React Native Security](https://reactnative.dev/docs/security)

---

## 🚨 Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, **ne créez PAS d'issue publique**.

Contactez directement : [votre email de sécurité]

Merci de contribuer à la sécurité d'Athlium ! 🙏
