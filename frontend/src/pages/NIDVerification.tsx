// src/pages/NIDVerification.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NIDVerification: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Verification in Progress");
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification process
    setStatus("Processing...");
    setTimeout(() => {
      setStatus("Verified");
      // After verification is complete, redirect to profile page
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    }, 3000); // Simulate a delay for verification
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify Yourself
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Upload NID Image */}
          <div className="mb-4">
            <label htmlFor="nidImage" className="block text-sm font-medium text-gray-700">
              Upload Your NID Image
            </label>
            <input
              type="file"
              id="nidImage"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {file && <p className="mt-2 text-sm text-gray-600">Selected File: {file.name}</p>}
          </div>

          {/* Schedule Video Call */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select a Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Select a Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Verification Status */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Verification Status</h3>
            <div className={`mt-2 p-3 rounded-md ${
              status === "Verified" ? "bg-green-100 text-green-800" : 
              status === "Processing..." ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              <p className="text-sm font-medium flex items-center">
                {status === "Processing..." && (
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {status === "Verified" && (
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {status}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          {status !== "Verified" ? (
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
              disabled={status === "Processing..."}
            >
              {status === "Processing..." ? "Processing..." : "Submit"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Continue to Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default NIDVerification;