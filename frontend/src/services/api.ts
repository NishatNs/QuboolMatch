// API Service for backend communication
const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
};

// ==================== INTEREST ENDPOINTS ====================

export const interestApi = {
  // Browse all users
  browseUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users/browse`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Send interest to a user
  sendInterest: async (toUserId: string, message?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interests/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ to_user_id: toUserId, message })
    });
    return handleResponse(response);
  },

  // Get received interests
  getReceivedInterests: async () => {
    const response = await fetch(`${API_BASE_URL}/api/interests/received`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get sent interests
  getSentInterests: async () => {
    const response = await fetch(`${API_BASE_URL}/api/interests/sent`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Accept an interest
  acceptInterest: async (interestId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}/accept`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Reject an interest
  rejectInterest: async (interestId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Cancel a sent interest
  cancelInterest: async (interestId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interests/${interestId}/cancel`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get matches (accepted interests)
  getMatches: async () => {
    const response = await fetch(`${API_BASE_URL}/api/interests/matches`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get full profile (requires mutual interest)
  getFullProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile/full`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== NOTIFICATION ENDPOINTS ====================

export const notificationApi = {
  // Get all notifications
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== AUTH ENDPOINTS ====================

export const authApi = {
  signIn: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign_in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  signUp: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign_up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

export default {
  interest: interestApi,
  notification: notificationApi,
  auth: authApi
};
