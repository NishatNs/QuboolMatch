import React, { useState, useEffect } from 'react';

interface PendingUser {
  id: string;
  email: string;
  verification_status: string;
  verification_date: string | null;
  verification_time: string | null;
  has_nid_image: boolean;
  nid_image_filename: string | null;
  verification_notes: string | null;
  created_at: string;
}

interface PendingVerificationsResponse {
  pending_verifications: PendingUser[];
}

const VerifyUsers: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken');
      const response = await fetch('http://localhost:8000/verification/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }

      const data: PendingVerificationsResponse = await response.json();
      
      // Sort by verification_date (most recent first)
      const sortedUsers = data.pending_verifications.sort((a, b) => {
        const dateA = new Date(a.verification_date || a.created_at);
        const dateB = new Date(b.verification_date || b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      
      setPendingUsers(sortedUsers);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setProcessingUserId(userId);
    try {
      const token = localStorage.getItem('adminAccessToken');
      const response = await fetch(`http://localhost:8000/verification/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to verify user');
      }

      // Remove the user from pending list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      // Show success message (you can add a toast notification here)
      alert('User verified successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to verify user');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    const rejectionNotes = prompt('Please enter rejection reason:');
    if (!rejectionNotes) return;

    setProcessingUserId(userId);
    try {
      const token = localStorage.getItem('adminAccessToken');
      const formData = new FormData();
      formData.append('rejection_notes', rejectionNotes);

      const response = await fetch(`http://localhost:8000/verification/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }

      // Remove the user from pending list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      // Show success message
      alert('User verification rejected successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reject user');
    } finally {
      setProcessingUserId(null);
    }
  };

  const viewNIDImage = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminAccessToken');
      const response = await fetch(`http://localhost:8000/verification/image/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch NID image');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      // Open image in new window
      window.open(imageUrl, '_blank');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to view NID image');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading pending verifications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending User Verifications</h2>
        <p className="text-gray-600 mt-1">
          {pendingUsers.length} users awaiting verification
        </p>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending verifications at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NID Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        Registered: {formatDate(user.created_at)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.verification_date ? formatDate(user.verification_date) : 'Not set'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.verification_time ? formatTime(user.verification_time) : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.verification_status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.has_nid_image ? (
                      <button
                        onClick={() => viewNIDImage(user.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View NID Image
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleVerifyUser(user.id)}
                      disabled={processingUserId === user.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingUserId === user.id ? 'Processing...' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleRejectUser(user.id)}
                      disabled={processingUserId === user.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingUserId === user.id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerifyUsers;