'use client';
import { useState } from 'react';
import { Eye, EyeOff, Shield, MapPin, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AuthoritySignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    badgeNumber: '',
    jurisdiction: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else if (value.trim().length > 100) {
          newErrors.fullName = 'Full name cannot exceed 100 characters';
        } else if (!/^[a-zA-Z\s\-'\.]+$/.test(value.trim())) {
          newErrors.fullName = 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else if (value.trim().length > 100) {
          newErrors.email = 'Email cannot exceed 100 characters';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value.trim().replace(/[\s\-\(\)]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'department':
        if (!value) {
          newErrors.department = 'Department selection is required';
        } else {
          delete newErrors.department;
        }
        break;

      case 'badgeNumber':
        if (!value.trim()) {
          newErrors.badgeNumber = 'Badge/ID number is required';
        } else if (value.trim().length < 3) {
          newErrors.badgeNumber = 'Badge number must be at least 3 characters';
        } else if (value.trim().length > 50) {
          newErrors.badgeNumber = 'Badge number cannot exceed 50 characters';
        } else if (!/^[a-zA-Z0-9\-]+$/.test(value.trim())) {
          newErrors.badgeNumber = 'Badge number can only contain letters, numbers, and hyphens';
        } else {
          delete newErrors.badgeNumber;
        }
        break;

      case 'jurisdiction':
        if (!value.trim()) {
          newErrors.jurisdiction = 'Area of jurisdiction is required';
        } else if (value.trim().length < 2) {
          newErrors.jurisdiction = 'Jurisdiction must be at least 2 characters';
        } else if (value.trim().length > 100) {
          newErrors.jurisdiction = 'Jurisdiction cannot exceed 100 characters';
        } else {
          delete newErrors.jurisdiction;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Password confirmation is required';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const newErrors = validateField(name, value);
    setErrors(newErrors);
  };

  const validateStep = (currentStep) => {
    const stepFields = {
      1: ['fullName', 'email', 'phone'],
      2: ['department', 'badgeNumber', 'jurisdiction'],
      3: ['password', 'confirmPassword']
    };

    const fieldsToValidate = stepFields[currentStep];
    let stepErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      if (fieldErrors[field]) {
        stepErrors[field] = fieldErrors[field];
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      const response = await fetch(`${backendUrl}/api/auth/authorities/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          department: formData.department,
          badgeNumber: formData.badgeNumber.trim(),
          jurisdiction: formData.jurisdiction.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Registration successful! Your account is pending approval.'
        });
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          department: '',
          badgeNumber: '',
          jurisdiction: '',
          password: '',
          confirmPassword: ''
        });
        setStep(1);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Registration failed. Please try again.'
        });

        // Handle field-specific errors
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach(error => {
            if (error.includes('email')) fieldErrors.email = error;
            else if (error.includes('badge')) fieldErrors.badgeNumber = error;
            else if (error.includes('phone')) fieldErrors.phone = error;
            else if (error.includes('password')) fieldErrors.password = error;
          });
          setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    { icon: Users, title: 'Personal Information' },
    { icon: MapPin, title: 'Authority Details' },
    { icon: AlertTriangle, title: 'Security Setup' }
  ];

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

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md animate-fade-in mt-20">
            
            {/* Success/Error Message */}
            {submitStatus && (
              <div className={`p-2 rounded-xl glass border-l-4 ${
                submitStatus.type === 'success' 
                  ? 'border-green-500/50' 
                  : 'border-red-500/50'
              }`}>
                <div className="flex items-center">
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${
                    submitStatus.type === 'success' 
                      ? 'text-green-200' 
                      : 'text-red-200'
                  }`}>
                    {submitStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Main Form Card */}
            <div className="card-glass ">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 glass rounded-2xl mb-4 group">
                  <Shield className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h1 className="text-3xl font-bold mb-2 gradient-text">
                  Authority Registration
                </h1>
                <p className="text-gray-300">Join the Odyssey Safety Network</p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {stepTitles.map((stepInfo, i) => {
                    const IconComponent = stepInfo.icon;
                    return (
                      <div key={i + 1} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          step >= i + 1 
                            ? 'bg-white/15 border-white text-white' 
                            : 'border-white/20 text-gray-400'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {i < stepTitles.length - 1 && (
                          <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                            step > i + 1 ? 'bg-white' : 'bg-white/20'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-slide-up">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Users className="w-5 h-5 mr-3 text-gray-300" />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          className={`input-glass ${errors.fullName ? 'error-input' : ''}`}
                          required
                        />
                        {errors.fullName && (
                          <p className="error-text">{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Official Email Address"
                          className={`input-glass ${errors.email ? 'error-input' : ''}`}
                          required
                        />
                        {errors.email && (
                          <p className="error-text">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                          className={`input-glass ${errors.phone ? 'error-input' : ''}`}
                          required
                        />
                        {errors.phone && (
                          <p className="error-text">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary w-full"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-slide-up">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-gray-300" />
                      Authority Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`input-glass appearance-none cursor-pointer ${errors.department ? 'error-input' : ''}`}
                          required
                        >
                          <option value="" className="bg-black text-white">Select Department</option>
                          <option value="police" className="bg-black text-white">Police Department</option>
                          <option value="tourism" className="bg-black text-white">Tourism Board</option>
                          <option value="emergency" className="bg-black text-white">Emergency Services</option>
                          <option value="customs" className="bg-black text-white">Customs & Immigration</option>
                          <option value="transport" className="bg-black text-white">Transport Authority</option>
                        </select>
                        {errors.department && (
                          <p className="error-text">{errors.department}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          name="badgeNumber"
                          value={formData.badgeNumber}
                          onChange={handleInputChange}
                          placeholder="Badge/ID Number"
                          className={`input-glass ${errors.badgeNumber ? 'error-input' : ''}`}
                          required
                        />
                        {errors.badgeNumber && (
                          <p className="error-text">{errors.badgeNumber}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          name="jurisdiction"
                          value={formData.jurisdiction}
                          onChange={handleInputChange}
                          placeholder="Area of Jurisdiction"
                          className={`input-glass ${errors.jurisdiction ? 'error-input' : ''}`}
                          required
                        />
                        {errors.jurisdiction && (
                          <p className="error-text">{errors.jurisdiction}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-glass flex-1"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary flex-1"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-slide-up">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-3 text-gray-300" />
                      Security Setup
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create Password"
                            className={`input-glass pr-12 ${errors.password ? 'error-input' : ''}`}
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

                      <div>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm Password"
                            className={`input-glass pr-12 ${errors.confirmPassword ? 'error-input' : ''}`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="error-text">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="glass rounded-xl p-4 border-l-4 border-yellow-500/50">
                        <p className="text-yellow-200 text-sm flex items-start">
                          <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
                          Your registration will be reviewed and approved by system administrators before access is granted.
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn-glass flex-1"
                        disabled={isLoading}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-primary flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Submit Registration'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-white hover:text-gray-200 transition-colors font-semibold hover:underline">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center animate-fade-in-delayed">
              <p className="text-gray-500 text-xs">
                By registering, you agree to our{' '}
                <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
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
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
          transition: all 0.3s ease;
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
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
          font-size: 0.875rem;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-glass:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .btn-glass:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
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

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
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

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
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
            padding: 1.5rem;
            margin: 1rem;
          }
          
          .input-glass,
          .btn-glass,
          .btn-primary {
            padding: 0.625rem 1rem;
          }
        }
      `}</style>
    </>
  );
}