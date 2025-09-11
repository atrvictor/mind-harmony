import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function MeditationDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);

  // Play button handler (defined outside useEffect so it's accessible in JSX)
  const handlePlayButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const video = videoRef.current;
    if (!video) {
      console.log('No video element found');
      return;
    }

    console.log('Play button clicked, video state:', {
      paused: video.paused,
      readyState: video.readyState,
      currentTime: video.currentTime,
      duration: video.duration
    });

    try {
      // Reset video and try to play
      video.currentTime = 0;
      await video.play();
      console.log('Manual play successful');
      setShowPlayButton(false);
    } catch (error) {
      console.error('Manual play failed:', error);
      
      // Try alternative approach: load and play
      try {
        video.load();
        await new Promise(resolve => setTimeout(resolve, 500));
        await video.play();
        console.log('Manual play with reload successful');
        setShowPlayButton(false);
      } catch (retryError) {
        console.error('Manual play retry failed:', retryError);
        alert('Unable to play video. Please try refreshing the page or check your network connection.');
      }
    }
  };

  // Handle authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Enhanced video autoplay handling for mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playAttempted = false;

    const attemptPlayWithRetries = async () => {
      if (playAttempted) return;
      playAttempted = true;

      try {
        // Reset video to beginning
        video.currentTime = 0;
        
        // More aggressive play attempts with varying delays
        for (let i = 0; i < 5; i++) {
          try {
            await video.play();
            console.log(`Video started playing (attempt ${i + 1})`);
            setShowPlayButton(false);
            return; // Success!
          } catch (playError) {
            console.log(`Play attempt ${i + 1} failed:`, playError);
            // Progressive delays: 100ms, 300ms, 800ms, 1500ms
            const delays = [100, 300, 800, 1500];
            if (i < delays.length) {
              await new Promise(resolve => setTimeout(resolve, delays[i]));
            }
          }
        }
        
        // If all attempts failed, show play button
        console.log('All autoplay attempts failed, showing play button');
        setShowPlayButton(true);
      } catch (error) {
        console.log('Video autoplay completely failed:', error);
        setShowPlayButton(true);
      }
    };

    const handleUserInteraction = () => {
      // Try to play video on any user interaction
      if (video.paused) {
        attemptPlayWithRetries();
      }
    };

    // Use the outer handlePlayButtonClick function

    // Multiple triggers for video play attempts
    const triggers = [
      'loadeddata',
      'canplay', 
      'canplaythrough',
      'loadedmetadata'
    ];

    triggers.forEach(event => {
      video.addEventListener(event, attemptPlayWithRetries);
    });

    // Try immediately if video is already ready
    if (video.readyState >= 2) {
      setTimeout(attemptPlayWithRetries, 100);
    }

    // Additional immediate attempt (for refresh scenarios)
    setTimeout(() => {
      if (video.paused) {
        playAttempted = false;
        attemptPlayWithRetries();
      }
    }, 1000);

    // Final check - if video still isn't playing after 3 seconds, show play button
    setTimeout(() => {
      if (video.paused) {
        console.log('Video still paused after 3 seconds, showing play button');
        setShowPlayButton(true);
      }
    }, 3000);

    // Try to play on user interactions (helps with iOS restrictions)
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('scroll', handleUserInteraction, { once: true });

    // Additional trigger for page visibility changes (helps with refresh scenarios)
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        playAttempted = false;
        setTimeout(attemptPlayWithRetries, 200);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      triggers.forEach(event => {
        video.removeEventListener(event, attemptPlayWithRetries);
      });
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

  // Show loading state while authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }



  const displayName = firstName || user?.email?.split('@')[0] || "friend";

  return (
    <div className="relative welcome-page">
      {/* Full-page background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="fixed inset-0 w-full h-full object-cover z-0"
        onLoadedData={() => {
          // Additional attempt when video data is loaded
          if (videoRef.current) {
            videoRef.current.play().catch(console.log);
          }
        }}
        onCanPlay={() => {
          // Another attempt when video can play
          if (videoRef.current) {
            videoRef.current.play().catch(console.log);
          }
        }}
      >
        <source src="/drone for site.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback play button for mobile */}
      {showPlayButton && (
        <div className="fixed inset-0 z-20 bg-black/30 flex items-center justify-center">
          <button
            onClick={handlePlayButtonClick}
            className="bg-white/95 hover:bg-white text-gray-800 rounded-full p-8 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              minWidth: '80px',
              minHeight: '80px',
              touchAction: 'manipulation'
            }}
            aria-label="Play background video"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-sm opacity-80">Tap to play video</p>
          </div>
        </div>
      )}
      
      {/* Content positioned at top */}
      <div className="relative z-10 pt-8 pb-16 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
            Welcome, {displayName}
          </h1>
          
          <h2 className="text-2xl font-semibold mb-6 text-white drop-shadow-lg">Grounding Breath Meditation</h2>
          <p className="text-lg text-white/90 drop-shadow leading-relaxed">
            Press play on the music player above to hear the music. Find a comfortable seated position. Close your eyes and take a deep breath in through your nose, allowing your abdomen to expand. Slowly exhale through your mouth, releasing any tension. Continue this gentle breathing, focusing on the sensation of air entering and leaving your body. If your mind wanders, gently redirect your attention back to your breath. After a few minutes, allow the piano music to guide you deeper into relaxation.
          </p>
        </div>
      </div>
    </div>
  );
} 