import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Done, Mic, Percent, Videocam } from '@mui/icons-material';
import './infobox.css';

const InfoBox = ({ faceVerified, audioVerified, onCaptureImage, onAudioVerification, updateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [isFaceCaptured, setIsFaceCaptured] = useState(false);
  const [isAudioVerificationStarted, setIsAudioVerificationStarted] = useState(false);

  const handleCaptureImage = () => {
    setLoading(true);
    updateStatus('Verifying face...');
    setTimeout(() => {
      setLoading(false);
      setIsFaceCaptured(true);
      onCaptureImage();
      updateStatus('Face verified. Click to start audio verification.');
    }, 2000);
  };

  const handleAudioVerification = () => {
    setLoading(true);
    updateStatus('Verifying audio...');
    setTimeout(() => {
      setLoading(false);
      setIsAudioVerificationStarted(false);
      onAudioVerification();
      updateStatus('Audio verified. Redirecting to interview...');
      setTimeout(() => {
        window.location.href = 'https://meet.google.com';
      }, 2000);
    }, 2000);
  };

  const toggleAudioVerification = () => {
    if (isAudioVerificationStarted) {
      handleAudioVerification();
    } else {
      setIsAudioVerificationStarted(true);
      updateStatus('Audio verification started. Please read the text.');
    }
  };

  return (
    <Card className="info-box">
      <CardContent className="info-content">
        <Typography variant="h6" align="center" className="info-header">User Information</Typography>
        <Box className="info-details">
          <Box className="info-item">
            <Typography>Name: John Doe</Typography>
          </Box>
          <Box className="info-item">
            <Typography>Interview ID: 12345</Typography>
          </Box>
        </Box>
        <Box className="action-buttons">
          {isFaceCaptured ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleAudioVerification}
              disabled={loading}
              className="action-button"
            >
              {loading ? <CircularProgress size={24} /> : (isAudioVerificationStarted ? 'Stop' : 'Start Audio Verification')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCaptureImage}
              disabled={loading}
              className="action-button"
            >
              {loading ? <CircularProgress size={24} /> : 'Capture Image'}
            </Button>
          )}
        </Box>
        <Box  className="verification-status">
          <Box className="status-item">
            <Videocam sx={{ fontSize: 30 }} />
            <Typography variant="h6" className="status-text">Face Verified</Typography>
            {loading && !faceVerified ? (
              <CircularProgress size={18} className="status-loader" />
            ) : (
              faceVerified && <Done className="status-icon" />
            )}
          </Box>
          <Box className="status-item">
            <Mic sx={{ fontSize: 30 }} />
            <Typography variant="h6" className="status-text">Audio Verified</Typography>
            {loading && !audioVerified ? (
              <CircularProgress size={18} className="status-loader" />
            ) : (
              audioVerified && <Done className="status-icon" />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
