"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { FaCamera, FaDownload, FaPalette } from 'react-icons/fa';
import Header from '../components/Header';
import { HexColorPicker } from 'react-colorful';

export default function CustomizePage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateTimeout, setRegenerateTimeout] = useState(null);
  
  const [stripData, setStripData] = useState({
    stripUrl: null,
    photos: [],
    layout: [],
    dimensions: {
      backgroundColor: '#ffffff',
      photoBorderColor: '#dddddd',
      padding: 30,
      topMargin: 120,
      bottomMargin: 240
    }
  });

  // Load saved strip data
  useEffect(() => {
    const loadStripData = () => {
      const savedData = localStorage.getItem('photoStripData');
      if (!savedData) {
        router.replace('/');
        return;
      }
      
      try {
        const parsedData = JSON.parse(savedData);
        setStripData(parsedData);
      } catch (e) {
        console.error('Failed to parse strip data', e);
        router.replace('/');
      }
    };

    loadStripData();
  }, [router]);

  // Update localStorage whenever stripData changes
  useEffect(() => {
    localStorage.setItem('photoStripData', JSON.stringify(stripData));
  }, [stripData]);

  // Debounced strip regeneration
  const regenerateStrip = useCallback(async () => {
    try {
      setIsRegenerating(true);
      
      const response = await fetch('/api/generate-strip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: stripData.photos,
          layout: stripData.layout,
          dimensions: stripData.dimensions
        })
      });

      if (!response.ok) throw new Error('Regeneration failed');
      
      const { stripUrl } = await response.json();
      setStripData(prev => ({ ...prev, stripUrl }));
    } catch (error) {
      console.error('Regeneration error:', error);
    } finally {
      setIsRegenerating(false);
    }
  }, [stripData.photos, stripData.layout, stripData.dimensions]);

  // Handle color changes with debounce
  const handleColorChange = useCallback((type, value) => {
    // Update local state immediately for instant preview
    setStripData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [type]: value
      }
    }));

    // Debounce the API call to regenerate strip
    if (regenerateTimeout) {
      clearTimeout(regenerateTimeout);
    }

    const timeout = setTimeout(() => {
      regenerateStrip();
    }, 500); // 500ms debounce delay

    setRegenerateTimeout(timeout);
  }, [regenerateStrip, regenerateTimeout]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (regenerateTimeout) {
        clearTimeout(regenerateTimeout);
      }
    };
  }, [regenerateTimeout]);

  const downloadStrip = () => {
    if (!stripData.stripUrl) return;
    
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = stripData.stripUrl;
    link.download = `photo-strip-${new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  if (!stripData.stripUrl) return null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 text-gray-800 overflow-hidden">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto w-full h-[calc(100vh-80px)]">
        {/* Photo strip container with real-time preview */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="bg-white p-4 rounded-xl shadow-lg border border-neutral-200 h-full max-h-[80vh] aspect-[3/4] flex items-center justify-center relative"
          >
            <img 
              src={stripData.stripUrl} 
              alt="Your Photo Strip" 
              className="object-contain w-full h-full"
            />
            {isRegenerating && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Color customization panel */}
        <div className="w-full lg:w-80 flex flex-col justify-center gap-6 py-4 relative">
          <h2 className="text-2xl font-bold text-neutral-800 text-center lg:text-left">
            Customize Your Strip
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="px-4 py-2 flex items-center gap-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FaPalette /> Colors
              </button>
              
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer"
                  style={{ backgroundColor: stripData.dimensions.backgroundColor }}
                  onClick={() => setShowColorPicker(true)}
                />
                <div 
                  className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer"
                  style={{ backgroundColor: stripData.dimensions.photoBorderColor }}
                  onClick={() => setShowColorPicker(true)}
                />
              </div>
            </div>

            {showColorPicker && (
              <div className="absolute z-10 top-0 left-0 right-0 bg-white p-4 rounded-lg shadow-lg border border-neutral-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Background Color
                  </label>
                  <div className="h-[200px]">
                    <HexColorPicker 
                      color={stripData.dimensions.backgroundColor} 
                      onChange={(color) => handleColorChange('backgroundColor', color)} 
                      className="!w-full !h-full"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={stripData.dimensions.backgroundColor} 
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Border Color
                  </label>
                  <div className="h-[200px]">
                    <HexColorPicker 
                      color={stripData.dimensions.photoBorderColor} 
                      onChange={(color) => handleColorChange('photoBorderColor', color)} 
                      className="!w-full !h-full"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={stripData.dimensions.photoBorderColor} 
                    onChange={(e) => handleColorChange('photoBorderColor', e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                  />
                </div>
                
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button
              onClick={downloadStrip}
              disabled={isDownloading || isRegenerating}
              className={`w-full px-6 py-4 flex items-center gap-3 justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg ${
                isDownloading ? 'opacity-75' : ''
              }`}
            >
              <FaDownload className="text-xl" />
              {isDownloading ? 'Downloading...' : 'Download Strip'}
              {(isDownloading || isRegenerating) && (
                <span className="ml-2 inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </button>
            
            <button
              onClick={() => router.push('/')}
              disabled={isRegenerating}
              className="w-full px-6 py-4 flex items-center gap-3 justify-center bg-white text-indigo-600 border-2 border-indigo-500 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <FaCamera className="text-xl" />
              Create New Strip
            </button>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="font-medium text-indigo-800 mb-2">Strip Details</h3>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Layout: {stripData.layout.length} rows</li>
              <li>• Photos: {stripData.photos.length} images</li>
              <li>• Background: {stripData.dimensions.backgroundColor}</li>
              <li>• Border: {stripData.dimensions.photoBorderColor}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}