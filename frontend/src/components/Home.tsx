// src/components/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  // Single background image - couple silhouette at sunset
  const backgroundImage = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-10000"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Dynamic overlay for text readability with subtle animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80 animate-pulse"></div>
        </div>
      </div>
      {/* Subtle animated elements overlay */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-500/10 rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full mix-blend-screen filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-4 z-20">
        <div className="mb-8 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <h1 className="relative text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
            Find Your Perfect Match
          </h1>
        </div>
        <p className="text-xl mb-8 text-slate-300 max-w-2xl leading-relaxed">
          Discover meaningful connections with Qubool Match - where authentic relationships begin with verified profiles and intelligent matching.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 transform">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl font-semibold text-white hover:border-cyan-400 transition-all duration-300 hover:scale-105 transform">
            <span className="relative z-10">Learn More</span>
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-slate-900/95 backdrop-blur-sm text-white py-16 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Qubool Match
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Where meaningful connections begin. Join thousands of successful couples who found their perfect match through our trusted platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.990 3.992-.281 1.189.597 2.159 1.769 2.159 2.123 0 3.756-2.239 3.756-5.471 0-2.861-2.056-4.86-4.991-4.86-3.398 0-5.393 2.549-5.393 5.184 0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355-.053.218-.173.265-.402.159-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.744-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">How It Works</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Success Stories</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@quboolmatch.com
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Qubool Match. All rights reserved. Made with ❤️ for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;