import { useState, useEffect } from 'react';

interface MusicalNotesProps {
  isActive: boolean;
}

// Musical notes symbols
const NOTES = ['♩', '♪', '♫', '♬', '🎵', '🎶'];

export default function MusicalNotes({ isActive }: MusicalNotesProps) {
  const [notes, setNotes] = useState<Array<{id: number, note: string, left: number, delay: number}>>([]);
  
  // Reset or create notes when active state changes
  useEffect(() => {
    if (isActive) {
      createNotes();
    } else {
      setNotes([]);
    }
    
    // Create more notes every 2 seconds if active
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        createRandomNote();
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  // Create initial set of notes
  const createNotes = () => {
    const newNotes = [];
    for (let i = 0; i < 5; i++) {
      newNotes.push({
        id: Date.now() + i,
        note: NOTES[Math.floor(Math.random() * NOTES.length)],
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 0.5
      });
    }
    setNotes(newNotes);
  };
  
  // Add a single random note
  const createRandomNote = () => {
    setNotes(prev => [
      ...prev,
      {
        id: Date.now(),
        note: NOTES[Math.floor(Math.random() * NOTES.length)],
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 0.5
      }
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
      {notes.map(({ id, note, left, delay }) => (
        <div 
          key={id}
          className="musical-notes absolute"
          style={{
            left: `${left}%`,
            bottom: '0',
            animationDelay: `${delay}s`
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
}