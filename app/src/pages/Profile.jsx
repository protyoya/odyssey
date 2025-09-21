import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Globe,
  Heart,
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Settings,
  FileText,
  Plane
} from 'lucide-react';

const OdysseyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    address: {
      country: '',
      state: '',
      city: '',
      street: '',
      zipCode: ''
    },
    passportNumber: '',
    preferences: {
      languages: [],
      interests: []
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    activities: '',
    notes: ''
  });

  const [trips, setTrips] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('odyssey_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/tour/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        setProfileData({
          fullName: data.data.fullName || '',
          phone: data.data.phone || '',
          nationality: data.data.nationality || '',
          dateOfBirth: data.data.dateOfBirth ? data.data.dateOfBirth.split('T')[0] : '',
          gender: data.data.gender || '',
          address: data.data.address || {
            country: '',
            state: '',
            city: '',
            street: '',
            zipCode: ''
          },
          passportNumber: data.data.passportNumber || '',
          preferences: data.data.preferences || {
            languages: [],
            interests: []
          }
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  // Fetch trips
  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('odyssey_token');
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setTrips(data.data || []);
      }
    } catch (error) {
      console.error('Trips fetch error:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTrips();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('odyssey_token');
      
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/basic`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        
        // Update localStorage
        localStorage.setItem('odyssey_user', JSON.stringify(data.data));
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('odyssey_token');
      
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordFields(false);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add trip
  const handleAddTrip = async () => {
    if (!newTrip.title || !newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('odyssey_token');
      
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/trips`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newTrip,
          activities: newTrip.activities.split(',').map(a => a.trim()).filter(a => a)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Trip added successfully' });
        setNewTrip({ title: '', destination: '', startDate: '', endDate: '', activities: '', notes: '' });
        fetchTrips(); // Refresh trips list
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Add trip error:', error);
      setMessage({ type: 'error', text: 'Failed to add trip' });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'trips', name: 'My Trips', icon: Plane },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  const languageOptions = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  const interestOptions = [
    'Adventure Sports', 'Cultural Heritage', 'Food & Cuisine', 'Photography', 
    'Wildlife', 'Museums', 'Nightlife', 'Shopping', 'Beaches', 'Mountains', 
    'Historical Sites', 'Festivals'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Profile Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your account settings and travel information
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 max-w-2xl mx-auto ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {message.text}
              </p>
              <button
                onClick={() => setMessage({ type: '', text: '' })}
                className="ml-auto text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-800/50">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsEditing(false);
                        setMessage({ type: '', text: '' });
                      }}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isEditing
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                      }`}
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nationality</label>
                      <input
                        type="text"
                        value={profileData.nationality}
                        onChange={(e) => setProfileData({...profileData, nationality: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="Enter your nationality"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Passport Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Passport Number</label>
                      <input
                        type="text"
                        value={profileData.passportNumber}
                        onChange={(e) => setProfileData({...profileData, passportNumber: e.target.value})}
                        disabled={!isEditing}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="Enter your passport number"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={profileData.address.country}
                        onChange={(e) => setProfileData({...profileData, address: {...profileData.address, country: e.target.value}})}
                        disabled={!isEditing}
                        className={`bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="Country"
                      />
                      <input
                        type="text"
                        value={profileData.address.state}
                        onChange={(e) => setProfileData({...profileData, address: {...profileData.address, state: e.target.value}})}
                        disabled={!isEditing}
                        className={`bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="State"
                      />
                      <input
                        type="text"
                        value={profileData.address.city}
                        onChange={(e) => setProfileData({...profileData, address: {...profileData.address, city: e.target.value}})}
                        disabled={!isEditing}
                        className={`bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={profileData.address.zipCode}
                        onChange={(e) => setProfileData({...profileData, address: {...profileData.address, zipCode: e.target.value}})}
                        disabled={!isEditing}
                        className={`bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                          !isEditing ? 'opacity-60' : ''
                        }`}
                        placeholder="ZIP Code"
                      />
                    </div>
                    <textarea
                      value={profileData.address.street}
                      onChange={(e) => setProfileData({...profileData, address: {...profileData.address, street: e.target.value}})}
                      disabled={!isEditing}
                      className={`w-full mt-4 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${
                        !isEditing ? 'opacity-60' : ''
                      }`}
                      placeholder="Street Address"
                      rows="2"
                    />
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Security Settings</h2>
                  </div>

                  {/* Account Status */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${user.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <span className="text-gray-300">
                        {user.isVerified ? 'Account Verified' : 'Account Pending Verification'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Password</h3>
                      <button
                        onClick={() => setShowPasswordFields(!showPasswordFields)}
                        className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                    </div>

                    {showPasswordFields && (
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <button
                            onClick={handlePasswordChange}
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            <span>Update Password</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordFields(false);
                              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'trips' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">My Trips</h2>
                  </div>

                  {/* Add New Trip */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Add New Trip</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newTrip.title}
                        onChange={(e) => setNewTrip({...newTrip, title: e.target.value})}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Trip Title"
                      />
                      <input
                        type="text"
                        value={newTrip.destination}
                        onChange={(e) => setNewTrip({...newTrip, destination: e.target.value})}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Destination"
                      />
                      <input
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <input
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) => setNewTrip({...newTrip, endDate: e.target.value})}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div className="mt-4 space-y-4">
                      <input
                        type="text"
                        value={newTrip.activities}
                        onChange={(e) => setNewTrip({...newTrip, activities: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Activities (comma-separated)"
                      />
                      <textarea
                        value={newTrip.notes}
                        onChange={(e) => setNewTrip({...newTrip, notes: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Trip Notes"
                        rows="3"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleAddTrip}
                        disabled={isLoading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>Add Trip</span>
                      </button>
                    </div>
                  </div>

                  {/* Trips List */}
                  <div className="space-y-4">
                    {trips.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No trips found. Add your first trip above!</p>
                      </div>
                    ) : (
                      trips.map((trip, index) => (
                        <div key={trip._id || index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">{trip.title}</h3>
                              <div className="space-y-2 text-gray-300">
                                <p className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-purple-400" />
                                  <span>{trip.destination}</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-blue-400" />
                                  <span>
                                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                  </span>
                                </p>
                                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                  trip.status === 'Planned' ? 'bg-blue-500/20 text-blue-400' :
                                  trip.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' :
                                  trip.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {trip.status}
                                </div>
                              </div>
                              {trip.activities && trip.activities.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-400 mb-1">Activities:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {trip.activities.map((activity, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs">
                                        {activity}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {trip.notes && (
                                <p className="mt-3 text-sm text-gray-400">{trip.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Preferences</h2>
                  </div>

                  {/* Languages */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {languageOptions.map((language) => (
                        <label key={language} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.languages.includes(language)}
                            onChange={(e) => {
                              const updatedLanguages = e.target.checked
                                ? [...profileData.preferences.languages, language]
                                : profileData.preferences.languages.filter(l => l !== language);
                              setProfileData({
                                ...profileData,
                                preferences: {
                                  ...profileData.preferences,
                                  languages: updatedLanguages
                                }
                              });
                            }}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-gray-300 text-sm">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Travel Interests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {interestOptions.map((interest) => (
                        <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.interests.includes(interest)}
                            onChange={(e) => {
                              const updatedInterests = e.target.checked
                                ? [...profileData.preferences.interests, interest]
                                : profileData.preferences.interests.filter(i => i !== interest);
                              setProfileData({
                                ...profileData,
                                preferences: {
                                  ...profileData.preferences,
                                  interests: updatedInterests
                                }
                              });
                            }}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-gray-300 text-sm">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save Preferences */}
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const token = localStorage.getItem('odyssey_token');
                          const response = await fetch(`${API_BASE_URL}/api/tour/profile/preferences`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(profileData.preferences)
                          });

                          const data = await response.json();
                          if (response.ok) {
                            setMessage({ type: 'success', text: 'Preferences updated successfully' });
                          } else {
                            setMessage({ type: 'error', text: data.message });
                          }
                        } catch (error) {
                          setMessage({ type: 'error', text: 'Failed to update preferences' });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdysseyProfilePage;