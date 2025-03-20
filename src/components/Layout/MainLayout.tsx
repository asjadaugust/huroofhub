'use client';

import React, { useState } from 'react';
import { Box, CssBaseline, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SurahTableOfContents from '../SurahTableOfContents/SurahTableOfContents';
import WritingLines from '../WritingLines/WritingLines';
import CompletedVersesList from '../CompletedVersesList/CompletedVersesList';
import { getSurahById } from '../../api/utils/surahUtils';

import './MainLayout.scss';
import { Surah } from '@huroofhub/interface/Surah';
import { Ayah } from '@huroofhub/interface/Ayah';

interface MainLayoutProps {
  children?: React.ReactNode;
  initialSurahs: Surah[]; // Add this to receive the server-fetched surahs
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, initialSurahs }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah>({
    id: 0,
    name: '',
    englishName: '',
    englishNameTranslation: '',
    numberOfAyahs: 0,
    ayahs: [],
  });

  React.useEffect(() => {
    const fetchFirstSurah = async () => {
      try {
        const firstSurah = await getSurahById(1);
        setSelectedSurah(firstSurah || selectedSurah);
      } catch (error) {
        console.error('Failed to fetch first surah:', error);
      }
    };

    fetchFirstSurah();
  }, []);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [completedVerses, setCompletedVerses] = useState<Ayah[]>([]);
  const [surahCompleted, setSurahCompleted] = useState<boolean>(false);
  const theme = useTheme();

  const handleSurahSelect = async (surahId: number) => {
    const surahData = await getSurahById(surahId);
    setSelectedSurah(surahData || selectedSurah);
    setCurrentVerseIndex(0);
    setCompletedVerses([]);
    setSurahCompleted(false);
  };

  const handleVerseComplete = () => {
    if (!selectedSurah?.ayahs) return;

    // Add the completed verse to our tracking array
    const completedVerse = selectedSurah.ayahs[currentVerseIndex];
    setCompletedVerses([...completedVerses, completedVerse]);

    // Move to the next verse
    const nextVerseIndex = currentVerseIndex + 1;

    if (nextVerseIndex < selectedSurah.ayahs.length) {
      setCurrentVerseIndex(nextVerseIndex);
    } else {
      // All verses in the surah have been completed
      setSurahCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentVerseIndex(0);
    setCompletedVerses([]);
    setSurahCompleted(false);
  };

  // Get the current verse text based on the index
  const getCurrentVerse = () : Ayah => {
    if (!selectedSurah?.ayahs?.length) {
      return {
        id: 0,
        text: 'Select a surah to start practicing',
        numberInSurah: 0,
        audio: '',
        translation: '',
      }; // Default text if no surah selected
    }

    if (currentVerseIndex >= selectedSurah.ayahs.length) {
      return {
        id: 0,
        text: 'All verses completed',
        numberInSurah: 0,
        audio: '',
        translation : '',
      }; // Handled by surahCompleted state
    }

    return selectedSurah.ayahs[currentVerseIndex];
  };

  return (
    <Box
      className={`main-layout ${
        theme.palette.mode === 'dark' ? 'dark-mode' : 'light-mode'
      }`}
    >
      <CssBaseline />

      <Box className="layout-container">
        <Box className="sidebar">
          {/* Use SurahTableOfContents directly with server-fetched data */}
          <SurahTableOfContents
            initialSurahs={initialSurahs}
            onSurahSelect={handleSurahSelect}
          />
        </Box>

        <Box className="content">
          {completedVerses.length > 0 && (
            <CompletedVersesList ayahs={completedVerses} />
          )}

          {surahCompleted ? (
            <Box className="surah-completion">
              <Typography variant="h4" gutterBottom>
                Congratulations!
              </Typography>
              <Typography variant="body1" component="p">
                You have completed all verses in {selectedSurah.name} (
                {selectedSurah.englishNameTranslation})
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRestart}
              >
                Practice Again
              </Button>
            </Box>
          ) : (
            <WritingLines
              ayah={getCurrentVerse()}
              onComplete={handleVerseComplete}
              verseNumber={selectedSurah ? currentVerseIndex + 1 : undefined}
            />
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
