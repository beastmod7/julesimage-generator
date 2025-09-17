import { useAuthState } from '~/components/contexts/UserContext';
import { Head } from '~/components/shared/Head';
import { Navigate } from 'react-router-dom';
import {
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Sessions', value: '12', icon: ClockIcon, change: '+4.75%', changeType: 'positive' },
  { name: 'Security Score', value: '98%', icon: ShieldCheckIcon, change: '+2.02%', changeType: 'positive' },
  { name: 'Profile Views', value: '24', icon: UserIcon, change: '+12.5%', changeType: 'positive' },
  { name: 'Notifications', value: '3', icon: BellIcon, change: '-1', changeType: 'negative' },
];

const recentActivity = [
  {
    id: 1,
    action: 'Signed in',
    timestamp: '2 minutes ago',
    device: 'Chrome on macOS',
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    action: 'Updated profile',
    timestamp: '1 hour ago',
    device: 'Safari on iOS',
    location: 'San Francisco, CA',
  },
  {
    id: 3,
    action: 'Changed password',
    timestamp: '2 days ago',
    device: 'Chrome on Windows',
    location: 'New York, NY',
  },
];

export default function Dashboard() {
  const { state } = useAuthState();

  // Redirect if not signed in
  if (state.state === 'SIGNED_OUT') {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (state.state === 'UNKNOWN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const user = state.currentUser;

  return (
    <>
      <Head title="Dashboard - AuthTest" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.photoURL || '/default-avatar.svg'}
                  alt={user.displayName || 'User'}
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.displayName?.split(' ')[0] || 'User'}!
            </h2>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your account today.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div
                key={item.name}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {item.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((item, itemIdx) => (
                      <li key={item.id}>
                        <div className="relative pb-8">
                          {itemIdx !== recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <UserIcon className="h-4 w-4 text-white" aria-hidden="true" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {item.action} from <span className="font-medium text-gray-900">{item.device}</span>
                                </p>
                                <p className="text-xs text-gray-400">{item.location}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {item.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Edit Profile</p>
                      <p className="text-xs text-gray-500">Update your personal information</p>
                    </div>
                  </button>

                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Security Settings</p>
                      <p className="text-xs text-gray-500">Manage passwords and 2FA</p>
                    </div>
                  </button>

                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Notifications</p>
                      <p className="text-xs text-gray-500">Configure alert preferences</p>
                    </div>
                  </button>

                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-500">View detailed reports</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}