// Web Audio API Sound Engine
// Tự động tổng hợp âm thanh không cần file MP3 bên ngoài, đảm bảo 100% không bao giờ lỗi 404 trên GitHub Pages

class SoundEngine {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private lofiInterval: number | null = null;
  private isLofiPlaying: boolean = false;
  private isRainPlaying: boolean = false;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tiếng mở tủ gỗ (lách cách + trượt bản lề nhẹ)
  playLockerOpen() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Tiếng chuông thư báo có tin nhắn mới
  playNotification() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc1.stop(now + 0.3);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.8);
  }

  // Tiếng chim bồ câu vỗ cánh & gấp thư gửi đi
  playLetterSend() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const flapTime = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220 + i * 30, flapTime);
      osc.frequency.exponentialRampToValueAtTime(90, flapTime + 0.07);

      gain.gain.setValueAtTime(0.2, flapTime);
      gain.gain.exponentialRampToValueAtTime(0.01, flapTime + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(flapTime);
      osc.stop(flapTime + 0.07);
    }
  }

  // Tiếng châm lửa đốt cháy muộn phiền (White noise crackle)
  playFireCrackle() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Noise with random crackles
      const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.8 : 0;
      data[i] = (Math.random() * 2 - 1) * 0.08 + crackle;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
  }

  // Tiếng đàn Harp ấm áp khi gửi một cái ôm
  playHugChime() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const notes = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.6);
    });
  }

  // Tiếng mưa rơi nhân tạo tự nhiên (Pink/Brown noise filter)
  toggleRain(enable: boolean, volume = 0.3) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (!enable) {
      if (this.rainNode) {
        try {
          (this.rainNode as unknown as { stop: () => void }).stop();
        } catch {
          // ignore
        }
        this.rainNode = null;
      }
      this.isRainPlaying = false;
      return;
    }

    if (this.isRainPlaying) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm
      lastOut = data[i];
      data[i] *= 1.2;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;

    const gain = this.ctx.createGain();
    gain.gain.value = volume;

    rainSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    rainSource.start();
    this.rainNode = rainSource as unknown as AudioNode;
    this.isRainPlaying = true;
  }

  // Giai điệu Lofi ấm áp thư giãn (Dm7 - G7 - Cmaj7 - Am7)
  toggleLofi(enable: boolean) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (!enable) {
      if (this.lofiInterval) {
        window.clearInterval(this.lofiInterval);
        this.lofiInterval = null;
      }
      this.isLofiPlaying = false;
      return;
    }

    if (this.isLofiPlaying) return;
    this.isLofiPlaying = true;

    const chords = [
      [293.66, 349.23, 440.0, 523.25], // Dm7: D4, F4, A4, C5
      [196.00, 246.94, 293.66, 349.23], // G7: G3, B3, D4, F4
      [261.63, 329.63, 392.00, 493.88], // Cmaj7: C4, E4, G4, B4
      [220.00, 261.63, 329.63, 392.00], // Am7: A3, C4, E4, G4
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || !this.masterGain || !this.isLofiPlaying) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 3.2);
      });
    };

    playChord();
    this.lofiInterval = window.setInterval(playChord, 3500);
  }

  setVolume(val: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, val));
    }
  }
}

export const sound = new SoundEngine();
