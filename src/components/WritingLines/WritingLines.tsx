'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import CandidateTextDeck from '../CandidateTextDeck/CandidateTextDeck';
import { useTheme } from '@mui/material/styles';

import './WritingLines.scss';

interface WritingLinesProps {
  text: string;
}

const WritingLines: React.FC<WritingLinesProps> = ({ text }) => {
  const [sentence, setSentence] = useState<string>(text);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [position, setPosition] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [currentCorrectLetter, setCurrentCorrectLetter] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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

  useEffect(() => {
    if (sentence.length > 0) {
      // Start with a random sentence
      setDisplayedText('');
      setPosition(0);
      const firstCorrectLetter = sentence[0] || '';
      setCurrentCorrectLetter(firstCorrectLetter);
      setOptions(generateOptions(firstCorrectLetter));
    }
  }, [sentence]);

  const handleOptionClick = (selectedLetter: string) => {
    setDisplayedText((prev) => prev + selectedLetter);
    const nextPosition = position + 1;
    setPosition(nextPosition);
    if (nextPosition < sentence.length) {
      const nextCorrectLetter = sentence[nextPosition];
      setCurrentCorrectLetter(nextCorrectLetter);
      setOptions(generateOptions(nextCorrectLetter));
    } else {
      setOptions([]);
    }
  };

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      setErrorMessage(
        'Your browser does not support text-to-speech functionality'
      );
      return;
    }

    // If already speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      const speech = new SpeechSynthesisUtterance();
      speech.text = sentence;
      speech.lang = 'ar-SA'; // Arabic language
      speech.rate = 0.8; // Slightly slower speech rate

      // Add event listeners for speech start and end
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = () => {
        setIsSpeaking(false);
        setErrorMessage('Error playing audio');
      };

      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(speech);
    } catch (error) {
      setErrorMessage('Failed to play audio');
    }
  };

  const handleCloseError = () => {
    setErrorMessage('');
  };

  return (
    <Box
      className={`writing-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <Box className="header-controls">
        <Tooltip title="Listen to pronunciation">
          <IconButton
            onClick={speakText}
            className={`speaker-button ${isSpeaking ? 'speaking' : ''}`}
            aria-label="Listen to pronunciation"
          >
            {isSpeaking ? <VolumeUpIcon /> : <VolumeUpIcon />}
          </IconButton>
        </Tooltip>
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
        <div className="line"></div>
      </Box>
      <CandidateTextDeck
        options={options}
        position={position}
        sentenceLength={sentence.length}
        correctLetter={currentCorrectLetter}
        onOptionClick={handleOptionClick}
        isDarkMode={isDarkMode}
      />
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
