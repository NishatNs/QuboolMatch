import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define notification types
interface Notification {
  id: string;
  type: "interest_received" | "interest_accepted" | "profile_view" | "match" | "system";
  fromUserId?: string;
  fromUserName?: string;
  fromUserImage?: string;
  message: string;
  timestamp: string; // ISO date string
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const dummyNotifications: Notification[] = [
        {
          id: "1",
          type: "interest_received",
          fromUserId: "7",
          fromUserName: "Sharmin Akter",
          fromUserImage: "https://randomuser.me/api/portraits/women/33.jpg",
          message: "Sharmin has shown interest in your profile",
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          isRead: false
        },
        {
          id: "2",
          type: "match",
          fromUserId: "5",
          fromUserName: "Tasneem Begum",
          fromUserImage: "https://randomuser.me/api/portraits/women/90.jpg",
          message: "You and Tasneem are now matched! You can start a conversation.",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          isRead: true
        },
        {
          id: "3",
          type: "profile_view",
          fromUserId: "2",
          fromUserName: "Farhan Ahmed",
          fromUserImage: "https://randomuser.me/api/portraits/men/32.jpg",
          message: "Farhan viewed your profile",
          timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
          isRead: true
        },
        {
          id: "4",
          type: "interest_accepted",
          fromUserId: "1",
          fromUserName: "Ayesha Rahman",
          fromUserImage: "https://randomuser.me/api/portraits/women/44.jpg",
          message: "Ayesha accepted your interest request",
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
          isRead: false
        },
        {
          id: "5",
          type: "system",
          message: "Your profile verification is complete. You can now access all features.",
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
          isRead: true
        }
      ];

      setNotifications(dummyNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.fromUserId) {
      // Navigate to the user profile or chat
      if (notification.type === "interest_received") {
        navigate(`/profile/${notification.fromUserId}`);
      } else if (notification.type === "match" || notification.type === "interest_accepted") {
        navigate(`/messages/${notification.fromUserId}`);
      } else if (notification.type === "profile_view") {
        navigate(`/profile/${notification.fromUserId}`);
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "interest_received":
        return (
          <div className="flex-shrink-0 rounded-full bg-pink-100 p-2">
            <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "interest_accepted":
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "match":
        return (
          <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
            <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 8.707l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 10.586V7a1 1 0 012 0v3.586l1.293-1.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "profile_view":
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
            <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <button 
              onClick={markAllAsRead} 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Mark all as read
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                    notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-100'
                  }`}
                >
                  {notification.fromUserImage ? (
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={notification.fromUserImage} 
                        alt={notification.fromUserName || "User"} 
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-900' : 'text-indigo-700'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    
                    {(notification.type === "interest_received" || notification.type === "match") && (
                      <div className="mt-2 flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, handle accepting interest
                            alert("Interest accepted!");
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700"
                        >
                          Accept
                        </button>
                        {notification.type === "interest_received" && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // In a real app, handle declining interest
                              alert("Interest declined");
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!notification.isRead && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;