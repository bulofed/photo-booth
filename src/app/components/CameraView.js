// /components/CameraView.js
import { FaCamera, FaSpinner, FaRedo, FaExpand, FaCompress } from 'react-icons/fa';
import { MdFlashOn, MdFlashOff } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

export default function CameraView({
  isCameraOn,
  isCountingDown,
  countDown,
  flash,
  videoRef,
  startCamera,
  stopCamera,
  takeMultiplePhotos,
  setFlash
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCapture = () => {
    takeMultiplePhotos();
  };

  const handleFullscreenKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const renderFullscreenControls = () => (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
      <button
        onClick={handleCapture}
        disabled={isCountingDown}
        className="p-3 bg-black/50 text-white rounded-full hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={isCountingDown ? 'Counting down' : 'Take photo'}
      >
        {isCountingDown ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaCamera />
        )}
      </button>
      <button
        onClick={() => setFlash(!flash)}
        className="p-3 bg-black/50 text-white rounded-full hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={flash ? 'Flash on' : 'Flash off'}
      >
        {flash ? <MdFlashOn /> : <MdFlashOff />}
      </button>
    </div>
  );

  return (
    <>
      {!isCameraOn ? (
        <button
          onClick={startCamera}
          className="mx-auto my-8 px-8 py-4 bg-indigo-500 text-white rounded-full text-xl font-medium hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all flex items-center gap-2"
        >
          <FaCamera /> Start Camera
        </button>
      ) : (
        <>
          <div 
            ref={containerRef}
            className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full max-w-4xl mx-auto rounded-lg border border-neutral-300'} overflow-hidden`}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`${isFullscreen ? 'h-screen w-screen object-contain' : 'w-full bg-black'} -scale-x-100`}
            />

            <button
              onClick={toggleFullscreen}
              onKeyDown={handleFullscreenKeyDown}
              className={`absolute ${isFullscreen ? 'top-4 right-4' : 'top-2 right-2'} p-2 bg-black/50 text-white rounded-full hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white z-20`}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>

            {isFullscreen && renderFullscreenControls()}

            {isCountingDown && (
              <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
                <div className="text-white text-9xl font-bold animate-ping">
                  {countDown}
                </div>
              </div>
            )}
            
            {flash && (
              <div className="absolute inset-0 bg-white animate-flash opacity-0" />
            )}
          </div>

          {!isFullscreen && (
            <div className="flex justify-center gap-4 my-6 flex-wrap">
              <button
                onClick={handleCapture}
                disabled={isCountingDown}
                className="px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
              >
                {isCountingDown ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCamera />
                )}
                {isCountingDown ? 'Smile!' : 'Take Photo'}
              </button>
              
              <button
                onClick={() => setFlash(!flash)}
                className="px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
              >
                {flash ? <MdFlashOn /> : <MdFlashOff />}
                Flash
              </button>
              
              <button
                onClick={stopCamera}
                className="px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
              >
                <FaRedo /> Stop Camera
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}