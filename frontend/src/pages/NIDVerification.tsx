// src/pages/NIDVerification.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NIDImageDisplay from "../components/NIDImageDisplay";

const NIDVerification: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Verification in Progress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const navigate = useNavigate();

  // Check current verification status on component load
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch("http://localhost:8000/verification/status", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const statusData = await response.json();
          setCurrentStatus(statusData);
          
          // Pre-fill form if data exists
          if (statusData.verification_date) {
            setDate(statusData.verification_date);
          }
          if (statusData.verification_time) {
            setTime(statusData.verification_time);
          }
          if (statusData.verification_notes) {
            setNotes(statusData.verification_notes);
          }
          
          // Update status display
          if (statusData.verification_status === "verified") {
            setStatus("Verified");
          } else if (statusData.verification_status === "in_progress") {
            setStatus("Processing...");
          }
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    };

    fetchVerificationStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Processing...");

    try {
      // Validate form data
      if (!file) {
        throw new Error("Please select a NID image file");
      }
      if (!date) {
        throw new Error("Please select a verification date");
      }
      if (!time) {
        throw new Error("Please select a verification time");
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("nid_image", file);
      formData.append("verification_date", date);
      formData.append("verification_time", time);
      if (notes.trim()) {
        formData.append("verification_notes", notes);
      }

      // Get auth token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("You must be logged in to submit verification");
      }

      // Submit to API
      const response = await fetch("http://localhost:8000/verification/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit verification");
      }

      const data = await response.json();
      
      if (data.success) {
        setStatus("Verified");
        // After successful submission, redirect to profile page
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        throw new Error(data.message || "Verification submission failed");
      }
      
    } catch (err) {
      console.error("Verification submission error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during verification submission");
      setStatus("Verification in Progress"); // Reset status on error
    } finally {
      setLoading(false);
    }
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

          {/* Current NID Image Preview */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current NID Image
            </label>
            <NIDImageDisplay 
              className="w-full h-48 object-cover border rounded-lg"
              fallbackText="No NID image uploaded yet"
            />
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

          {/* Additional Notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Any additional information for the verification team..."
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

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
              
              {/* Show existing verification details if available */}
              {currentStatus && currentStatus.verification_date && (
                <div className="mt-3 pt-3 border-t border-opacity-20 border-gray-500">
                  <p className="text-xs opacity-75">
                    Previously submitted: {currentStatus.verification_date}
                    {currentStatus.verification_time && ` at ${currentStatus.verification_time}`}
                  </p>
                  {currentStatus.verification_notes && (
                    <p className="text-xs opacity-75 mt-1">
                      Notes: {currentStatus.verification_notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {status !== "Verified" ? (
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md transition ${
                loading || status === "Processing..." 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
              disabled={loading || status === "Processing..."}
            >
              {loading || status === "Processing..." ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Verification"
              )}
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