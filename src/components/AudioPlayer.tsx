import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Only init if playing
    if (isPlaying && !audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const bufferSize = 2 * ctx.sampleRate,
        noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
        output = noiseBuffer.getChannelData(0);
      
      // Brownian noise generation for wind/rumble
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate gain
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      // Filter to make it sound like low wind
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      // LFO to modulate wind filter frequency
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // slow modulation
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300; 

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; // start silent
      gainNodeRef.current = masterGain;

      noise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
      noise.start();

      masterGain.gain.setTargetAtTime(0.5, ctx.currentTime, 2); // fade in
    }

    if (!isPlaying && gainNodeRef.current && audioCtxRef.current) {
      // Fade out
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 1);
      setTimeout(() => {
        audioCtxRef.current?.suspend();
      }, 2000);
    } else if (isPlaying && audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      gainNodeRef.current?.gain.setTargetAtTime(0.5, audioCtxRef.current.currentTime, 2);
    }

    return () => {
      // Cleanup on unmount handled gracefully
    };
  }, [isPlaying]);

  // We actually don't render anything UI here, just expose a way to toggle,
  // but as a component it can listen to an event or we can render a hidden element.
  // We will let the Nav component toggle this via App state.
  return null;
}
