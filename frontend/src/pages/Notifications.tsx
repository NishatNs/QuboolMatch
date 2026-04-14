import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { interestApi, notificationApi } from "../services/api";

// Define notification types from backend
interface Notification {
  id: string;
  type: "interest_received" | "interest_accepted" | "interest_rejected" | "new_message" | "system";
  from_user_id?: string;
  from_user?: {
    id: string;
    name: string;
    age: number;
    profile_picture: string | null;
  };
  message: string;
  created_at: string;
  is_read: boolean;
  related_id?: string;
  interest_action_status?: 'accepted' | 'rejected';
}

type InterestActionStatus = 'accepted' | 'rejected';

const HANDLED_INTEREST_NOTIFICATION_KEY = 'handledInterestNotifications';

const readHandledInterestNotificationMap = (): Record<string, InterestActionStatus> => {
  try {
    const raw = sessionStorage.getItem(HANDLED_INTEREST_NOTIFICATION_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, InterestActionStatus>;
  } catch {
    return {};
  }
};

const writeHandledInterestNotificationMap = (map: Record<string, InterestActionStatus>) => {
  try {
    sessionStorage.setItem(HANDLED_INTEREST_NOTIFICATION_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage errors.
  }
};

const applyHandledInterestStatus = (items: Notification[]): Notification[] => {
  const handledMap = readHandledInterestNotificationMap();
  return items.map((item) => {
    const handledStatus = handledMap[item.id];
    if (item.type !== 'interest_received' || !handledStatus) {
      return item;
    }

    const suffix = handledStatus === 'accepted'
      ? '(You accepted this request)'
      : '(You rejected this request)';
    const nextMessage = item.message.includes(suffix) ? item.message : `${item.message} ${suffix}`;

    return {
      ...item,
      is_read: true,
      interest_action_status: handledStatus,
      message: nextMessage,
    };
  });
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationApi.getNotifications();
      const items = applyHandledInterestStatus(response.notifications || []);
      setNotifications(items);
      setUnreadCount(response.unread_count);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      // Recalculate unread count
      const deletedNotif = notifications.find(n => n.id === id);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      alert('Error deleting notification: ' + err.message);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    void markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === "interest_received") {
      navigate(`/interest-requests`);
    } else if (notification.type === "interest_accepted" && notification.from_user_id) {
      const userName = notification.from_user?.name || 'Match';
      navigate(`/messages?user=${encodeURIComponent(notification.from_user_id)}&name=${encodeURIComponent(userName)}`);
    } else if (notification.type === "new_message" && notification.from_user_id) {
      const userName = notification.from_user?.name || 'User';
      navigate(`/messages?user=${encodeURIComponent(notification.from_user_id)}&name=${encodeURIComponent(userName)}`);
    } else if (notification.type === "interest_rejected") {
      navigate(`/interest-requests`);
    }
  };

  const handleInterestAction = async (notification: Notification, action: 'accept' | 'reject') => {
    if (!notification.related_id) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [notification.id]: true }));
      if (action === 'accept') {
        await interestApi.acceptInterest(notification.related_id);
      } else {
        await interestApi.rejectInterest(notification.related_id);
      }

      const handledStatus: InterestActionStatus = action === 'accept' ? 'accepted' : 'rejected';
      const existingMap = readHandledInterestNotificationMap();
      writeHandledInterestNotificationMap({
        ...existingMap,
        [notification.id]: handledStatus,
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((item) => {
          if (item.id !== notification.id) {
            return item;
          }
          return {
            ...item,
            is_read: true,
            interest_action_status: handledStatus,
            message:
              action === 'accept'
                ? `${item.message} (You accepted this request)`
                : `${item.message} (You rejected this request)`,
          };
        })
      );

      await markAsRead(notification.id);
    } catch (err: any) {
      setError(err.message || `Failed to ${action} interest request`);
      await loadNotifications();
    } finally {
      setActionLoading((prev) => ({ ...prev, [notification.id]: false }));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "interest_received":
        return "💌";
      case "interest_accepted":
        return "✅";
      case "interest_rejected":
        return "❌";
      case "system":
        return "🔔";
      case "new_message":
        return "💬";
      default:
        return "📬";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "interest_received":
        return "bg-pink-50 border-pink-200";
      case "interest_accepted":
        return "bg-green-50 border-green-200";
      case "interest_rejected":
        return "bg-red-50 border-red-200";
      case "system":
        return "bg-blue-50 border-blue-200";
      case "new_message":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <div className="bg-indigo-100 border-l-4 border-indigo-500 p-3 mb-6">
              <p className="text-sm text-indigo-700">
                You have <span className="font-bold">{unreadCount}</span> unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          )}

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

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-2 text-sm text-gray-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    border rounded-lg p-4 transition-all duration-200 cursor-pointer
                    ${getNotificationColor(notification.type)}
                    ${!notification.is_read ? 'border-l-4' : ''}
                    hover:shadow-md
                  `}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    {/* Notification Icon/Avatar */}
                    <div className="flex-shrink-0 mr-4">
                      {notification.from_user?.profile_picture ? (
                        <img
                          src={notification.from_user.profile_picture}
                          alt={notification.from_user.name}
                          className="h-12 w-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.from_user?.name || 'User')}&size=48&background=random`;
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      {notification.from_user && (
                        <p className="text-xs text-gray-500 mt-1">
                          From: {notification.from_user.name}, {notification.from_user.age}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.created_at)}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.is_read && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="flex-shrink-0 ml-4 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {notification.type === 'interest_received' && notification.related_id && !notification.interest_action_status && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleInterestAction(notification, 'accept');
                        }}
                        disabled={Boolean(actionLoading[notification.id])}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
                      >
                        {actionLoading[notification.id] ? 'Processing...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleInterestAction(notification, 'reject');
                        }}
                        disabled={Boolean(actionLoading[notification.id])}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
