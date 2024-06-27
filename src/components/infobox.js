import Webcam from "react-webcam";
import React, { useCallback,useState, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Done, Mic, Videocam } from '@mui/icons-material';
import './infobox.css';

const InfoBox = ({ faceVerified, audioVerified, onCaptureImage, onAudioVerification, updateStatus, videoRef }) => {
  const [loading, setLoading] = useState(false);
  const [isFaceCaptured, setIsFaceCaptured] = useState(false);
  const [isAudioVerificationStarted, setIsAudioVerificationStarted] = useState(false);
  const canvasRef = useRef(null);

  // const captureImage = () => {
  //   const context = canvasRef.current.getContext('2d');
  //   context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
  //   return canvasRef.current.toDataURL('image/jpeg');
  // };
  const captureImage = () => {
    const videoElement = videoRef.current;
    console.log(videoElement);
    console.log(videoElement.videoWidth);
    console.log(videoElement.videoHeight);

    // Ensure videoElement and its dimensions are available
    if (videoElement && videoElement.videoWidth && videoElement.videoHeight) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Set canvas dimensions based on video dimensions
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw video frame onto canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64 image data
      return canvas.toDataURL('image/jpeg');
    }

    return null; // Handle if video dimensions are not available
  };

  function dataUrlToBlob(dataUrl) {
    const [metadata, base64Data] = dataUrl.split(',');
    const byteString = atob(base64Data);
    const mimeType = metadata.match(/:(.*?);/)[1];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([uint8Array], { type: mimeType });
  }
  

  const handleCaptureImage = async () => {
    setLoading(true);
    const imageData = captureImage();
    const blob = dataUrlToBlob(imageData);
    const interviewee_id = 5;
    if (imageData) {
      try {
        const formData = new FormData();
        formData.append('interviewee_id', interviewee_id);
        formData.append('file', blob, 'capture.jpg');
        console.log(formData);
  
        // Fetch request to backend API endpoint
        const response = await fetch('https://5712-2401-4900-1c5c-1cfc-a5d8-e092-b0a1-a093.ngrok-free.app/deepface/verify/', {
          method: 'POST',
          body: formData,
          headers: {
            // Add any necessary headers here
          },
        });
        // console.log(response);
        if (response.ok) {
          // Handle successful response
          const data = await response.json();
          console.log('Verification result:', data);
          if(data['match'] === true){
            setIsFaceCaptured(true);
            onCaptureImage(imageData); // Pass imageData to parent component
            updateStatus('Image captured and verified successfully.');
          }
          else{
            updateStatus('Image captured but not verified. Please try again.');
          }
        } else {
          const errorDetails = await response.json();
          console.error('Error details:', errorDetails);
          // Handle error response
          console.error('Failed to verify image:', response.statusText);
          updateStatus('Failed to capture or verify image.');
        }
      } catch (error) {
        console.error('Error:', error);
        updateStatus('Error occurred while capturing or verifying image.');
      }
    } else {
      updateStatus('Failed to capture image.');
    }
    setLoading(false);
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
        window.location.href = 'https://clocktantra-sockets-production.up.railway.app/room.html?room=d88d883b1';
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
              disabled={loading || isFaceCaptured}
              className="action-button"
              startIcon={<Videocam />}
            >
              {loading ? <CircularProgress size={24} /> : 'Capture Image'}
            </Button>
          )}
        </Box>
        <Box className="verification-status">
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
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
