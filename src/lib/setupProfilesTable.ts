import { supabase } from "./supabase";

// SupabaseErrorLike - a simplified interface for error objects from Supabase
interface SupabaseErrorLike {
  message: string;
  code?: string; // code is not always present, e.g. for network errors
  details?: string;
  hint?: string;
}

/**
 * Sets up the profiles table in Supabase using the execute_sql helper RPC function.
 * This function should be created in your Supabase SQL Editor:
 * CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
 * RETURNS VOID AS $$
 * BEGIN
 *   EXECUTE sql_query;
 * END;
 * $$ LANGUAGE plpgsql;
 */
export async function setupProfilesTable(): Promise<{ success: boolean; error?: SupabaseErrorLike | null }> {
  try {
    console.log("Starting profiles table setup via execute_sql RPC...");

    const query = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename  = 'profiles') THEN
          CREATE TABLE public.profiles (
            id SERIAL PRIMARY KEY, user_id UUID NOT NULL, full_name TEXT, bio TEXT,
            preferred_meditation_duration TEXT, preferred_meditation_time TEXT,
            notification_preference BOOLEAN DEFAULT TRUE, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
          );
          RAISE NOTICE 'Table public.profiles created.';
        ELSE RAISE NOTICE 'Table public.profiles already exists.';
        END IF;
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_indexes WHERE schemaname = 'public' AND indexname = 'profiles_user_id_idx') THEN
          CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
          RAISE NOTICE 'Index profiles_user_id_idx created.';
        ELSE RAISE NOTICE 'Index profiles_user_id_idx already exists.';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_class where relname='profiles' AND relrowsecurity) THEN
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
            RAISE NOTICE 'RLS enabled for public.profiles.';
        ELSE RAISE NOTICE 'RLS already enabled for public.profiles.';
        END IF;
        DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Policy "Users can view own profile" created.';
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Policy "Users can update own profile" created.';
        DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Policy "Users can insert own profile" created.';
      END
      $$;
    `;

    const { error } = await supabase.rpc('execute_sql', { sql_query: query });

    if (error) {
      const typedError = error as SupabaseErrorLike;
      if (typedError.message && typedError.message.includes('function public.execute_sql(sql_query => text) does not exist')) {
        const helperFunctionSQL = "CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT) RETURNS VOID AS $$ BEGIN EXECUTE sql_query; END; $$ LANGUAGE plpgsql;";
        console.error(`IMPORTANT: Helper 'execute_sql' function missing. Please create it in your Supabase SQL Editor: ${helperFunctionSQL}`);
        throw new Error(`DB setup function 'execute_sql' missing. Original error: ${typedError.message}`);
      }
      console.error(`Error executing setup SQL via RPC: ${typedError.message}`);
      throw typedError;
    }
    
    console.log("Profiles table and policies setup successfully attempted!");
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Overall error in setupProfilesTable: ${error.message || String(error)}`);
    return { success: false, error: { message: String(error.message || String(error)), code: String(error.code) } as SupabaseErrorLike };
  }
}

/**
 * Checks if the profiles table exists by direct query only (no information_schema).
 */
async function checkTableExistsByDirectQuery(): Promise<{ exists: boolean; error?: SupabaseErrorLike | null }> {
  try {
    console.log("Checking 'profiles' table existence by direct query...");
    const { error, status, count } = await supabase
      .from('profiles')
      .select('id', { head: true, count: 'exact' })
      .limit(1);

    if (error) {
      const typedError = error as SupabaseErrorLike;
      console.warn(`Direct query to profiles table failed. Status: ${status}, Code: ${typedError.code}, Message: ${typedError.message}, Details: ${typedError.details}, Hint: ${typedError.hint}`);
      const tableNotFoundErrors = ['42P01']; // PostgreSQL error code for "undefined_table"
      const isRelationDoesNotExistError = typedError.message && typedError.message.toLowerCase().includes('relation "public.profiles" does not exist');
      if ((typedError.code && tableNotFoundErrors.includes(typedError.code)) || isRelationDoesNotExistError) {
        console.log("Confirmed profiles table does not exist (42P01 or relation not found).");
        return { exists: false, error: null };
      }
      return { exists: false, error: typedError };
    }
    console.log(`Direct query to profiles table successful. Status: ${status}, Count: ${count}`);
    return { exists: true, error: null };
  } catch (catchError: any) {
    console.error(`Exception during direct query: ${catchError.message}`);
    return { exists: false, error: { message: String(catchError.message), code: String(catchError.code) } as SupabaseErrorLike };
  }
}

export async function checkProfilesTable(): Promise<{ exists: boolean; error?: SupabaseErrorLike | null }> {
  // Only use the direct query method
  return await checkTableExistsByDirectQuery();
} 