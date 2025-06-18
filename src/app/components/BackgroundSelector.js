import React from 'react';

const backgrounds = [
  { name: 'Beach', src: '/backgrounds/beach.jpg' },
  { name: 'Mountains', src: '/backgrounds/mountains.jpg' },
  { name: 'City', src: '/backgrounds/city.jpg' },
];

export default function BackgroundSelector({ onSelect }) {
  return (
    <div>
      <h3>Select a Background:</h3>
      <div className="flex gap-2">
        {backgrounds.map(bg => (
          <img
            key={bg.name}
            src={bg.src}
            alt={bg.name}
            className="w-20 h-15 cursor-pointer border-2 border-gray-300"
            onClick={() => onSelect(bg.src)}
          />
        ))}
      </div>
    </div>
  );
}