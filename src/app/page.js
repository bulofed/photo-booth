// page.js
"use client"
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import Header from './components/Header';
import CameraView from './components/CameraView';
import StripLayoutSelector from './components/StripLayoutSelector';

export default function PhotoBooth() {

  const router = useRouter();

  const [photos, setPhotos] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState(null);

  const [layout, setLayout] = useState([
    [0],
    [1],
    [2]
  ])
  const [padding, setPadding] = useState(30);
  const [topMargin, setTopMargin] = useState(4 * padding);
  const [bottomMargin, setBottomMargin] = useState(8 * padding);

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

  function countPhotoCells(layout) {
    return layout.flat().filter(cell => typeof cell === 'number').length;
  }

  // Create a combined photo strip
  const generateStrip = async (data) => {
    const response = await fetch('/api/generate-strip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Generation failed');
    return await response.json();
  };

  useEffect(() => {
    const generateAndSaveStrip = async () => {
      const neededPhotos = countPhotoCells(layout);
      if (photos.length === neededPhotos && neededPhotos > 0) {
        const { stripUrl } = await generateStrip({
          photos: photos,
          layout: layout
        });
        localStorage.setItem('photoStripData', JSON.stringify({
          stripUrl,
          photos,
          layout,
          dimensions: {
            padding,
            topMargin,
            bottomMargin,
            backgroundColor: '#ffffff',
            photoBorderColor: '#dddddd'
          }
        }));
        router.push('/customize');
      }
    };
    
    generateAndSaveStrip();
  }, [photos, layout, router]);

  const takeMultiplePhotos = async () => {
    const numPhotos = countPhotoCells(layout);
    setIsCountingDown(true);
    
    for (let i = 0; i < numPhotos; i++) {
      let localCount = 3;
      setCountDown(localCount);
      
      // Countdown for this photo
      while (localCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localCount -= 1;
        setCountDown(localCount);
      }
      
      // Take the photo
      capturePhoto();
      
      // Short pause between photos if not the last one
      if (i < numPhotos - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsCountingDown(false);
    setCountDown(3);
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
    <div className='flex flex-col min-h-screen bg-neutral-100 text-gray-800'>
      <Header />
      <main className='flex-1 p-8 max-w-6xl mx-auto w-full'>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
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
            />
            <canvas ref={canvasRef} className='hidden'/>
            <canvas ref={stripCanvasRef} className='hidden' />
          </div>
          <div className="w-full md:w-96 flex flex-col gap-6 bg-white rounded-lg border border-neutral-300 p-6">
            {error && (
              <div className='p-4 bg-red-100 text-red-800 rounded mb-2 text-center'>
                {error}
              </div>
            )}
            <StripLayoutSelector
              layout={layout}
              padding={padding}
              topMargin={topMargin}
              bottomMargin={bottomMargin}
              setLayout={setLayout}
              setPadding={setPadding}
              setTopMargin={setTopMargin}
              setBottomMargin={setBottomMargin}
            />
          </div>
        </div>
      </main>
    </div>
  );
}