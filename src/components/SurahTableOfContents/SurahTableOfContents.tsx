'use client';

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import ModeSwitch from '../ModeSwitch';

import './SurahTableOfContents.scss';
import { Surah } from '@huroofhub/interface/Surah';

interface SurahTableOfContentsProps {
  initialSurahs: Surah[]; // Data from server component
  onSurahSelect: (surahId: number) => void;
}

const SurahTableOfContents: React.FC<SurahTableOfContentsProps> = ({
  initialSurahs,
  onSurahSelect,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [surahs] = useState<Surah[]>(initialSurahs); // Use data from server
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSurahSelect = (surahId: number) => {
    setSelectedSurah(surahId);
    onSurahSelect(surahId);
  };

  return (
    <Box
      className={`surah-toc ${isDarkMode ? 'dark-mode' : 'light-mode'} ${
        expanded ? 'expanded' : 'collapsed'
      }`}
    >
      <Box className="toc-header">
        <Typography variant="h6" component="div" className="title">
          {expanded ? 'Surahs' : ''}
        </Typography>
        <IconButton onClick={handleToggleExpand} className="toggle-button">
          {expanded ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      <List className="surah-list">
        {surahs.map((surah) => (
          <ListItem
            key={surah.id}
            disablePadding
            className={selectedSurah === surah.id ? 'selected' : ''}
          >
            <Tooltip
              title={
                expanded
                  ? ''
                  : `${surah.englishName} - ${surah.englishNameTranslation}`
              }
              placement="right"
            >
              <ListItemButton
                onClick={() => handleSurahSelect(surah.id)}
                className="surah-item"
              >
                <Box className="surah-number">{surah.id}</Box>

                {expanded && (
                  <ListItemText
                    primary={surah.name}
                    secondary={`${surah.englishName} (${surah.numberOfAyahs} verses)`}
                    className="surah-details"
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Add mode switch at the bottom */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: (theme) => theme.palette.background.paper,
          mt: 'auto',
          display: expanded ? 'block' : 'none',
        }}
      >
        <ModeSwitch align="start" />
      </Box>
    </Box>
  );
};

export default SurahTableOfContents;
