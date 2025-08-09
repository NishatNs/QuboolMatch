import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent ${
              isScrolled ? '' : 'text-white'
            }`}>
              Qubool Match
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`font-medium transition-colors duration-200 hover:text-rose-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-rose-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`font-medium transition-colors duration-200 hover:text-rose-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-rose-300'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('why-choose-us')}
              className={`font-medium transition-colors duration-200 hover:text-rose-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-rose-300'
              }`}
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`font-medium transition-colors duration-200 hover:text-rose-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-rose-300'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`font-medium transition-colors duration-200 hover:text-rose-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-rose-300'
              }`}
            >
              Contact
            </button>
            
            {/* Helpline */}
            <div className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">01522434565</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-rose-600 hover:bg-gray-100' 
                  : 'text-white hover:text-rose-300 hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="block text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('why-choose-us')}
                className="block text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-700 hover:text-rose-600 font-medium transition-colors duration-200"
              >
                Contact
              </button>
              <div className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full w-fit">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">01522434565</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;