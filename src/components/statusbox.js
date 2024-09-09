import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import './statusbox.css';

const StatusBox = ({ status }) => {
  const shouldDisplayParagraph = [
    'Face verified. Click to start audio verification. Please read the following text aloud.',
    'Audio verification started. Please read the text.',
  ].includes(status);

  return (
    <Card className="status-box">
      <CardContent>
        <Typography variant="h5" align="center" className="status-text">{status}</Typography>
        <Box mt={2} display="flex" justifyContent="center">
          {(status === 'Verifying face...' || status === 'Verifying audio...') && <CircularProgress className="status-loader" />}
        </Box>
        {shouldDisplayParagraph && (
          <Box mt={-1} className="prompt-box">
            <Typography  variant="h5" align="center" className="prompt-content">
            "On a brisk autumn morning, the eloquent speaker confidently addressed the eager crowd, captivating everyone with tales of a dragons treasure hidden beneath the ancient willow tree. The melodic song of a distant nightingale added to the enchantment, creating an unforgettable ambiance that lingered long after the last word had been spoken."
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusBox;
