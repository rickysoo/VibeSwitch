import { useState } from "react";

interface VibeToggleProps {
  initialState?: boolean;
  onChange?: (isOn: boolean) => void;
}

export default function VibeToggle({ initialState = false, onChange }: VibeToggleProps) {
  const [isOn, setIsOn] = useState(initialState);
  
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onChange) {
      onChange(newState);
    }
  };
  
  const statusMessage = isOn
    ? "Vibe mode activated! Feel the energy!"
    : "Vibe is off. Turn it on to get the party started!";
  
  return (
    <div className="relative p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Toggle the VIBE</h2>
      
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
          <label 
            className={`
              toggle-container cursor-pointer w-[200px] h-[80px] block rounded-full relative transition-all duration-300
              ${isOn ? 'bg-gradient-to-r from-[#ff3a8c] to-[#b930ff] shadow-lg shadow-[#ff3a8c]/40' : 'bg-gradient-to-r from-[#3a3a5c] to-[#252541] shadow-lg shadow-black/20'}
            `}
            htmlFor="toggle-switch-checkbox"
          >
            <div className={`vibe-glow absolute top-1/2 left-1/2 w-[160px] h-[60px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] 
              bg-radial-gradient transition-opacity duration-500 ease-in-out
              ${isOn ? 'opacity-100 animate-pulse-slow' : 'opacity-0'}`}>
            </div>
            
            <div className={`vibe-text vibe-off absolute w-full text-center font-bold tracking-wider transition-all duration-300 
              left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-[20px]
              ${isOn ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              VIBE
            </div>
            
            <div className={`vibe-text vibe-on absolute w-full text-center font-bold tracking-wider transition-all duration-300 
              left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[24px] shadow-text-white
              ${isOn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <span className={`vibe-letter inline-block transition-all duration-200 ${isOn ? 'animate-[wave_1s_infinite_0s]' : ''}`}>V</span>
              <span className={`vibe-letter inline-block transition-all duration-200 ${isOn ? 'animate-[wave_1s_infinite_0.1s]' : ''}`}>I</span>
              <span className={`vibe-letter inline-block transition-all duration-200 ${isOn ? 'animate-[wave_1s_infinite_0.2s]' : ''}`}>B</span>
              <span className={`vibe-letter inline-block transition-all duration-200 ${isOn ? 'animate-[wave_1s_infinite_0.3s]' : ''}`}>E</span>
            </div>
            
            <span className={`
              absolute top-[5px] left-[5px] w-[70px] h-[70px] bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(.85,.05,.18,.95)]
              shadow-md
              ${isOn ? 'left-[calc(100%-5px)] -translate-x-full' : ''}
            `}></span>
          </label>
        </div>
      </div>
      
      <div className={`mt-6 text-center text-sm ${isOn ? 'font-bold text-purple-600' : 'text-gray-500'}`}>
        {statusMessage}
      </div>
    </div>
  );
}
