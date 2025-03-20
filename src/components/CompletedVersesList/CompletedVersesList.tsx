import React from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CompletedVerseCard from '../CompletedVerseCard/CompletedVerseCard';
import './CompletedVersesList.scss';

interface CompletedVersesListProps {
  ayahs: Array<{
    id: number;
    audio: string;
    text: string;
    numberInSurah: number;
    translation: string;
  }>;
}

const CompletedVersesList: React.FC<CompletedVersesListProps> = ({
  ayahs,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (ayahs.length === 0) {
    return null;
  }

  return (
    <Box className="completed-verses-container">
      <Box className="completed-verses-header" onClick={toggleExpanded}>
        <Typography variant="subtitle1">
          Completed Verses ({ayahs.length})
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={expanded}>
        <Box className="completed-verses-list">
          {ayahs.map((ayah) => (
            <CompletedVerseCard key={ayah.id} ayah={ayah} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default CompletedVersesList;
