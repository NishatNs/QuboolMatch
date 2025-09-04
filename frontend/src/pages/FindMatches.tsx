import React, { useState, useEffect } from "react";

// Define the structure for a potential match
interface MatchProfile {
  id: string;
  name: string;
  age: string;
  location: string;
  profession: string;
  profilePicture: string;
  religion: string;
  interests: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  matchPercentage: number;
  matchCriteria: {
    location: boolean;
    religion: boolean;
    age: boolean;
    interests: boolean;
  };
}

const FindMatches: React.FC = () => {
  // State variables
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verificationStatus: 'all',
    minMatchPercentage: 0,
    location: '',
    ageRange: [18, 60],
    religion: 'all'
  });

  // Load dummy profiles on component mount
  useEffect(() => {
    // This would be an API call in a real application
    const dummyProfiles: MatchProfile[] = [
      {
        id: "1",
        name: "Ayesha Rahman",
        age: "27",
        location: "Dhaka, Bangladesh",
        profession: "Software Engineer",
        profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
        religion: "Islam",
        interests: ["Technology", "Reading", "Traveling", "Photography"],
        verificationStatus: 'verified',
        matchPercentage: 92,
        matchCriteria: { location: true, religion: true, age: true, interests: true }
      },
      {
        id: "2",
        name: "Farhan Ahmed",
        age: "32",
        location: "Dhaka, Bangladesh",
        profession: "Doctor",
        profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
        religion: "Islam",
        interests: ["Sports", "Cooking", "Medicine", "Fitness"],
        verificationStatus: 'verified',
        matchPercentage: 85,
        matchCriteria: { location: true, religion: true, age: true, interests: false }
      },
      {
        id: "3",
        name: "Nadia Khan",
        age: "26",
        location: "Chittagong, Bangladesh",
        profession: "Architect",
        profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
        religion: "Islam",
        interests: ["Art", "Design", "Hiking", "Music"],
        verificationStatus: 'pending',
        matchPercentage: 78,
        matchCriteria: { location: false, religion: true, age: true, interests: true }
      },
      {
        id: "4",
        name: "Rahim Uddin",
        age: "30",
        location: "Sylhet, Bangladesh",
        profession: "Business Analyst",
        profilePicture: "https://randomuser.me/api/portraits/men/76.jpg",
        religion: "Islam",
        interests: ["Finance", "Sports", "Travel", "Politics"],
        verificationStatus: 'unverified',
        matchPercentage: 65,
        matchCriteria: { location: false, religion: true, age: false, interests: false }
      },
      {
        id: "5",
        name: "Tasneem Begum",
        age: "27",
        location: "Dhaka, Bangladesh",
        profession: "Teacher",
        profilePicture: "https://randomuser.me/api/portraits/women/90.jpg",
        religion: "Islam",
        interests: ["Education", "Books", "Volunteering", "Cooking"],
        verificationStatus: 'verified',
        matchPercentage: 88,
        matchCriteria: { location: true, religion: true, age: true, interests: false }
      },
      {
        id: "6",
        name: "Kamal Hossain",
        age: "29",
        location: "Khulna, Bangladesh",
        profession: "Civil Engineer",
        profilePicture: "https://randomuser.me/api/portraits/men/40.jpg",
        religion: "Islam",
        interests: ["Engineering", "Technology", "Outdoor activities", "Music"],
        verificationStatus: 'pending',
        matchPercentage: 72,
        matchCriteria: { location: false, religion: true, age: true, interests: false }
      },
      {
        id: "7",
        name: "Sharmin Akter",
        age: "25",
        location: "Dhaka, Bangladesh",
        profession: "Data Scientist",
        profilePicture: "https://randomuser.me/api/portraits/women/33.jpg",
        religion: "Islam",
        interests: ["AI", "Technology", "Books", "Chess"],
        verificationStatus: 'verified',
        matchPercentage: 94,
        matchCriteria: { location: true, religion: true, age: true, interests: true }
      },
      {
        id: "8",
        name: "Imran Khan",
        age: "34",
        location: "Rajshahi, Bangladesh",
        profession: "University Professor",
        profilePicture: "https://randomuser.me/api/portraits/men/55.jpg",
        religion: "Islam",
        interests: ["Academia", "Literature", "Philosophy", "Music"],
        verificationStatus: 'unverified',
        matchPercentage: 60,
        matchCriteria: { location: false, religion: true, age: false, interests: true }
      }
    ];

    // Simulate API loading delay
    setTimeout(() => {
      setMatches(dummyProfiles);
      setFilteredMatches(dummyProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    const filtered = matches.filter(match => {
      // Filter by verification status
      if (filters.verificationStatus !== 'all' && match.verificationStatus !== filters.verificationStatus) {
        return false;
      }
      
      // Filter by match percentage
      if (match.matchPercentage < filters.minMatchPercentage) {
        return false;
      }
      
      // Filter by location
      if (filters.location && !match.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Filter by religion
      if (filters.religion !== 'all' && match.religion !== filters.religion) {
        return false;
      }
      
      // Filter by age range (convert string age to number for comparison)
      const ageNum = parseInt(match.age);
      if (ageNum < filters.ageRange[0] || ageNum > filters.ageRange[1]) {
        return false;
      }
      
      return true;
    });
    
    setFilteredMatches(filtered);
  }, [filters, matches]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle sending interest to a profile
  const handleSendInterest = (id: string) => {
    // In a real app, this would send an API request
    alert(`Interest sent to profile #${id}!`);
  };

  // Handle viewing detailed profile
  const handleViewProfile = (id: string) => {
    // In a real app, this would navigate to a profile page
    alert(`Viewing detailed profile for #${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Find Your Perfect Match</h1>

          {/* User Profile Status Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your profile is <span className="font-medium">verified</span>. You can view all potential matches and send interest requests.
                </p>
              </div>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Filter Matches</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Location filter */}
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
              
              {/* Verification status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.verificationStatus}
                  onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              
              {/* Religion filter */}
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
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Match percentage slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Match: {filters.minMatchPercentage}%
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={filters.minMatchPercentage}
                  onChange={(e) => handleFilterChange('minMatchPercentage', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-2">
              {filteredMatches.map((match) => (
                <div key={match.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {/* Profile Image and Match Percentage */}
                  <div className="relative">
                    <img 
                      src={match.profilePicture} 
                      alt={`${match.name}'s profile`}
                      className="w-full h-60 object-cover object-center"
                    />
                    {/* Verification Badge */}
                    <div className="absolute top-3 right-3">
                      {match.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                      {match.verificationStatus === 'pending' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </span>
                      )}
                      {match.verificationStatus === 'unverified' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Unverified
                        </span>
                      )}
                    </div>
                    {/* Match Percentage */}
                    <div className="absolute bottom-3 right-3 bg-indigo-600 text-white rounded-full h-14 w-14 flex items-center justify-center font-bold text-lg shadow-lg">
                      {match.matchPercentage}%
                    </div>
                    </div>
                    
                    {/* Profile Details */}
                    <div className="p-5 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">{match.name}, {match.age}</h3>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {match.location}
                      </div>                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {match.profession}
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                        </svg>
                        {match.religion}
                      </div>
                    </div>
                    
                    {/* Interests */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5">Interests:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.interests.map((interest, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Match Criteria */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5">Why you match:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchCriteria.location && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            Location
                          </span>
                        )}
                        {match.matchCriteria.religion && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Religion
                          </span>
                        )}
                        {match.matchCriteria.age && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                            Age
                          </span>
                        )}
                        {match.matchCriteria.interests && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            Interests
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-3">
                      <button 
                        onClick={() => handleSendInterest(match.id)}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        Send Interest
                      </button>
                      <button 
                        onClick={() => handleViewProfile(match.id)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No matches found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMatches;
