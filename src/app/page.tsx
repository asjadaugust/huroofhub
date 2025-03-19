import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import WritingLines from '@huroofhub/components/WritingLines/WritingLines';

export default function Home() {
  const arabicText = 'مرحبا بكم في موقعنا';
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <WritingLines text={arabicText} />
      </Box>
    </Container>
  );
}
