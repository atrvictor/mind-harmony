import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MeditationDashboard() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    async function fetchUserProfile() {
      if (user?.email) {
        const { data } = await supabase
          .from('user_profiles')
          .select('first_name')
          .eq('email', user.email)
          .single();
        
        if (data?.first_name) {
          setFirstName(data.first_name);
        }
      }
    }
    fetchUserProfile();
  }, [user?.email]);

  const displayName = firstName || user?.email?.split('@')[0] || "friend";

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {displayName}
      </h1>
      <article className="prose max-w-none mb-10">
        <h2>Grounding Breath Meditation</h2>
        <p>
          Find a comfortable seated position. Close your eyes and take a deep
          breath in through your nose, allowing your abdomen to expand. Slowly
          exhale through your mouth, releasing any tension. Continue this
          gentle breathing, focusing on the sensation of air entering and
          leaving your body. If your mind wanders, gently redirect your
          attention back to your breath.
        </p>
        <p>
          After a few minutes, allow the piano music to guide you deeper
          into relaxation. Press play on the music player in the upper right 
          to hear the music. Feel free to browse around the website - the music 
          player will follow you on all pages.
        </p>
      </article>

      {/* Subtle background video */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/drone for site.mp4" type="video/mp4" />
          {/* Fallback gradient if video fails to load */}
        </video>
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white drop-shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-sm font-medium">
              Let the music guide your meditation journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 