// Global audio manager to persist audio across navigation
class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private currentSrc: string = '';
  private isInitialized: boolean = false;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  initialize(src: string): HTMLAudioElement {
    if (!this.audio || this.currentSrc !== src) {
      // Create new audio element if needed
      if (this.audio) {
        this.saveState();
        this.audio.pause();
      }
      
      this.audio = new Audio(src);
      this.currentSrc = src;
      this.setupAudio();
      this.restoreState();
    }
    return this.audio;
  }

  private setupAudio() {
    if (!this.audio) return;
    
    this.audio.preload = 'metadata';
    this.audio.volume = 0.8;
    
    // Save state periodically while playing
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && !this.audio.paused) {
        localStorage.setItem('mh_audio_time', this.audio.currentTime.toString());
        localStorage.setItem('mh_audio_playing', 'true');
      }
    });
    
    this.audio.addEventListener('pause', () => {
      localStorage.setItem('mh_audio_playing', 'false');
    });
    
    this.audio.addEventListener('play', () => {
      localStorage.setItem('mh_audio_playing', 'true');
    });
  }

  private saveState() {
    if (this.audio) {
      localStorage.setItem('mh_audio_time', this.audio.currentTime.toString());
      localStorage.setItem('mh_audio_playing', this.audio.paused ? 'false' : 'true');
    }
  }

  private restoreState() {
    if (!this.audio) return;
    
    const savedTime = localStorage.getItem('mh_audio_time');
    const wasPlaying = localStorage.getItem('mh_audio_playing') === 'true';
    
    if (savedTime) {
      this.audio.currentTime = parseFloat(savedTime);
    }
    
    if (wasPlaying) {
      // Try to resume playback
      this.audio.play().catch(() => {
        // Autoplay blocked, user will need to click play
        localStorage.setItem('mh_audio_playing', 'false');
      });
    }
  }

  getAudio(): HTMLAudioElement | null {
    return this.audio;
  }

  cleanup() {
    if (this.audio) {
      this.saveState();
      this.audio.pause();
    }
  }
}

export default AudioManager;
