import React, { useRef, useEffect } from 'react';
import { Card, CardMedia } from '@mui/material';
import './livestream.css';

const LiveStream = () => {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('Error accessing webcam: ', err));
  }, []);

  return (
    <Card className="live-stream">
      <CardMedia component="video" ref={videoRef} autoPlay />
    </Card>
  );
};

export default LiveStream;
