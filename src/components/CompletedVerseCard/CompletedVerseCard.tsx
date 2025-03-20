import React from 'react';
import { Paper, Typography, Box, IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useTheme } from '@mui/material/styles';
import './CompletedVerseCard.scss';
import { Ayah } from '@huroofhub/interface/Ayah';

interface CompletedVerseCardProps {
  ayah: Ayah;
}

const CompletedVerseCard: React.FC<CompletedVerseCardProps> = ({ ayah }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const speakVerse = () => {
    const audio = new Audio(ayah.audio);
    audio.play();
  }

  return (
    <Paper
      elevation={1}
      className={`completed-verse-card ${
        isDarkMode ? 'dark-mode' : 'light-mode'
      }`}
    >
      <Box
        className="verse-number"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption">Verse {ayah.id}</Typography>
        <Tooltip title="Listen to ayah">
          <IconButton
            size="small"
            onClick={speakVerse}
            aria-label="listen to ayah"
          >
            <VolumeUpIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="h6" className="arabic-text" dir="rtl">
        {ayah.text}
      </Typography>
      <Typography variant="body2" className="translation">
        {ayah.translation}
      </Typography>
    </Paper>
  );
};

export default CompletedVerseCard;
