import React, { useState, useEffect } from "react";

// Define interface for the lifestyle preferences
interface LifestylePreferences {
  smoking: string;
  alcohol: string;
  dietaryMatch: boolean;
}

// Define the complete profile data structure
interface ProfileData {
  // Personal Information
  name: string;
  age: string;
  gender: string;
  location: string;
  academicBackground: string;
  profession: string;
  maritalStatus: string;
  religion: string;
  hobbies: string;
  introVideo: string;
  
  // Health Information
  medicalHistory: string;
  overallHealthStatus: string;
  longTermCondition: string;
  longTermConditionDescription: string;
  bloodGroup: string;
  geneticConditions: string[];
  fertilityAwareness: string;
  disability: string;
  disabilityDescription: string;
  medicalDocuments: string;
  
  // Physical Attributes
  height: string;
  weight: string;
  
  // Lifestyle & Habits
  dietaryPreference: string;
  smokingHabit: string;
  alcoholConsumption: string;
  chronicIllness: string;
  interests: string;
  
  // Profile Picture
  profilePicture: string;
  
  // Partner and Marriage Preferences
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredHeightMin: string;
  preferredHeightMax: string;
  preferredWeightMin: string;
  preferredWeightMax: string;
  preferredReligion: string;
  preferredEducation: string;
  preferredProfession: string;
  preferredLocation: string;
  specificLocation?: string;
  willingToRelocate: boolean;
  lifestylePreferences: LifestylePreferences;
  livingWithInLaws: string;
  careerSupportExpectations: string;
  necessaryPreferences: string[];
  additionalComments: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    // Personal Information
    name: "",
    age: "",
    gender: "",
    location: "",
    academicBackground: "",
    profession: "",
    maritalStatus: "",
    religion: "",
    hobbies: "",
    introVideo: "",
    
    // Health Information
    medicalHistory: "",
    overallHealthStatus: "",
    longTermCondition: "",
    longTermConditionDescription: "",
    bloodGroup: "",
    geneticConditions: [],
    fertilityAwareness: "",
    disability: "",
    disabilityDescription: "",
    medicalDocuments: "",
    
    // Physical Attributes
    height: "",
    weight: "",
    
    // Lifestyle & Habits
    dietaryPreference: "",
    smokingHabit: "",
    alcoholConsumption: "",
    chronicIllness: "",
    interests: "",
    
    // Profile Picture
    profilePicture: "",
    
