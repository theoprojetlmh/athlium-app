# ⚡ Solution rapide - 5 minutes

Si vous voulez résoudre le problème des clés API **rapidement** (sans lire 50 pages de doc) :

## 🎯 Commandes à copier-coller

### 1. Sauvegarde (1 min)

```bash
cd /c/Users/THEO6/Desktop
cp -r athtlium-app athtlium-app-backup
cd athtlium-app
```

### 2. Purge Git (1 min)

```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 3. Vérification (10 sec)

```bash
git log --all -- .env
```

**Doit être vide** ✅

### 4. Push (30 sec)

```bash
git push origin --force --all
```

### 5. Révoquer les clés Supabase (2 min)

1. Aller ici : https://supabase.com/dashboard/project/sbhqmofubnwdoocsywqs/settings/api
2. Cliquer "Reset JWT secret"
3. Copier la nouvelle `ANON_KEY`
4. Mettre à jour `.env` :

```env
SUPABASE_URL=https://sbhqmofubnwdoocsywqs.supabase.co
SUPABASE_ANON_KEY=NOUVELLE_CLE_ICI
```

### 6. Tester (30 sec)

```bash
npm start -- --clear
```

## ✅ C'est fait !

Vos clés ne sont plus dans Git. L'app fonctionne avec les nouvelles clés.

---

**Besoin de plus de détails ?** → Lire `PURGE_GIT_GUIDE.md`

**Questions de sécurité ?** → Lire `SECURITY.md`
