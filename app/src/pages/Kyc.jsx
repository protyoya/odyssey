import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Shield,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Copy,
  FileText,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Calendar,
  Globe,
  CreditCard,
  Verified
} from 'lucide-react';

const OdysseyKYCPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [kycStatus, setKycStatus] = useState('not_applied');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showFullProfile, setShowFullProfile] = useState(false);
  const canvasRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchUserProfile();
    checkProfileCompletion();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('odyssey_token');
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication required' });
        setLoading(false);
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
        setKycStatus(data.data.kycStatus || 'not_applied');

        // Generate QR code if KYC is approved
        if (data.data.kycStatus === 'approved') {
          generateQRCode(data.data);
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompletion = async () => {
    try {
      const token = localStorage.getItem('odyssey_token');
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/completion`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setProfileCompletion(data.data.completionPercentage);
      }
    } catch (error) {
      console.error('Profile completion check error:', error);
    }
  };

  const generateQRCode = async (userData) => {
    try {
      const qrData = {
        id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        nationality: userData.nationality,
        passportNumber: userData.passportNumber,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address,
        kycStatus: userData.kycStatus,
        kycVerifiedAt: userData.kycVerifiedAt,
        kycVerifiedBy: userData.kycVerifiedBy,
        emergencyContacts: userData.emergencyContacts,
        verificationTimestamp: Date.now(),
        type: 'odyssey_kyc_verification'
      };

      const qrString = JSON.stringify(qrData);
      const qrCodeDataURL = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        },
        width: 300
      });

      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('QR Code generation error:', error);
      setMessage({ type: 'error', text: 'Failed to generate QR code' });
    }
  };

  const applyForKYC = async () => {
    if (profileCompletion < 100) {
      setMessage({
        type: 'error',
        text: 'Please complete your profile first. All fields are required for KYC verification.'
      });
      return;
    }

    try {
      const token = localStorage.getItem('odyssey_token');
      const response = await fetch(`${API_BASE_URL}/api/tour/profile/kyc/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'KYC application submitted successfully!' });
        setKycStatus('pending');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('KYC application error:', error);
      setMessage({ type: 'error', text: 'Failed to submit KYC application' });
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `odyssey-kyc-${user?.fullName || 'verification'}.png`;
    link.href = qrCode;
    link.click();
  };

  const copyQRCode = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setMessage({ type: 'success', text: 'QR code copied to clipboard!' });
          } catch (error) {
            setMessage({ type: 'error', text: 'Failed to copy QR code' });
          }
        });
      };

      img.src = qrCode;
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to copy QR code' });
    }
  };

  const getStatusIcon = () => {
    switch (kycStatus) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-400" />;
      case 'rejected':
        return <X className="w-8 h-8 text-red-400" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (kycStatus) {
      case 'approved':
        return 'from-green-500 to-emerald-500';
      case 'pending':
        return 'from-yellow-500 to-orange-500';
      case 'rejected':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = () => {
    switch (kycStatus) {
      case 'approved':
        return 'Verified & Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Verification Rejected';
      default:
        return 'Not Applied';
    }
  };

  if (loading) {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              KYC Verification
            </h1>
            <p className="text-gray-400">
              Secure identity verification for enhanced travel safety
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

          {/* Main Content */}
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-gray-800/80 shadow-2xl overflow-hidden">
            {/* Status Header */}
            <div className={`bg-gradient-to-r ${getStatusColor()} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon()}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{getStatusText()}</h2>
                    <p className="text-white/80">
                      {kycStatus === 'approved' && 'Your identity has been verified by authorities'}
                      {kycStatus === 'pending' && 'Your application is being reviewed'}
                      {kycStatus === 'rejected' && 'Please update your information and reapply'}
                      {kycStatus === 'not_applied' && 'Complete your profile to apply for verification'}
                    </p>
                  </div>
                </div>
                {kycStatus === 'approved' && (
                  <Verified className="w-12 h-12 text-white" />
                )}
              </div>
            </div>

            <div className="p-8">
              {/* Profile Completion */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Profile Completion</h3>
                  <span className="text-purple-400 font-bold">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                {profileCompletion < 100 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Complete your profile to apply for KYC verification
                  </p>
                )}
              </div>

              {/* User Profile Summary */}
              {user && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Profile Summary</h3>
                    <button
                      onClick={() => setShowFullProfile(!showFullProfile)}
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showFullProfile ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showFullProfile ? 'Hide Details' : 'Show Details'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white">{user.fullName || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Nationality</p>
                          <p className="text-white">{user.nationality || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-gray-400">Passport</p>
                          <p className="text-white">{user.passportNumber || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-pink-400" />
                        <div>
                          <p className="text-sm text-gray-400">Date of Birth</p>
                          <p className="text-white">
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">
                            {user.address?.city && user.address?.country
                              ? `${user.address.city}, ${user.address.country}`
                              : 'Not provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {showFullProfile && user.emergencyContacts?.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                      <h4 className="text-lg font-semibold text-white mb-3">Emergency Contacts</h4>
                      <div className="space-y-2">
                        {user.emergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-400">{contact.relationship}</p>
                            </div>
                            <p className="text-purple-400">{contact.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-6">
                {kycStatus === 'not_applied' && (
                  <button
                    onClick={applyForKYC}
                    disabled={profileCompletion < 100}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Apply for KYC Verification</span>
                    </div>
                  </button>
                )}

                {kycStatus === 'approved' && (
                  <div className="space-y-4">
                    {!showQRCode ? (
                      <button
                        onClick={() => setShowQRCode(true)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="w-5 h-5" />
                          <span>Generate Verification QR Code</span>
                        </div>
                      </button>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 text-center">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Your Verification QR Code</h4>
                        <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                          <img src={qrCode} alt="KYC Verification QR Code" className="w-64 h-64 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-600 mt-4 mb-6">
                          Show this QR code to authorities for instant verification
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={downloadQRCode}
                            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>

                          <button
                            onClick={copyQRCode}
                            className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>

                          <button
                            onClick={() => setShowQRCode(false)}
                            className="flex items-center justify-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Hide</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {kycStatus === 'pending' && (
                  <div className="text-center p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">Application Under Review</h4>
                    <p className="text-gray-300">
                      Your KYC application is being reviewed by authorities. You will be notified once the verification is complete.
                    </p>
                  </div>
                )}

                {kycStatus === 'rejected' && (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                      <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-red-400 mb-2">Verification Rejected</h4>
                      <p className="text-gray-300">
                        Your KYC application was rejected. Please update your profile information and reapply.
                      </p>
                    </div>

                    <button
                      onClick={applyForKYC}
                      disabled={profileCompletion < 100}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Reapply for KYC Verification</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdysseyKYCPage;