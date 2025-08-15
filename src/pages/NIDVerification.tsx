// src/pages/NIDVerification.tsx
import React, { useState } from "react";

const NIDVerification: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Verification in Progress");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification process
    setTimeout(() => {
      setStatus("Verified");
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
            <p className={`mt-2 text-sm ${status === "Verified" ? "text-green-600" : "text-yellow-600"}`}>
              {status}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NIDVerification;