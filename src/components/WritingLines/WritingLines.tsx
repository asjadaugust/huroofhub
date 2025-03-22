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
    // Create a copy of the ayah with trimmed text
    const trimmedAyah = {
      ...ayah,
      text: ayah.text?.trim() || '',
    };

    setSentence(trimmedAyah);
    setDisplayedText('');
    setPosition(0);
    setCompleted(false);

    if (trimmedAyah.text?.length > 0) {
      const firstCorrectLetter = trimmedAyah.text[0] || '';
      setCurrentCorrectLetter(firstCorrectLetter);
      setOptions(generateOptions(firstCorrectLetter));
    }
  }, [ayah]);

  const generateOptions = (correctLetter: string) => {
    const arabicAlphabet = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const arabicDiacritics = 'ًٌٍَُِّْٰٓٔـ';
    const newOptions = [correctLetter];

    // Check if the correct letter is a diacritic
    const isDiacritic = arabicDiacritics.includes(correctLetter);

    if (isDiacritic) {
      // Get contextually relevant diacritics based on what's already been written
      const contextDiacritics = getMostLikelyDiacritics(
        displayedText,
        correctLetter
      );

      // Add challenging but contextually relevant diacritic options first
      for (const diacritic of contextDiacritics) {
        if (!newOptions.includes(diacritic) && newOptions.length < 4) {
          newOptions.push(diacritic);
        }
      }
    } else {
      // Get contextually relevant letters based on what's already been written
      const contextLetters = getMostLikelyNextLetters(
        displayedText,
        correctLetter
      );

      // Add challenging but contextually relevant options first
      for (const letter of contextLetters) {
        if (!newOptions.includes(letter) && newOptions.length < 4) {
          newOptions.push(letter);
        }
      }
    }

    // If we still need more options, add random letters or diacritics
    while (newOptions.length < 4) {
      const randomChar = isDiacritic
        ? arabicDiacritics[Math.floor(Math.random() * arabicDiacritics.length)]
        : arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];

      if (!newOptions.includes(randomChar)) {
        newOptions.push(randomChar);
      }
    }

    return newOptions.sort(() => Math.random() - 0.5);
  };

  // Get contextually relevant diacritics
  const getMostLikelyDiacritics = (
    context: string,
    correctDiacritic: string
  ): string[] => {
    // Common diacritic patterns in Arabic
    const diacriticPatterns: Record<string, string[]> = {
      // Fatha
      'َ': ['ُ', 'ِ', 'ّ', 'ْ'],
      // Damma
      'ُ': ['َ', 'ِ', 'ّ', 'ْ'],
      // Kasra
      'ِ': ['َ', 'ُ', 'ّ', 'ْ'],
      // Shadda
      'ّ': ['َ', 'ُ', 'ِ', 'ْ'],
      // Sukun
      'ْ': ['َ', 'ُ', 'ِ', 'ّ'],
      // Tanween Fath
      'ً': ['ٌ', 'ٍ', 'َ', 'ُ'],
      // Tanween Damm
      'ٌ': ['ً', 'ٍ', 'ُ', 'َ'],
      // Tanween Kasr
      'ٍ': ['ً', 'ٌ', 'ِ', 'َ'],
      // Maddah
      'ٓ': ['ٔ', 'ْ', 'ّ', 'َ'],
      // Hamza above
      'ٔ': ['ٓ', 'ْ', 'ّ', 'َ'],
      // Alef Khanjareeya
      'ٰ': ['َ', 'ُ', 'ِ', 'ّ'],
      // Tatweel
      ـ: ['ّ', 'ْ', 'َ', 'ُ'],
    };

    // Specific contextual patterns - which diacritics commonly follow certain letters
    const letterDiacriticPatterns: Record<string, string[]> = {
      ا: ['َ', 'ُ', 'ِ', 'ْ'],
      ب: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
      ت: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
      ل: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
      م: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
      ن: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
      و: ['َ', 'ُ', 'ْ', 'ٌ'],
      ي: ['َ', 'ُ', 'ِ', 'ّ', 'ْ'],
    };

    let likelyDiacritics: string[] = [];

    // If we have context, use the last letter to predict likely diacritics
    if (context.length > 0) {
      const lastChar = context[context.length - 1];

      // If we have specific patterns for this letter
      if (letterDiacriticPatterns[lastChar]) {
        likelyDiacritics = letterDiacriticPatterns[lastChar].filter(
          (d) => d !== correctDiacritic
        );
      }
      // Else use general diacritic patterns
      else if (diacriticPatterns[correctDiacritic]) {
        likelyDiacritics = diacriticPatterns[correctDiacritic];
      }
    } else if (diacriticPatterns[correctDiacritic]) {
      // If no context, just use the common pattern for this diacritic
      likelyDiacritics = diacriticPatterns[correctDiacritic];
    }

    // Ensure we don't include the correct diacritic
    return likelyDiacritics.filter((d) => d !== correctDiacritic);
  };

  // Simple implementation of n-gram based letter prediction
  const getMostLikelyNextLetters = (
    context: string,
    correctLetter: string
  ): string[] => {
    // Common letter pairs in Arabic - simplified n-gram model
    // These pairs represent letters that commonly follow each other
    const commonPairs: Record<string, string[]> = {
      ا: ['ل', 'ن', 'م', 'ر'],
      ب: ['ا', 'ي', 'ر', 'ن'],
      ت: ['ا', 'ي', 'و', 'ر'],
      ث: ['م', 'ر', 'ن', 'ل'],
      ج: ['ا', 'ر', 'د', 'ع'],
      ح: ['م', 'ي', 'د', 'ت'],
      خ: ['ر', 'ي', 'ل', 'ت'],
      د: ['ا', 'ي', 'و', 'ر'],
      ذ: ['ا', 'ل', 'ي', 'ر'],
      ر: ['ا', 'ب', 'س', 'ي'],
      ز: ['ي', 'ل', 'م', 'ن'],
      س: ['ا', 'ل', 'م', 'ت'],
      ش: ['ي', 'ر', 'ا', 'ت'],
      ص: ['ا', 'ل', 'ر', 'د'],
      ض: ['ر', 'ي', 'ل', 'ا'],
      ط: ['ا', 'ي', 'ل', 'ر'],
      ظ: ['ي', 'ل', 'م', 'ا'],
      ع: ['ل', 'ن', 'م', 'ي'],
      غ: ['ي', 'ر', 'ف', 'ا'],
      ف: ['ي', 'ا', 'ر', 'ع'],
      ق: ['ا', 'ل', 'و', 'د'],
      ك: ['ا', 'م', 'ر', 'ت'],
      ل: ['ا', 'م', 'ل', 'ي'],
      م: ['ا', 'ن', 'ي', 'و'],
      ن: ['ا', 'و', 'ي', 'ه'],
      ه: ['ا', 'م', 'و', 'ي'],
      و: ['ا', 'ل', 'ن', 'م'],
      ي: ['ن', 'ر', 'د', 'ة'],
    };

    let likelyLetters: string[] = [];

    // If we have context, use the last letter to predict likely next letters
    if (context.length > 0) {
      const lastChar = context[context.length - 1];
      if (commonPairs[lastChar]) {
        // Filter out the correct letter to ensure we only offer challenging alternatives
        likelyLetters = commonPairs[lastChar].filter(
          (l) => l !== correctLetter
        );
      }
    }

    // If we haven't found likely letters or context is empty,
    // use letters that are visually similar to the correct letter
    if (likelyLetters.length < 3) {
      // Map of visually similar Arabic letters
      const similarLetters: Record<string, string[]> = {
        ب: ['ت', 'ث', 'ن', 'ي'],
        ت: ['ب', 'ث', 'ن', 'ي'],
        ث: ['ب', 'ت', 'ن', 'ي'],
        ج: ['ح', 'خ'],
        ح: ['ج', 'خ'],
        خ: ['ج', 'ح'],
        د: ['ذ'],
        ذ: ['د'],
        ر: ['ز', 'و'],
        ز: ['ر'],
        س: ['ش', 'ص'],
        ش: ['س'],
        ص: ['ض', 'س'],
        ض: ['ص'],
        ط: ['ظ'],
        ظ: ['ط'],
        ع: ['غ'],
        غ: ['ع'],
        ف: ['ق'],
        ق: ['ف'],
        ك: ['ل'],
        م: ['ه'],
        ن: ['ب', 'ت', 'ث', 'ي'],
        ه: ['م'],
        و: ['ر'],
        ي: ['ب', 'ت', 'ث', 'ن'],
      };

      if (similarLetters[correctLetter]) {
        const visuallySimilar = similarLetters[correctLetter].filter(
          (l) => !likelyLetters.includes(l)
        );
        likelyLetters = [...likelyLetters, ...visuallySimilar];
      }
    }

    return likelyLetters;
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

    audio.play().catch((error) => {
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
