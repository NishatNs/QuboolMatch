import React from "react";
import { useAuth } from "../context/AuthContext";

const DevLogin: React.FC = () => {
  const { login, isLoggedIn, logout } = useAuth();

  const handleTestLogin = () => {
    login("test_token_" + Date.now());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Development Tools</h3>
        <div className="flex flex-col gap-2">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout (Dev)
            </button>
          ) : (
            <button
              onClick={handleTestLogin}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Login (Dev)
            </button>
          )}
          <div className="text-sm text-gray-500">
            Status: {isLoggedIn ? "Logged In" : "Logged Out"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevLogin;