# 🔥 Guide étape par étape : Purge des clés API de Git

## ⚠️ IMPORTANT

Ce guide va **supprimer définitivement** les clés API de l'historique Git. Cette opération est **irréversible**.

---

## 📋 Prérequis

Avant de commencer :

1. ✅ Vous avez accès au dashboard Supabase
2. ✅ Vous êtes le propriétaire du repository GitHub
3. ✅ Aucun autre développeur ne travaille actuellement sur le projet
4. ✅ Vous avez Git Bash ou un terminal sous Windows

---

## 🚀 Étape 1 : Sauvegarde

```bash
# Créer une sauvegarde complète (au cas où)
cd /c/Users/THEO6/Desktop
cp -r athtlium-app athtlium-app-backup-$(date +%Y%m%d)

# Vérifier que la sauvegarde existe
ls -ld athtlium-app-backup-*
```

**✅ Checkpoint** : Vous devez voir un dossier `athtlium-app-backup-YYYYMMDD`

---

## 🧹 Étape 2 : Purger le fichier .env de l'historique

```bash
# Retourner dans le projet
cd /c/Users/THEO6/Desktop/athtlium-app

# Vérifier l'état Git actuel
git status

# Purger .env de TOUT l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

**⏱️ Durée** : 10-30 secondes

**✅ Checkpoint** : Vous devriez voir :
```
Rewrite 1dda458... (1/2) (0 seconds passed, remaining 0 predicted)
Rewrite 79503c1... (2/2) (0 seconds passed, remaining 0 predicted)
```

---

## 🗑️ Étape 3 : Nettoyer les références Git

```bash
# Supprimer les anciennes références
rm -rf .git/refs/original/

# Expirer le reflog
git reflog expire --expire=now --all

# Garbage collection aggressive
git gc --prune=now --aggressive
```

**⏱️ Durée** : 5-15 secondes

**✅ Checkpoint** : Commande complétée sans erreur

---

## 🔍 Étape 4 : Vérifier que la purge a fonctionné

```bash
# Cette commande ne doit RIEN afficher
git log --all --full-history --oneline -- .env
```

**✅ SUCCÈS** : Aucune sortie affichée ✨

**❌ ÉCHEC** : Si des commits s'affichent encore, recommencez l'étape 2

---

## 📤 Étape 5 : Force push vers GitHub

⚠️ **ATTENTION** : Cette étape va réécrire l'historique sur GitHub !

```bash
# Forcer le push de toutes les branches
git push origin --force --all

# Forcer le push de tous les tags
git push origin --force --tags
```

**✅ Checkpoint** : Vous devriez voir :
```
+ 1dda458...abc1234 main -> main (forced update)
```

---

## 🔐 Étape 6 : Révoquer les anciennes clés Supabase

1. **Aller sur le dashboard Supabase** :
   - https://supabase.com/dashboard/project/sbhqmofubnwdoocsywqs/settings/api

2. **Cliquer sur "Reset JWT secret"** ou générer de nouvelles clés

3. **Copier les nouvelles clés** :
   - `SUPABASE_URL` (reste le même normalement)
   - `SUPABASE_ANON_KEY` (nouvelle valeur)

4. **Mettre à jour le fichier `.env` local** :

```bash
# Éditer .env avec les NOUVELLES clés
code .env  # ou nano .env
```

**Contenu à mettre dans `.env`** :
```env
# ⚠️ NE JAMAIS COMMITER CE FICHIER !
SUPABASE_URL=https://sbhqmofubnwdoocsywqs.supabase.co
SUPABASE_ANON_KEY=VOTRE_NOUVELLE_CLE_ICI
```

---

## ✅ Étape 7 : Tester l'application

```bash
# Nettoyer le cache Metro
npm start -- --clear
```

**✅ Checkpoint** : L'application démarre sans erreur de connexion Supabase

---

## 📝 Étape 8 : Vérifier sur GitHub

1. Aller sur : https://github.com/theoprojetlmh/athlium-app
2. Cliquer sur "Commits"
3. Vérifier que les anciens commits n'affichent plus les clés API

---

## 🎉 Étape 9 : Commit final sécurisé

```bash
# Vérifier ce qui a changé
git status

