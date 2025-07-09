import { createClient } from "@supabase/supabase-js";

// The .env file appears to be empty (0 bytes), so let's use the values directly for now
const supabaseUrl = "https://zhdltlfzdybadlmgmlqa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZGx0bGZ6ZHliYWRsbWdtbHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTcwOTAsImV4cCI6MjA2MjQ5MzA5MH0.SwmR40lP37sAMAGY_zalYBUlkTqDpIKtwky78KchbKs";

// For debugging
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey.substring(0, 10) + "...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 