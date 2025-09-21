'use client';
import { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, CheckCircle, XCircle, X } from 'lucide-react';

export default function EmailVerificationPopup({
  isOpen,
  onClose,
  email,
  fullName,
  onVerificationSuccess
}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setError('Verification code has expired. Please request a new one.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Send OTP when popup opens
  useEffect(() => {
    if (isOpen && !otpSent) {
      sendOTP();
    }
  }, [isOpen]);

  // Reset state when popup opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '']);
      setError('');
      setSuccess('');
      setTimeLeft(600);
    }
  }, [isOpen]);

  const sendOTP = async () => {
    setIsSending(true);
    setError('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/auth/authorities/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setTimeLeft(600); // Reset timer
        setSuccess('Verification code sent to your email!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/auth/authorities/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }

    // Handle enter to submit
    if (e.key === 'Enter') {
      verifyOTP();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-glass w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="glass rounded-2xl p-3 mr-3">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
              <p className="text-gray-400 text-sm">Check your inbox for the code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Display */}
        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-gray-300 text-sm mb-1">Verification code sent to:</p>
          <p className="text-white font-medium">{email}</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="glass border-l-4 border-green-500/50 p-3 mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="glass border-l-4 border-red-500/50 p-3 mb-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-3">
            Enter 4-digit verification code
          </label>
          <div className="flex space-x-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                maxLength={1}
                disabled={isLoading || isSending}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-6">
          <Clock className="w-4 h-4 text-gray-400 mr-2" />
          <span className={`text-sm font-medium ${
            timeLeft <= 60 ? 'text-red-400' : 'text-gray-300'
          }`}>
            Code expires in {formatTime(timeLeft)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={verifyOTP}
            disabled={isLoading || otp.join('').length !== 4 || timeLeft <= 0}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>

          <button
            onClick={sendOTP}
            disabled={isSending || timeLeft > 540} // Can resend after 1 minute
            className="btn-glass w-full flex items-center justify-center"
          >
            {isSending ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Code
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-gray-400 text-xs">
            Didn't receive the code? Check your spam folder or click resend.
          </p>
        </div>
      </div>

      <style jsx>{`
        /* OTP Input Styles */
        .otp-input {
          width: 3rem;
          height: 3rem;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          color: white;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .otp-input:focus {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .otp-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Animation */
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Glass morphism styles */
        .card-glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
        }

        .glass {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}