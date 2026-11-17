"use client";
// Tiny WebAudio synth — no audio assets to download.
let ac: AudioContext | null = null;
let muted = false;
export const setMuted = (m: boolean) => (muted = m);
export const isMuted = () => muted;

function tone(freq: number, dur = 0.08, type: OscillatorType = "sine", gain = 0.06, when = 0) {
  if (muted || typeof window === "undefined") return;
  try {
    ac ||= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const t = ac.currentTime + when;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {}
}

export const sfx = {
  tap: () => tone(660, 0.05, "triangle", 0.04),
  swipe: () => tone(420, 0.09, "sine", 0.05),
  star: () => (tone(880, 0.08, "triangle"), tone(1320, 0.12, "triangle", 0.05, 0.07)),
  flag: () => (tone(300, 0.1, "square", 0.035), tone(220, 0.14, "square", 0.03, 0.08)),
  good: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, "triangle", 0.05, i * 0.08)),
  bad: () => (tone(260, 0.2, "sawtooth", 0.035), tone(180, 0.3, "sawtooth", 0.03, 0.15)),
  tick: () => tone(1200, 0.03, "square", 0.02),
  whoosh: () => [200, 400, 800, 1600].forEach((f, i) => tone(f, 0.08, "sine", 0.04, i * 0.04)),
};
