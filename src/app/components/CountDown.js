'use client';
import { useEffect, useState } from 'react';

export default function Countdown({ 
  duration = 3, 
  onComplete,
  visible 
}) {
  const [count, setCount] = useState(duration);
  
  useEffect(() => {
    if (!visible) return;
    
    setCount(duration);
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const frame = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setCount(remaining);
      
      if (remaining > 0) {
        requestAnimationFrame(frame);
      } else {
        onComplete();
      }
    };
    
    const animationId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationId);
  }, [duration, visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
      <div className="text-white text-9xl font-bold animate-pulse">
        {count}
      </div>
    </div>
  );
}