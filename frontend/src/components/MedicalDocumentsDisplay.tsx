import React, { useState, useEffect } from 'react';

interface MedicalDocumentsDisplayProps {
  userId?: string;
  className?: string;
  fallbackText?: string;
  previewDocument?: File | null;
}

const MedicalDocumentsDisplay: React.FC<MedicalDocumentsDisplayProps> = ({
  userId,
  className = "w-full h-48 object-cover border rounded-lg",
  fallbackText = "No medical documents uploaded",
  previewDocument = null
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's a preview document (newly selected), show that instead
    if (previewDocument) {
      const url = URL.createObjectURL(previewDocument);
      setDocumentUrl(url);
      setContentType(previewDocument.type);
      setLoading(false);
      setError(null);
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // Otherwise fetch from backend
    const fetchDocument = async () => {
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

        const response = await fetch(`http://localhost:8000/api/profile/documents/${actualUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          setError(fallbackText);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.status}`);
        }

        // Get content type from response
        const type = response.headers.get('content-type');
        setContentType(type);

        // Convert response to blob and create object URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDocumentUrl(url);

      } catch (err) {
        console.error('Error loading medical documents:', err);
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();

    // Cleanup function to revoke object URL
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [userId, fallbackText, previewDocument]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-500">Loading document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-500`}>
        <div className="flex flex-col items-center">
          <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-center">{error}</span>
        </div>
      </div>
    );
  }

  // If it's an image, display it
  if (documentUrl && contentType?.startsWith('image/')) {
    return (
      <img
        src={documentUrl}
        alt="Medical Document"
        className={className}
        onError={() => setError('Failed to display document')}
      />
    );
  }

  // If it's a PDF or other document, show a link to view
  if (documentUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="flex flex-col items-center space-y-3">
          <svg className="h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            View Document
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default MedicalDocumentsDisplay;
