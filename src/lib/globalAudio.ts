// Truly global audio that exists outside React entirely
let globalAudio: HTMLAudioElement | null = null;
let currentGlobalSrc: string = '';

export function getGlobalAudio(): HTMLAudioElement | null {
  return globalAudio;
}

export function setGlobalAudio(src: string, title: string): HTMLAudioElement {
  // If we already have the same audio source, return it
  if (globalAudio && currentGlobalSrc === src) {
    return globalAudio;
  }

  // Save state of current audio if changing tracks
  if (globalAudio && currentGlobalSrc !== src) {
    localStorage.setItem('mh_global_time', globalAudio.currentTime.toString());
    localStorage.setItem('mh_global_playing', globalAudio.paused ? 'false' : 'true');
    localStorage.setItem('mh_global_src', currentGlobalSrc);
  }

  // Create new global audio
  globalAudio = new Audio(src);
  currentGlobalSrc = src;
  
  // Setup audio
  globalAudio.preload = 'metadata';
  globalAudio.volume = 0.8;
  globalAudio.loop = false;
  
  // Auto-save state
  globalAudio.addEventListener('timeupdate', () => {
    if (globalAudio && !globalAudio.paused) {
      localStorage.setItem('mh_global_time', globalAudio.currentTime.toString());
      localStorage.setItem('mh_global_src', currentGlobalSrc);
    }
  });

  globalAudio.addEventListener('play', () => {
    localStorage.setItem('mh_global_playing', 'true');
  });

  globalAudio.addEventListener('pause', () => {
    localStorage.setItem('mh_global_playing', 'false');
  });

  // Restore state if this is the same source as before
  const savedSrc = localStorage.getItem('mh_global_src');
  if (savedSrc === src) {
    const savedTime = localStorage.getItem('mh_global_time');
    const wasPlaying = localStorage.getItem('mh_global_playing') === 'true';
    
    if (savedTime) {
      globalAudio.currentTime = parseFloat(savedTime);
    }
    
    if (wasPlaying) {
      globalAudio.play().catch(() => {
        // Autoplay blocked
      });
    }
  }

  return globalAudio;
}

export function getCurrentGlobalSrc(): string {
  return currentGlobalSrc;
}
