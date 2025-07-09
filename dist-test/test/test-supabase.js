// Test script for Supabase connection (TypeScript)
import { supabase } from '../lib/supabase.js';
async function testSupabaseConnection() {
    console.log('=== Testing Supabase Connection ===');
    // @ts-ignore
    console.log('URL:', supabase.supabaseUrl);
    try {
        // Test authentication service
        console.log('Testing auth service...');
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('❌ Auth service error:', authError);
            return false;
        }
        console.log('✅ Auth service connection: SUCCESS');
        console.log('Session data:', authData.session ? 'Active session exists' : 'No active session');
        // Test database with a simple query
        console.log('\nTesting database connection...');
        try {
            // First try to list all tables to test basic connectivity
            const { data: tablesData, error: tablesError } = await supabase
                .from('pg_catalog.pg_tables')
                .select('schemaname, tablename')
                .eq('schemaname', 'public')
                .limit(5);
            if (tablesError) {
                if (tablesError.code === '42501') { // Permission denied
                    console.log('⚠️ Permission issue with pg_catalog - expected for public access');
                }
                else {
                    console.error('❌ Tables query error:', tablesError);
                }
            }
            else {
                console.log('✅ Tables query successful:', tablesData);
            }
            // Try profiles table
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .limit(1);
            if (profilesError) {
                if (profilesError.code === '42P01' || profilesError.message.includes('relation "profiles" does not exist')) {
                    console.log('⚠️ profiles table does not exist yet (expected if not set up)');
                }
                else {
                    console.error('❌ Profiles query error:', profilesError);
                    return false;
                }
            }
            else {
                console.log('✅ profiles table exists');
            }
            console.log('✅ Database connection tests complete');
            return true;
        }
        catch (dbError) {
            console.error('❌ Database query exception:', dbError);
            return false;
        }
    }
    catch (error) {
        console.error('❌ Unexpected error testing connection:', error);
        return false;
    }
}
// Run the test
testSupabaseConnection()
    .then(success => {
    console.log('\n=== Connection Test Complete ===');
    console.log('Overall result:', success ? '✅ SUCCESS' : '❌ FAILED');
    process.exit(success ? 0 : 1);
})
    .catch(error => {
    console.error('❌ Test failed with exception:', error);
    process.exit(1);
});
