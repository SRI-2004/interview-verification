import Webcam from "react-webcam";
import React, { useState, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import LiveStream from './components/livestream';
import InfoBox from './components/infobox';
import StatusBox from './components/statusbox';
import { useSearchParams } from 'react-router-dom';

import './App.css';

const App = () => {
  const [status, setStatus] = useState('Click to start face verification');
  const [faceVerified, setFaceVerified] = useState(false);
  const [audioVerified, setAudioVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); 
  const url = searchParams.get('url');
  const videoRef = useRef(null);

  console.log(id);

  const handleCaptureImage = () => {
    setFaceVerified(true);
  };

  const handleAudioVerification = () => {
    setAudioVerified(true);
  };

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Box className="main-container">
      <Box className="content">
        <Box className="top-section">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LiveStream videoRef={videoRef} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoBox
                faceVerified={faceVerified}
                audioVerified={audioVerified}
                onCaptureImage={handleCaptureImage}
                onAudioVerification={handleAudioVerification}
                updateStatus={updateStatus}
                videoRef={videoRef}
                id={id}
                url={url}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className="status-box-container">
          <StatusBox status={status} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
