import React, { useState, useEffect } from 'react';

interface AdminStatsData {
  total_users: number;
  total_admins: number;
  pending_verifications: number;
  verified_users: number;
  rejected_verifications: number;
  verification_rate: number;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken');
      const response = await fetch('http://localhost:8000/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const data: AdminStatsData = await response.json();
      setStats(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">No statistics available</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: '👥',
      color: 'bg-blue-500',
      description: 'Registered users'
    },
    {
      title: 'Verified Users',
      value: stats.verified_users,
      icon: '✅',
      color: 'bg-green-500',
      description: 'Successfully verified'
    },
    {
      title: 'Pending Verifications',
      value: stats.pending_verifications,
      icon: '⏳',
      color: 'bg-yellow-500',
      description: 'Awaiting review'
    },
    {
      title: 'Rejected',
      value: stats.rejected_verifications,
      icon: '❌',
      color: 'bg-red-500',
      description: 'Verification rejected'
    },
    {
      title: 'Admin Users',
      value: stats.total_admins,
      icon: '👑',
      color: 'bg-purple-500',
      description: 'System administrators'
    },
    {
      title: 'Verification Rate',
      value: `${stats.verification_rate}%`,
      icon: '📊',
      color: 'bg-indigo-500',
      description: 'Success rate'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          System statistics and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3 mr-4`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <span className="mr-2">🔄</span>
            Refresh Stats
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
            <span className="mr-2">📋</span>
            Export Report
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors">
            <span className="mr-2">👥</span>
            Manage Users
          </button>
          <button className="flex items-center justify-center px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
            <span className="mr-2">⚙️</span>
            Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">●</span>
              <span className="text-sm font-medium text-gray-800">API Server</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-500 mr-3">●</span>
              <span className="text-sm font-medium text-gray-800">Database</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-blue-500 mr-3">●</span>
              <span className="text-sm font-medium text-gray-800">Verification Queue</span>
            </div>
            <span className="text-sm text-blue-600 font-medium">
              {stats.pending_verifications} pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;