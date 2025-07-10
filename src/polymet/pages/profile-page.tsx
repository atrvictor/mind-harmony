import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { checkProfilesTable } from "@/lib/setupProfilesTable";
import type { User } from "@supabase/supabase-js";

interface ProfileData {
  fullName: string;
  bio: string;
  preferredMeditationDuration: string;
  preferredMeditationTime: string;
  notificationPreference: boolean;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true); // Start with loading true
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState("");
  const [dbError, setDbError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [isTableSetup, setIsTableSetup] = React.useState(true);
  const [profileData, setProfileData] = React.useState<ProfileData>({
    fullName: "",
    bio: "",
    preferredMeditationDuration: "10",
    preferredMeditationTime: "morning",
    notificationPreference: true,
  });
  const [passwordResetStatus, setPasswordResetStatus] = React.useState<string>("");

  // Fetch the auth state only once during component mount
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (err) {
        console.error("Auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialAuthCheckComplete(true);
      }
    }
    
    checkAuth();
  }, []);

  // Only redirect to login if initial auth check is complete and user is null
  React.useEffect(() => {
    if (initialAuthCheckComplete && !user && !loading) {
      navigate("/login");
    }
  }, [initialAuthCheckComplete, user, navigate, loading]);

  // Fetch profile data after authentication is confirmed
  React.useEffect(() => {
    if (!user || !initialAuthCheckComplete) {
      return;
    }

    // Fetch user profile data
    async function fetchProfile() {
      setLoading(true);
      setDbError(""); // Clear previous DB errors
      setIsTableSetup(true); // Assume table is setup initially
      console.log(`[fetchProfile] Attempting to fetch profile for user ID: ${user?.id}`);

      try {
        // First check if the table exists using the imported utility
        const tableCheckResult = await checkProfilesTable();
        console.log("[fetchProfile] tableCheckResult:", tableCheckResult);
        
        if (tableCheckResult.error) {
          console.error("[fetchProfile] Error checking profiles table (via utility):", tableCheckResult.error);
          setDbError(`Database error: ${tableCheckResult.error.message || 'Failed to verify table status.'}`);
          setIsTableSetup(false);
          setLoading(false);
          return;
        }

        if (!tableCheckResult.exists) {
          console.log("[fetchProfile] Profiles table does not exist.");
          setIsTableSetup(false);
          setDbError("Profiles table has not been set up yet. Please visit the admin setup page.");
          setLoading(false);
          return;
        }
        
        console.log("[fetchProfile] Profiles table exists. Fetching profile now...");
        // If table exists, proceed to fetch profile
        let data = null;
        let profileError = null;
        if (user) {
          const result = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          data = result.data;
          profileError = result.error;
        }

        console.log("[fetchProfile] Raw fetch result - data:", data);
        console.log("[fetchProfile] Raw fetch result - profileError:", profileError);

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is fine, a new profile will be created on save
          console.error("[fetchProfile] Error fetching profile (and not PGRST116):", profileError);
          setError("Failed to load profile data. " + profileError.message);
        } else if (data) {
          console.log("[fetchProfile] Data found, setting profileData:", data);
          setProfileData({
            fullName: data.full_name || "",
            bio: data.bio || "",
            preferredMeditationDuration: data.preferred_meditation_duration || "10",
            preferredMeditationTime: data.preferred_meditation_time || "morning",
            notificationPreference: data.notification_preference !== null ? data.notification_preference : true,
          });
        } else {
          console.log("[fetchProfile] No data found (or error was PGRST116), profileData will use defaults.");
          // Explicitly ensure profileData is reset to defaults if no data is loaded
          // This helps if a previous state had data (e.g. from a failed optimistic update)
          setProfileData({
            fullName: "",
            bio: "",
            preferredMeditationDuration: "10",
            preferredMeditationTime: "morning",
            notificationPreference: true,
          });
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(`Error: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, initialAuthCheckComplete]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!user) {
        setError("You must be logged in to save your profile");
        return;
      }
      
      if (!isTableSetup) {
        setError("Cannot save profile - the profiles table is not set up");
        return;
      }
      
      // Update or insert profile
      const { error } = await supabase.from("profiles").upsert({
        user_id: user.id,
        full_name: profileData.fullName,
        bio: profileData.bio,
        preferred_meditation_duration: profileData.preferredMeditationDuration,
        preferred_meditation_time: profileData.preferredMeditationTime,
        notification_preference: profileData.notificationPreference,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }); // Use string for onConflict in supabase-js v2

      if (error) {
        if (error.code === '23505' || (error.message && error.message.includes('duplicate key value'))) {
          setError("There was a problem saving your profile. Please refresh and try again.");
        } else {
          setError(error.message || "Failed to update profile");
        }
        return;
      }

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Show loading indicator during initial auth check
  if (loading && !initialAuthCheckComplete) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Loading</h1>
        <p>Please wait while we load your profile...</p>
      </div>
    );
  }

  // Don't show the login prompt - let the redirect handle it
  
  if (dbError) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-amber-100 border border-amber-400 text-amber-800 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Database Setup Required</h2>
          <p className="mb-4">{dbError}</p>
          <Button asChild>
            <Link to="/admin/setup">Go to Admin Setup</Link>
          </Button>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Your Account Information</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-4">
        Your Profile
        {user?.email === "atrvictor@gmail.com" && (
          <Button asChild size="sm" variant="outline">
            <Link to="/admin">Admin</Link>
          </Button>
        )}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">
            Email address cannot be changed
          </p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={profileData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Tell us about yourself and your meditation journey"
          />
        </div>

        <div>
          <label htmlFor="preferredMeditationDuration" className="block text-sm font-medium mb-2">
            Preferred Meditation Duration (minutes)
          </label>
          <select
            id="preferredMeditationDuration"
            name="preferredMeditationDuration"
            value={profileData.preferredMeditationDuration}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredMeditationTime" className="block text-sm font-medium mb-2">
            Preferred Time of Day
          </label>
          <select
            id="preferredMeditationTime"
            name="preferredMeditationTime"
            value={profileData.preferredMeditationTime}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
            <option value="variable">Variable</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="notificationPreference"
            name="notificationPreference"
            type="checkbox"
            checked={profileData.notificationPreference}
            onChange={handleCheckboxChange}
            className="h-4 w-4 border-gray-300 rounded"
          />
          <label htmlFor="notificationPreference" className="ml-2 block text-sm">
            Receive meditation reminders and updates
          </label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#1E3A5F] hover:bg-[#152A45]"
            disabled={loading || !isTableSetup}
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>

      {user && (
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={async () => {
              setPasswordResetStatus("");
              const { error } = await supabase.auth.resetPasswordForEmail(user.email!);
              if (error) {
                setPasswordResetStatus("Failed to send password reset email: " + error.message);
              } else {
                setPasswordResetStatus("Password reset email sent! Please check your inbox.");
              }
            }}
          >
            Set Password
          </Button>
          {passwordResetStatus && (
            <p className="mt-2 text-sm text-muted-foreground">{passwordResetStatus}</p>
          )}
        </div>
      )}
    </div>
  );
} 