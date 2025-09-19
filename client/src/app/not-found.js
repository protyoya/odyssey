'use client';
import { useState, useEffect } from 'react';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center">
      
      {/* Simple Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.1}px)`
        }}
      />

      {/* Main Content */}
      <div className="text-center px-4 max-w-2xl mx-auto">

        {/* 404 */}
        <div className="mb-8">
          <h2 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-4 font-mono">
            404
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Page Not Found
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <a
            href="/"
            className="inline-flex items-center px-8 py-4 bg-white/15 hover:bg-white/20 backdrop-blur-xl border border-white/30 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5 mr-3" />
            Go Home
          </a>
          
          <div className="block">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}