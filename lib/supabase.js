import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par les tiennes
// REMOVED: Hardcoded URL
// REMOVED: Hardcoded KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);