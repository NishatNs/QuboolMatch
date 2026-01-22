import React, { useState, useEffect } from "react";
import { interestApi } from "../services/api";

// Define the structure for a user from the API
interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  religion: string | null;
  location: string | null;
  profession: string | null;
  academic_background: string | null;
  profile_picture: string | null;
  interest_status: 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected';
}

const FindMatches: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [cancelingInterest, setCancelingInterest] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    location: '',
    religion: 'all',
    gender: 'all',
    minAge: 18,
    maxAge: 60
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interestApi.browseUsers();
      setUsers(response.users);
      setFilteredUsers(response.users);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when filter state changes
  useEffect(() => {
    const filtered = users.filter(user => {
      if (filters.location && !user.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.religion !== 'all' && user.religion !== filters.religion) {
        return false;
      }
      if (filters.gender !== 'all' && user.gender !== filters.gender) {
        return false;
      }
      if (user.age < filters.minAge || user.age > filters.maxAge) {
        return false;
      }
      return true;
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSendInterest = async (userId: string, userName: string) => {
    if (!window.confirm(`Send interest to ${userName}?`)) return;
    try {
      setSendingInterest(userId);
      await interestApi.sendInterest(userId, `Hi ${userName}, I'd like to connect with you!`);
      await loadUsers();
      alert(`Interest sent to ${userName} successfully!`);
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to send interest'}`);
    } finally {
      setSendingInterest(null);
    }
  };

  const handleCancelInterest = async (userId: string, userName: string) => {
    if (!window.confirm(`Cancel your interest to ${userName}?`)) return;
    try {
      setCancelingInterest(userId);
      // We need to get the interest ID first
      const sentInterests = await interestApi.getSentInterests();
      const interest = sentInterests.interests.find((i: any) => i.to_user_id === userId && i.status === 'pending');
      if (interest) {
        await interestApi.cancelInterest(interest.id);
        await loadUsers();
        alert(`Interest to ${userName} canceled successfully!`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed to cancel interest'}`);
    } finally {
      setCancelingInterest(null);
    }
  };

  const getInterestButtonText = (status: string) => {
    switch (status) {
      case 'pending_sent': return 'Interest Sent';
      case 'pending_received': return 'Respond to Interest';
      case 'accepted': return 'Matched ✓';
      case 'rejected': return 'Declined';
      default: return 'Send Interest';
    }
  };

  const getInterestButtonClass = (status: string) => {
    switch (status) {
      case 'pending_sent': return 'bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed';
      case 'pending_received': return 'bg-green-600 hover:bg-green-700';
      case 'accepted': return 'bg-blue-600 hover:bg-blue-700 cursor-default';
      case 'rejected': return 'bg-gray-400 cursor-not-allowed';
      default: return 'bg-pink-600 hover:bg-pink-700';
    }
  };

  const isButtonDisabled = (status: string, userId: string) => {
    return status === 'pending_sent' || status === 'accepted' || status === 'rejected' || sendingInterest === userId;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Find Your Perfect Match</h1>

          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You can send interest to users. Maximum 3 mutual interests allowed. Full profiles are visible only after mutual interest.
                </p>
              </div>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Filter Users</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.religion}
                  onChange={(e) => handleFilterChange('religion', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Islam">Islam</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Buddhism">Buddhism</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age: {filters.minAge} - {filters.maxAge}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    min="18" 
                    max="100"
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange('minAge', parseInt(e.target.value) || 18)}
                  />
                  <input 
                    type="number" 
                    min="18" 
                    max="100"
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange('maxAge', parseInt(e.target.value) || 60)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Section */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-2">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    {/* Profile Image */}
                    <div className="relative">
                      {user.profile_picture ? (
                        <img 
                          src={user.profile_picture} 
                          alt={`${user.name}'s profile`}
                          className="w-full h-60 object-cover object-center"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=400&background=random`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-60 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-6xl font-bold">{user.name.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Interest Status Badge */}
                      {user.interest_status !== 'none' && (
                        <div className="absolute top-3 right-3">
                          {user.interest_status === 'accepted' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                              ✓ Matched
                            </span>
                          )}
                          {user.interest_status === 'pending_sent' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                              ⏳ Pending
                            </span>
                          )}
                          {user.interest_status === 'pending_received' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                              💌 Interested in You
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Profile Details */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800">{user.name}, {user.age}</h3>
                      
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        {user.location && (
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {user.location}
                          </div>
                        )}
                        
                        {user.profession && (
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            {user.profession}
                          </div>
                        )}
                        
                        {user.religion && (
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                            </svg>
                            {user.religion}
                          </div>
                        )}
                        
                        {user.academic_background && (
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                            {user.academic_background}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="mt-4">
                        {user.interest_status === 'pending_sent' ? (
                          <div className="space-y-2">
                            <button 
                              disabled
                              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-medium cursor-not-allowed opacity-70"
                            >
                              Interest Sent
                            </button>
                            <button 
                              onClick={() => handleCancelInterest(user.id, user.name)}
                              disabled={cancelingInterest === user.id}
                              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                            >
                              {cancelingInterest === user.id ? 'Canceling...' : 'Cancel Interest'}
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => user.interest_status === 'none' && handleSendInterest(user.id, user.name)}
                            disabled={isButtonDisabled(user.interest_status, user.id)}
                            className={`w-full ${getInterestButtonClass(user.interest_status)} text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70`}
                          >
                            {sendingInterest === user.id ? 'Sending...' : getInterestButtonText(user.interest_status)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMatches;
