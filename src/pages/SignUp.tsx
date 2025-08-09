import React, { useState } from "react";

const SignUp: React.FC = () => {
  const [ageRange, setAgeRange] = useState({ from: "", to: "" });

  const handleAgeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgeRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Create a password"
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* NID */}
          <div className="mb-4">
            <label htmlFor="nid" className="block text-sm font-medium text-gray-700">
              NID (National ID)
            </label>
            <input
              type="text"
              id="nid"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your NID"
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your age"
            />
          </div>

          {/* Religion */}
          <div className="mb-4">
            <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
              Religion
            </label>
            <input
              type="text"
              id="religion"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your religion"
            />
          </div>

          {/* Preferences Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What are you looking for?
            </h3>

            {/* Bride or Groom */}
            <div className="mb-4">
              <label htmlFor="lookingFor" className="block text-sm font-medium text-gray-700">
                Looking For
              </label>
              <select
                id="lookingFor"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select</option>
                <option value="bride">Bride</option>
                <option value="groom">Groom</option>
              </select>
            </div>

            {/* Age Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Age Range
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  name="from"
                  value={ageRange.from}
                  onChange={handleAgeRangeChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="From"
                />
                <input
                  type="number"
                  name="to"
                  value={ageRange.to}
                  onChange={handleAgeRangeChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Profession */}
            <div className="mb-4">
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                Preferred Profession
              </label>
              <input
                type="text"
                id="profession"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter preferred profession"
              />
            </div>

            {/* Religion */}
            <div className="mb-4">
              <label htmlFor="preferredReligion" className="block text-sm font-medium text-gray-700">
                Preferred Religion
              </label>
              <input
                type="text"
                id="preferredReligion"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter preferred religion"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;