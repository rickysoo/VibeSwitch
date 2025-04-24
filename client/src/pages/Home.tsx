import { useState } from "react";
import VibeToggle from "@/components/VibeToggle";

export default function Home() {
  const [isVibeMode, setIsVibeMode] = useState(false);
  
  const handleVibeChange = (isOn: boolean) => {
    setIsVibeMode(isOn);
    console.log("Vibe state changed:", isOn ? "ON" : "OFF");
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-all duration-1000 ${
      isVibeMode 
        ? 'bg-gradient-to-br from-purple-900 via-black to-blue-900' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200'
    }`}>
      <div className={`w-full max-w-xl transition-all duration-500 ${
        isVibeMode ? 'scale-105' : 'scale-100'
      }`}>
        <VibeToggle onChange={handleVibeChange} />
      </div>
    </div>
  );
}
