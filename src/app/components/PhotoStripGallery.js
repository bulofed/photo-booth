import { FaDownload, FaRedo } from 'react-icons/fa';

export default function PhotoStripGallery({ photoStrips, downloadStrip, clearStrips }) {
  if (!photoStrips.length) return null;
  return (
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
  );
}
