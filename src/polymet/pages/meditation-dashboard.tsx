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
          After a few minutes, allow the piano music below to guide you deeper
          into relaxation.
        </p>
      </article>

      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/2OEL4P1Rz04"
          title="Piano Meditation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
} 