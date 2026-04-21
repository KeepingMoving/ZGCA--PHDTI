export const playSound = (type: 'shake' | 'reveal_N' | 'reveal_R' | 'reveal_SR' | 'reveal_UR') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    // Create contexts dynamically to bypass strict autoplay requirements if triggered by a user action
    const ctx = new AudioContext();
    
    const playTone = (freq: number, type: OscillatorType, duration: number, vol: number, startTime = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    if (type === 'shake') {
      playTone(300, 'sine', 0.1, 0.1);
      playTone(400, 'sine', 0.1, 0.1, 0.1);
      playTone(500, 'sine', 0.15, 0.05, 0.2);
    } else if (type === 'reveal_N') {
      // Pleasant calm sequence
      playTone(440, 'triangle', 0.5, 0.1); // A4
      playTone(554, 'triangle', 0.5, 0.1, 0.1); // C#5
    } else if (type === 'reveal_R') {
      // Upbeat pop
      playTone(523.25, 'sine', 0.6, 0.1); // C5
      playTone(659.25, 'sine', 0.6, 0.1, 0.1); // E5
      playTone(783.99, 'sine', 0.6, 0.1, 0.2); // G5
    } else if (type === 'reveal_SR') {
      // Magical crystalline arpeggio
      playTone(587.33, 'square', 0.8, 0.05); // D5
      playTone(739.99, 'square', 0.8, 0.05, 0.1); // F#5
      playTone(880, 'square', 0.8, 0.05, 0.2); // A5
      playTone(1174.66, 'square', 0.8, 0.05, 0.3); // D6
      playTone(1479.98, 'sine', 1.0, 0.05, 0.4); // F#6
    } else if (type === 'reveal_UR') {
      // Epic fanfare chord
      playTone(523.25, 'sawtooth', 1.5, 0.05); // C5
      playTone(659.25, 'sawtooth', 1.5, 0.05); // E5
      playTone(783.99, 'sawtooth', 1.5, 0.05); // G5
      playTone(1046.50, 'sawtooth', 1.5, 0.05, 0.2); // C6
      playTone(1318.51, 'sawtooth', 1.5, 0.05, 0.4); // E6
      playTone(1567.98, 'sawtooth', 2.0, 0.05, 0.5); // G6
    }
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};
