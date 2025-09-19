'use client';
import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, ArrowRight, UserPlus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState(null);

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 1) {
          newErrors.password = 'Password cannot be empty';
        } else {
          delete newErrors.password;
        }
        break;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous status messages when user starts typing
    if (loginStatus) {
      setLoginStatus(null);
    }
    
    // Real-time validation
    const newErrors = validateField(name, value);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const emailErrors = validateField('email', formData.email);
    const passwordErrors = validateField('password', formData.password);
    
    const allErrors = { ...emailErrors, ...passwordErrors };
    setErrors(allErrors);
    
    return Object.keys(allErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginStatus(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      const response = await fetch(`${backendUrl}/api/auth/authorities/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginStatus({
          type: 'success',
          message: data.message || 'Login successful! Redirecting...'
        });

        // Store token and authority data
        if (data.data && data.data.token) {
          localStorage.setItem('authToken', data.data.token);
          localStorage.setItem('authorityData', JSON.stringify(data.data.authority));
        }

        // Clear form
        setFormData({ email: '', password: '' });
        setRememberMe(false);
        
        // Redirect after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);

      } else {
        // Handle different error types
        let errorMessage = data.message || 'Login failed. Please try again.';
        let statusType = 'error';

        if (response.status === 423) {
          statusType = 'warning';
          errorMessage = 'Account temporarily locked. Please try again later.';
        } else if (response.status === 403) {
          statusType = 'warning';
          errorMessage = data.message || 'Account not approved or suspended.';
        } else if (response.status === 429) {
          statusType = 'warning';
          errorMessage = 'Too many login attempts. Please try again later.';
        }

        setLoginStatus({
          type: statusType,
          message: errorMessage
        });

        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Network error:', error);
      setLoginStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-sm sm:max-w-md animate-fade-in">
            
            {/* Status Message */}
            {loginStatus && (
              <div className={`mb-6 p-4 rounded-xl glass border-l-4 ${
                loginStatus.type === 'success' 
                  ? 'border-green-500/50' 
                  : loginStatus.type === 'warning'
                  ? 'border-yellow-500/50'
                  : 'border-red-500/50'
              }`}>
                <div className="flex items-center">
                  {loginStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  ) : loginStatus.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${
                    loginStatus.type === 'success' 
                      ? 'text-green-200' 
                      : loginStatus.type === 'warning'
                      ? 'text-yellow-200'
                      : 'text-red-200'
                  }`}>
                    {loginStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Main Login Card */}
            <div className="card-glass">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 glass rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">
                  Authority Login
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">Access the Odyssey Safety Network</p>
              </div>

              {/* Login Form */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        className={`input-glass pl-10 ${errors.email ? 'error-input' : ''}`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="error-text">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className={`input-glass pl-10 pr-12 ${errors.password ? 'error-input' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="error-text">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Remember me and Forgot password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
                  <label className="flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="relative">
                      <div className="w-4 h-4 bg-black/30 border border-white/20 rounded flex items-center justify-center">
                        <div className={`w-2 h-2 bg-blue-500 rounded-sm transition-opacity duration-200 ${rememberMe ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <span className="ml-2">Remember me for 30 days</span>
                  </label>
                  <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-center sm:text-right">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>

              </div>

              {/* Footer */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Need authority access?{' '}
                  <a href="/signup" className="text-white hover:text-gray-200 transition-colors font-semibold hover:underline inline-flex items-center justify-center sm:justify-start">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Register here
                  </a>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 sm:mt-6 text-center animate-fade-in-delayed">
             
              <p className="text-gray-500 text-xs">
                Protected by Odyssey Security Protocol v2.1
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Glass morphism styles */
        .card-glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .card-glass {
            padding: 2rem;
          }
        }

        .glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Input styles */
        .input-glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          width: 100%;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          min-height: 44px;
        }

        @media (max-width: 639px) {
          .input-glass {
            padding: 0.875rem 1rem;
            font-size: 1rem;
          }
        }

        .input-glass:focus {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .input-glass::placeholder {
          color: rgba(156, 163, 175, 0.8);
        }

        /* Error input styles */
        .error-input {
          border-color: rgba(239, 68, 68, 0.6) !important;
          background: rgba(239, 68, 68, 0.1);
        }

        .error-input:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-text {
          color: #fca5a5;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          margin-left: 0.25rem;
        }

        /* Button styles */
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
          font-size: 0.875rem;
          position: relative;
          overflow: hidden;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 639px) {
          .btn-primary {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.875rem;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 639px) {
          .btn-glass {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
        }

        .btn-glass:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        /* Loading spinner */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        /* Animation classes */
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 0.6s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .delay-2000 {
          animation-delay: 2s;
        }

        /* Keyframe animations */
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .card-glass {
            margin: 0.5rem;
          }
          
          .input-glass + .input-glass {
            margin-top: 0.75rem;
          }

          .gradient-text {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .absolute.right-3 {
            right: 1rem;
          }

          .absolute.left-0.pl-3 {
            padding-left: 1rem;
          }
        }

        @media (max-width: 480px) {
          .card-glass {
            margin: 0.25rem;
            padding: 1.25rem;
          }

          .flex.flex-col.sm\\:flex-row {
            align-items: flex-start;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .glass, .card-glass {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </>
  );
}