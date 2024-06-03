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
              "Eyes glued to the newsfeed, another crazy headline. Guess a second cup of coffee is the only sane option left. Fresh paint smell stinging my nose, but hey, at least the leaky roof is finally a memory. Now, where'd I put those unpacking boxes?. Heart hammering a frantic rhythm against my ribs. One more wrong turn and I'll be permanently lost in this labyrinthine market. But hey, gotta find those spices for grandma's recipe."
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusBox;
