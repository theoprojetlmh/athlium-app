// scripts/import-exrx-curated.js
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const SUPABASE_URL = 'https://sbhqmofubnwdoocsywqs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaHFtb2Z1Ym53ZG9vY3N5d3FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUyNzk5MSwiZXhwIjoyMDc2MTAzOTkxfQ.oxb3DbRkevoCYjNSmDQK4g2PV4zCX2mm8A-OOyrmxmU';

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
        name: 'Soulevé de terre (Deadlift)',
        nameEn: 'Deadlift',
        description: 'Soulevez une barre du sol jusqu\'à la position debout en gardant le dos droit.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Tirage vertical (Lat Pulldown)',
        nameEn: 'Lat Pulldown',
        description: 'Assis, tirez une barre attachée à une poulie haute vers votre poitrine.',
        muscle: 'dos',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Rowing haltère un bras',
        nameEn: 'Single-Arm Dumbbell Row',
        description: 'Appuyé sur un banc, tirez un haltère vers votre hanche.',
        muscle: 'dos',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Rowing T-bar',
        nameEn: 'T-Bar Row',
        description: 'Penché en avant, tirez une barre en T vers votre poitrine.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Tirage horizontal (Seated Cable Row)',
        nameEn: 'Seated Cable Row',
        description: 'Assis, tirez une poignée attachée à une poulie basse vers votre abdomen.',
        muscle: 'dos',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Tractions supination (Chin-ups)',
        nameEn: 'Chin-ups',
        description: 'Tractions avec prise en supination (paumes vers vous).',
        muscle: 'dos',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Face Pull',
        nameEn: 'Face Pull',
        description: 'Tirez une corde attachée à une poulie haute vers votre visage.',
        muscle: 'dos',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Good Morning',
        nameEn: 'Good Morning',
        description: 'Avec une barre sur les épaules, penchez-vous en avant puis revenez.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Shrugs (Haussements d\'épaules)',
        nameEn: 'Barbell Shrugs',
        description: 'Haussez les épaules en tenant une barre ou des haltères.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Rowing haltères (Bent Over)',
        nameEn: 'Bent Over Dumbbell Row',
        description: 'Penché en avant, tirez deux haltères vers votre abdomen.',
        muscle: 'dos',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pendlay Row',
        nameEn: 'Pendlay Row',
        description: 'Rowing explosif où la barre touche le sol entre chaque répétition.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Hyperextensions',
        nameEn: 'Back Extension',
        description: 'Sur un banc à hyperextension, fléchissez puis étendez le bas du dos.',
        muscle: 'dos',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Inverted Row',
        nameEn: 'Inverted Row',
        description: 'Suspendu sous une barre basse, tirez votre poitrine vers la barre.',
        muscle: 'dos',
        equipment: 'Barre',
        category: 'calisthenics',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🔴 PECTORAUX (12 exercices - 12%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Développé couché (Bench Press)',
        nameEn: 'Bench Press',
        description: 'Allongé sur un banc, poussez une barre depuis votre poitrine jusqu\'à l\'extension complète.',
        muscle: 'pectoraux',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pompes (Push-ups)',
        nameEn: 'Push-ups',
        description: 'En position de planche, abaissez votre corps puis poussez pour remonter.',
        muscle: 'pectoraux',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Développé incliné',
        nameEn: 'Incline Bench Press',
        description: 'Développé couché sur banc incliné pour cibler le haut des pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Écartés haltères',
        nameEn: 'Dumbbell Flyes',
        description: 'Allongé, écartez puis rapprochez les haltères au-dessus de votre poitrine.',
        muscle: 'pectoraux',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Dips pour pectoraux',
        nameEn: 'Chest Dips',
        description: 'Entre deux barres parallèles, descendez puis poussez, corps penché en avant.',
        muscle: 'pectoraux',
        equipment: 'Barres parallèles',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Développé haltères',
        nameEn: 'Dumbbell Bench Press',
        description: 'Développé couché avec des haltères pour plus d\'amplitude.',
        muscle: 'pectoraux',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pompes diamant',
        nameEn: 'Diamond Push-ups',
        description: 'Pompes avec les mains rapprochées en forme de diamant.',
        muscle: 'pectoraux',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Cable Crossover',
        nameEn: 'Cable Crossover',
        description: 'Croisez les câbles devant vous pour contracter les pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Développé décliné',
        nameEn: 'Decline Bench Press',
        description: 'Développé couché sur banc décliné pour cibler le bas des pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pompes surélevées',
        nameEn: 'Feet Elevated Push-ups',
        description: 'Pompes avec les pieds surélevés pour plus de difficulté.',
        muscle: 'pectoraux',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Pec Deck (Butterfly)',
        nameEn: 'Pec Deck',
        description: 'Sur machine, rapprochez les poignées devant votre poitrine.',
        muscle: 'pectoraux',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pompes larges',
        nameEn: 'Wide Push-ups',
        description: 'Pompes avec les mains écartées pour cibler l\'extérieur des pectoraux.',
        muscle: 'pectoraux',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🔴 QUADRICEPS (12 exercices - 12%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Squat (Back Squat)',
        nameEn: 'Back Squat',
        description: 'Avec une barre sur les épaules, descendez en flexion puis remontez.',
        muscle: 'quadriceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Squat poids du corps',
        nameEn: 'Bodyweight Squat',
        description: 'Squat sans charge, idéal pour les débutants.',
        muscle: 'quadriceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Fentes (Lunges)',
        nameEn: 'Lunges',
        description: 'Avancez un pied et descendez en flexion, alternez les jambes.',
        muscle: 'quadriceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Presse à cuisses (Leg Press)',
        nameEn: 'Leg Press',
        description: 'Sur machine, poussez la plateforme avec vos pieds.',
        muscle: 'quadriceps',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Extension de jambes',
        nameEn: 'Leg Extension',
        description: 'Sur machine, étendez vos jambes contre une résistance.',
        muscle: 'quadriceps',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Squat goblet',
        nameEn: 'Goblet Squat',
        description: 'Squat en tenant un haltère ou kettlebell devant la poitrine.',
        muscle: 'quadriceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Squat avant (Front Squat)',
        nameEn: 'Front Squat',
        description: 'Squat avec la barre devant sur les épaules.',
        muscle: 'quadriceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'Bulgarian Split Squat',
        nameEn: 'Bulgarian Split Squat',
        description: 'Fentes avec le pied arrière surélevé sur un banc.',
        muscle: 'quadriceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Step-ups',
        nameEn: 'Step-ups',
        description: 'Montez sur un banc ou une box, alternez les jambes.',
        muscle: 'quadriceps',
        equipment: 'Banc',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Hack Squat',
        nameEn: 'Hack Squat',
        description: 'Squat sur machine hack squat.',
        muscle: 'quadriceps',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Squat sumo',
        nameEn: 'Sumo Squat',
        description: 'Squat avec écartement large des pieds.',
        muscle: 'quadriceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Pistol Squat',
        nameEn: 'Pistol Squat',
        description: 'Squat sur une jambe, l\'autre tendue devant.',
        muscle: 'quadriceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'advanced'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟡 ÉPAULES (10 exercices - 10%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Développé militaire',
        nameEn: 'Overhead Press',
        description: 'Debout, poussez une barre au-dessus de votre tête.',
        muscle: 'epaules',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Élévations latérales',
        nameEn: 'Lateral Raises',
        description: 'Levez les haltères sur les côtés jusqu\'à hauteur des épaules.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Développé haltères épaules',
        nameEn: 'Dumbbell Shoulder Press',
        description: 'Assis ou debout, poussez des haltères au-dessus de la tête.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations frontales',
        nameEn: 'Front Raises',
        description: 'Levez les haltères devant vous jusqu\'à hauteur des épaules.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Oiseau (Rear Delt Fly)',
        nameEn: 'Rear Delt Fly',
        description: 'Penché en avant, écartez les haltères sur les côtés.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Arnold Press',
        nameEn: 'Arnold Press',
        description: 'Développé avec rotation des poignets inventé par Arnold Schwarzenegger.',
        muscle: 'epaules',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Pike Push-ups',
        nameEn: 'Pike Push-ups',
        description: 'Pompes en position de V inversé pour cibler les épaules.',
        muscle: 'epaules',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Upright Row',
        nameEn: 'Upright Row',
        description: 'Tirez une barre le long de votre corps jusqu\'au menton.',
        muscle: 'epaules',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Handstand Push-ups',
        nameEn: 'Handstand Push-ups',
        description: 'Pompes en position de poirier contre un mur.',
        muscle: 'epaules',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Cable Lateral Raise',
        nameEn: 'Cable Lateral Raise',
        description: 'Élévations latérales avec câble pour tension constante.',
        muscle: 'epaules',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟡 ABDOMINAUX (10 exercices - 10%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Gainage (Plank)',
        nameEn: 'Plank',
        description: 'Maintenez une position de planche sur les avant-bras.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Crunch',
        nameEn: 'Crunch',
        description: 'Allongé sur le dos, contractez les abdominaux pour soulever le haut du corps.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations de jambes',
        nameEn: 'Leg Raises',
        description: 'Allongé, levez les jambes tendues vers le plafond.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Russian Twist',
        nameEn: 'Russian Twist',
        description: 'Assis, pivotez le torse de gauche à droite en tenant un poids.',
        muscle: 'abdominaux-obliques',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Mountain Climbers',
        nameEn: 'Mountain Climbers',
        description: 'En position de planche, ramenez alternativement les genoux vers la poitrine.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'cardio',
        difficulty: 'beginner'
    },
    {
        name: 'Bicycle Crunch',
        nameEn: 'Bicycle Crunch',
        description: 'Alternez coude et genou opposé en mouvement de pédalage.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Gainage latéral (Side Plank)',
        nameEn: 'Side Plank',
        description: 'Maintenez une position de planche sur le côté.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Hanging Knee Raises',
        nameEn: 'Hanging Knee Raises',
        description: 'Suspendu à une barre, levez les genoux vers la poitrine.',
        muscle: 'abdominaux-obliques',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Ab Wheel Rollout',
        nameEn: 'Ab Wheel Rollout',
        description: 'À genoux, roulez la roue abdominale vers l\'avant puis revenez.',
        muscle: 'abdominaux-obliques',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'advanced'
    },
    {
        name: 'V-ups',
        nameEn: 'V-ups',
        description: 'Allongé, levez simultanément jambes et torse pour former un V.',
        muscle: 'abdominaux-obliques',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟡 ISCHIO-JAMBIERS (8 exercices - 8%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Soulevé de terre roumain',
        nameEn: 'Romanian Deadlift',
        description: 'Soulevé de terre avec jambes peu fléchies pour cibler les ischios.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Leg Curl allongé',
        nameEn: 'Lying Leg Curl',
        description: 'Allongé sur le ventre, fléchissez les jambes contre une résistance.',
        muscle: 'ischios-jambiers',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Good Morning',
        nameEn: 'Good Morning',
        description: 'Penchez-vous en avant avec une barre sur les épaules.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Nordic Hamstring Curl',
        nameEn: 'Nordic Hamstring Curl',
        description: 'À genoux, abaissez votre corps vers l\'avant en contrôlant avec les ischios.',
        muscle: 'ischios-jambiers',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'advanced'
    },
    {
        name: 'Leg Curl assis',
        nameEn: 'Seated Leg Curl',
        description: 'Assis, fléchissez les jambes contre une résistance.',
        muscle: 'ischios-jambiers',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Soulevé de terre jambes tendues',
        nameEn: 'Stiff-Leg Deadlift',
        description: 'Soulevé de terre avec jambes presque tendues.',
        muscle: 'ischios-jambiers',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Single-Leg Romanian Deadlift',
        nameEn: 'Single-Leg Romanian Deadlift',
        description: 'Soulevé de terre roumain sur une jambe.',
        muscle: 'ischios-jambiers',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Glute-Ham Raise',
        nameEn: 'Glute-Ham Raise',
        description: 'Sur machine GHD, flexion-extension complète des ischios.',
        muscle: 'ischios-jambiers',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'advanced'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟡 FESSIERS (8 exercices - 8%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Hip Thrust',
        nameEn: 'Hip Thrust',
        description: 'Adossé à un banc, poussez les hanches vers le haut avec une barre.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Glute Bridge',
        nameEn: 'Glute Bridge',
        description: 'Allongé sur le dos, poussez les hanches vers le haut.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Fentes (Lunges)',
        nameEn: 'Lunges',
        description: 'Avancez un pied et descendez, excellent pour les fessiers.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Kickbacks câble',
        nameEn: 'Cable Kickbacks',
        description: 'Avec un câble à la cheville, poussez la jambe vers l\'arrière.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Abduction hanche machine',
        nameEn: 'Hip Abduction Machine',
        description: 'Écartez les jambes contre une résistance sur machine.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Donkey Kicks',
        nameEn: 'Donkey Kicks',
        description: 'À quatre pattes, poussez un talon vers le plafond.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Single-Leg Hip Thrust',
        nameEn: 'Single-Leg Hip Thrust',
        description: 'Hip thrust sur une jambe pour plus d\'intensité.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Fire Hydrant',
        nameEn: 'Fire Hydrant',
        description: 'À quatre pattes, levez un genou sur le côté.',
        muscle: 'fessiers-abducteur-adducteur',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟢 BICEPS (7 exercices - 7%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Curl biceps barre',
        nameEn: 'Barbell Curl',
        description: 'Debout, fléchissez les avant-bras en tenant une barre.',
        muscle: 'biceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl haltères',
        nameEn: 'Dumbbell Curl',
        description: 'Fléchissez les avant-bras avec des haltères.',
        muscle: 'biceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl marteau',
        nameEn: 'Hammer Curl',
        description: 'Curl avec les paumes face à face.',
        muscle: 'biceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl au pupitre',
        nameEn: 'Preacher Curl',
        description: 'Curl avec les bras appuyés sur un pupitre.',
        muscle: 'biceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl concentration',
        nameEn: 'Concentration Curl',
        description: 'Assis, curl avec un haltère, coude appuyé sur la cuisse.',
        muscle: 'biceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Curl câble',
        nameEn: 'Cable Curl',
        description: 'Curl avec câble pour tension constante.',
        muscle: 'biceps',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Tractions supination',
        nameEn: 'Chin-ups',
        description: 'Tractions prise supination, excellent pour les biceps.',
        muscle: 'biceps',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟢 TRICEPS (7 exercices - 7%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Dips triceps',
        nameEn: 'Tricep Dips',
        description: 'Entre deux barres, descendez puis poussez, corps droit.',
        muscle: 'triceps',
        equipment: 'Barres parallèles',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Extension triceps allongé',
        nameEn: 'Lying Tricep Extension',
        description: 'Allongé, étendez les bras en tenant une barre au-dessus de la tête.',
        muscle: 'triceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pushdown triceps',
        nameEn: 'Tricep Pushdown',
        description: 'Poussez une barre ou corde vers le bas avec un câble.',
        muscle: 'triceps',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Extension triceps haltère',
        nameEn: 'Overhead Dumbbell Extension',
        description: 'Debout ou assis, étendez un haltère au-dessus de la tête.',
        muscle: 'triceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Développé prise serrée',
        nameEn: 'Close-Grip Bench Press',
        description: 'Développé couché avec les mains rapprochées.',
        muscle: 'triceps',
        equipment: 'Barre',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Kickback triceps',
        nameEn: 'Tricep Kickback',
        description: 'Penché en avant, étendez le bras vers l\'arrière.',
        muscle: 'triceps',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Pompes diamant',
        nameEn: 'Diamond Push-ups',
        description: 'Pompes mains rapprochées, excellent pour triceps.',
        muscle: 'triceps',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟢 MOLLETS (6 exercices - 6%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Élévations mollets debout',
        nameEn: 'Standing Calf Raise',
        description: 'Debout, montez sur la pointe des pieds.',
        muscle: 'mollets',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations mollets assis',
        nameEn: 'Seated Calf Raise',
        description: 'Assis, montez sur la pointe des pieds avec poids sur les genoux.',
        muscle: 'mollets',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations mollets poids du corps',
        nameEn: 'Bodyweight Calf Raise',
        description: 'Élévations de mollets sans charge.',
        muscle: 'mollets',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Élévations mollets une jambe',
        nameEn: 'Single-Leg Calf Raise',
        description: 'Élévations sur une jambe pour plus d\'intensité.',
        muscle: 'mollets',
        equipment: 'Poids du corps',
        category: 'calisthenics',
        difficulty: 'intermediate'
    },
    {
        name: 'Donkey Calf Raise',
        nameEn: 'Donkey Calf Raise',
        description: 'Penché en avant avec poids sur le bas du dos, élévations de mollets.',
        muscle: 'mollets',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'intermediate'
    },
    {
        name: 'Jump Rope (Corde à sauter)',
        nameEn: 'Jump Rope',
        description: 'Sautez à la corde, excellent pour les mollets.',
        muscle: 'mollets',
        equipment: 'Aucun',
        category: 'cardio',
        difficulty: 'beginner'
    },

    // ═══════════════════════════════════════════════════════════
    // 🟢 AVANT-BRAS (5 exercices - 5%)
    // ═══════════════════════════════════════════════════════════
    {
        name: 'Wrist Curl',
        nameEn: 'Wrist Curl',
        description: 'Assis, avant-bras sur les cuisses, fléchissez les poignets.',
        muscle: 'avant-bras',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Reverse Wrist Curl',
        nameEn: 'Reverse Wrist Curl',
        description: 'Wrist curl avec paumes vers le bas.',
        muscle: 'avant-bras',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Farmer\'s Walk',
        nameEn: 'Farmer\'s Walk',
        description: 'Marchez en tenant des poids lourds dans chaque main.',
        muscle: 'avant-bras',
        equipment: 'Haltères',
        category: 'equipment',
        difficulty: 'beginner'
    },
    {
        name: 'Dead Hang',
        nameEn: 'Dead Hang',
        description: 'Suspendez-vous à une barre aussi longtemps que possible.',
        muscle: 'avant-bras',
        equipment: 'Barre de traction',
        category: 'calisthenics',
        difficulty: 'beginner'
    },
    {
        name: 'Plate Pinch',
        nameEn: 'Plate Pinch',
        description: 'Tenez un disque de poids entre le pouce et les doigts.',
        muscle: 'avant-bras',
        equipment: 'Appareil',
        category: 'equipment',
        difficulty: 'intermediate'
    },
];

async function importCuratedExercises() {
    console.log('🚀 IMPORT EXERCICES CURÉS AVEC RÉPARTITION IDÉALE\n');
    console.log('═'.repeat(70));
    console.log('📊 RÉPARTITION:');
    console.log('  DOS: 15 | PECS: 12 | QUADS: 12 | ÉPAULES: 10 | ABDOS: 10');
    console.log('  ISCHIOS: 8 | FESSIERS: 8 | BICEPS: 7 | TRICEPS: 7');
    console.log('  MOLLETS: 6 | AVANT-BRAS: 5');
    console.log('═'.repeat(70) + '\n');

    try {
        // 1. Récupérer les muscles
        const { data: muscles, error: musclesError } = await supabase
            .from('muscles')
            .select('id, slug');

        if (musclesError) throw musclesError;

        const muscleMap = {};
        muscles.forEach(m => {
            muscleMap[m.slug] = m.id;
        });

        console.log(`✅ ${muscles.length} muscles chargés\n`);

        // 2. Importer les exercices
        let imported = 0;
        let failed = 0;
        const stats = {};

        for (const ex of CURATED_EXERCISES) {
            try {
                // Stats
                if (!stats[ex.muscle]) stats[ex.muscle] = 0;

                // Créer l'exercice
                const exerciseData = {
                    name: ex.name,
                    description: ex.description,
                    difficulty: ex.difficulty,
                    equipment: ex.equipment,
                    category: ex.category,
                    instructions: ex.description,
                    image_url: null,
                    video_url: null,
                };

                const { data: insertedExercise, error: insertError } = await supabase
                    .from('exercises')
                    .insert(exerciseData)
                    .select()
                    .single();

                if (insertError) {
                    console.error(`❌ "${ex.name}":`, insertError.message);
                    failed++;
                    continue;
                }

                // Associer au muscle
                const muscleId = muscleMap[ex.muscle];
                if (muscleId) {
                    const { error: relError } = await supabase
                        .from('muscle_exercises')
                        .insert({
                            muscle_id: muscleId,
                            exercise_id: insertedExercise.id,
                            is_primary: true,
                        });

                    if (relError) {
                        console.error(`❌ Relation muscle:`, relError.message);
                    }
                }

                imported++;
                stats[ex.muscle]++;
                console.log(`✅ ${imported}. ${ex.name} [${ex.category}] [${ex.difficulty}]`);

            } catch (error) {
                console.error(`❌ Erreur ${ex.name}:`, error.message);
                failed++;
            }
        }

        console.log('\n' + '═'.repeat(70));
        console.log('🎉 IMPORT TERMINÉ !');
        console.log('═'.repeat(70) + '\n');
        console.log(`✅ Importés: ${imported}`);
        console.log(`❌ Échoués: ${failed}\n`);

        console.log('📊 RÉPARTITION FINALE:\n');
        const muscleLabels = {
            'dos': 'Dos',
            'pectoraux': 'Pectoraux',
            'quadriceps': 'Quadriceps',
            'epaules': 'Épaules',
            'abdominaux-obliques': 'Abdominaux',
            'ischios-jambiers': 'Ischio-jambiers',
            'fessiers-abducteur-adducteur': 'Fessiers',
            'biceps': 'Biceps',
            'triceps': 'Triceps',
            'mollets': 'Mollets',
            'avant-bras': 'Avant-bras',
        };

        for (const [slug, label] of Object.entries(muscleLabels)) {
            const count = stats[slug] || 0;
            const bar = '█'.repeat(count);
            console.log(`${label.padEnd(20)} : ${count.toString().padStart(2)} ${bar}`);
        }

        console.log('\n✅ BASE DE DONNÉES PRÊTE ! 🎉\n');

    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
    }
}

importCuratedExercises();