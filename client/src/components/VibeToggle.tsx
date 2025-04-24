import { useState, useEffect, useRef } from "react";
import MusicalNotes from "./MusicalNotes";

interface VibeToggleProps {
  initialState?: boolean;
  onChange?: (isOn: boolean) => void;
}

export default function VibeToggle({ initialState = false, onChange }: VibeToggleProps) {
  const [isOn, setIsOn] = useState(initialState);
  const [playSound, setPlaySound] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element for sound effects
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.4;
    }
    
    // Play different sounds based on toggle state
    if (playSound) {
      if (isOn) {
        // Play activation sound - using a frequency to create a synth sound
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
        oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.3); // Up to A5
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.5);
      } else {
        // Play deactivation sound - descending tone
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, context.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.5);
      }
      
      // Reset sound trigger
      setPlaySound(false);
    }
  }, [playSound, isOn]);
  
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    setPlaySound(true); // Trigger sound effect
    
    if (onChange) {
      onChange(newState);
    }
  };
  
  const statusMessage = isOn
    ? "VIBE mode activated! Feel the beat! 🎶"
    : "Vibe is off. Turn it on to get the party started!";
  
  return (
    <div className={`relative p-10 ${isOn ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' : 'bg-white'} rounded-xl shadow-xl transition-all duration-500 max-w-md w-full overflow-hidden`}>
      {/* Musical background pattern when active */}
      <div className={`absolute inset-0 music-bg opacity-0 transition-opacity duration-500 ${isOn ? 'opacity-100' : ''}`}></div>
      
      {/* Animated musical notes when toggle is on */}
      <MusicalNotes isActive={isOn} />
      
      <h2 className={`text-2xl font-bold mb-8 text-center transition-colors duration-500 
        ${isOn ? 'text-white shadow-text-white rainbow-text' : 'text-gray-800'}`}>
        {isOn ? "TURN UP THE VIBE" : "Toggle the VIBE"}
      </h2>
      
      <div className="flex justify-center">
        <div className="relative">
          <input 
            type="checkbox" 
            id="toggle-switch-checkbox" 
            checked={isOn}
            onChange={handleToggle}
            aria-label="Toggle VIBE" 
            className="sr-only"
          />
          
          {/* Decorative music elements that appear when toggle is on */}
          <div className={`absolute -top-8 -left-8 text-2xl transition-all duration-300 transform rotate-[-20deg] ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>🎹</div>
          <div className={`absolute -top-5 -right-6 text-2xl transition-all duration-300 transform rotate-[15deg] ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>🎸</div>
          <div className={`absolute -bottom-8 left-5 text-2xl transition-all duration-300 transform rotate-[10deg] ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>🎷</div>
          <div className={`absolute -bottom-6 -right-8 text-2xl transition-all duration-300 transform rotate-[-10deg] ${isOn ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>🥁</div>
          
          <label 
            className={`
              toggle-container cursor-pointer w-[220px] h-[90px] block rounded-full relative transition-all duration-500
              ${isOn 
                ? 'bg-gradient-to-r from-[#ff3a8c] to-[#b930ff] shadow-lg shadow-[#ff3a8c]/60 pulse-animation border-2 border-pink-300/30' 
                : 'bg-gradient-to-r from-[#3a3a5c] to-[#252541] shadow-lg shadow-black/20'}
            `}
            htmlFor="toggle-switch-checkbox"
          >
            {/* Glow effect behind the toggle */}
            <div className={`vibe-glow absolute top-1/2 left-1/2 w-[200px] h-[70px] -translate-x-1/2 -translate-y-1/2 rounded-[35px] 
              bg-radial-gradient transition-all duration-500 ease-in-out
              ${isOn ? 'opacity-100 animate-[pulse-glow_1.5s_infinite_ease-in-out]' : 'opacity-0'}`}>
            </div>
            
            {/* VIBE text when off */}
            <div className={`vibe-text vibe-off absolute w-full text-center font-bold tracking-wider transition-all duration-500 
              left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40 text-[26px]
              ${isOn ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              VIBE
            </div>
            
            {/* VIBE text when on - with rainbow animation */}
            <div className={`vibe-text vibe-on absolute w-full text-center font-bold tracking-wider transition-all duration-500 
              left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[30px] shadow-text-white
              ${isOn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <span className={`vibe-letter inline-block transition-all duration-300 ${isOn ? 'animate-[wave_0.7s_infinite_0s] rainbow-text' : ''}`}>V</span>
              <span className={`vibe-letter inline-block transition-all duration-300 ${isOn ? 'animate-[wave_0.7s_infinite_0.1s] rainbow-text' : ''}`}>I</span>
              <span className={`vibe-letter inline-block transition-all duration-300 ${isOn ? 'animate-[wave_0.7s_infinite_0.2s] rainbow-text' : ''}`}>B</span>
              <span className={`vibe-letter inline-block transition-all duration-300 ${isOn ? 'animate-[wave_0.7s_infinite_0.3s] rainbow-text' : ''}`}>E</span>
            </div>
            
            {/* Toggle knob */}
            <span className={`
              absolute top-[5px] left-[5px] w-[80px] h-[80px] rounded-full 
              transition-all duration-500 ease-in-out
              shadow-lg overflow-hidden
              ${isOn 
                ? 'left-[calc(100%-5px)] -translate-x-full bg-gradient-to-br from-pink-300 via-white to-purple-300' 
                : 'bg-white'}
            `}>
              {/* Background pattern on toggle knob when on */}
              <span className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isOn ? 'opacity-40' : ''}`} 
                    style={{background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'}}></span>
              
              {/* Musical icon on the toggle knob when on */}
              <span className={`absolute inset-0 flex items-center justify-center text-3xl
                transition-all duration-300 ${isOn ? 'opacity-100 scale-100 animate-[beat_1s_infinite_ease-in-out]' : 'opacity-0 scale-0'}`}>
                🎵
              </span>
            </span>
          </label>
        </div>
      </div>
      
      <div className={`mt-8 text-center text-base font-medium transition-all duration-300
        ${isOn ? 'text-pink-300 animate-[dance_2s_infinite_ease-in-out]' : 'text-gray-500'}`}>
        {statusMessage}
      </div>
    </div>
  );
}
