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
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-page background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/drone for site.mp4" type="video/mp4" />
      </video>
      
      {/* Content overlay */}
      <div className="relative z-10 max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Welcome, {displayName}
        </h1>
        <article className="prose max-w-none mb-10 text-white">
          <h2 className="text-white">Grounding Breath Meditation</h2>
          <p className="text-white/90">
            Find a comfortable seated position. Close your eyes and take a deep
            breath in through your nose, allowing your abdomen to expand. Slowly
            exhale through your mouth, releasing any tension. Continue this
            gentle breathing, focusing on the sensation of air entering and
            leaving your body. If your mind wanders, gently redirect your
            attention back to your breath.
          </p>
          <p className="text-white/90">
            After a few minutes, allow the piano music to guide you deeper
            into relaxation. Press play on the music player in the upper right 
            to hear the music. Feel free to browse around the website - the music 
            player will follow you on all pages.
          </p>
        </article>
      </div>
    </div>
  );
} 