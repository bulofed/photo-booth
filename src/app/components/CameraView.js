import { FaCamera, FaSpinner, FaRedo } from 'react-icons/fa';
import { MdFlashOn, MdFlashOff } from 'react-icons/md';

export default function CameraView({
  isCameraOn,
  isCountingDown,
  countDown,
  flash,
  videoRef,
  startCamera,
  stopCamera,
  takeMultiplePhotos,
  setFlash,
  stripRows,
  stripCols
}) {
  return (
    <>
      {!isCameraOn ? (
        <button
          onClick={startCamera}
          className='mx-auto my-8 px-8 py-4 bg-indigo-500 text-white rounded-full text-xl font-medium hover:bg-indigo-600 transition-all flex items-center gap-2'
        >
          <FaCamera /> Start Camera
        </button>
      ) : (
        <>
          <div className='relative w-full max-w-4xl mx-auto rounded-lg border border-neutral-300 overflow-hidden'>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className='w-full bg-black'
              style={{ transform: 'scaleX(-1)' }}
            />
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
              className='px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all disabled:opcaity-70 disabled:cursor-not-allowed'
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
              className='px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all'
            >
              {flash ? <MdFlashOn /> : <MdFlashOff />}
              Flash
            </button>
            <button
              onClick={stopCamera}
              className='px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all'
            >
              <FaRedo /> Stop Camera
            </button>
          </div>
        </>
      )}
    </>
  );
}
