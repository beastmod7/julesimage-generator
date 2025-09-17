import { useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { Head } from '~/components/shared/Head';
import { Navigate } from 'react-router-dom';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { PhoneAuthButton } from '~/components/domain/auth/PhoneAuthButton';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { state } = useAuthState();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: ''
  });

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

  const handleEdit = () => {
    setFormData({
      displayName: user.displayName || '',
      bio: 'Passionate about technology and innovation.',
      location: 'San Francisco, CA',
      website: 'https://example.com'
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Head title="Profile - AuthTest" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="flex items-center">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                  src={user.photoURL || '/default-avatar.svg'}
                  alt={user.displayName || 'User'}
                />
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">
                    {user.displayName || 'User'}
                  </h1>
                  <p className="text-blue-100">{user.email}</p>
                  <div className="mt-2 flex items-center text-blue-100 text-sm">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Joined {user.metadata.creationTime ?
                      new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
                <div className="ml-auto">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-white text-white hover:bg-white hover:text-blue-600 font-medium rounded-md transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 border border-white text-white hover:bg-white hover:text-blue-600 font-medium rounded-md transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main profile info */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Display Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.displayName}
                              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{user.displayName || 'Not set'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">Email cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bio</label>
                          {isEditing ? (
                            <textarea
                              value={formData.bio}
                              onChange={(e) => setFormData({...formData, bio: e.target.value})}
                              rows={3}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">Passionate about technology and innovation.</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.location}
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">San Francisco, CA</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          {isEditing ? (
                            <input
                              type="url"
                              value={formData.website}
                              onChange={(e) => setFormData({...formData, website: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <a href="https://example.com" className="mt-1 text-blue-600 hover:text-blue-800">
                              https://example.com
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="space-y-6">
                    {/* Account Security */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Account Security
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Verified</span>
                          <span className={`text-sm font-medium ${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {user.emailVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Last Sign In</span>
                          <span className="text-sm text-gray-900">
                            {user.metadata.lastSignInTime ?
                              new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Provider</span>
                          <span className="text-sm text-gray-900">
                            {user.providerData.map(provider => {
                              if (provider.providerId === 'google.com') return 'Google';
                              if (provider.providerId === 'phone') return 'Phone';
                              return 'Email';
                            }).join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Phone Number</span>
                          <span className="text-sm text-gray-900">
                            {user.phoneNumber || 'Not linked'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-3">
                        {!user.phoneNumber && (
                          <div className="pb-3 border-b border-gray-200">
                            <PhoneAuthButton mode="link" variant="primary" className="w-full" />
                          </div>
                        )}
                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                          Change Password
                        </button>
                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                          Download My Data
                        </button>
                        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800">
                          Privacy Settings
                        </button>
                        <div className="pt-3 border-t border-gray-200">
                          <SignOutButton />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}