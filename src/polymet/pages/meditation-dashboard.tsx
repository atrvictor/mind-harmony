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
    <div className="relative">
      {/* Full-page background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ 
          // Ensure video doesn't interfere with audio
          isolation: 'isolate'
        }}
      >
        <source src="/drone for site.mp4" type="video/mp4" />
      </video>
      
      {/* Hide footer for this page */}
      <style>{`
        footer { display: none !important; }
      `}</style>
      
      {/* Content positioned at top */}
      <div className="relative z-10 pt-8 pb-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
            Welcome, {displayName}
          </h1>
          
          <h2 className="text-2xl font-semibold mb-6 text-white drop-shadow-lg">Grounding Breath Meditation</h2>
          <p className="text-lg text-white/90 drop-shadow mb-6 leading-relaxed">
            Find a comfortable seated position. Close your eyes and take a deep
            breath in through your nose, allowing your abdomen to expand. Slowly
            exhale through your mouth, releasing any tension. Continue this
            gentle breathing, focusing on the sensation of air entering and
            leaving your body. If your mind wanders, gently redirect your
            attention back to your breath.
          </p>
          <p className="text-lg text-white/90 drop-shadow leading-relaxed">
            After a few minutes, allow the piano music to guide you deeper
            into relaxation. Press play on the music player in the upper right 
            to hear the music. Feel free to browse around the website - the music 
            player will follow you on all pages.
          </p>
        </div>
      </div>
    </div>
  );
} 