import FixedNavigationMenu from "@/polymet/components/fixed-navigation-menu";
import AudioPlayer from "@/polymet/components/audio-player";
import Footer from "@/polymet/components/footer";
// import { MusicIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface MainLayoutProps {
  children: ReactNode;
  user: User | null;
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  const location = useLocation();
  const adminEmails = ["atrvictor@gmail.com", "mashashen@yahoo.com"]; 
  const isAdmin = !!(user && user.email && adminEmails.includes(user.email));
  
  // Check if we're on special pages to hide footer
  const isWelcomePage = location.pathname === '/welcome';
  const isFriendGiftPage = location.pathname === '/friend';
  const [hasMusic, setHasMusic] = useState(() => {
    // Initialize from localStorage to prevent state changes
    return localStorage.getItem('mh_has_music') === 'true';
  });
  
  // State for controlling music player visibility on friend page
  const [showMusicPlayerOnFriendGift, setShowMusicPlayerOnFriendGift] = useState(false);

  // Listen for custom event to show music player on friend page
  useEffect(() => {
    const handleShowMusicPlayer = () => {
      if (isFriendGiftPage) {
        setShowMusicPlayerOnFriendGift(true);
      }
    };

    window.addEventListener('mh:show-music-player', handleShowMusicPlayer);
    return () => window.removeEventListener('mh:show-music-player', handleShowMusicPlayer);
  }, [isFriendGiftPage]);

  // Full 4-song playlist for welcome page members
  const fullTracks = [
    { src: "/audio/Felt%20Before%20Whisper.mp3", title: "Before Whisper Vitiá Kulish" },
    { src: "/audio/Felt%20Whispering%20Heart.mp3", title: "Whispering Heart Vitiá Kulish" },
    { src: "/audio/Felt%20Before%20Kindred.mp3", title: "Before Kindred Vitiá Kulish" },
    { src: "/audio/Kindred%20Spirit%20Felt.mp3", title: "Kindred Spirit Vitiá Kulish" },
  ];

  // 2-song playlist for friend page (anonymous access)
  const friendTracks = [
    { src: "/audio/Felt%20Before%20Kindred.mp3", title: "Before Kindred Vitiá Kulish" },
    { src: "/audio/Kindred%20Spirit%20Felt.mp3", title: "Kindred Spirit Vitiá Kulish" },
  ];

  // Determine which track array to use
  const trackArray = isFriendGiftPage ? friendTracks : fullTracks;
  const maxTracks = trackArray.length;

  const [trackIndex, setTrackIndex] = useState(() => {
    // Persist track index in localStorage, but reset if switching between friend and other pages
    const saved = localStorage.getItem('mh_track_index');
    const savedPage = localStorage.getItem('mh_current_page');
    
    // Reset index if switching between friend and other pages
    if (savedPage !== location.pathname) {
      console.log(`🎵 Page changed from ${savedPage} to ${location.pathname}, resetting to track 0`);
      localStorage.setItem('mh_current_page', location.pathname);
      localStorage.setItem('mh_track_index', '0');
      return 0;
    }
    
    return saved ? Math.max(0, Math.min(parseInt(saved, 10), maxTracks - 1)) : 0;
  });
  
  // Determine current track and access level
  let currentTrack;
  let showPrevNext = false;
  
  if (isFriendGiftPage) {
    // Friend gift page: 2 songs, no login required
    currentTrack = friendTracks[trackIndex];
    showPrevNext = true;
  } else if (isAdmin || hasMusic) {
    // Welcome page with full access: 4 songs
    currentTrack = fullTracks[trackIndex];
    showPrevNext = true;
  } else {
    // Default: 1 song only
    currentTrack = { src: "/audio/Kindred%20Spirit%20Felt.mp3", title: "Kindred Spirit Vitiá Kulish" };
    showPrevNext = false;
  }
  
  const handlePrev = () => {
    const newIndex = (trackIndex - 1 + trackArray.length) % trackArray.length;
    setTrackIndex(newIndex);
    localStorage.setItem('mh_track_index', newIndex.toString());
  };
  
  const handleNext = () => {
    const newIndex = (trackIndex + 1) % trackArray.length;
    console.log('Advancing track:', trackIndex, '->', newIndex, 'of', trackArray.length);
    console.log('New track will be:', trackArray[newIndex]?.title);
    
    // Check if we're looping back to the beginning
    if (newIndex === 0 && trackIndex === trackArray.length - 1) {
      const playlistType = isFriendGiftPage ? '2-song friend' : `${trackArray.length}-song full`;
      console.log(`🔄 PLAYLIST LOOP: Completed all ${trackArray.length} tracks (${playlistType}), looping back to track 1`);
      
      // Increment loop counter for debugging
      const loopCount = parseInt(localStorage.getItem('mh_loop_count') || '0') + 1;
      localStorage.setItem('mh_loop_count', loopCount.toString());
      console.log('🔄 This is playlist loop #' + loopCount);
    }
    
    setTrackIndex(newIndex);
    localStorage.setItem('mh_track_index', newIndex.toString());
    
    // Ensure playing state is maintained when advancing tracks
    localStorage.setItem('mh_audio_playing', 'true');
    
    // Force the new track to start playing after a brief delay
    setTimeout(() => {
      console.log('Triggering auto-play for advanced track');
      window.dispatchEvent(new Event('mh:audio-play'));
    }, 200);
  };
  // Add a state to track scroll position 
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMultiTrackHint, setShowMultiTrackHint] = useState(false);
  
  // Persist rid/campaign if present on landing
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const rid = url.searchParams.get('rid');
      const camp = url.searchParams.get('campaign');
      if (rid) localStorage.setItem('mh_rid', rid);
      if (camp) localStorage.setItem('mh_campaign', camp);
    } catch {}
  }, []);

  // Check if this user has music access (non-admin unlock, case-insensitive)
  useEffect(() => {
    let active = true;
    async function checkMusic() {
      try {
        if (!user?.email) { if (active) setHasMusic(false); return; }
        const { data, error } = await supabase
          .from('music_access')
          .select('email')
          .ilike('email', user.email)
          .maybeSingle();
        if (!active) return;
        const musicAccess = !!data && !error;
        setHasMusic(musicAccess);
        localStorage.setItem('mh_has_music', musicAccess.toString());
      } catch {
        if (!active) return;
        setHasMusic(false);
        localStorage.setItem('mh_has_music', 'false');
      }
    }
    checkMusic();
    return () => { active = false; };
  }, [user?.email]);

  // Decide whether to show the one-time multi-track hint
  useEffect(() => {
    const canShow = (isAdmin || hasMusic || isFriendGiftPage) && trackArray.length > 1;
    if (!canShow) { setShowMultiTrackHint(false); return; }
    let urlFlag = false;
    try {
      const u = new URL(window.location.href);
      urlFlag = u.searchParams.get('hint') === '1';
    } catch {}
    const seen = localStorage.getItem('mh_multitrack_hint_seen') === '1';
    setShowMultiTrackHint(urlFlag || !seen);
  }, [isAdmin, hasMusic, isFriendGiftPage, trackArray.length]);

  // Hide hint on explicit interaction via custom event fired by the player
  useEffect(() => {
    const onInteract = () => {
      setShowMultiTrackHint(false);
      localStorage.setItem('mh_multitrack_hint_seen', '1');
    };
    window.addEventListener('mh:player-user-interact', onInteract);
    return () => window.removeEventListener('mh:player-user-interact', onInteract);
  }, []);
  
  useEffect(() => {
    // Function to update scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initialize scroll position
    handleScroll();
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Calculate opacity based on scroll position
  // Start with higher opacity, then reduce as user scrolls down
  const headerOpacity = Math.max(0.4, 0.95 - (scrollPosition * 0.001));
  
  // Increase shadow as opacity decreases
  const shadowClass = scrollPosition > 100 ? "shadow-lg" : "shadow-md";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-background overflow-hidden">
      {/* Use inline style for background opacity based on scroll position */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[9999] w-full border-b backdrop-blur-md ${shadowClass} transition-all duration-200`}
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          // For dark mode handled via CSS variables
          '--header-opacity': headerOpacity.toString()
        } as React.CSSProperties}
      >
        <div className="container flex h-12 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 pl-8 hover:opacity-80 transition-opacity">
            <img src="/Lotus Piano Logo.png" alt="Mind Harmony Logo" className="h-14 w-14 object-contain" />

            <span className="text-xl font-bold text-[#1E3A5F] dark:text-foreground">
              Mind{' '}
              <span className="bg-gradient-to-r from-[#93c7ee] via-[#f3b6d3] to-[#ffd1b3] text-transparent bg-clip-text font-bold" style={{ filter: 'brightness(1.07)' }}>
                Harmony
              </span>
            </span>
          </Link>
          <FixedNavigationMenu user={user} />
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pt-16">{children}</main>

      {/* Hide footer on Welcome Page and Friend Page to prevent it showing through video background */}
      {!isWelcomePage && !isFriendGiftPage && <Footer />}
      
      {/* Additional CSS to ensure footer is completely hidden on special pages */}
      {(isWelcomePage || isFriendGiftPage) && (
        <style>{`
          footer {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            z-index: -9999 !important;
          }
        `}</style>
      )}

      {/* Wrapper to detect hover and dismiss the hint */}
      <div
        onMouseEnter={() => {
          if (showMultiTrackHint) {
            setShowMultiTrackHint(false);
            localStorage.setItem('mh_multitrack_hint_seen', '1');
          }
        }}
      >
        {/* Floating audio player; shows playlist based on page and access level */}
        {/* Hide music player on friend page until custom play button is clicked */}
        {(!isFriendGiftPage || showMusicPlayerOnFriendGift) && (
          <AudioPlayer 
            key="global-audio-player"
            src={currentTrack.src}
            title={currentTrack.title}
            loop={false}
            showPrevNext={showPrevNext}
            onPrev={showPrevNext ? handlePrev : undefined}
            onNext={showPrevNext ? handleNext : undefined}
            userEmail={user?.email ?? undefined}
            userId={user?.id ?? undefined}
          />
        )}
      </div>

      {showMultiTrackHint && (
        <div className="fixed left-1/2 transform -translate-x-1/2 z-[9997]" style={{ top: '46px' }}>
          <div className="pointer-events-none inline-flex items-center gap-2 rounded-md bg-black/70 text-white px-3 py-1 shadow-lg">
            <span className="text-xs font-semibold tracking-wide">
              {isFriendGiftPage ? `${friendTracks.length} tracks available` : `${trackArray.length} tracks now available`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
