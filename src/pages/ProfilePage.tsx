import React, { useState } from "react";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    academicBackground: "",
    profession: "",
    medicalHistory: "",
    overallHealthStatus: "",
    longTermCondition: "",
    longTermConditionDescription: "",
    height: "",
    weight: "",
    dietaryPreference: "",
    smokingHabit: "",
    alcoholConsumption: "",
    chronicIllness: "",
    interests: "",
    partnerPreferences: "",
    profilePicture: "", // Store the profile picture URL
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile Saved:", profile);
    alert("Profile information saved successfully!");
  };

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
  profile: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  profile: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ profile, onInputChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h2>
      <div className="space-y-4">
        {/* Academic Background */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Academic Background</label>
          <input
            type="text"
            name="academicBackground"
            value={profile.academicBackground}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your academic background"
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
            placeholder="Enter your profession"
          />
        </div>

        {/* Medical History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical History</h3>

          {/* Overall Health Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Overall Health Status</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="overallHealthStatus"
                  value="Excellent"
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
                  onChange={onInputChange}
                  className="mr-2"
                />
                Has Issues
              </label>
            </div>
          </div>

          {/* Long-Term Medical Condition */}
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
                  onChange={onInputChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
            <textarea
              name="longTermConditionDescription"
              value={profile.longTermConditionDescription}
              onChange={onInputChange}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="If yes, provide a short description"
            ></textarea>
          </div>

          {/* Height, Weight, or BMI */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Height (in cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your height"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Weight (in kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your weight"
            />
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

          {/* Chronic Illness */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Chronic Illness</label>
            <textarea
              name="chronicIllness"
              value={profile.chronicIllness}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Enter details about any chronic illness (optional)"
            ></textarea>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Interests</label>
          <textarea
            name="interests"
            value={profile.interests}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Enter your interests"
          ></textarea>
        </div>

        {/* Partner Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Partner Preferences</label>
          <textarea
            name="partnerPreferences"
            value={profile.partnerPreferences}
            onChange={onInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Enter your partner preferences"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;