# Ajouter les modifications (babel.config.js, lib/supabase.js, etc.)
git add babel.config.js lib/supabase.js .env.example SECURITY.md PURGE_GIT_GUIDE.md purge-secrets.py

# Créer un commit
git commit -m "🔒 Sécurité: Migration vers variables d'environnement

- Configuration de react-native-dotenv
- Migration lib/supabase.js vers @env
- Ajout de SECURITY.md et guides de purge
- Suppression des clés hardcodées

⚠️ IMPORTANT: Après ce commit, les anciennes clés ont été révoquées.
Les collaborateurs doivent mettre à jour leur fichier .env local."

# Push normal (pas de force cette fois)
git push origin main
```

---

## 🧪 Étape 10 : Test final complet

### Test 1 : Vérifier l'historique GitHub

```bash
# Clone frais du repository
cd /c/Users/THEO6/Desktop
git clone https://github.com/theoprojetlmh/athlium-app athtlium-app-test

cd athtlium-app-test

# Chercher les anciennes clés dans TOUT l'historique
git log --all --full-history -p | grep -i "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
```

**✅ SUCCÈS** : Aucune clé API trouvée

**❌ ÉCHEC** : Des clés sont encore présentes → Recommencer depuis l'étape 2

### Test 2 : L'application fonctionne

```bash
cd athtlium-app-test
cp .env.example .env

# Éditer .env avec les NOUVELLES clés
code .env

# Installer et démarrer
npm install
npm start
```

**✅ SUCCÈS** : L'app charge les exercices depuis Supabase

---

## 📧 Étape 11 : Informer les collaborateurs (si applicable)

Si d'autres personnes travaillent sur le projet :

```
Sujet: ⚠️ URGENT - Repository Athlium réinitialisé

Bonjour,

L'historique Git du projet Athlium a été réécrit pour supprimer
des secrets compromis.

Actions requises:
1. Supprimer votre clone local actuel
2. Re-cloner le repository
3. Copier .env.example en .env
4. Me demander les nouvelles clés Supabase

⚠️ Ne PAS faire git pull, ça ne marchera pas !

Merci de votre compréhension.
```

---

## ✅ Checklist finale

- [ ] Sauvegarde créée
- [ ] `.env` purgé de l'historique Git
- [ ] Force push effectué sur GitHub
- [ ] Anciennes clés révoquées dans Supabase
- [ ] Nouvelles clés générées et testées
- [ ] `.env` local mis à jour avec nouvelles clés
- [ ] Application testée et fonctionnelle
- [ ] Historique GitHub vérifié (plus de clés)
- [ ] Collaborateurs informés (si applicable)
- [ ] Sauvegarde supprimée (optionnel)

---

## 🆘 En cas de problème

### "git filter-branch" ne fonctionne pas

```bash
# Utiliser le script Python à la place
python3 purge-secrets.py
```

### "git push --force" est refusé

```bash
# Vérifier les protections de branche sur GitHub
# Settings → Branches → Désactiver temporairement "Require pull request reviews"

git push origin --force --all
```

### L'application ne se connecte plus à Supabase

1. Vérifier que `.env` existe et contient les bonnes clés
2. Redémarrer Metro : `npm start -- --reset-cache`
3. Vérifier les clés sur : https://supabase.com/dashboard/project/sbhqmofubnwdoocsywqs/settings/api

---

## 🎓 Leçon apprise

**À l'avenir** :

1. ✅ Toujours mettre `.env` dans `.gitignore` AVANT le premier commit
2. ✅ Utiliser `git add -p` pour vérifier chaque fichier avant de commiter
3. ✅ Utiliser des hooks Git pre-commit pour détecter les secrets
4. ✅ Faire des code reviews avant de push

---

**Dernière mise à jour** : 2025-11-19
**Durée totale estimée** : 15-30 minutes
