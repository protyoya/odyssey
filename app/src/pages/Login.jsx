import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OdysseyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phone: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!isLogin) {
      // Username validation for signup
      if (!formData.username) {
        errors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
      }
      
      // Full name validation
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      }
      
      // Phone validation
      if (!formData.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      // Terms agreement
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'Please agree to the terms and conditions';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isLogin ? '/api/tourist/login' : '/api/tourist/signup';
      const url = `${API_BASE_URL}${endpoint}`;

      const requestBody = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        setMessage({ 
          type: 'success', 
          text: data.message || (isLogin ? 'Login successful!' : 'Account created successfully!') 
        });

        // Store token and user data
        if (data.token) {
          localStorage.setItem('odyssey_token', data.token);
        }
        if (data.tourist) {
          localStorage.setItem('odyssey_user', JSON.stringify(data.tourist));
        }

        // Clear form on success
        setFormData({
          email: '',
          password: '',
          username: '',
          fullName: '',
          phone: '',
          agreeToTerms: false
        });

        // Redirect or handle success (you might want to use React Router here)
        setTimeout(() => {
          navigate('/profile');
        }, 1500);

      } else {
        // Error from server
        setMessage({ 
          type: 'error', 
          text: data.message || 'An error occurred. Please try again.' 
        });

        // Handle specific validation errors from backend
        if (data.errors) {
          setFormErrors(data.errors);
        }
      }

    } catch (error) {
      console.error('API Error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      username: '',
      fullName: '',
      phone: '',
      agreeToTerms: false
    });
    setFormErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Auth Card */}
      <div className="relative mt-20 z-10 w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/80 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Odyssey
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to your tourist safety account' : 'Join the smart tourism safety platform'}
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
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
            </div>
          )}

          {/* Auth Toggle */}
          <div className="bg-gray-800/30 rounded-2xl p-1 mb-6 flex">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Signup Fields */}
            {!isLogin && (
              <>
                {/* Username */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        formErrors.username 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-700/50 focus:ring-purple-500/50 focus:border-transparent'
                      }`}
                      placeholder="Username"
                    />
                  </div>
                  {formErrors.username && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.username}
                    </p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        formErrors.fullName 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-700/50 focus:ring-purple-500/50 focus:border-transparent'
                      }`}
                      placeholder="Full Name"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        formErrors.phone 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-700/50 focus:ring-purple-500/50 focus:border-transparent'
                      }`}
                      placeholder="Phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formErrors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700/50 focus:ring-purple-500/50 focus:border-transparent'
                  }`}
                  placeholder="Email address"
                />
              </div>
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-gray-800/50 border rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formErrors.password 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-700/50 focus:ring-purple-500/50 focus:border-transparent'
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password for Login */}
            {isLogin && (
              <div className="text-right">
                <a href="#forgot" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Terms Agreement for Signup */}
            {!isLogin && (
              <div>
                <label className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" 
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the <a href="#terms" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and 
                    <a href="#privacy" className="text-purple-400 hover:text-purple-300"> Privacy Policy</a>
                  </span>
                </label>
                {formErrors.agreeToTerms && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formErrors.agreeToTerms}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center font-semibold shadow-lg hover:shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </span>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <a href="#help" className="hover:text-white transition-colors">Need Help?</a>
            <span>•</span>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdysseyAuth;