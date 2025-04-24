import { useState, useEffect } from 'react';

interface MusicalNotesProps {
  isActive: boolean;
}

// Musical notes symbols and colors
const NOTES = ['♩', '♪', '♫', '♬', '🎵', '🎶', '🎼'];
const COLORS = [
  'text-pink-400', 'text-purple-400', 'text-blue-400', 
  'text-yellow-400', 'text-green-400', 'text-cyan-400'
];

export default function MusicalNotes({ isActive }: MusicalNotesProps) {
  const [notes, setNotes] = useState<Array<{
    id: number, 
    note: string, 
    left: number, 
    delay: number,
    color: string,
    size: string,
    rotation: number
  }>>([]);
  
  // Reset or create notes when active state changes
  useEffect(() => {
    if (isActive) {
      createNotes();
    } else {
      setNotes([]);
    }
    
    // Create more notes every interval if active
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        createRandomNote();
      }, 600);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  // Create initial set of notes
  const createNotes = () => {
    const newNotes = [];
    for (let i = 0; i < 6; i++) {
      newNotes.push(createNoteObject(Date.now() + i));
    }
    setNotes(newNotes);
  };
  
  // Create a note object with random properties
  const createNoteObject = (id: number) => {
    return {
      id,
      note: NOTES[Math.floor(Math.random() * NOTES.length)],
      left: Math.floor(Math.random() * 100),
      delay: Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'][Math.floor(Math.random() * 4)],
      rotation: Math.floor(Math.random() * 40) - 20
    };
  };
  
  // Add a single random note
  const createRandomNote = () => {
    setNotes(prev => [
      ...prev,
      createNoteObject(Date.now())
    ]);
    
    // Remove oldest notes to prevent too many elements
    if (notes.length > 15) {
      setNotes(prev => prev.slice(1));
    }
  };
  
  // Don't render anything if not active
  if (!isActive) return null;
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {notes.map(({ id, note, left, delay, color, size, rotation }) => (
        <div 
          key={id}
          className={`musical-notes absolute ${color} ${size} font-bold`}
          style={{
            left: `${left}%`,
            bottom: '0',
            animationDelay: `${delay}s`,
            transform: `rotate(${rotation}deg)`,
            textShadow: '0 0 5px rgba(255, 255, 255, 0.7)'
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
}