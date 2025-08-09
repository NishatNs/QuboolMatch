// src/components/Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">
          Find Your Perfect Match
        </h1>
        <p className="text-lg mb-6">
          Join Qubool Match today and connect with your soulmate.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-pink-500 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">
            Get Started
          </button>
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white text-gray-800 py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
            <p>We ensure all profiles are verified for authenticity.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Advanced Matching</h3>
            <p>Our algorithm helps you find the perfect match.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p>Your data is safe and secure with us.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white text-gray-800 p-6 rounded-md shadow-md">
            <p>
              "Qubool Match helped me find my soulmate. The platform is easy to
              use and very secure."
            </p>
            <h3 className="mt-4 font-semibold">- Sarah</h3>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-md shadow-md">
            <p>
              "I was skeptical at first, but Qubool Match exceeded my
              expectations. Highly recommended!"
            </p>
            <h3 className="mt-4 font-semibold">- Ahmed</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;