"use client"
import { useState, useRef, useEffect } from 'react';
import { FaCamera, FaDownload, FaRedo, FaSpinner } from 'react-icons/fa';
import { MdFlashOn, MdFlashOff } from 'react-icons/md';

const BACKGROUNDS = [
];

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

  const [backgroundImage, setBackgroundImage] = useState(null);
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

  // Create photo strip when we have 3 photos
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
        { backgroundImage && (
          <div className="mb-6 flex flex-col items-center">
            <label className="mb-2 font-medium">Choose a background:</label>
            <div className="flex gap-4 flex-wrap">
              {BACKGROUNDS.map(bg => (
                <div
                  key={bg.name}
                  className={`w-24 h-16 cursor-pointer border-2 ${backgroundImage === bg.src ? 'border-blue-700' : 'border-gray-300'} rounded-lg overflow-hidden`}
                  onClick={() => setBackgroundImage(bg.src)}
                  style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {backgroundImage === bg.src && (
                    <div className='absolute inset-0 bg-blue-700/50 flex items-center justify-center'>
                      <span className='text-white font-bold'>Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col items-center">
          <label className="mb-2 font-medium">Photo strip layout:</label>
          <div className="flex gap-4">
            <div>
              <label className="mr-2">Rows:</label>
              <input
                type="number"
                min={1}
                max={6}
                value={stripRows}
                onChange={e => setStripRows(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16 text-center"
              />
            </div>
            <div>
              <label className="mr-2">Columns:</label>
              <input
                type="number"
                min={1}
                max={6}
                value={stripCols}
                onChange={e => setStripCols(Number(e.target.value))}
                className="border rounded px-2 py-1 w-16 text-center"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <label className="mb-2 font-medium">Add custom text for your strip:</label>
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            maxLength={40}
            placeholder="Type your message here"
            className="border rounded px-3 py-2 w-80 text-lg text-center outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {error && (
          <div className='p-4 bg-red-100 text-red-800 rounded mb-4 text-center'>
            {error}
          </div>
        )}

        {!isCameraOn ? (
          <button
            onClick={startCamera}
            className='mx-auto my-8 px-8 py-4 bg-blue-700 text-white rounded-full text-xl font-medium hover:bg-blue-800 hover:shadow-md transition-all flex items-center gap-2'
          >
            <FaCamera /> Start Camera
          </button>
        ) : (
          <>
            <div className='relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg'>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className='w-full bg-black'
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas ref={canvasRef} className='hidden'/>
              <canvas ref={stripCanvasRef} className='hidden' />

              {isCountingDown && (
                <div className='absolute inset-0 bg-black/50 flex justify-center items-center'>
                  <div className='text-white text-9xl font-bold animate-ping'>
                    {countDown}
                  </div>
                </div>
              )}

              {flash && (
                <div className='absolute inset-0 bg-white animate-flash opacity-0' />
              )}
            </div>

            <div className='flex justify-center gap-4 my-6 flex-wrap'>
              <button
                onClick={() => takeMultiplePhotos(stripRows * stripCols, 0)}
                disabled={isCountingDown}
                className='px-6 py-3 bg-white text-blue-700 border-2 border-blue-700 rounded-full flex items-center gap-2 hover:bg-blue-700 hover:text-white transition-all disabled:opcaity-70 disabled:cursor-not-allowed'
              >
                {isCountingDown ? (
                  <FaSpinner className='animate-spin' />
                ): (
                  <FaCamera />
                )}
                {isCountingDown ? 'Smile!': 'Take Photo'}
              </button>

              <button
                onClick={() => setFlash(!flash)}
                className='px-6 py-3 bg-white text-blue-700 border-2 border-blue-700 rounded-full flex items-center gap-2 hover:bg-blue-700 hover:text-white transition-all'
              >
                {flash ? <MdFlashOn /> : <MdFlashOff />}
                Flash
              </button>

              <button
                onClick={() => stopCamera()}
                className='px-6 py-3 bg-white text-blue-700 border-2 border-blue-700 rounded-full flex items-center gap-2 hover:bg-blue-700 hover:text-white transition-all'
              >
                <FaRedo /> Stop Camera
              </button>
            </div>
          </>
        )}

        {photoStrips.length > 0 && (
          <section className='mt-12 pt-8 border-t border-gray-300'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-blue-700 m-0'>Your Photos Strips</h2>
              <button
                onClick={clearStrips}
                className='px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2 hover:bg-red-400 transition-colors'
              >
                <FaRedo /> Clear All
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4'>
              {photoStrips.map((strip, index) => (
                <div key={index} className='bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1 transition-transform'>
                  <img
                    src={strip}
                    alt={`Photo Strip ${index + 1}`}
                    className='w-full h-auto'
                  />
                  <button
                    onClick={() => downloadStrip(strip)}
                    className='w-full py-3 bg-blue-700 text-white flex justify-center items-center gap-2 hover:bg-blue-800 transition-colors'
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="text-center p-4 bg-white/80 text-gray-600">
        <p>© {new Date().getFullYear()} Photo Booth</p>
      </footer>
    </div>
  );
}
