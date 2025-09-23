import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqfcfzlwadqpgiqlkggp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmNmemx3YWRxcGdpcWxrZ2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxMDM4NDgsImV4cCI6MjAzNTY3OTg0OH0.jUq2_5q5fLdYQ3n5jN2N33Y_692-l_2Kj9fTf_ATtMc';
// The service role key is needed for admin-level operations like creating users.
// IMPORTANT: This key has admin privileges and should be kept secret.
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmNmemx3YWRxcGdpcWxrZ2dwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMDEwMzg0OCwiZXhwIjoyMDM1Njc5ODQ4fQ.5m44GR5Lq3Oa93aMo5q1x3yqD5yDq-Iq2T3m-3sXp8Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a separate admin client that uses the service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
