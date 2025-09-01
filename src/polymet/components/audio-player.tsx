import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, MusicIcon } from "lucide-react";
import AudioManager from "@/lib/audioManager";

interface AudioPlayerProps {
  /** Absolute path under public/. Example: "/audio/your-song.mp3" */
  src?: string;
  /** Visible track title */
  title?: string;
  /** Loop playback (enabled by default) */
  loop?: boolean;
  /** Optional prev/next handlers (useful for admin playlist) */
  onPrev?: () => void;
  onNext?: () => void;
  /** Show prev/next buttons when handlers provided */
  showPrevNext?: boolean;
  /** Logged-in user email (for tracking) */
  userEmail?: string;
  /** Logged-in user id (for tracking) */
  userId?: string;
}

/**
 * Small floating audio player. Loop is enabled by default.
 * Note: Modern browsers block autoplay with sound. Users must click Play.
 */
export default function AudioPlayer({
  src = "/audio/your-song.mp3",
  title = "Your Song",
  loop = true,
  onPrev,
  onNext,
  showPrevNext = false,
  userEmail,
  userId,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioManager = AudioManager.getInstance();
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    // Restore playing state from localStorage
    return localStorage.getItem('mh_audio_playing') === 'true';
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  // Controls persistent visibility of the title. Hover will still temporarily reveal it.
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Helper functions to persist audio state
  const setPlayingState = (playing: boolean) => {
    setIsPlaying(playing);
    localStorage.setItem('mh_audio_playing', playing.toString());
    if (playing) {
      // Save current time periodically while playing
      const audio = audioRef.current;
      if (audio) {
        localStorage.setItem('mh_audio_time', audio.currentTime.toString());
      }
    }
  };

  // Save audio state when component unmounts or src changes
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        localStorage.setItem('mh_audio_time', audio.currentTime.toString());
        localStorage.setItem('mh_audio_playing', 'true');
      }
    };
  }, []);

  // Periodically save current time while playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        localStorage.setItem('mh_audio_time', audio.currentTime.toString());
      }
    }, 1000); // Save every second
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initialize audio element using global manager
  useEffect(() => {
    if (!src) return;
    
    // Get or create audio element from global manager
    const audio = audioManager.initialize(src);
    audioRef.current = audio;
    
    // Apply current settings
    audio.loop = loop;
    audio.volume = volume;
    
    // Sync playing state with actual audio state
    setPlayingState(!audio.paused);
    
  }, [src, loop, audioManager]);

  // Reflect volume/mute changes on the element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = volume;
  }, [isMuted, volume]);

  // Auto-advance to next track when current ends (only when loop is disabled and onNext provided)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      try {
        const rid = localStorage.getItem('mh_rid') || undefined;
        const campaign = localStorage.getItem('mh_campaign') || undefined;
        fetch('/api/trackAudio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            userId,
            trackSrc: src,
            trackTitle: title,
            action: 'ended',
            position: audio.currentTime,
            duration: isFinite(audio.duration) ? audio.duration : undefined,
            rid,
            campaign
          })
        }).catch(() => {});
      } catch {}
      if (!loop && onNext) {
        onNext();
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [onNext, loop, src]);

  // If source changes, (re)load and if currently playing, auto-play the new source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Ensure fresh load for new source
    const autoPlay = isPlaying;
    const onCanPlay = () => {
      if (autoPlay) {
        audio
          .play()
          .then(async () => {
            try {
              const rid = localStorage.getItem('mh_rid') || undefined;
              const campaign = localStorage.getItem('mh_campaign') || undefined;
              await fetch('/api/trackAudio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userEmail,
                  userId,
                  trackSrc: src,
                  trackTitle: title,
                  action: 'play',
                  position: audio.currentTime,
                  duration: isFinite(audio.duration) ? audio.duration : undefined,
                  rid,
                  campaign
                })
              });
            } catch {}
          })
          .catch(() => {});
      }
      audio.removeEventListener('canplay', onCanPlay);
    };
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {}
    audio.addEventListener('canplay', onCanPlay);
    audio.load();
    return () => {
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [src, isPlaying]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      try {
        const rid = localStorage.getItem('mh_rid') || undefined;
        const campaign = localStorage.getItem('mh_campaign') || undefined;
        await fetch('/api/trackAudio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            userId,
            trackSrc: src,
            trackTitle: title,
            action: 'pause',
            position: audio.currentTime,
            duration: isFinite(audio.duration) ? audio.duration : undefined,
            rid,
            campaign
          })
        });
      } catch {}
      try { window.dispatchEvent(new Event('mh:player-user-interact')); } catch {}
      return;
    }
    try {
      await audio.play();
      setPlayingState(true);
      // Ensure the title is collapsed when playback starts
      setIsExpanded(false);
      try {
        const rid = localStorage.getItem('mh_rid') || undefined;
        const campaign = localStorage.getItem('mh_campaign') || undefined;
        await fetch('/api/trackAudio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            userId,
            trackSrc: src,
            trackTitle: title,
            action: 'play',
            position: audio.currentTime,
            duration: isFinite(audio.duration) ? audio.duration : undefined,
            rid,
            campaign
          })
        });
      } catch {}
      try { window.dispatchEvent(new Event('mh:player-user-interact')); } catch {}
    } catch (err) {
      // Autoplay restrictions or missing file
      setIsPlaying(false);
      // Silently fail; user can try again
    }
  };

  // Listen for global play/pause/toggle commands from header button
  useEffect(() => {
    const onPlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        await audio.play();
        setPlayingState(true);
        // Do not force title open during playback
        setIsExpanded(false);
      } catch {}
    };
    const onPause = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      setIsPlaying(false);
    };
    const onToggle = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setPlayingState(true);
            setIsExpanded(false);
          })
          .catch(() => {});
      } else {
        audio.pause();
        setPlayingState(false);
      }
    };
    window.addEventListener("mh:audio-play", onPlay);
    window.addEventListener("mh:audio-pause", onPause);
    window.addEventListener("mh:audio-toggle", onToggle);
    // Collapse the title smoothly after the page finishes loading
    const collapse = () => {
      // small delay so it's visible briefly after load
      setTimeout(() => setIsExpanded(false), 900);
    };
    if (document.readyState === "complete") {
      collapse();
    } else {
      window.addEventListener("load", collapse);
    }
    return () => {
      window.removeEventListener("mh:audio-play", onPlay);
      window.removeEventListener("mh:audio-pause", onPause);
      window.removeEventListener("mh:audio-toggle", onToggle);
      window.removeEventListener("load", collapse);
    };
  }, []);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9998]">
      <div
        className="group flex items-center gap-2 rounded-xl border border-border bg-white/90 dark:bg-card/90 backdrop-blur px-3 py-2 shadow-lg"
        title={title}
      >
        <button
          type="button"
          aria-label="Toggle track title"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center justify-center"
        >
          <MusicIcon className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-out 
            ${isExpanded ? "max-w-[220px] opacity-100 ml-1" : "max-w-0 opacity-0 ml-0"}
            group-hover:max-w-[220px] group-hover:opacity-100 group-hover:ml-1`}
        >
          <div className="text-xs font-medium leading-tight whitespace-nowrap">{title}</div>
        </div>

        {showPrevNext && (
          <button
            type="button"
            aria-label="Previous"
            onClick={onPrev}
            className="inline-flex h-8 px-2 items-center justify-center rounded-full border bg-background border-border text-xs"
            title="Previous"
          >
            ◀
          </button>
        )}

        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={handleTogglePlay}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E3A5F] text-white hover:bg-[#27496f]"
        >
          {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={handleToggleMute}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background border-border"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="h-1 w-24 accent-[#1E3A5F]"
          aria-label="Volume"
        />

        {showPrevNext && (
          <button
            type="button"
            aria-label="Next"
            onClick={onNext}
            className="inline-flex h-8 px-2 items-center justify-center rounded-full border bg-background border-border text-xs"
            title="Next"
          >
            ▶
          </button>
        )}

        {/* Hidden native audio element */}
        <audio ref={audioRef} src={src} preload="metadata" playsInline />
      </div>
    </div>
  );
}


