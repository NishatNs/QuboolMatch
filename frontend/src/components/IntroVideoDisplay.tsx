import React, { useState, useEffect } from 'react';

interface IntroVideoDisplayProps {
  userId?: string;
  className?: string;
  fallbackText?: string;
  previewVideo?: File | null;
}

const IntroVideoDisplay: React.FC<IntroVideoDisplayProps> = ({
  userId,
  className = "w-full h-64 object-cover border rounded-lg",
  fallbackText = "No intro video uploaded",
  previewVideo = null
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's a preview video (newly selected), show that instead
    if (previewVideo) {
      const url = URL.createObjectURL(previewVideo);
      setVideoUrl(url);
      setLoading(false);
      setError(null);
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // Otherwise fetch from backend
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        // Get current user ID from profile
        const profileResponse = await fetch('http://localhost:8000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          setError(fallbackText);
          return;
        }

        const profileData = await profileResponse.json();
        const actualUserId = userId || profileData.user_id;

        if (!actualUserId) {
          setError(fallbackText);
          return;
        }

        const response = await fetch(`http://localhost:8000/api/profile/video/${actualUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          setError(fallbackText);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load video: ${response.status}`);
        }

        // Convert response to blob and create object URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

      } catch (err) {
        console.error('Error loading intro video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();

    // Cleanup function to revoke object URL
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [userId, fallbackText, previewVideo]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-500">Loading video...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-500`}>
        <div className="flex flex-col items-center">
          <svg className="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-center">{error}</span>
        </div>
      </div>
    );
  }

  return videoUrl ? (
    <video
      src={videoUrl}
      controls
      className={className}
      onError={() => setError('Failed to display video')}
    >
      Your browser does not support the video tag.
    </video>
  ) : null;
};

export default IntroVideoDisplay;
