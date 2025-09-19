'use client';
import { useState } from 'react';
import { Eye, EyeOff, Shield, MapPin, Users, AlertTriangle } from 'lucide-react';

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
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
          <div className="w-full max-w-md animate-fade-in">
            
            {/* Main Form Card */}
            <div className="card-glass mt-20">
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
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="input-glass"
                        required
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Official Email Address"
                        className="input-glass"
                        required
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="input-glass"
                        required
                      />
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
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-glass appearance-none cursor-pointer"
                        required
                      >
                        <option value="" className="bg-black text-white">Select Department</option>
                        <option value="police" className="bg-black text-white">Police Department</option>
                        <option value="tourism" className="bg-black text-white">Tourism Board</option>
                        <option value="emergency" className="bg-black text-white">Emergency Services</option>
                        <option value="customs" className="bg-black text-white">Customs & Immigration</option>
                        <option value="transport" className="bg-black text-white">Transport Authority</option>
                      </select>

                      <input
                        type="text"
                        name="badgeNumber"
                        value={formData.badgeNumber}
                        onChange={handleInputChange}
                        placeholder="Badge/ID Number"
                        className="input-glass"
                        required
                      />

                      <input
                        type="text"
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        placeholder="Area of Jurisdiction"
                        className="input-glass"
                        required
                      />
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
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create Password"
                          className="input-glass pr-12"
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

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm Password"
                          className="input-glass pr-12"
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
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-primary flex-1"
                      >
                        Submit Registration
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

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
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