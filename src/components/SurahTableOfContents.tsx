import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';

interface Surah {
  id: number;
  name: string;
  verses: number;
  isSelected: boolean;
}

// Mock function to simulate API call - replace with actual API call
const fetchSurahsFromAPI = async (): Promise<Surah[]> => {
  return Promise.resolve([
    { id: 1, name: 'Al-Fatihah', verses: 7, isSelected: false },
    { id: 2, name: 'Al-Baqarah', verses: 286, isSelected: false },
    // Add more surahs as needed
  ]);
};

interface SurahTableOfContentsProps {
  onSurahSelect?: (id: number) => void;
}

const SurahTableOfContents: React.FC<SurahTableOfContentsProps> = ({
  onSurahSelect,
}) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSurahsFromAPI();
        setSurahs(data);
        setIsLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        setIsLoading(false);
      }
    };

    loadSurahs();
  }, []);

  const handleSurahSelect = (id: number) => {
    setSelectedSurah(id);
    if (onSurahSelect) {
      onSurahSelect(id);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // Important for footer positioning
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Surahs
      </Typography>

      {(() => {
        if (isLoading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          );
        }
        if (error) {
          return (
            <Typography color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          );
        }
        return (
          <List
            sx={{
              width: '100%',
              flex: '1 1 auto',
              overflowY: 'auto',
              pb: 8, // Add padding bottom to avoid content being hidden by footer
            }}
          >
            {surahs.map((surah) => (
              <ListItem key={surah.id} disablePadding>
                <ListItemButton
                  selected={surah.id === selectedSurah}
                  onClick={() => handleSurahSelect(surah.id)}
                >
                  <ListItemText
                    primary={`${surah.id}. ${surah.name}`}
                    secondary={`Verses: ${surah.verses}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        );
      })()}
    </Box>
  );
};

export default SurahTableOfContents;
