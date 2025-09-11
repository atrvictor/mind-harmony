import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FriendGiftPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showCustomPlayButton, setShowCustomPlayButton] = useState(true);

  // Custom play button handler for music player
  const handleCustomPlayClick = () => {
    setShowMusicPlayer(true);
    setShowCustomPlayButton(false);
    // Show the music player in main layout
    window.dispatchEvent(new Event('mh:show-music-player'));
    // Trigger the music player to start playing
    setTimeout(() => {
      window.dispatchEvent(new Event('mh:audio-play'));
    }, 100);
  };

  // Play button handler (same as welcome page)
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
      video.currentTime = 0;
      await video.play();
      console.log('Manual play successful');
      setShowPlayButton(false);
    } catch (error) {
      console.error('Manual play failed:', error);
      
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

  // Enhanced video autoplay handling (same as welcome page)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playAttempted = false;

    const attemptPlayWithRetries = async () => {
      if (playAttempted) return;
      playAttempted = true;

      try {
        video.currentTime = 0;
        
        for (let i = 0; i < 5; i++) {
          try {
            await video.play();
            console.log(`Friend video started playing (attempt ${i + 1})`);
            setShowPlayButton(false);
            return;
          } catch (playError) {
            console.log(`Friend play attempt ${i + 1} failed:`, playError);
            const delays = [100, 300, 800, 1500];
            if (i < delays.length) {
              await new Promise(resolve => setTimeout(resolve, delays[i]));
            }
          }
        }
        
        console.log('All friend autoplay attempts failed, showing play button');
        setShowPlayButton(true);
      } catch (error) {
        console.log('Friend video autoplay completely failed:', error);
        setShowPlayButton(true);
      }
    };

    const handleUserInteraction = () => {
      if (video.paused) {
        attemptPlayWithRetries();
      }
    };

    const triggers = ['loadeddata', 'canplay', 'canplaythrough', 'loadedmetadata'];
    triggers.forEach(event => {
      video.addEventListener(event, attemptPlayWithRetries);
    });

    if (video.readyState >= 2) {
      setTimeout(attemptPlayWithRetries, 100);
    }

    setTimeout(() => {
      if (video.paused) {
        playAttempted = false;
        attemptPlayWithRetries();
      }
    }, 1000);

    setTimeout(() => {
      if (video.paused) {
        console.log('Friend video still paused after 3 seconds, showing play button');
        setShowPlayButton(true);
      }
    }, 3000);

    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('scroll', handleUserInteraction, { once: true });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/sendAutoMagicLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          campaign: 'friend_invitation'
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send gift');

      setSuccess(true);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative welcome-page friend-page" data-page="friend">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="fixed inset-0 w-full h-full object-cover z-0"
        >
          <source src="/drone for site.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Success message overlay */}
        <div className="fixed inset-0 z-20 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/95 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent! 📧</h1>
              <p className="text-gray-600 mb-4">
                Verify your email to complete your access to all available songs and become a Mind Harmony member.
              </p>
              <p className="text-sm text-gray-500">
                <strong>Please check your spam, promotions, or offers folder</strong> if you don't see the email in your inbox within a few minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative welcome-page friend-page" data-page="friend">
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
          if (videoRef.current) {
            videoRef.current.play().catch(console.log);
          }
        }}
        onCanPlay={() => {
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
      <div className="relative z-10 pt-8 pb-16 px-4 min-h-screen flex flex-col">
        <div className="max-w-2xl mx-auto text-center flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
            Welcome, friend
          </h1>
          
          <div className="relative">
            <h2 className="text-2xl font-semibold mb-6 text-white drop-shadow-lg">Grounding Breath Meditation</h2>
            
            {/* Custom Play Button Overlay */}
            {showCustomPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center -mt-6">
                <button
                  onClick={handleCustomPlayClick}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-6 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-white/30"
                  aria-label="Start music player"
                >
                  <svg 
                    className="w-12 h-12 ml-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <p className="text-lg text-white/90 drop-shadow leading-relaxed mb-12">
            Press the play button above to hear 2 unreleased piano meditation tracks. Find a comfortable seated position. Close your eyes and take a deep breath in through your nose, allowing your abdomen to expand. Slowly exhale through your mouth, releasing any tension. Continue this gentle breathing, focusing on the sensation of air entering and leaving your body. If your mind wanders, gently redirect your attention back to your breath. After a few minutes, allow the piano music to guide you deeper into relaxation.
          </p>
        </div>

        {/* Signup section at bottom - more transparent */}
        <div className="max-w-sm mx-auto">
          <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/30">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">Want More?</h3>
              <p className="text-white/90 text-sm drop-shadow">
                Activate your Mind Harmony account for free to unlock access to more unreleased songs, get info about our upcoming events before anyone else and access to guest lists.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 backdrop-blur border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-white/70 focus:bg-white/90 placeholder-gray-600"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 backdrop-blur border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-white/70 focus:bg-white/90 placeholder-gray-600"
                  placeholder="Your email"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-white/90 hover:bg-white text-gray-800 border border-white/50 shadow-lg"
                disabled={loading || !name.trim() || !email.trim()}
              >
                {loading ? 'Sending...' : 'Get Full Access'}
              </Button>
            </form>

            <p className="text-xs text-white/70 mt-3 text-center drop-shadow">
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>

        {/* Next Event Info Box */}
        <div className="max-w-sm mx-auto mt-6">
          <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-4 border border-white/30">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">Next Piano Meditation Experience</h3>
              <div className="text-white/90 text-sm drop-shadow mb-3">
                <p className="font-semibold">Mount Soledad Memorial Park</p>
                <p>Sun 14th Sep, 6:00pm</p>
              </div>
              <button
                onClick={() => window.open('https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator', '_blank')}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 w-full"
              >
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
