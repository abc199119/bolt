import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  LinkIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    githubUrl: user?.githubUrl || ''
  });

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      company: user?.company || '',
      githubUrl: user?.githubUrl || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
              <p className="text-gray-900 dark:text-white">@{user.username}</p>
            </div>
          </div>

          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">{user.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                  <p className="text-gray-900 dark:text-white">{user.company}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* GitHub Integration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">GitHub Integration</h3>
        <div className="space-y-4">
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://github.com/username"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">GitHub Profile</p>
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {user.githubUrl}
                  </a>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Connected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}