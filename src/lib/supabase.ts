import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gqfcfzlwadqpgiqlkggp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZmNmemx3YWRxcGdpcWxrZ2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxMDM4NDgsImV4cCI6MjAzNTY3OTg0OH0.jUq2_5q5fLdYQ3n5jN2N33Y_692-l_2Kj9fTf_ATtMc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
