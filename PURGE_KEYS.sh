#!/bin/bash

# Script de purge des clés API de l'historique Git
# ATTENTION: Ce script va réécrire complètement l'historique Git !

echo "🔒 PURGE DES CLÉS API DE L'HISTORIQUE GIT"
echo "========================================="
echo ""
echo "⚠️  AVERTISSEMENT:"
echo "   - Ce script va réécrire l'historique Git complet"
echo "   - Tous les collaborateurs devront re-cloner le repo"
echo "   - Cette action est IRRÉVERSIBLE"
echo ""
read -p "Voulez-vous continuer? (oui/non): " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Opération annulée"
    exit 1
fi

echo ""
echo "📦 Étape 1: Création d'une sauvegarde complète..."
cd /c/Users/THEO6/Desktop
cp -r athtlium-app athtlium-app-backup-$(date +%Y%m%d-%H%M%S)
echo "✅ Sauvegarde créée"

cd /c/Users/THEO6/Desktop/athtlium-app

echo ""
echo "🧹 Étape 2: Suppression du fichier .env de l'historique..."
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🔧 Étape 3: Remplacement des clés hardcodées dans lib/supabase.js..."
git filter-branch --force --tree-filter \
  "if [ -f lib/supabase.js ]; then \
     sed -i 's|const SUPABASE_URL = '\''https://sbhqmofubnwdoocsywqs.supabase.co'\'';|const SUPABASE_URL = process.env.SUPABASE_URL || '\''REMPLACÉ'\'';|g' lib/supabase.js; \
     sed -i 's|const SUPABASE_ANON_KEY = '\''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*'\'';|const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '\''REMPLACÉ'\'';|g' lib/supabase.js; \
   fi" \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "🗑️  Étape 4: Nettoyage des références et garbage collection..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ PURGE TERMINÉE!"
echo ""
echo "📝 PROCHAINES ÉTAPES:"
echo "   1. Vérifiez que tout fonctionne: git log --all -- .env lib/supabase.js"
echo "   2. Forcez le push: git push origin --force --all"
echo "   3. Révoquez les anciennes clés dans Supabase"
echo "   4. Créez de nouvelles clés"
echo ""
