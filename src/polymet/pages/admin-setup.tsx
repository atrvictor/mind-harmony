import * as React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { setupProfilesTable, checkProfilesTable } from "@/lib/setupProfilesTable";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export default function AdminSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [setupLoading, setSetupLoading] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [tableExists, setTableExists] = React.useState<boolean | null>(null);

  // Load auth state directly from Supabase
  React.useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user;
        
        setUser(currentUser || null);
        
        if (!currentUser) {
          navigate("/login");
          return;
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [navigate]);

  // Only check table if user is loaded
  React.useEffect(() => {
    if (loading || !user) return;

    // Check if the profiles table exists
    async function checkTable() {
      try {
        console.log("Checking if profiles table exists...");
        const result = await checkProfilesTable();
        
        if (result.error) {
          const errorMsg = result.error && typeof result.error === 'object' 
            ? (result.error as any).message || 'Unknown error'
            : String(result.error);
            
          setErrorMessage(`Error checking profiles table: ${errorMsg}`);
        }
        
        setTableExists(result.exists);
      } catch (err: any) {
        console.error("Error in checkTable:", err);
        setErrorMessage(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
      }
    }

    checkTable();
  }, [user, loading]);

  const handleSetupTable = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSetupLoading(true);

    try {
      console.log("Starting table setup...");
      const result = await setupProfilesTable();
      
      if (result.success) {
        setTableExists(true);
        setSuccessMessage("Success! Profiles table has been set up.");
      } else if (result.error) {
        const errorMsg = typeof result.error === 'object' && result.error !== null
          ? (result.error as any).message || 'Unknown error'
          : String(result.error);
          
        console.error("Setup error:", result.error);
        setErrorMessage(`Error: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Setup exception:", err);
      setErrorMessage(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setSetupLoading(false);
      
      // Check again after setup attempt
      try {
        const result = await checkProfilesTable();
        setTableExists(result.exists);
      } catch (err) {
        console.error("Error checking table after setup:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Loading</h1>
        <p className="mb-6">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Setup</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Success</h2>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Profiles Table Setup</h2>
        
        <p className="mb-4">
          This will create the necessary database table for user profiles.
        </p>

        <div className="mb-6">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${
              tableExists === true ? 'bg-green-500' : 
              tableExists === false ? 'bg-red-500' : 
              'bg-gray-300'
            }`}></div>
            <span>Profiles Table: {
              tableExists === true ? 'Exists' : 
              tableExists === false ? 'Missing' : 
              'Checking...'
            }</span>
          </div>
        </div>

        <Button
          onClick={handleSetupTable}
          disabled={setupLoading || tableExists === true}
          className="w-full bg-[#1E3A5F] hover:bg-[#152A45]"
        >
          {setupLoading ? "Setting up..." : tableExists ? "Table already exists" : "Setup Profiles Table"}
        </Button>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Logged in as: {user?.email}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
} 