import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Done, Mic, Videocam } from '@mui/icons-material';
import './infobox.css';

const InfoBox = ({ faceVerified, audioVerified, onCaptureImage, onAudioVerification, updateStatus, videoRef, id, url }) => {
  const [loading, setLoading] = useState(false);
  const [isFaceCaptured, setIsFaceCaptured] = useState(false);
  const [isAudioVerificationStarted, setIsAudioVerificationStarted] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  url = 'https://meet.google.com/'
  const captureImage = () => {
    const videoElement = videoRef.current;

    if (videoElement && videoElement.videoWidth && videoElement.videoHeight) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL('image/jpeg');
    }

    return null;
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
  const interviewee_id = 5;
  const handleCaptureImage = async () => {
    setLoading(true);
    const imageData = captureImage();
    const blob = dataUrlToBlob(imageData);
    if (imageData) {
      try {
        const formData = new FormData();
        formData.append('interviewee_id', id);
        formData.append('file', blob, 'capture.jpg');

        const response = await fetch('https://77s80p1k-8000.inc1.devtunnels.ms/deepface/verify/', {
          method: 'POST',
          body: formData,
          headers: {
            // Add any necessary headers here
          },
        });
        

        if (response.ok) {
          const data = await response.json();
          if (data['match'] === true) {
            setIsFaceCaptured(true);
            onCaptureImage(imageData);
            updateStatus('Image captured and verified successfully.');
          } else {
            updateStatus('Image captured but not verified. Please try again.');
          }
        } else {
          const errorDetails = await response.json();
          console.error('Error details:', errorDetails);
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
  

  const handleStartAudioVerification = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          audioChunksRef.current = [];
          updateStatus('Audio recorded. Verifying...');

          const formData = new FormData();
          formData.append('interviewee_id', id);
          formData.append('file', audioBlob, 'recording.wav');

          try {
            const response = await fetch('https://77s80p1k-8000.inc1.devtunnels.ms/audio/verify/', {
              method: 'POST',
              body: formData,
              headers: {
                // Add any necessary headers here
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data['match'] === true) {
                onAudioVerification();
                updateStatus('Audio verified. Redirecting to interview...');
                setTimeout(() => {
                  window.location.href = url;
                }, 2000);
              } else {
                updateStatus('Audio captured but not verified. Please try again.');

              }
            } else {
              const errorDetails = await response.json();
              console.error('Error details:', errorDetails);
              console.error('Failed to verify audio:', response.statusText);
              updateStatus('Failed to capture or verify audio.');
            }
          } catch (error) {
            console.error('Error:', error);
            updateStatus('Error occurred while capturing or verifying audio.');
          }
        };
        mediaRecorderRef.current.start();
        updateStatus('Audio verification started. Please read the text.');
        setIsAudioVerificationStarted(true);
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
        updateStatus('Failed to access microphone. Please check your settings.');
      });
  };

  const handleStopAudioVerification = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      updateStatus('Audio recording stopped.');
      setIsAudioVerificationStarted(false);
    }
  };

  const toggleAudioVerification = () => {
    if (isAudioVerificationStarted) {
      handleStopAudioVerification();
    } else {
      handleStartAudioVerification();
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
            <Typography>Interview ID: {id}</Typography>
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
