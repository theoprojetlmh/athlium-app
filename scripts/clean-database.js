// scripts/clean-database.js
// ⚠️ IMPORTANT: Ce script utilise SERVICE_KEY qui donne un accès ADMIN à Supabase
// Ne JAMAIS inclure ce fichier dans l'app mobile !
// À utiliser UNIQUEMENT en local pour nettoyer la base

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Vérifier que les variables d'environnement sont présentes
if (!process.env.SUPABASE_URL) {
    console.error('❌ SUPABASE_URL manquant dans .env');
    process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ SUPABASE_SERVICE_KEY manquant dans .env');
    console.log('💡 Crée un fichier .env avec:');
    console.log('   SUPABASE_URL=https://your-project.supabase.co');
    console.log('   SUPABASE_SERVICE_KEY=your-service-key-here');
    process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function cleanDatabase() {
    console.log('🗑️  NETTOYAGE COMPLET DE LA BASE DE DONNÉES\n');

    try {
        // 1. Compter ce qu'on va supprimer
        const { count: relCount } = await supabase
            .from('muscle_exercises')
            .select('*', { count: 'exact', head: true });

        const { count: exCount } = await supabase
            .from('exercises')
            .select('*', { count: 'exact', head: true });

        console.log(`📊 À supprimer: ${exCount || 0} exercices, ${relCount || 0} relations\n`);

        if (exCount === 0 && relCount === 0) {
            console.log('✅ Base déjà vide, rien à nettoyer\n');
            return;
        }

        // 2. Récupérer tous les IDs à supprimer
        const { data: allRelations } = await supabase
            .from('muscle_exercises')
            .select('id');

        const { data: allExercises } = await supabase
            .from('exercises')
            .select('id');

        // 3. Supprimer les relations
        if (allRelations && allRelations.length > 0) {
            console.log('⏳ Suppression des relations muscle_exercises...');
            const relIds = allRelations.map(r => r.id);

            const { error: relError } = await supabase
                .from('muscle_exercises')
                .delete()
                .in('id', relIds);

            if (relError) throw relError;
            console.log('✅ Relations supprimées\n');
        } else {
            console.log('ℹ️  Aucune relation à supprimer\n');
        }

        // 4. Supprimer les exercices
        if (allExercises && allExercises.length > 0) {
            console.log('⏳ Suppression des exercices...');
            const exIds = allExercises.map(e => e.id);

            const { error: exError } = await supabase
                .from('exercises')
                .delete()
                .in('id', exIds);

            if (exError) throw exError;
            console.log('✅ Exercices supprimés\n');
        } else {
            console.log('ℹ️  Aucun exercice à supprimer\n');
        }

        console.log('🎉 BASE DE DONNÉES NETTOYÉE !\n');
        console.log('✅ Prêt pour importer les nouveaux exercices\n');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

// Demander confirmation avant de supprimer
console.log('⚠️  ATTENTION: Cette action va SUPPRIMER tous les exercices !\n');
console.log('Appuie sur CTRL+C pour annuler, ou ENTRÉE pour continuer...\n');

process.stdin.once('data', () => {
    cleanDatabase();
});