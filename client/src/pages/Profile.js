import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    specialization: userProfile?.specialization || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(currentUser.uid, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    />
                  ) : (
                    userProfile?.displayName || 'User'
                  )}
                </h1>
                <p className="text-gray-400">
                  {userProfile?.email || currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  placeholder="e.g., Geneticist, Researcher"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Specialization</h3>
                <p className="text-white mt-1">
                  {userProfile?.specialization || 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Bio</h3>
                <p className="text-white mt-1">
                  {userProfile?.bio || 'No bio available'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Total Predictions</p>
              <p className="text-2xl font-bold text-white">
                {userProfile?.phenotypeHistory?.length || 0}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Gene Sequences</p>
              <p className="text-2xl font-bold text-white">
                {userProfile?.geneSequences?.length || 0}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-2xl font-bold text-white">
                {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 