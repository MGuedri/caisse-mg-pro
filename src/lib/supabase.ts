
import { createClient } from '@supabase/supabase-js'

// These values are now placeholders as the app will use local mock data.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey)

export const createSupabaseAdmin = () => {
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseServiceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    }
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
