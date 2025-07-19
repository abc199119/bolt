import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GitBranch, User, Mail, Lock, FileText, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupData {
  name: string;
  email: string;
  password: string;
  bio: string;
  location: string;
  isStudent: boolean;
  company: string;
}

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  
  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    bio: '',
    location: '',
    isStudent: true,
    company: ''
  });

  const totalSteps = 6;

  const handleNext = () => {
    setError('');
    
    // Validation for each step
    switch (currentStep) {
      case 1:
        if (!signupData.name.trim()) {
          setError('Please enter your full name');
          return;
        }
        if (signupData.name.trim().length < 2) {
          setError('Name must be at least 2 characters long');
          return;
        }
        break;
      case 2:
        if (!signupData.email.trim()) {
          setError('Please enter your email address');
          return;
        }
        if (!/\S+@\S+\.\S+/.test(signupData.email)) {
          setError('Please enter a valid email address');
          return;
        }
        break;
      case 3:
        if (!signupData.password) {
          setError('Please enter a password');
          return;
        }
        if (signupData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        break;
      case 4:
        if (!signupData.bio.trim()) {
          setError('Please tell us a bit about yourself');
          return;
        }
        if (signupData.bio.trim().length < 10) {
          setError('Bio must be at least 10 characters long');
          return;
        }
        break;
      case 5:
        if (!signupData.location.trim()) {
          setError('Please enter your location');
          return;
        }
        if (signupData.location.trim().length < 2) {
          setError('Location must be at least 2 characters long');
          return;
        }
        break;
      case 6:
        if (!signupData.isStudent && !signupData.company.trim()) {
          setError('Please enter your company name');
          return;
        }
        if (!signupData.isStudent && signupData.company.trim().length < 2) {
          setError('Company name must be at least 2 characters long');
          return;
        }
        break;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signup(signupData);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  const updateSignupData = (field: keyof SignupData, value: string | boolean) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return User;
      case 2: return Mail;
      case 3: return Lock;
      case 4: return FileText;
      case 5: return MapPin;
      case 6: return Briefcase;
      default: return User;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's your name?</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Let's start with your full name</p>
            </div>
            <div>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => updateSignupData('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-center text-lg"
                placeholder="Enter your full name"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's your email?</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">We'll use this to create your account</p>
            </div>
            <div>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => updateSignupData('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-center text-lg"
                placeholder="Enter your email address"
                autoFocus
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create a password</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Choose a secure password (at least 6 characters)</p>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={(e) => updateSignupData('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-center text-lg"
                placeholder="Enter your password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tell us about yourself</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Write a short bio for your profile</p>
            </div>
            <div>
              <textarea
                value={signupData.bio}
                onChange={(e) => updateSignupData('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                placeholder="Tell us about your role, interests, or what you're working on..."
                autoFocus
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {signupData.bio.length}/200 characters
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Where are you located?</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">This helps us connect you with local opportunities</p>
            </div>
            <div>
              <input
                type="text"
                value={signupData.location}
                onChange={(e) => updateSignupData('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-center text-lg"
                placeholder="e.g., San Francisco, CA or London, UK"
                autoFocus
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What's your current status?</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">This helps us personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateSignupData('isStudent', true)}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    signupData.isStudent
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-medium text-gray-900 dark:text-white">Student</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Currently studying</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateSignupData('isStudent', false)}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    !signupData.isStudent
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💼</div>
                    <div className="font-medium text-gray-900 dark:text-white">Professional</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Working professional</div>
                  </div>
                </button>
              </div>
              
              {!signupData.isStudent && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={signupData.company}
                    onChange={(e) => updateSignupData('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    placeholder="Enter your company name"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join PR Insight</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create your account to start tracking contributions</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Icons */}
          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const StepIcon = getStepIcon(step);
              return (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {renderStep()}

            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : currentStep === totalSteps ? (
                  'Create Account'
                ) : (
                  <>
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}