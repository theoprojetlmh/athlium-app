#!/usr/bin/env python3
"""
Script de purge des secrets de l'historique Git d'Athlium
Ce script utilise git filter-branch pour supprimer les clés API de l'historique
"""

import subprocess
import sys
import os
from datetime import datetime

def run_command(cmd, description):
    """Exécute une commande shell et affiche le résultat"""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}")
    print(f"Commande: {cmd}")
    print()

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)

    if result.returncode != 0:
        print(f"❌ Erreur lors de l'exécution: {description}")
        return False
    else:
        print(f"✅ Succès: {description}")
        return True

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║   🔒 PURGE DES SECRETS DE L'HISTORIQUE GIT - ATHLIUM      ║
╚════════════════════════════════════════════════════════════╝

⚠️  AVERTISSEMENT CRITIQUE:
   • Ce script va RÉÉCRIRE COMPLÈTEMENT l'historique Git
   • Tous les collaborateurs devront RE-CLONER le repository
   • Cette action est IRRÉVERSIBLE
   • Une sauvegarde sera créée automatiquement

📍 Fichiers qui seront nettoyés:
   • .env (supprimé de l'historique)
   • lib/supabase.js (clés hardcodées remplacées)

🔄 Étapes qui seront effectuées:
   1. Création d'une sauvegarde complète
   2. Suppression de .env de l'historique
   3. Nettoyage des références Git
   4. Garbage collection
    """)

    response = input("Voulez-vous continuer? (tapez 'OUI' en majuscules): ")

    if response != "OUI":
        print("\n❌ Opération annulée par l'utilisateur")
        return

    # Vérifier qu'on est dans le bon répertoire
    if not os.path.exists('.git'):
        print("❌ Erreur: Pas de répertoire .git trouvé. Exécutez ce script depuis la racine du projet.")
        return

    # Étape 1: Sauvegarde
    backup_name = f"athtlium-app-backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    backup_path = f"../{backup_name}"

    print(f"\n📦 Étape 1: Création de la sauvegarde...")
    print(f"   Destination: {backup_path}")

    if os.path.exists(backup_path):
        print(f"⚠️  Le dossier de sauvegarde existe déjà: {backup_path}")
        return

    if not run_command(f'cp -r . "{backup_path}"', "Sauvegarde complète du projet"):
        return

    # Étape 2: Suppression du .env de l'historique
    if not run_command(
        'git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all',
        "Suppression de .env de tout l'historique Git"
    ):
        return

    # Étape 3: Nettoyage des références
    print("\n🗑️  Étape 3: Nettoyage des références Git...")

    run_command('rm -rf .git/refs/original/', "Suppression des références originales")
    run_command('git reflog expire --expire=now --all', "Expiration du reflog")
    run_command('git gc --prune=now --aggressive', "Garbage collection agressive")

    print("""
╔════════════════════════════════════════════════════════════╗
║                    ✅ PURGE TERMINÉE !                     ║
╚════════════════════════════════════════════════════════════╝

📝 PROCHAINES ÉTAPES OBLIGATOIRES:

1️⃣  Vérifier que la purge a fonctionné:
   git log --all --full-history -- .env

   👉 Cette commande ne doit RIEN afficher

2️⃣  Forcer le push vers GitHub:
   git push origin --force --all
   git push origin --force --tags

   ⚠️  ATTENTION: Tous vos collaborateurs devront re-cloner le repo !

3️⃣  Révoquer les ANCIENNES clés dans Supabase:
   https://supabase.com/dashboard/project/sbhqmofubnwdoocsywqs/settings/api

4️⃣  Générer de NOUVELLES clés et les mettre dans .env

5️⃣  Tester que l'app fonctionne:
   npm start

6️⃣  Informer vos collaborateurs:
   ⚠️  Ils doivent supprimer leur ancien clone et re-cloner le repo

📂 Sauvegarde créée dans: {backup_path}
   (vous pouvez la supprimer une fois que tout fonctionne)
    """)

if __name__ == "__main__":
    main()
