import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { User } from '@/types';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateSignupForm,
  getFieldError,
  hasFieldError,
} from '@/utils/validationUtils';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Real-time field validation
  const validateField = (fieldName: string, value: string) => {
    let error: string | null = null;

    if (fieldName === 'email') {
      error = validateEmail(value);
    } else if (fieldName === 'password') {
      error = validatePassword(value);
    } else if (fieldName === 'name') {
      error = validateName(value);
    }

    setErrors((prev) => {
      const filtered = prev.filter((e) => e.field !== fieldName);
      if (error) {
        return [...filtered, { field: fieldName, message: error }];
      }
      return filtered;
    });

    return !error;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.has('email')) {
      validateField('email', value);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.has('password')) {
      validateField('password', value);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.has('name')) {
      validateField('name', value);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => new Set(prev).add(fieldName));

    if (fieldName === 'email') {
      validateField('email', email);
    } else if (fieldName === 'password') {
      validateField('password', password);
    } else if (fieldName === 'name') {
      validateField('name', name);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validation = isSignup
      ? validateSignupForm(email, password, name)
      : validateLoginForm(email, password);

    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setLoading(true);

    try {
      let user: User;
      if (isSignup) {
        user = await authService.signup(email, password, name);
      } else {
        user = await authService.login(email, password);
      }
      onAuthSuccess(user);
    } catch (err) {
      setErrors([
        {
          field: 'general',
          message: err instanceof Error ? err.message : 'Authentication failed',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    setErrors([]);
    setTouched(new Set());
    setEmail('');
    setPassword('');
    setName('');
  };

  const generalError = errors.find((e) => e.field === 'general');
  const emailError = getFieldError(errors, 'email');
  const passwordError = getFieldError(errors, 'password');
  const nameError = getFieldError(errors, 'name');
  const hasEmailError = hasFieldError(errors, 'email');
  const hasPasswordError = hasFieldError(errors, 'password');
  const hasNameError = hasFieldError(errors, 'name');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Shield className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">ContractGuard</h1>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          AI Contract Analysis Platform
        </p>

        {/* General Error */}
        {generalError && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{generalError.message}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Name Field - Signup Only */}
          {isSignup && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {nameError && (
                  <span className="text-red-600 text-xs font-medium">{nameError}</span>
                )}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => handleBlur('name')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 text-base transition-colors ${
                  hasNameError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="Your full name"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {emailError && (
                <span className="text-red-600 text-xs font-medium">{emailError}</span>
              )}
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => handleBlur('email')}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 text-base transition-colors ${
                hasEmailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              }`}
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              {passwordError && (
                <span className="text-red-600 text-xs font-medium">{passwordError}</span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => handleBlur('password')}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 text-base transition-colors ${
                  hasPasswordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {!isSignup && (
              <p className="text-xs text-gray-500 mt-1">Demo: Use any password (min. 6 chars)</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || errors.length > 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isSignup ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isSignup ? 'Sign Up' : 'Log In'}</span>
            )}
          </button>

          {/* Toggle Auth Mode */}
          <p className="text-center text-sm text-gray-600">
            {isSignup ? 'Have an account? ' : "Don't have an account? "}
            <button
              onClick={handleToggleMode}
              disabled={loading}
              className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Demo mode: Use any valid email and password (min. 6 chars)
          </p>
        </div>
      </div>
    </div>
  );
};
