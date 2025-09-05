import React, { useState } from 'react';
import { User, Calendar, Scale, Target, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ProfileSetupProps {
  onComplete?: () => void;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  weight: string;
  height: string;
  fitnessGoal: string;
}

interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: string;
  height?: string;
  fitnessGoal?: string;
}

interface UnitPreferences {
  weight: 'kg' | 'lbs';
  height: 'cm' | 'ft';
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    weight: '',
    height: '',
    fitnessGoal: ''
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [units, setUnits] = useState<UnitPreferences>({
    weight: 'kg',
    height: 'cm'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const fitnessGoalOptions = [
    { value: '', label: 'Select Your Primary Goal' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'muscle-gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'general-fitness', label: 'General Fitness' }
  ];

  const validateStep1 = (): boolean => {
    const newErrors: ProfileErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(profileData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!profileData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ProfileErrors = {};

    if (!profileData.weight) {
      newErrors.weight = 'Weight is required';
    } else {
      const weight = parseFloat(profileData.weight);
      const minWeight = units.weight === 'kg' ? 20 : 44;
      const maxWeight = units.weight === 'kg' ? 300 : 660;
      if (isNaN(weight) || weight < minWeight || weight > maxWeight) {
        newErrors.weight = `Please enter a valid weight (${minWeight}-${maxWeight} ${units.weight})`;
      }
    }

    if (!profileData.height) {
      newErrors.height = 'Height is required';
    } else {
      const height = parseFloat(profileData.height);
      const minHeight = units.height === 'cm' ? 100 : 3;
      const maxHeight = units.height === 'cm' ? 250 : 8;
      if (isNaN(height) || height < minHeight || height > maxHeight) {
        newErrors.height = `Please enter a valid height (${minHeight}-${maxHeight} ${units.height})`;
      }
    }

    if (!profileData.fitnessGoal) {
      newErrors.fitnessGoal = 'Please select your fitness goal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ProfileErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Complete Profile Data:', {
        ...profileData,
        units,
        completedAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      
      // Navigate to dashboard
      if (onComplete) {
        onComplete();
      }
    }, 1500);
  };

  const toggleWeightUnit = () => {
    setUnits(prev => ({
      ...prev,
      weight: prev.weight === 'kg' ? 'lbs' : 'kg'
    }));
    // Clear weight value when switching units to avoid confusion
    setProfileData(prev => ({ ...prev, weight: '' }));
  };

  const toggleHeightUnit = () => {
    setUnits(prev => ({
      ...prev,
      height: prev.height === 'cm' ? 'ft' : 'cm'
    }));
    // Clear height value when switching units to avoid confusion
    setProfileData(prev => ({ ...prev, height: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              💪 FitTracker
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              Let's set up your profile to personalize your fitness journey
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="ml-2 text-sm text-gray-600">Personal Info</span>
              </div>
              <div className={`w-8 h-1 rounded ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm text-gray-600">Fitness Info</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Step {currentStep} of 2
            </p>
          </div>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <form className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 transform shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Next Step
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          )}

          {/* Step 2: Fitness Info */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={profileData.weight}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={`Enter weight in ${units.weight}`}
                      step="0.1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={toggleWeightUnit}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 min-w-[60px]"
                  >
                    {units.weight}
                  </button>
                </div>
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>

              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={profileData.height}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.height ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={`Enter height in ${units.height}`}
                      step={units.height === 'cm' ? '1' : '0.1'}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={toggleHeightUnit}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 min-w-[60px]"
                  >
                    {units.height}
                  </button>
                </div>
                {errors.height && (
                  <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                )}
              </div>

              {/* Fitness Goal */}
              <div>
                <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Fitness Goal
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="fitnessGoal"
                    name="fitnessGoal"
                    value={profileData.fitnessGoal}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.fitnessGoal ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {fitnessGoalOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.fitnessGoal && (
                  <p className="mt-1 text-sm text-red-600">{errors.fitnessGoal}</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform shadow-lg hover:shadow-xl ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Setting up...
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Your information is secure and will be used to personalize your fitness experience
            </p>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;