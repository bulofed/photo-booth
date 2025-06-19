"use client"
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import CameraView from './components/CameraView';
import StripLayoutSelector from './components/StripLayoutSelector';
import CustomTextInput from './components/CustomTextInput';

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

  function countPhotoCells(layout) {
    return layout.flat().filter(cell => typeof cell === 'number').length;
  }

  // Create photo strip when we have enough photos
  useEffect(() => {
    const neededPhotos = countPhotoCells(layout);
    if (photos.length === neededPhotos && neededPhotos > 0) {
      createPhotoStrip();
      setPhotos([]);
    }
  }, [photos, layout]);

  // Create a combined photo strip
  const createPhotoStrip = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const photoWidth = 600;
    const aspectRatio = 9/16;
    const photoHeight = Math.round(photoWidth * aspectRatio);
    const fontSize = 32;

    // Calculate max columns in layout
    const maxCols = Math.max(...layout.map(row => row.length));
    const stripWidth = (photoWidth * maxCols) + (padding * (maxCols + 1));
    const stripHeight = (photoHeight * layout.length) + (padding * (layout.length + 1)) + topMargin + bottomMargin;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Draw each photo
    const cellPromises = [];
    layout.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const x = padding + colIdx * (photoWidth + padding);
        const y = topMargin + padding + rowIdx * (photoHeight + padding);

        if (cell === 'text' && customText) {
          // Draw text synchronously
          ctx.fillStyle = '#333';
          ctx.font = `${fontSize}px bold Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(customText, x + photoWidth / 2, y + photoHeight / 2);
        } else if (typeof cell === 'number' && photos[cell]) {
          // Draw image asynchronously
          cellPromises.push(new Promise(resolve => {
            const img = new window.Image();
            img.onload = () => {
              ctx.fillStyle = '#ddd';
              ctx.fillRect(x - 2, y - 2, photoWidth + 4, photoHeight + 4);
              ctx.drawImage(img, x, y, photoWidth, photoHeight);
              resolve();
            };
            img.src = photos[cell];
          }));
        }
      });
    });

    // When all images are loaded, save the strip
    Promise.all(cellPromises).then(() => {
      const stripUrl = canvas.toDataURL('image/jpeg', 0.9);
      localStorage.setItem('photoStrip', stripUrl);
      router.push('/customize');
    });
  };


  // Take multiple photos based on layout
  const takeMultiplePhotos = async () => {
    const numPhotos = countPhotoCells(layout);
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
        await new Promise(res => setTimeout(res, 0));
      }
    }
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
      <nav className='w-full bg-indigo-500 flex'>
        <div className='mx-auto max-w-6xl w-full py-3 px-8 flex'>
          <h1 className='text-4xl font-bold text-white max-w-2xl'>FotoFoto</h1>
        </div>
      </nav>
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
            />
            <canvas ref={canvasRef} className='hidden'/>
            <canvas ref={stripCanvasRef} className='hidden' />
          </div>
          {/* Options Panel */}
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
            <CustomTextInput customText={customText} setCustomText={setCustomText} />
          </div>
        </div>
      </main>
    </div>
  );
}