import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
              Qubool Match
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/why-choose-us">Why Us</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/testimonials">Testimonials</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            
            {isLoggedIn && (
              <>
                <NavLink to="/matches">Matches</NavLink>
                <NavLink to="/notifications">Notifications</NavLink>
                <NavLink to="/nid-verification">Verification</NavLink>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Admin Link - Dev Only */}
            <Link
              to="/admin-login"
              className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
              title="Admin Access"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileNavLink>
              <MobileNavLink to="/why-choose-us" onClick={() => setIsMobileMenuOpen(false)}>Why Us</MobileNavLink>
              <MobileNavLink to="/services" onClick={() => setIsMobileMenuOpen(false)}>Services</MobileNavLink>
              <MobileNavLink to="/testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
              
              {isLoggedIn && (
                <>
                  <MobileNavLink to="/matches" onClick={() => setIsMobileMenuOpen(false)}>Matches</MobileNavLink>
                  <MobileNavLink to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>Notifications</MobileNavLink>
                  <MobileNavLink to="/nid-verification" onClick={() => setIsMobileMenuOpen(false)}>Verification</MobileNavLink>
                  <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
                </>
              )}
              
              <div className="pt-4 border-t border-gray-200 mt-2 space-y-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-2.5 rounded-lg text-center text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-2.5 rounded-lg text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                
                <Link
                  to="/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-2.5 rounded-lg text-center text-red-600 border-2 border-red-300 hover:bg-red-50 transition-colors duration-200 font-medium text-sm"
                >
                  Admin Access
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop Nav Link Component
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-all duration-200 font-medium"
  >
    {children}
  </Link>
);

// Mobile Nav Link Component
const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; onClick: () => void }> = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 font-medium"
  >
    {children}
  </Link>
);

export default Navbar;