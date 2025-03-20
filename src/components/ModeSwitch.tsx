'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../contexts/ThemeContext';

interface ModeSwitchProps {
  align?: 'start' | 'end' | 'center';
}

export default function ModeSwitch({ align = 'end' }: Readonly<ModeSwitchProps>) {
  const { mode, toggleTheme } = useThemeContext();
  
  // Extract the nested ternary operation to an independent statement
  const justifyContentValue = align === 'start' 
    ? 'flex-start' 
    : align === 'end' 
      ? 'flex-end' 
      : 'center';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: justifyContentValue,
        p: 1,
      }}
    >
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
