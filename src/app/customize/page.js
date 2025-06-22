"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '../components/Header';

export default function CustomizePage() {
  const router = useRouter();

  const [stripUrl, setStripUrl] = useState(null);

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
    const link = document.createElement('a');
    link.href = stripUrl;
    link.download = `photo-strip-${new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 text-gray-800">
      <Header />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full flex flex-col items-center">
        <img src={stripUrl} alt="Photo Strip" className="mb-8 rounded shadow-lg max-w-full" />
        <button
          onClick={downloadStrip}
          className="px-6 py-3 bg-indigo-500 text-white rounded-full text-lg font-medium hover:bg-indigo-600 transition-all"
        >
          Download Strip
        </button>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-full text-lg font-medium hover:bg-indigo-500 hover:text-white transition-all"
        >
          Retake a pic !
        </button>
      </main>
    </div>
  );
}