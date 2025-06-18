"use client"
import { useState, useRef, useEffect } from 'react';
import CameraView from './components/CameraView';
import StripLayoutSelector from './components/StripLayoutSelector';
import CustomTextInput from './components/CustomTextInput';
import PhotoStripGallery from './components/PhotoStripGallery';

export default function PhotoBooth() {
  const [photos, setPhotos] = useState([]);
  const [photoStrips, setPhotoStrips] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState(null);
  const [stripRows, setStripRows] = useState(3);
  const [stripCols, setStripCols] = useState(1);

  const [customText, setCustomText] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const stripCanvasRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraOn(true);
      setError(null);
    } catch (err) {
      setError('Could not access the camera. Please check permissions.');
      console.log(err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (flash) {
      document.body.style.backgroundColor = 'white';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 200);
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.save();
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.restore();

    const photoUrl = canvas.toDataURL('image/jpeg', 0.95);
    setPhotos(prev => [...prev, photoUrl]);
  };

  // Create photo strip when we have enough photos
  useEffect(() => {
    if (photos.length === stripRows * stripCols) {
      createPhotoStrip();
      setPhotos([]);
    }
  }, [photos, stripRows, stripCols]);

  // Create a combined photo strip
  const createPhotoStrip = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions (vertical strip)
    const photoWidth = 600;
    const aspectRatio = 9/16;
    const photoHeight = Math.round(photoWidth * aspectRatio);
    const padding = 30;
    const bottomMargin = 8 * padding;
    const fontSize = 32;
    const stripWidth = (photoWidth * stripCols) + (padding * (stripCols + 1));
    const stripHeight = (photoHeight * stripRows) + (padding * (stripRows + 1)) + bottomMargin;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Draw each photo
    const imageLoadPromises = photos.map((photo, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const row = Math.floor(index / stripCols);
          const col = index % stripCols;
          const x = padding + col * (photoWidth + padding);
          const y = padding + row * (photoHeight + padding);

          ctx.fillStyle = '#ddd';
          ctx.fillRect(x - 2, y - 2, photoWidth + 4, photoHeight + 4);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
          resolve();
        };
        img.src = photo;
      });
    });

    // When all images are loaded, save the strip
    Promise.all(imageLoadPromises).then(() => {
      // Add custom text if provided
      if (customText) {
        ctx.fillStyle = '#333';
        ctx.font = `${fontSize}px bold Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(customText, stripWidth / 2, stripHeight - bottomMargin + fontSize);
      }

      const stripUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoStrips(prev => [...prev, stripUrl]);
    });
  };

  // Take multiple photos with countdown and delay between each
  const takeMultiplePhotos = async (numPhotos = 3, delay = 1000) => {
    for (let i = 0; i < numPhotos; i++) {
      await new Promise(resolve => {
        setIsCountingDown(true);
        let localCount = 3;
        setCountDown(localCount);
        const timer = setInterval(() => {
          localCount -= 1;
          setCountDown(localCount);
          if (localCount <= 0) {
            clearInterval(timer);
            capturePhoto();
            setIsCountingDown(false);
            setCountDown(3);
            resolve();
          }
        }, 1000);
      });
      if (i < numPhotos - 1) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  };

  // Download photo strip
  const downloadStrip = (stripUrl) => {
    const link = document.createElement('a');
    link.href = stripUrl;
    link.download = `photo-strip-${new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear photo strips
  const clearStrips = () => {
    setPhotoStrips([]);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Attach stream to video element when both are ready
  useEffect(() => {
    if (isCameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.log("Video play error:", e));
    }
  }, [isCameraOn]);

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800'>
      <header className='text-center p-8 bg-white/80 shadow-md'>
        <h1 className='text-4xl font-bold text-blue-700 m-0'>Photo Booth</h1>
        <p className='text-gray-600 mt-2'>Capture your moments with style</p>
      </header>
      <main className='flex-1 p-8 max-w-6xl mx-auto w-full'>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
          {/* Camera View */}
          <div className="flex-1 min-w-[320px] max-w-2xl">
            <CameraView
              isCameraOn={isCameraOn}
              isCountingDown={isCountingDown}
              countDown={countDown}
              flash={flash}
              videoRef={videoRef}
              startCamera={startCamera}
              stopCamera={stopCamera}
              takeMultiplePhotos={takeMultiplePhotos}
              setFlash={setFlash}
              stripRows={stripRows}
              stripCols={stripCols}
            />
            <canvas ref={canvasRef} className='hidden'/>
            <canvas ref={stripCanvasRef} className='hidden' />
          </div>
          {/* Options Panel */}
          <div className="w-full md:w-96 flex flex-col gap-6 bg-white/80 rounded-xl shadow-lg p-6">
            {error && (
              <div className='p-4 bg-red-100 text-red-800 rounded mb-2 text-center'>
                {error}
              </div>
            )}
            <StripLayoutSelector
              stripRows={stripRows}
              stripCols={stripCols}
              setStripRows={setStripRows}
              setStripCols={setStripCols}
            />
            <CustomTextInput customText={customText} setCustomText={setCustomText} />
            {/* BackgroundSelector can be added here in the future */}
          </div>
        </div>
        <PhotoStripGallery
          photoStrips={photoStrips}
          downloadStrip={downloadStrip}
          clearStrips={clearStrips}
        />
      </main>
    </div>
  );
}