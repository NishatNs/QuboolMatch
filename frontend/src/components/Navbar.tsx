import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-50 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Qubool Match
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          {/* Home Button */}
          <Link to="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600">
            About
          </Link>
          <Link to="/why-choose-us" className="text-gray-700 hover:text-indigo-600">
            Why Choose Us
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-indigo-600">
            Services
          </Link>
          <Link to="/testimonials" className="text-gray-700 hover:text-indigo-600">
            Testimonials
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600">
            Contact
          </Link>

          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-700 hover:text-indigo-600">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;