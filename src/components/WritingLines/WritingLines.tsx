'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import CandidateTextDeck from '../CandidateTextDeck/CandidateTextDeck';
import { useTheme } from '@mui/material/styles';

import './WritingLines.scss';
import { Ayah } from '@huroofhub/interface/Ayah';

interface WritingLinesProps {
  ayah: Ayah;
  onComplete?: () => void; // New callback for when verse is completed
  verseNumber?: number; // Optional verse number for display
}

const WritingLines: React.FC<WritingLinesProps> = ({
  ayah,
  onComplete,
  verseNumber,
}) => {
  const [sentence, setSentence] = useState<Ayah>(ayah);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [position, setPosition] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [currentCorrectLetter, setCurrentCorrectLetter] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Reset state when text changes (new verse)
  useEffect(() => {
    setSentence(ayah);
    setDisplayedText('');
    setPosition(0);
    setCompleted(false);

    if (ayah.text?.length > 0) {
      const firstCorrectLetter = ayah.text[0] || '';
      setCurrentCorrectLetter(firstCorrectLetter);
      setOptions(generateOptions(firstCorrectLetter));
    }
  }, [ayah]);

  const generateOptions = (correctLetter: string) => {
    const arabicAlphabet = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const newOptions = [correctLetter];
    while (newOptions.length < 4) {
      const randomLetter =
        arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
      if (!newOptions.includes(randomLetter)) {
        newOptions.push(randomLetter);
      }
    }
    return newOptions.sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = (selectedLetter: string) => {
    setDisplayedText((prev) => prev + selectedLetter);
    const nextPosition = position + 1;
    setPosition(nextPosition);

    if (nextPosition < sentence.text?.length) {
      // Still have letters to complete in the current verse
      const nextCorrectLetter = sentence.text[nextPosition];
      setCurrentCorrectLetter(nextCorrectLetter);
      setOptions(generateOptions(nextCorrectLetter));
    } else {
      // Verse completed
      setOptions([]);
      setCompleted(true);

      // Signal completion to parent component after a brief delay
      // to allow the user to see the completed text
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1500);
    }
  };

  const speakText = () => {
    // If already speaking, stop it
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    const audio = new Audio(sentence.audio);
    
    // Add event listeners to handle when audio finishes or errors
    audio.addEventListener('ended', () => setIsSpeaking(false));
    audio.addEventListener('error', () => {
      setIsSpeaking(false);
      setErrorMessage('Error playing audio');
    });
    
    audio.play().catch(error => {
      setIsSpeaking(false);
      setErrorMessage('Failed to play audio');
      console.error('Audio playback failed:', error);
    });
  };

  const handleSkipVerse = () => {
    // Set displayed text to the full sentence to show what was skipped
    setDisplayedText(sentence.text);
    setOptions([]);
    setCompleted(true);

    // Signal completion to parent component after a brief delay
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };

  const handleCloseError = () => {
    setErrorMessage('');
  };

  return (
    <Box
      className={`writing-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <Box className="header-controls">
        {verseNumber && (
          <Typography className="verse-number">Verse {verseNumber}</Typography>
        )}
        <Box className="control-buttons">
          <Tooltip title="Listen to pronunciation">
            <IconButton
              onClick={speakText}
              className={`speaker-button ${isSpeaking ? 'speaking' : ''}`}
              aria-label="Listen to pronunciation"
            >
              <VolumeUpIcon />
            </IconButton>
          </Tooltip>

          {!completed && (
            <Tooltip title="Skip this verse">
              <IconButton
                onClick={handleSkipVerse}
                className="skip-button"
                aria-label="Skip this verse"
              >
                <SkipNextIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Typography
        className="arabic-text"
        variant="h5"
        component="div"
        dir="rtl"
      >
        {displayedText}
      </Typography>
      <Box className="writing-lines">
        <div className="line"></div>
        <div className="line"></div>
        {/* <div className="line"></div> */}
      </Box>
      <CandidateTextDeck
        options={options}
        position={position}
        sentenceLength={sentence.text?.length}
        correctLetter={currentCorrectLetter}
        onOptionClick={handleOptionClick}
        isDarkMode={isDarkMode}
      />

      {completed && (
        <Box className="verse-completion-message">
          <Typography>Good job! Moving to next verse...</Typography>
        </Box>
      )}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
      />
    </Box>
  );
};

export default WritingLines;
