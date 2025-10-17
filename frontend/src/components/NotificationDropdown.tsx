import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const fetchNotifications = () => {
    setLoading(true);
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
          id: "2",
          type: "match",
          fromUserId: "5",
          fromUserName: "Tasneem Begum",
          fromUserImage: "https://randomuser.me/api/portraits/women/90.jpg",
          message: "You and Tasneem are now matched!",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          isRead: true
        }
      ];

      setNotifications(dummyNotifications);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-1 text-gray-700 hover:text-indigo-600 focus:outline-none"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <svg 
          className="h-6 w-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                <Link 
                  to="/notifications" 
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                  onClick={() => setIsOpen(false)}
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.fromUserId ? `/profile/${notification.fromUserId}` : "/notifications"}
                      className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center">
                        {notification.fromUserImage && (
                          <div className="flex-shrink-0 mr-3">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={notification.fromUserImage}
                              alt={notification.fromUserName || "User"}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-normal'} text-gray-900 truncate`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;