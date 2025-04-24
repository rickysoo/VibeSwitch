import { useEffect, useRef } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
}

// Create a music player component that plays background music when the toggle is on
export default function MusicPlayer({ isPlaying }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context and elements if they don't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set properties - loop the music and set volume
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25; // Not too loud
      
      // We'll generate a synthetic song pattern
      createSynthMusic();
      
      // Create user interaction handler for browsers that require user interaction to play audio
      document.addEventListener('click', () => {
        if (isPlaying && audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play after interaction failed:', e));
        }
      }, { once: true });
    }

    // Play or pause based on isPlaying prop
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    // Cleanup when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  // Create synthetic music using oscillators
  const createSynthMusic = () => {
    if (!audioRef.current) return;
    
    try {
      // Create a looping piece of synthesized music using oscillators and AudioContext
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Set up audio processing
      const destination = context.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: BlobPart[] = [];
      
      // Generate several oscillators for a chord progression
      const createOscillators = () => {
        // Base frequencies for a pleasant chord progression (C major, G, A minor, F)
        const progressions = [
          [261.63, 329.63, 392.00], // C major
          [392.00, 493.88, 587.33], // G major
          [220.00, 277.18, 329.63], // A minor
          [349.23, 440.00, 523.25]  // F major
        ];
        
        let time = context.currentTime;
        const oscillators: OscillatorNode[] = [];
        
        // Create gain node for volume envelope
        const gainNode = context.createGain();
        gainNode.connect(destination);
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.1, time + 0.1);
        
        // For each chord in progression
        progressions.forEach((frequencies, index) => {
          // For each note in chord
          frequencies.forEach(frequency => {
            // Create oscillator
            const oscillator = context.createOscillator();
            oscillator.type = ['sine', 'triangle', 'square', 'sawtooth'][index % 4] as OscillatorType;
            oscillator.frequency.setValueAtTime(frequency, time + index * 2);
            
            // Connect to gain node
            oscillator.connect(gainNode);
            
            // Start oscillator
            oscillator.start(time + index * 2);
            oscillator.stop(time + (index + 1) * 2);
            
            oscillators.push(oscillator);
          });
          
          // Set gain envelope for nice attack/decay
          gainNode.gain.setValueAtTime(0.1, time + index * 2);
          gainNode.gain.linearRampToValueAtTime(0.15, time + index * 2 + 0.1);
          gainNode.gain.linearRampToValueAtTime(0.05, time + (index + 1) * 2 - 0.1);
        });
        
        return oscillators;
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Create the oscillators to generate audio
      const oscillators = createOscillators();
      
      // Stop recording after the full progression
      setTimeout(() => {
        mediaRecorder.stop();
      }, 8000); // 8 seconds for the full progression
      
      // Handle the audio data when recording completes
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        // Create a blob from audio chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set the audio source
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          
          // If already should be playing, play it
          if (isPlaying) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }
      };
      
    } catch (error) {
      console.error("Web Audio API is not supported in this browser or context:", error);
      
      // Fallback to using a simple tone instead
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start();
      
      // Stop after a short time
      setTimeout(() => oscillator.stop(), 1000);
    }
  };

  // Component doesn't render anything visible
  return null;
}