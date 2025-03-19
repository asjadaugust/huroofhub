import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import './CandidateTextDeck.scss';

interface CandidateTextDeckProps {
  options: string[];
  position: number;
  sentenceLength: number;
  correctLetter: string;
  onOptionClick: (selectedLetter: string) => void;
  isDarkMode?: boolean;
}

const CandidateTextDeck: React.FC<CandidateTextDeckProps> = ({
  options,
  position,
  sentenceLength,
  correctLetter,
  onOptionClick,
  isDarkMode = false,
}) => {
  const [incorrectOptions, setIncorrectOptions] = useState<Set<string>>(
    new Set()
  );
  const [correctSelection, setCorrectSelection] = useState<string | null>(null);

  // Clear the correct selection after animation completes
  useEffect(() => {
    if (correctSelection) {
      const timer = setTimeout(() => {
        setCorrectSelection(null);
      }, 500); // 500ms flash of green

      return () => clearTimeout(timer);
    }
  }, [correctSelection]);

  const handleOptionClick = (selectedLetter: string) => {
    if (selectedLetter !== correctLetter) {
      setIncorrectOptions((prev) => new Set([...prev, selectedLetter]));
    } else {
      setCorrectSelection(selectedLetter);
      setIncorrectOptions(new Set());

      // Delay the advancement slightly to see the green feedback
      setTimeout(() => {
        onOptionClick(selectedLetter);
      }, 300);
    }
  };

  return (
    <Box
      className={`candidate-text-deck ${
        isDarkMode ? 'dark-mode' : 'light-mode'
      }`}
    >
      {options.map((letter, index) => (
        <div
          key={index}
          className={`text-badge ${
            incorrectOptions.has(letter) ? 'incorrect' : ''
          } ${correctSelection === letter ? 'correct' : ''}`}
          onClick={() => handleOptionClick(letter)}
        >
          {letter}
        </div>
      ))}
      {position >= sentenceLength && (
        <div className="completion-message">تم بنجاح! (Completed!)</div>
      )}
    </Box>
  );
};

export default CandidateTextDeck;
