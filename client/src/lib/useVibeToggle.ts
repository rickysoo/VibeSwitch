import { useState, useCallback } from 'react';

interface UseVibeToggleProps {
  initialState?: boolean;
  onChange?: (state: boolean) => void;
}

export function useVibeToggle({ initialState = false, onChange }: UseVibeToggleProps = {}) {
  const [isVibeOn, setIsVibeOn] = useState(initialState);
  
  const toggleVibe = useCallback(() => {
    const newState = !isVibeOn;
    setIsVibeOn(newState);
    if (onChange) {
      onChange(newState);
    }
  }, [isVibeOn, onChange]);
  
  const vibeStatus = isVibeOn
    ? "Vibe mode activated! Feel the energy!"
    : "Vibe is off. Turn it on to get the party started!";
    
  return {
    isVibeOn,
    toggleVibe,
    vibeStatus
  };
}
