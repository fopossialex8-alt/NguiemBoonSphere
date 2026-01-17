
import React from 'react';
import { CAMEROON_ALPHABET } from '../constants';

interface KeyboardProps {
  onCharClick: (char: string) => void;
}

const SpecialKeyboard: React.FC<KeyboardProps> = ({ onCharClick }) => {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-stone-100 border border-stone-300 rounded-lg shadow-inner">
      {CAMEROON_ALPHABET.map((char) => (
        <button
          key={char}
          onClick={() => onCharClick(char)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-stone-200 rounded hover:bg-amber-100 hover:border-amber-400 transition-colors font-bold text-lg"
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default SpecialKeyboard;
