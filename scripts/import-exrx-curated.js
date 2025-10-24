// scripts/import-exrx-curated.js
// Script pour importer les exercices curés dans Supabase
// ⚠️ IMPORTANT: Utilise dotenv pour charger les clés depuis .env

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

// Base de données curée manuellement avec les meilleurs exercices
// Répartition: DOS(15), PECS(12), QUADS(12), ÉPAULES(10), ABDOS(10), ISCHIOS(8), FESSIERS(8), BICEPS(7), TRICEPS(7), MOLLETS(6), AVANT-BRAS(5)
const CURATED_EXERCISES = [
    // ═══════════════════════════════════════════════════════════
    // 🔴 DOS (15 exercices - 15%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Tractions (Pull-ups)',
        nameEn: 'Pull-ups',
        description: 'Suspendez-vous à une barre et tirez votre corps vers le haut jusqu\'à ce que votre menton dépasse la barre.',
        muscle: 'dos',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Rowing barre (Barbell Row)',
        nameEn: 'Barbell Row',
        description: 'Penchez-vous en avant avec une barre, tirez-la vers votre abdomen en gardant le dos droit.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Tirage vertical (Lat Pulldown)',
        nameEn: 'Lat Pulldown',
        description: 'Tirez une barre attachée à une poulie haute vers votre poitrine.',
        muscle: 'dos',
        equipment: 'Machine poulie',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Rowing haltère (Dumbbell Row)',
        nameEn: 'Dumbbell Row',
        description: 'Penchez-vous avec un haltère dans une main, tirez vers la hanche.',
        muscle: 'dos',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Soulevé de terre (Deadlift)',
        nameEn: 'Deadlift',
        description: 'Soulevez une barre du sol en gardant le dos droit et les jambes tendues.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Rowing T-bar',
        nameEn: 'T-Bar Row',
        description: 'Tirez une barre en T vers votre poitrine en position penchée.',
        muscle: 'dos',
        equipment: 'T-bar',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Face Pull',
        nameEn: 'Face Pull',
        description: 'Tirez une corde attachée à une poulie haute vers votre visage.',
        muscle: 'dos',
        equipment: 'Poulie',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Shrugs (Haussements d\'épaules)',
        nameEn: 'Shrugs',
        description: 'Levez vos épaules vers vos oreilles avec des haltères.',
        muscle: 'dos',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Rowing Pendlay',
        nameEn: 'Pendlay Row',
        description: 'Variante du rowing barre où vous posez la barre au sol entre chaque répétition.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Pull-over',
        nameEn: 'Pullover',
        description: 'Allongé sur un banc, abaissez un haltère derrière votre tête.',
        muscle: 'dos',
        equipment: 'Haltère',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Rowing machine',
        nameEn: 'Cable Row',
        description: 'Tirez un câble vers votre abdomen en position assise.',
        muscle: 'dos',
        equipment: 'Machine câble',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Superman',
        nameEn: 'Superman',
        description: 'Allongé sur le ventre, levez simultanément vos bras et jambes.',
        muscle: 'dos',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Good Morning',
        nameEn: 'Good Morning',
        description: 'Penchez-vous en avant avec une barre sur les épaules, puis redressez-vous.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Rowing inversé (Inverted Row)',
        nameEn: 'Inverted Row',
        description: 'Suspendez-vous sous une barre basse et tirez votre corps vers elle.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Hyperextensions',
        nameEn: 'Hyperextensions',
        description: 'Sur un banc à hyperextension, pliez et redressez votre torse.',
        muscle: 'dos',
        equipment: 'Banc hyperextension',
        category: 'equipment',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 💪 PECTORAUX (12 exercices - 12%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Développé couché (Bench Press)',
        nameEn: 'Bench Press',
        description: 'Allongé sur un banc, poussez une barre depuis votre poitrine jusqu\'à extension complète des bras.',
        muscle: 'pectoraux',
        equipment: 'Barre + Banc',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pompes (Push-ups)',
        nameEn: 'Push-ups',
        description: 'En position de planche, abaissez votre corps jusqu\'à ce que votre poitrine touche presque le sol, puis poussez.',
        muscle: 'pectoraux',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Développé incliné (Incline Bench Press)',
        nameEn: 'Incline Bench Press',
        description: 'Développé couché sur un banc incliné pour cibler le haut des pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Barre + Banc incliné',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Écarté haltères (Dumbbell Fly)',
        nameEn: 'Dumbbell Fly',
        description: 'Allongé sur un banc, écartez vos bras avec des haltères puis ramenez-les.',
        muscle: 'pectoraux',
        equipment: 'Haltères + Banc',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Dips pectoraux',
        nameEn: 'Chest Dips',
        description: 'Penchez-vous en avant sur des barres parallèles et descendez votre corps.',
        muscle: 'pectoraux',
        equipment: 'Barres parallèles',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Développé décliné (Decline Bench Press)',
        nameEn: 'Decline Bench Press',
        description: 'Développé couché sur un banc décliné pour cibler le bas des pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Barre + Banc décliné',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pec Deck (Machine)',
        nameEn: 'Pec Deck',
        description: 'Machine où vous rapprochez deux poignées devant votre poitrine.',
        muscle: 'pectoraux',
        equipment: 'Machine Pec Deck',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Cable Crossover',
        nameEn: 'Cable Crossover',
        description: 'Croisez deux câbles devant votre poitrine en position debout.',
        muscle: 'pectoraux',
        equipment: 'Poulie',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pompes diamant',
        nameEn: 'Diamond Push-ups',
        description: 'Pompes avec les mains rapprochées formant un diamant.',
        muscle: 'pectoraux',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Développé haltères (Dumbbell Press)',
        nameEn: 'Dumbbell Press',
        description: 'Développé couché avec des haltères au lieu d\'une barre.',
        muscle: 'pectoraux',
        equipment: 'Haltères + Banc',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pompes sur swiss ball',
        nameEn: 'Swiss Ball Push-ups',
        description: 'Pompes avec les mains ou les pieds sur un ballon suisse.',
        muscle: 'pectoraux',
        equipment: 'Swiss ball',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Landmine Press',
        nameEn: 'Landmine Press',
        description: 'Poussez une extrémité de barre fixée au sol devant vous.',
        muscle: 'pectoraux',
        equipment: 'Barre + Landmine',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🦵 QUADRICEPS (12 exercices - 12%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Squat (Back Squat)',
        nameEn: 'Back Squat',
        description: 'Descendez en position accroupie avec une barre sur les épaules.',
        muscle: 'quadriceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Front Squat',
        nameEn: 'Front Squat',
        description: 'Squat avec la barre devant, sur les épaules avant.',
        muscle: 'quadriceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Leg Press',
        nameEn: 'Leg Press',
        description: 'Poussez une plateforme avec vos jambes sur une machine.',
        muscle: 'quadriceps',
        equipment: 'Machine Leg Press',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Leg Extension',
        nameEn: 'Leg Extension',
        description: 'Étendez vos jambes contre une résistance en position assise.',
        muscle: 'quadriceps',
        equipment: 'Machine',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Fentes (Lunges)',
        nameEn: 'Lunges',
        description: 'Avancez une jambe et pliez les deux genoux en gardant le torse droit.',
        muscle: 'quadriceps',
        equipment: 'Haltères ou poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Bulgarian Split Squat',
        nameEn: 'Bulgarian Split Squat',
        description: 'Squat sur une jambe avec l\'autre pied surélevé derrière.',
        muscle: 'quadriceps',
        equipment: 'Banc',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Goblet Squat',
        nameEn: 'Goblet Squat',
        description: 'Squat en tenant un haltère ou kettlebell devant la poitrine.',
        muscle: 'quadriceps',
        equipment: 'Haltère/Kettlebell',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Hack Squat',
        nameEn: 'Hack Squat',
        description: 'Squat sur machine avec dos appuyé et poids sur épaules.',
        muscle: 'quadriceps',
        equipment: 'Machine Hack Squat',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pistol Squat',
        nameEn: 'Pistol Squat',
        description: 'Squat sur une jambe avec l\'autre tendue devant.',
        muscle: 'quadriceps',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Step-ups',
        nameEn: 'Step-ups',
        description: 'Montez sur une plateforme en alternant les jambes.',
        muscle: 'quadriceps',
        equipment: 'Banc/Box',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Sissy Squat',
        nameEn: 'Sissy Squat',
        description: 'Penchez-vous en arrière en descendant avec genoux en avant.',
        muscle: 'quadriceps',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Box Squat',
        nameEn: 'Box Squat',
        description: 'Squat en s\'asseyant brièvement sur une box/banc.',
        muscle: 'quadriceps',
        equipment: 'Barre + Box',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🔱 ÉPAULES (10 exercices - 10%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Développé militaire (Overhead Press)',
        nameEn: 'Overhead Press',
        description: 'Poussez une barre au-dessus de votre tête en position debout.',
        muscle: 'epaules',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Élévations latérales (Lateral Raises)',
        nameEn: 'Lateral Raises',
        description: 'Levez des haltères sur les côtés jusqu\'à hauteur d\'épaule.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations frontales (Front Raises)',
        nameEn: 'Front Raises',
        description: 'Levez des haltères devant vous jusqu\'à hauteur d\'épaule.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Oiseau (Reverse Fly)',
        nameEn: 'Reverse Fly',
        description: 'Penché en avant, écartez les haltères sur les côtés.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Arnold Press',
        nameEn: 'Arnold Press',
        description: 'Développé avec rotation des poignets, des haltères devant vers au-dessus.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Upright Row',
        nameEn: 'Upright Row',
        description: 'Tirez une barre le long de votre corps jusqu\'au menton.',
        muscle: 'epaules',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pike Push-ups',
        nameEn: 'Pike Push-ups',
        description: 'Pompes en position V inversée, ciblant les épaules.',
        muscle: 'epaules',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Handstand Push-ups',
        nameEn: 'Handstand Push-ups',
        description: 'Pompes en position poirier (contre un mur).',
        muscle: 'epaules',
        equipment: 'Mur',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Bradford Press',
        nameEn: 'Bradford Press',
        description: 'Alternez développé devant et derrière la nuque.',
        muscle: 'epaules',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Élévations Y',
        nameEn: 'Y Raises',
        description: 'Levez les bras en diagonale formant un Y.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🔥 ABDOMINAUX (10 exercices - 10%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Crunch',
        nameEn: 'Crunch',
        description: 'Allongé sur le dos, relevez vos épaules vers vos genoux.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Planche (Plank)',
        nameEn: 'Plank',
        description: 'Maintenez une position de planche sur les avant-bras.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Russian Twist',
        nameEn: 'Russian Twist',
        description: 'Assis, tournez le torse en touchant le sol de chaque côté.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun ou haltère',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Levées de jambes (Leg Raises)',
        nameEn: 'Leg Raises',
        description: 'Allongé, levez vos jambes tendues vers le plafond.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Mountain Climbers',
        nameEn: 'Mountain Climbers',
        description: 'En planche, amenez alternativement vos genoux vers la poitrine rapidement.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'cardio',
        difficulty: 'intermediate'
    },
    {
        name: 'Bicycle Crunch',
        nameEn: 'Bicycle Crunch',
        description: 'Allongé, amenez coude et genou opposés ensemble en pédalant.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Ab Wheel Rollout',
        nameEn: 'Ab Wheel Rollout',
        description: 'À genoux, roulez une roue abdominale devant vous.',
        muscle: 'abdominaux-obliques',
        equipment: 'Roue abdominale',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Hanging Knee Raises',
        nameEn: 'Hanging Knee Raises',
        description: 'Suspendu à une barre, levez vos genoux vers la poitrine.',
        muscle: 'abdominaux-obliques',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Dead Bug',
        nameEn: 'Dead Bug',
        description: 'Sur le dos, étendez bras et jambes opposés alternativement.',
        muscle: 'abdominaux-obliques',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Cable Crunch',
        nameEn: 'Cable Crunch',
        description: 'À genoux, tirez un câble vers le bas en contractant les abdos.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poulie',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🦵 ISCHIO-JAMBIERS (8 exercices - 8%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Leg Curl',
        nameEn: 'Leg Curl',
        description: 'Allongé ou assis, pliez vos jambes contre une résistance.',
        muscle: 'ischios-jambiers',
        equipment: 'Machine',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Romanian Deadlift (RDL)',
        nameEn: 'Romanian Deadlift',
        description: 'Penchez-vous en avant avec une barre, jambes presque tendues.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Nordic Curls',
        nameEn: 'Nordic Curls',
        description: 'À genoux, descendez lentement le torse vers l\'avant.',
        muscle: 'ischios-jambiers',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Good Morning',
        nameEn: 'Good Morning',
        description: 'Penchez-vous en avant avec barre sur épaules, puis redressez-vous.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Glute Ham Raise',
        nameEn: 'Glute Ham Raise',
        description: 'Sur machine GHR, descendez et remontez avec les ischios.',
        muscle: 'ischios-jambiers',
        equipment: 'Machine GHR',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Single Leg Deadlift',
        nameEn: 'Single Leg Deadlift',
        description: 'Soulevé de terre sur une jambe.',
        muscle: 'ischios-jambiers',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Kettlebell Swing',
        nameEn: 'Kettlebell Swing',
        description: 'Balancez un kettlebell entre vos jambes puis à hauteur d\'épaule.',
        muscle: 'ischios-jambiers',
        equipment: 'Kettlebell',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Stiff Leg Deadlift',
        nameEn: 'Stiff Leg Deadlift',
        description: 'Soulevé de terre jambes complètement tendues.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🍑 FESSIERS (8 exercices - 8%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Hip Thrust',
        nameEn: 'Hip Thrust',
        description: 'Dos appuyé sur banc, poussez hanches vers haut avec barre.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Barre + Banc',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Fentes bulgares (Bulgarian Split Squat)',
        nameEn: 'Bulgarian Split Squat',
        description: 'Squat sur une jambe avec l\'autre pied surélevé.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Banc',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Abduction hanche (Hip Abduction)',
        nameEn: 'Hip Abduction',
        description: 'Écartez une jambe sur le côté contre résistance.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Machine ou élastique',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Kickbacks',
        nameEn: 'Cable Kickbacks',
        description: 'Tendez jambe vers l\'arrière contre câble ou élastique.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Câble',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Fire Hydrant',
        nameEn: 'Fire Hydrant',
        description: 'À quatre pattes, levez une jambe pliée sur le côté.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Clamshell',
        nameEn: 'Clamshell',
        description: 'Sur le côté, ouvrez genoux comme une coquille.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Élastique',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Single Leg Hip Thrust',
        nameEn: 'Single Leg Hip Thrust',
        description: 'Hip thrust sur une jambe.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Banc',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Donkey Kicks',
        nameEn: 'Donkey Kicks',
        description: 'À quatre pattes, poussez un pied vers le plafond.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 💪 BICEPS (7 exercices - 7%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Curl barre (Barbell Curl)',
        nameEn: 'Barbell Curl',
        description: 'Pliez les coudes pour lever une barre vers vos épaules.',
        muscle: 'biceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl haltères (Dumbbell Curl)',
        nameEn: 'Dumbbell Curl',
        description: 'Pliez les coudes pour lever des haltères vers vos épaules.',
        muscle: 'biceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl marteau (Hammer Curl)',
        nameEn: 'Hammer Curl',
        description: 'Curl avec haltères en prise neutre (pouces vers le haut).',
        muscle: 'biceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl pupitre (Preacher Curl)',
        nameEn: 'Preacher Curl',
        description: 'Curl sur pupitre pour isoler les biceps.',
        muscle: 'biceps',
        equipment: 'Pupitre + Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Curl concentration',
        nameEn: 'Concentration Curl',
        description: 'Assis, curl avec un bras appuyé sur cuisse.',
        muscle: 'biceps',
        equipment: 'Haltère',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl 21s',
        nameEn: '21s Curl',
        description: '7 reps moitié basse + 7 reps moitié haute + 7 reps complètes.',
        muscle: 'biceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Curl câble (Cable Curl)',
        nameEn: 'Cable Curl',
        description: 'Curl avec poulie basse.',
        muscle: 'biceps',
        equipment: 'Poulie',
        category: 'equipment',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🔺 TRICEPS (7 exercices - 7%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Dips triceps',
        nameEn: 'Triceps Dips',
        description: 'Descendez corps entre barres parallèles, coudes vers arrière.',
        muscle: 'triceps',
        equipment: 'Barres parallèles',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Extension triceps couché (Skull Crushers)',
        nameEn: 'Skull Crushers',
        description: 'Allongé, abaissez barre vers front puis étendez.',
        muscle: 'triceps',
        equipment: 'Barre + Banc',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Extension triceps poulie (Cable Pushdown)',
        nameEn: 'Cable Pushdown',
        description: 'Poussez câble vers bas en gardant coudes fixes.',
        muscle: 'triceps',
        equipment: 'Poulie',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Kickback triceps',
        nameEn: 'Triceps Kickback',
        description: 'Penché, étendez avant-bras vers arrière.',
        muscle: 'triceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Extension nuque (Overhead Extension)',
        nameEn: 'Overhead Extension',
        description: 'Bras levés, abaissez haltère derrière tête.',
        muscle: 'triceps',
        equipment: 'Haltère',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pompes prise serrée (Close-Grip Push-ups)',
        nameEn: 'Close-Grip Push-ups',
        description: 'Pompes avec mains rapprochées.',
        muscle: 'triceps',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Développé couché prise serrée',
        nameEn: 'Close-Grip Bench Press',
        description: 'Développé couché avec prise étroite.',
        muscle: 'triceps',
        equipment: 'Barre + Banc',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🦵 MOLLETS (6 exercices - 6%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Mollets debout (Standing Calf Raise)',
        nameEn: 'Standing Calf Raise',
        description: 'Montez sur pointes de pieds en position debout.',
        muscle: 'mollets',
        equipment: 'Machine ou haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Mollets assis (Seated Calf Raise)',
        nameEn: 'Seated Calf Raise',
        description: 'Montez sur pointes de pieds en position assise.',
        muscle: 'mollets',
        equipment: 'Machine',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Mollets à la presse (Leg Press Calf Raise)',
        nameEn: 'Leg Press Calf Raise',
        description: 'Sur leg press, poussez avec pointes de pieds.',
        muscle: 'mollets',
        equipment: 'Machine Leg Press',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Mollets sur une jambe',
        nameEn: 'Single Leg Calf Raise',
        description: 'Mollets debout sur une jambe.',
        muscle: 'mollets',
        equipment: 'Aucun',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Sauts mollets (Calf Jumps)',
        nameEn: 'Calf Jumps',
        description: 'Sautez en utilisant principalement les mollets.',
        muscle: 'mollets',
        equipment: 'Aucun',
        category: 'cardio',
        difficulty: 'intermediate'
    },
    {
        name: 'Donkey Calf Raise',
        nameEn: 'Donkey Calf Raise',
        description: 'Penché en avant, montez sur pointes avec poids sur dos.',
        muscle: 'mollets',
        equipment: 'Banc + Partenaire',
        category: 'equipment',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🤜 AVANT-BRAS (5 exercices - 5%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Curl poignets (Wrist Curl)',
        nameEn: 'Wrist Curl',
        description: 'Avant-bras sur banc, pliez poignets vers haut.',
        muscle: 'avant-bras',
        equipment: 'Haltères + Banc',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Extension poignets (Reverse Wrist Curl)',
        nameEn: 'Reverse Wrist Curl',
        description: 'Avant-bras sur banc, étendez poignets vers haut.',
        muscle: 'avant-bras',
        equipment: 'Haltères + Banc',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Farmer\'s Walk',
        nameEn: 'Farmer\'s Walk',
        description: 'Marchez en tenant lourdes charges dans chaque main.',
        muscle: 'avant-bras',
        equipment: 'Haltères lourds',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Suspension barre (Dead Hang)',
        nameEn: 'Dead Hang',
        description: 'Suspendez-vous à une barre le plus longtemps possible.',
        muscle: 'avant-bras',
        equipment: 'Barre',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Pinces de préhension (Gripper)',
        nameEn: 'Gripper',
        description: 'Serrez un outil de préhension.',
        muscle: 'avant-bras',
        equipment: 'Gripper',
        category: 'equipment',
        difficulty: 'beginner'
    },
];

// Mapping muscles slug → ID Supabase
const MUSCLE_MAPPING = {
    'dos': null,
    'pectoraux': null,
    'quadriceps': null,
    'epaules': null,
    'abdominaux-obliques': null,
    'ischios-jambiers': null,
    'fessiers-abducteur-adducteur': null,
    'biceps': null,
    'triceps': null,
    'mollets': null,
    'avant-bras': null,
};

async function loadMuscleIds() {
    console.log('🔄 Chargement des IDs des muscles...\n');

    const { data: muscles, error } = await supabase
        .from('muscles')
        .select('id, slug');

    if (error) {
        console.error('❌ Erreur chargement muscles:', error);
        throw error;
    }

    muscles.forEach(muscle => {
        MUSCLE_MAPPING[muscle.slug] = muscle.id;
    });

    console.log('✅ Muscles chargés:', Object.keys(MUSCLE_MAPPING).length, '\n');
}

async function importExercises() {
    try {
        console.log('📥 IMPORT DES EXERCICES CURATED\n');
        console.log('═'.repeat(60), '\n');

        await loadMuscleIds();

        let successCount = 0;
        let errorCount = 0;

        for (const ex of CURATED_EXERCISES) {
            try {
                console.log(`🔄 Traitement de: ${ex.name}`);

                // Insérer l'exercice
                const { data: exercise, error: exError } = await supabase
                    .from('exercises')
                    .insert({
                        name: ex.name,
                        name_en: ex.nameEn,
                        description: ex.description,
                        equipment: ex.equipment,
                        category: ex.category,
                        difficulty: ex.difficulty,
                    })
                    .select()
                    .single();

                if (exError) throw exError;

                console.log(`   ✅ Exercice créé: ${exercise.name} (ID: ${exercise.id})`);

                // Créer la relation muscle primaire
                const muscleId = MUSCLE_MAPPING[ex.muscle];

                if (!muscleId) {
                    console.log(`   ⚠️  Muscle introuvable: ${ex.muscle}`);
                    continue;
                }

                const { error: relError } = await supabase
                    .from('muscle_exercises')
                    .insert({
                        muscle_id: muscleId,
                        exercise_id: exercise.id,
                        is_primary: true,
                    });

                if (relError) throw relError;

                console.log(`   💪 Relation muscle créée: ${ex.muscle} (primaire)\n`);

                successCount++;

            } catch (err) {
                console.error(`   ❌ Erreur: ${err.message}\n`);
                errorCount++;
            }
        }

        console.log('═'.repeat(60));
        console.log('\n🎉 IMPORT TERMINÉ !');
        console.log(`📊 ${successCount} exercices importés avec succès`);
        if (errorCount > 0) {
            console.log(`⚠️  ${errorCount} erreurs rencontrées`);
        }
        console.log('');

    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    }
}

// Lancer l'import
importExercises();