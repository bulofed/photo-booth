"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCamera, FaDownload, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';

export default function CustomizePage() {
  const router = useRouter();
  const [stripUrl, setStripUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const url = localStorage.getItem('photoStrip');
    if (!url) {
      router.replace('/');
    } else {
      setStripUrl(url);
    }
  }, [router]);

  if (!stripUrl) return null;

  const downloadStrip = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = stripUrl;
    link.download = `photo-strip-${new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 text-gray-800 overflow-hidden">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto w-full h-[calc(100vh-80px)]">
        {/* Photo strip container - no scrolling */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-neutral-200 h-full max-h-[80vh] aspect-[3/4] flex items-center justify-center">
            <img 
              src={stripUrl} 
              alt="Your Photo Strip" 
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        
        {/* Action buttons - fixed height container */}
        <div className="w-full lg:w-80 flex flex-col justify-center gap-6 py-4">
          <h2 className="text-2xl font-bold text-neutral-800 text-center lg:text-left">
            Your Photo Strip
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={downloadStrip}
              disabled={isDownloading}
              className={`w-full px-6 py-4 flex items-center gap-3 justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg ${
                isDownloading ? 'opacity-75' : ''
              }`}
            >
              <FaDownload className="text-xl" />
              {isDownloading ? 'Downloading...' : 'Download Strip'}
              {isDownloading && (
                <span className="ml-2 inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-4 flex items-center gap-3 justify-center bg-white text-indigo-600 border-2 border-indigo-500 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg"
            >
              <FaCamera className="text-xl" />
              Create New Strip
            </button>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="font-medium text-indigo-800 mb-2">Tips</h3>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Save to your photos for printing</li>
              <li>• Share on social media</li>
              <li>• Try different layouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}