    // Partner and Marriage Preferences
    preferredAgeMin: "",
    preferredAgeMax: "",
    preferredHeightMin: "",
    preferredHeightMax: "",
    preferredWeightMin: "",
    preferredWeightMax: "",
    preferredReligion: "",
    preferredEducation: "",
    preferredProfession: "",
    preferredLocation: "",
    willingToRelocate: false,
    lifestylePreferences: {
      smoking: "",
      alcohol: "",
      dietaryMatch: false
    },
    livingWithInLaws: "",
    careerSupportExpectations: "",
    necessaryPreferences: [],
    additionalComments: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any; type?: string; checked?: boolean } }) => {
    const { name, value, type } = e.target as HTMLInputElement & { type?: string };
    const checked = (e.target as HTMLInputElement).checked;
    
    // Handle genetic condition checkboxes
    if (name === 'geneticConditions' && Array.isArray(value)) {
      setProfile((prev) => ({ ...prev, geneticConditions: value }));
      return;
    }
    
    // Handle medical document upload
    if (name === 'medicalDocuments' && typeof value === 'string') {
      setProfile((prev) => ({ ...prev, medicalDocuments: value }));
      return;
    }
    
    if (type === 'checkbox') {
      // Handle nested properties for lifestyle preferences
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'lifestylePreferences') {
          setProfile((prev) => ({
            ...prev,
            lifestylePreferences: { 
              ...prev.lifestylePreferences, 
              [child]: checked 
            }
          }));
        }
      } else if (name === 'willingToRelocate') {
        setProfile((prev) => ({ ...prev, willingToRelocate: checked }));
      } else if (name === 'necessaryPreferences') {
        const checkboxValue = (e.target as HTMLInputElement).value;
        setProfile((prev) => {
          const current = [...prev.necessaryPreferences];
          if (checked) {
            current.push(checkboxValue);
          } else {
            const index = current.indexOf(checkboxValue);
            if (index > -1) {
              current.splice(index, 1);
            }
          }
          return { ...prev, necessaryPreferences: current };
        });
      } else if (name.startsWith('geneticCondition_')) {
        // Handle individual genetic condition checkboxes
        const conditionValue = name.replace('geneticCondition_', '');
        setProfile((prev) => {
          const conditions = [...prev.geneticConditions];
          if (checked && !conditions.includes(conditionValue)) {
            conditions.push(conditionValue);
          } else if (!checked) {
            const index = conditions.indexOf(conditionValue);
            if (index > -1) {
              conditions.splice(index, 1);
            }
          }
          return { ...prev, geneticConditions: conditions };
        });
      }
    } else {
      // For normal inputs
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'lifestylePreferences') {
          setProfile((prev) => ({
            ...prev,
            lifestylePreferences: { 
              ...prev.lifestylePreferences, 
              [child]: value 
            }
          }));
        }
      } else {
        setProfile((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          setProfile((prev) => ({ ...prev, profilePicture: reader.result as string }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert('Please sign in first');
        return;
      }

      // Transform the frontend profile data to match the backend API format
      const profileData = {
        location: profile.location,
        academic_background: profile.academicBackground,
        profession: profile.profession,
        marital_status: profile.maritalStatus,
        hobbies: profile.hobbies,
        intro_video: profile.introVideo,
        medical_history: profile.medicalHistory,
        overall_health_status: profile.overallHealthStatus,
        long_term_condition: profile.longTermCondition,
        long_term_condition_description: profile.longTermConditionDescription,
        blood_group: profile.bloodGroup,
        genetic_conditions: profile.geneticConditions,
        fertility_awareness: profile.fertilityAwareness,
        disability: profile.disability,
        disability_description: profile.disabilityDescription,
        medical_documents: profile.medicalDocuments,
        height: parseFloat(profile.height) || null,
        weight: parseFloat(profile.weight) || null,
        dietary_preference: profile.dietaryPreference,
        smoking_habit: profile.smokingHabit,
        alcohol_consumption: profile.alcoholConsumption,
        chronic_illness: profile.chronicIllness,
        interests: profile.interests,
        profile_picture: profile.profilePicture,
        preferred_age_min: parseInt(profile.preferredAgeMin) || null,
        preferred_age_max: parseInt(profile.preferredAgeMax) || null,
        preferred_height_min: parseFloat(profile.preferredHeightMin) || null,
        preferred_height_max: parseFloat(profile.preferredHeightMax) || null,
        preferred_weight_min: parseFloat(profile.preferredWeightMin) || null,
        preferred_weight_max: parseFloat(profile.preferredWeightMax) || null,
        preferred_religion: profile.preferredReligion,
        preferred_education: profile.preferredEducation,
        preferred_profession: profile.preferredProfession,
        preferred_location: profile.preferredLocation,
        specific_location: profile.specificLocation || null,
        willing_to_relocate: profile.willingToRelocate,
        lifestyle_pref_smoking: profile.lifestylePreferences.smoking,
        lifestyle_pref_alcohol: profile.lifestylePreferences.alcohol,
        lifestyle_pref_dietary_match: profile.lifestylePreferences.dietaryMatch,
        living_with_in_laws: profile.livingWithInLaws,
        career_support_expectations: profile.careerSupportExpectations,
        necessary_preferences: profile.necessaryPreferences,
        additional_comments: profile.additionalComments,
        is_completed: true
      };

      // Try to update first (if profile exists), otherwise create
      let response = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      // If update fails with 404, try creating new profile
      if (response.status === 404) {
        response = await fetch('http://localhost:8000/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save profile');
      }

      const result = await response.json();
      console.log("Profile Saved:", result);
      alert("Profile information saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Load existing profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          return; // User not logged in
        }

        const response = await fetch('http://localhost:8000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Transform backend data to frontend format
          setProfile({
            name: data.name || '',
            age: data.age || '',
            gender: data.gender || '',
            location: data.location || '',
            academicBackground: data.academic_background || '',
            profession: data.profession || '',
            maritalStatus: data.marital_status || '',
            religion: data.religion || '',
            hobbies: data.hobbies || '',
            introVideo: data.intro_video || '',
            medicalHistory: data.medical_history || '',
            overallHealthStatus: data.overall_health_status || '',
            longTermCondition: data.long_term_condition || '',
            longTermConditionDescription: data.long_term_condition_description || '',
            bloodGroup: data.blood_group || '',
            geneticConditions: data.genetic_conditions || [],
            fertilityAwareness: data.fertility_awareness || '',
            disability: data.disability || '',
            disabilityDescription: data.disability_description || '',
            medicalDocuments: data.medical_documents || '',
            height: data.height?.toString() || '',
            weight: data.weight?.toString() || '',
            dietaryPreference: data.dietary_preference || '',
            smokingHabit: data.smoking_habit || '',
            alcoholConsumption: data.alcohol_consumption || '',
            chronicIllness: data.chronic_illness || '',
            interests: data.interests || '',
            profilePicture: data.profile_picture || '',
            preferredAgeMin: data.preferred_age_min?.toString() || '',
            preferredAgeMax: data.preferred_age_max?.toString() || '',
            preferredHeightMin: data.preferred_height_min?.toString() || '',
            preferredHeightMax: data.preferred_height_max?.toString() || '',
            preferredWeightMin: data.preferred_weight_min?.toString() || '',
            preferredWeightMax: data.preferred_weight_max?.toString() || '',
            preferredReligion: data.preferred_religion || '',
            preferredEducation: data.preferred_education || '',
            preferredProfession: data.preferred_profession || '',
            preferredLocation: data.preferred_location || '',
            specificLocation: data.specific_location || '',
            willingToRelocate: data.willing_to_relocate || false,
            lifestylePreferences: {
              smoking: data.lifestyle_pref_smoking || '',
              alcohol: data.lifestyle_pref_alcohol || '',
              dietaryMatch: data.lifestyle_pref_dietary_match || false
            },
            livingWithInLaws: data.living_with_in_laws || '',
            careerSupportExpectations: data.career_support_expectations || '',
            necessaryPreferences: data.necessary_preferences || [],
            additionalComments: data.additional_comments || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Profile</h1>
        <form onSubmit={handleSubmit}>
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            onInputChange={handleInputChange}
            onProfilePictureChange={handleProfilePictureChange}
          />

          {/* Personal Info Section */}
          <PersonalInfoSection profile={profile} onInputChange={handleInputChange} />
          
          {/* Partner Preferences Section */}
          <PartnerPreferencesSection profile={profile} onInputChange={handleInputChange} />

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileHeader: React.FC<{
  profile: ProfileData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onProfilePictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ profile, onInputChange, onProfilePictureChange }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profile.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md object-cover"
          />
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-indigo-700"
          >
            Upload
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={onProfilePictureChange}
            className="hidden"
          />
        </div>

        {/* Name and Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={onInputChange}
            className="text-lg font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            placeholder="Enter your name"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={onInputChange}
              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
              placeholder="Enter your age"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={onInputChange}
              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={onInputChange}
              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
              placeholder="Enter your location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalInfoSection: React.FC<{
  profile: ProfileData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}> = ({ profile, onInputChange }) => {
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // For now just store the filename, in a real app you'd upload to server
      // and store URL
      const fileName = file.name;
      onInputChange({
        target: { name: 'introVideo', value: fileName }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
      <div className="space-y-5">
        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <select
            name="maritalStatus"
            value={profile.maritalStatus}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Marital Status</option>
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
            <option value="Annulled">Annulled</option>
          </select>
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Religion</label>
          <select
            name="religion"
            value={profile.religion}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Religion</option>
            <option value="Islam">Islam</option>
            <option value="Christianity">Christianity</option>
            <option value="Hinduism">Hinduism</option>
            <option value="Buddhism">Buddhism</option>
            <option value="Judaism">Judaism</option>
            <option value="Sikhism">Sikhism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Academic Background */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Academic Background</label>
          <input
            type="text"
            name="academicBackground"
            value={profile.academicBackground}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your school, college, highest degree, institution, etc."
          />
        </div>

        {/* Profession */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profession</label>
          <input
            type="text"
            name="profession"
            value={profile.profession}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your current job position and company"
          />
        </div>

        {/* Hobbies */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hobbies</label>
          <textarea
            name="hobbies"
            value={profile.hobbies}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Share your hobbies and activities you enjoy (e.g., cooking, travel, reading)"
          ></textarea>
        </div>

        {/* Introductory Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Introductory Video</label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="introVideo"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 cursor-pointer"
            >
              Upload Video
            </label>
            <input
              type="file"
              id="introVideo"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <span className="ml-3 text-sm text-gray-500">
              {profile.introVideo ? profile.introVideo : "No video uploaded yet"}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Upload a short video introduction (max 60 seconds, MP4 format recommended)
          </p>
        </div>

        {/* Health & Genetics */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Health & Genetics</h3>
          <p className="text-sm text-gray-500 mb-4 italic">All health information is optional and will be treated as sensitive information. You can choose to share only what you're comfortable with.</p>
          
          {/* Basic Health Status */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Basic Health Information</h4>
            
            {/* Overall Health Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Overall Health Status</label>
              <div className="flex flex-wrap items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallHealthStatus"
                    value="Excellent"
                    checked={profile.overallHealthStatus === "Excellent"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Excellent
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallHealthStatus"
                    value="Good"
                    checked={profile.overallHealthStatus === "Good"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Good
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallHealthStatus"
                    value="Fair"
                    checked={profile.overallHealthStatus === "Fair"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Fair
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="overallHealthStatus"
                    value="Has Issues"
                    checked={profile.overallHealthStatus === "Has Issues"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Has Issues
                </label>
              </div>
            </div>

            {/* Height, Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (in cm)</label>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={onInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your height"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (in kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={onInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your weight"
                />
              </div>
            </div>
            
            {/* Blood Group */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={onInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          
          {/* Genetic Conditions */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Genetic & Medical Conditions</h4>
            <p className="text-sm text-gray-500 mb-3">Please indicate if you have any of the following conditions:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="diabetes"
                  name="geneticCondition_Diabetes"
                  checked={profile.geneticConditions.includes('Diabetes')}
                  onChange={onInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="diabetes" className="ml-2 block text-sm text-gray-700">Diabetes</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="thalassemia"
                  name="geneticCondition_Thalassemia"
                  checked={profile.geneticConditions.includes('Thalassemia')}
                  onChange={onInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="thalassemia" className="ml-2 block text-sm text-gray-700">Thalassemia</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="heartDisease"
                  name="geneticCondition_Heart Disease"
                  checked={profile.geneticConditions.includes('Heart Disease')}
                  onChange={onInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="heartDisease" className="ml-2 block text-sm text-gray-700">Heart Disease</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="asthma"
                  name="geneticCondition_Asthma"
                  checked={profile.geneticConditions.includes('Asthma')}
                  onChange={onInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="asthma" className="ml-2 block text-sm text-gray-700">Asthma</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cancer"
                  name="geneticCondition_Cancer"
                  checked={profile.geneticConditions.includes('Cancer')}
                  onChange={onInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="cancer" className="ml-2 block text-sm text-gray-700">Cancer</label>
                <label htmlFor="cancer" className="ml-2 block text-sm text-gray-700">Cancer</label>
              </div>
            </div>
            
            {/* Other Health Conditions */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Any Long-Term Medical Condition?
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="longTermCondition"
                    value="Yes"
                    checked={profile.longTermCondition === "Yes"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="longTermCondition"
                    value="No"
                    checked={profile.longTermCondition === "No"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              {profile.longTermCondition === "Yes" && (
                <textarea
                  name="longTermConditionDescription"
                  value={profile.longTermConditionDescription}
                  onChange={onInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                  placeholder="If yes, please provide a short description"
                ></textarea>
              )}
            </div>
          </div>
          
          {/* Sensitive Health Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Sensitive Health Information</h4>
            <p className="text-sm text-gray-500 mb-3">This information is completely optional and will be treated confidentially</p>
            
            {/* Fertility Awareness */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fertility Awareness</label>
              <select
                name="fertilityAwareness"
                value={profile.fertilityAwareness}
                onChange={onInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Option</option>
                <option value="normal">No known fertility issues</option>
                <option value="issues">Known fertility challenges</option>
                <option value="private">Prefer to discuss privately</option>
                <option value="notRelevant">Not relevant to me</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">This information is sensitive and optional. You can choose to keep it private or discuss with potential matches later.</p>
            </div>
            
            {/* Disability or Special Needs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Do you have any disability or special needs?</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="disability"
                    value="Yes"
                    checked={profile.disability === "Yes"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="disability"
                    value="No"
                    checked={profile.disability === "No"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="disability"
                    value="Prefer not to say"
                    checked={profile.disability === "Prefer not to say"}
                    onChange={onInputChange}
                    className="mr-2"
                  />
                  Prefer not to say
                </label>
              </div>
              {profile.disability === "Yes" && (
                <textarea
                  name="disabilityDescription"
                  value={profile.disabilityDescription}
                  onChange={onInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                  placeholder="Please describe your disability or special needs"
                ></textarea>
              )}
            </div>
            
            {/* Medical Documents */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Medical Reports (Optional)</label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="medicalDocs"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 cursor-pointer"
                >
                  Upload Documents
                </label>
                <input
                  type="file"
                  id="medicalDocs"
                  name="medicalDocuments"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Use custom event to work with onInputChange
                      const file = e.target.files[0];
                      const fileName = file.name;
                      // Create a custom event object compatible with onInputChange
                      const customEvent = {
                        target: { 
                          name: 'medicalDocuments', 
                          value: fileName 
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      
                      onInputChange(customEvent);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <span className="ml-3 text-sm text-gray-500">
                  {profile.medicalDocuments ? profile.medicalDocuments : "No document uploaded"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                You can upload vaccination records or other medical documents that you feel are relevant. All documents are kept confidential.
              </p>
            </div>
          </div>
          

          {/* Dietary Preference */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dietary Preference</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dietaryPreference"
                  value="Vegetarian"
                  onChange={onInputChange}
                  className="mr-2"
                />
                Vegetarian
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dietaryPreference"
                  value="Non-Vegetarian"
                  onChange={onInputChange}
                  className="mr-2"
                />
                Non-Vegetarian
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dietaryPreference"
                  value="Vegan"
                  onChange={onInputChange}
                  className="mr-2"
                />
                Vegan
              </label>
            </div>
          </div>

          {/* Smoking Habit */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Smoking Habit</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smokingHabit"
                  value="Yes"
                  onChange={onInputChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="smokingHabit"
                  value="No"
                  onChange={onInputChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Alcohol Consumption */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Alcohol Consumption</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="alcoholConsumption"
                  value="Yes"
                  onChange={onInputChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="alcoholConsumption"
                  value="No"
                  onChange={onInputChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          
        </div>

  

        
      </div>
    </div>
  );
};

const PartnerPreferencesSection: React.FC<{
  profile: ProfileData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}> = ({ profile, onInputChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Partner and Marriage Preferences</h2>
      
      {/* Age Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Preferred Age Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Age</label>
            <input
              type="number"
              name="preferredAgeMin"
              value={profile.preferredAgeMin}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Min Age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Age</label>
            <input
              type="number"
              name="preferredAgeMax"
              value={profile.preferredAgeMax}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Max Age"
            />
          </div>
        </div>
      </div>
      
      {/* Height/Weight Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Preferred Height/Weight</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Height (cm)</label>
            <input
              type="number"
              name="preferredHeightMin"
              value={profile.preferredHeightMin}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Min Height"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Height (cm)</label>
            <input
              type="number"
              name="preferredHeightMax"
              value={profile.preferredHeightMax}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Max Height"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Weight (kg)</label>
            <input
              type="number"
              name="preferredWeightMin"
              value={profile.preferredWeightMin}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Min Weight"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Weight (kg)</label>
            <input
              type="number"
              name="preferredWeightMax"
              value={profile.preferredWeightMax}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Max Weight"
            />
          </div>
        </div>
      </div>
      
      {/* Religious Preference */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Religious Preference</h3>
        <select
          name="preferredReligion"
          value={profile.preferredReligion}
          onChange={onInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Select Preferred Religion</option>
          <option value="muslim">Muslim</option>
          <option value="christian">Christian</option>
          <option value="hindu">Hindu</option>
          <option value="buddhist">Buddhist</option>
          <option value="jewish">Jewish</option>
          <option value="sikh">Sikh</option>
          <option value="noPreference">No Preference</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Educational & Professional Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Educational & Professional Preference</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Education Level</label>
          <select
            name="preferredEducation"
            value={profile.preferredEducation}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
          >
            <option value="">Select Preferred Education Level</option>
            <option value="highSchool">High School</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
            <option value="noPreference">No Preference</option>
          </select>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Professional Field</label>
          <input
            type="text"
            name="preferredProfession"
            value={profile.preferredProfession}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
            placeholder="E.g., Medical, Engineering, Education, etc."
          />
        </div>
      </div>
      
      {/* Location Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Location Preference</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Location</label>
          <select
            name="preferredLocation"
            value={profile.preferredLocation}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
          >
            <option value="">Select Location Preference</option>
            <option value="sameCity">Same City</option>
            <option value="sameCountry">Same Country</option>
            <option value="anywhere">Anywhere</option>
            <option value="specific">Specific Location</option>
          </select>
          {profile.preferredLocation === 'specific' && (
            <input
              type="text"
              name="specificLocation"
              onChange={onInputChange}
              className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
              placeholder="Specify location"
            />
          )}
        </div>
        <div className="mt-3 flex items-center">
          <input
            type="checkbox"
            id="willingToRelocate"
            name="willingToRelocate"
            checked={profile.willingToRelocate}
            onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
            className="h-4 w-4 text-indigo-600 rounded"
          />
          <label htmlFor="willingToRelocate" className="ml-2 block text-sm text-gray-700">
            I am open to relocating for my spouse
          </label>
        </div>
      </div>
      
      {/* Lifestyle Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Lifestyle Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Smoking Tolerance</label>
            <select
              name="lifestylePreferences.smoking"
              value={profile.lifestylePreferences.smoking}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
            >
              <option value="">Select Preference</option>
              <option value="nonSmoker">Must be Non-smoker</option>
              <option value="occasional">Occasional is acceptable</option>
              <option value="noPreference">No Preference</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alcohol Tolerance</label>
            <select
              name="lifestylePreferences.alcohol"
              value={profile.lifestylePreferences.alcohol}
              onChange={onInputChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
            >
              <option value="">Select Preference</option>
              <option value="nonDrinker">Must be Non-drinker</option>
              <option value="occasional">Occasional is acceptable</option>
              <option value="noPreference">No Preference</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <input
            type="checkbox"
            id="dietaryMatch"
            name="lifestylePreferences.dietaryMatch"
            checked={profile.lifestylePreferences.dietaryMatch}
            onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
            className="h-4 w-4 text-indigo-600 rounded"
          />
          <label htmlFor="dietaryMatch" className="ml-2 block text-sm text-gray-700">
            Dietary preferences must match with mine
          </label>
        </div>
      </div>
      
      {/* After Marriage Expectations */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">After Marriage Expectations</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Living Arrangement</label>
          <select
            name="livingWithInLaws"
            value={profile.livingWithInLaws}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
          >
            <option value="">Select Preference</option>
            <option value="willing">Willing to live with in-laws</option>
            <option value="preferNot">Prefer separate residence</option>
            <option value="temporarilyOk">Temporarily acceptable</option>
            <option value="noPreference">No preference</option>
          </select>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">Career Support Expectations</label>
          <select
            name="careerSupportExpectations"
            value={profile.careerSupportExpectations}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
          >
            <option value="">Select Preference</option>
            <option value="fullSupport">Full support for career goals</option>
            <option value="partialSupport">Partial support - family comes first</option>
            <option value="traditionalRoles">Prefer traditional roles</option>
            <option value="flexible">Flexible based on situation</option>
          </select>
        </div>
      </div>
      
      {/* Must-Have Preferences */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Must-Have Preferences</h3>
        <p className="text-sm text-gray-500 mb-2">Select preferences that are absolutely necessary for you</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryAge"
              name="necessaryPreferences"
              value="age"
              checked={profile.necessaryPreferences.includes('age')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryAge" className="ml-2 block text-sm text-gray-700">Age Range</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryHeight"
              name="necessaryPreferences"
              value="height"
              checked={profile.necessaryPreferences.includes('height')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryHeight" className="ml-2 block text-sm text-gray-700">Height</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryReligion"
              name="necessaryPreferences"
              value="religion"
              checked={profile.necessaryPreferences.includes('religion')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryReligion" className="ml-2 block text-sm text-gray-700">Religion</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryEducation"
              name="necessaryPreferences"
              value="education"
              checked={profile.necessaryPreferences.includes('education')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryEducation" className="ml-2 block text-sm text-gray-700">Education</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryLocation"
              name="necessaryPreferences"
              value="location"
              checked={profile.necessaryPreferences.includes('location')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryLocation" className="ml-2 block text-sm text-gray-700">Location</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessaryLifestyle"
              name="necessaryPreferences"
              value="lifestyle"
              checked={profile.necessaryPreferences.includes('lifestyle')}
              onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label htmlFor="necessaryLifestyle" className="ml-2 block text-sm text-gray-700">Lifestyle (smoking/alcohol)</label>
          </div>
        </div>
      </div>
      
      {/* Additional Comments */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Comments</h3>
        <textarea
          name="additionalComments"
          value={profile.additionalComments}
          onChange={onInputChange}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-600 focus:outline-none"
          placeholder="Any other preferences or expectations you'd like to mention"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProfilePage;