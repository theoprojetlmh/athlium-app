import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par les tiennes
const SUPABASE_URL = 'https://sbhqmofubnwdoocsywqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaHFtb2Z1Ym53ZG9vY3N5d3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDk0NTksImV4cCI6MjA3Njg4NTQ1OX0.UNFnbQLBMf6B9DUhdCGx2PxTgoH0FVtOq7BIJ-O1tug';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);