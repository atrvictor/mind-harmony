// Global audio manager that exists outside React lifecycle
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private currentSrc: string = '';

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Get or create the global audio element
  getOrCreateAudio(src: string): HTMLAudioElement {
    // If we already have audio with the same source, return it
    if (this.audio && this.currentSrc === src) {
      return this.audio;
    }

    // If changing tracks, save state of current track
    if (this.audio && this.currentSrc !== src) {
      this.saveCurrentState();
    }

    // Create new audio element for new track
    this.audio = new Audio(src);
    this.currentSrc = src;
    this.setupAudio();
    
    return this.audio;
  }

  private setupAudio() {
    if (!this.audio) return;
    
    this.audio.preload = 'metadata';
    this.audio.volume = 0.8;
    this.audio.loop = false;
    
    // Save state periodically while playing
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && !this.audio.paused) {
        localStorage.setItem('mh_audio_time', this.audio.currentTime.toString());
        localStorage.setItem('mh_audio_src', this.currentSrc);
      }
    });
  }

  private saveCurrentState() {
    if (this.audio) {
      localStorage.setItem('mh_audio_time', this.audio.currentTime.toString());
      localStorage.setItem('mh_audio_playing', this.audio.paused ? 'false' : 'true');
      localStorage.setItem('mh_audio_src', this.currentSrc);
    }
  }

  // Check if audio should be playing and restore it
  restoreIfNeeded() {
    if (!this.audio) return;
    
    const wasPlaying = localStorage.getItem('mh_audio_playing') === 'true';
    const savedTime = localStorage.getItem('mh_audio_time');
    const savedSrc = localStorage.getItem('mh_audio_src');
    
    // Only restore if this is the same source
    if (wasPlaying && savedSrc === this.currentSrc) {
      if (savedTime) {
        this.audio.currentTime = parseFloat(savedTime);
      }
      
      if (this.audio.paused) {
        this.audio.play().catch(() => {
          // Autoplay blocked
        });
      }
    }
  }

  getCurrentAudio(): HTMLAudioElement | null {
    return this.audio;
  }

  getCurrentSrc(): string {
    return this.currentSrc;
  }
}

export default AudioManager;
