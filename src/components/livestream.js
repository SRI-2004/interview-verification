// LiveStream.js
import React, { useEffect, useRef } from 'react';
import { Card, CardMedia } from '@mui/material';
import './livestream.css';

const LiveStream = ({ videoRef }) => {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam: ', err));
  }, [videoRef]);

  return (
    <Card className="live-stream">
      <CardMedia component="video" ref={videoRef} autoPlay />
    </Card>
  );
};

export default LiveStream;
