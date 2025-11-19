import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Validation des variables d'environnement
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        'Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies dans le fichier .env'
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);