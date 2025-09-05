import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Calendar,
  User,
  Dumbbell,
  Heart,
  Target,
  MessageCircle,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateWorkoutPlan } from '../lib/gemini';

interface GoalSettingProps {
  onBack?: () => void;
}

interface GoalData {
  goalType: string;
  timeline: string;
  frequency: number;
  experienceLevel: string;
  equipment: string[];
  timePerWorkout: number;
  injuries: string;
  personalContext: string;
}

interface GoalOption {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ onBack }) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [goalData, setGoalData] = useState<GoalData>({
    goalType: '',
    timeline: '',
    frequency: 3,
    experienceLevel: '',
    equipment: [],
    timePerWorkout: 30,
    injuries: '',
    personalContext: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const goalOptions: GoalOption[] = [
    {
      id: 'lose-weight',
      title: 'Lose Weight',
      icon: '🔥',
      description: 'Burn calories and shed pounds with targeted workouts',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100 border-red-200'
    },
    {
      id: 'build-muscle',
      title: 'Build Muscle',
      icon: '💪',
      description: 'Gain strength and muscle mass with resistance training',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      id: 'improve-endurance',
      title: 'Improve Endurance',
      icon: '🏃‍♂️',
      description: 'Boost cardiovascular health and stamina',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      id: 'general-fitness',
      title: 'General Fitness',
      icon: '⚡',
      description: 'Overall health and wellness improvement',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      id: 'strength-training',
      title: 'Strength Training',
      icon: '🏋️‍♂️',
      description: 'Build raw power and functional strength',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    }
  ];

  const timelineOptions = [
    { value: '4-weeks', label: '4 Weeks - Quick Start' },
    { value: '8-weeks', label: '8 Weeks - Solid Foundation' },
    { value: '12-weeks', label: '12 Weeks - Transformation' },
    { value: '6-months', label: '6 Months - Life Change' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - New to fitness' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'advanced', label: 'Advanced - Very experienced' }
  ];

  const equipmentOptions = [
    { id: 'none', label: 'No Equipment (Bodyweight)' },
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'resistance-bands', label: 'Resistance Bands' },
    { id: 'full-gym', label: 'Full Gym Access' }
  ];

  const inspirationPrompts = [
    "I work long hours and...",
    "I've tried dieting before but...",
    "My biggest challenge is...",
    "I really enjoy...",
    "What motivates me most is...",
    "I struggle with..."
  ];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setGoalData(prev => ({ ...prev, goalType: goalId }));
    setCurrentStep(2);
  };

  const handleInputChange = (field: keyof GoalData, value: any) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const handleEquipmentChange = (equipmentId: string) => {
    setGoalData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter(id => id !== equipmentId)
        : [...prev.equipment, equipmentId]
    }));
  };

  const handlePromptClick = (prompt: string) => {
    const currentText = goalData.personalContext;
    const newText = currentText ? `${currentText} ${prompt}` : prompt;
    if (newText.length <= 500) {
      handleInputChange('personalContext', newText);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      // If we're on step 1 and have an onBack prop, go back to dashboard
      onBack();
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (!user || !profile) {
        throw new Error('User profile not found');
      }

      console.log('Generating personalized workout plan...');
      console.log('User Profile:', profile);
      console.log('Goal Data:', goalData);
      
      // Generate personalized workout plan using Gemini
      const result = await generateWorkoutPlan(profile, goalData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate workout plan');
      }
      
      console.log('Generated Workout Plan:', result.data);
      
      // Here you would save both the goal data and workout plan to Supabase
      const goalRecord = {
        userId: user.id,
        ...goalData,
        workoutPlan: result.data,
        createdAt: new Date().toISOString()
      };
      
      console.log('Saving to database:', goalRecord);
      
      // TODO: Save to Supabase user_goals table
      // await supabase.from('user_goals').insert(goalRecord);
      
      alert(`🎉 Your personalized "${result.data.plan_name}" plan has been created!\n\nCheck the console to see your custom workout plan.`);
      
      // Call onBack if provided to return to dashboard
      if (onBack) {
        onBack();
      }
      
    } catch (error) {
      setSubmitError('Failed to save your goal. Please try again.');
      console.error('Error saving goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Choose Your Goal';
      case 2: return 'Goal Details';
      case 3: return 'Tell Your Story';
      case 4: return 'Generate Your Plan';
      default: return 'Set Your Goal';
    }
  };

  const selectedGoalOption = goalOptions.find(goal => goal.id === selectedGoal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">🎯 Set Your Fitness Goal</h1>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-8 h-1 rounded ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">{getStepTitle()}</h2>
            <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
          </div>
        </div>

        {/* Step 1: Goal Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">What's your primary fitness goal?</h3>
              <p className="text-gray-600">Choose the goal that excites you most - you can always adjust later!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${goal.bgColor}`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{goal.icon}</div>
                    <h4 className={`text-lg font-bold mb-2 ${goal.color}`}>{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goal Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">{selectedGoalOption?.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Perfect! Let's customize your {selectedGoalOption?.title.toLowerCase()} plan</h3>
              <p className="text-gray-600">These details help us create the perfect workout plan for you</p>
            </div>

            <div className="space-y-8">
              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Target Timeline
                </label>
                <select
                  value={goalData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your timeline</option>
                  {timelineOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Workout Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Target className="inline w-4 h-4 mr-2" />
                  Workout Frequency: {goalData.frequency} days per week
                </label>
                <input
                  type="range"
                  min="2"
                  max="7"
                  value={goalData.frequency}
                  onChange={(e) => handleInputChange('frequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2 days</span>
                  <span>7 days</span>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="inline w-4 h-4 mr-2" />
                  Experience Level
                </label>
                <div className="space-y-2">
                  {experienceLevels.map(level => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level.value}
                        checked={goalData.experienceLevel === level.value}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Dumbbell className="inline w-4 h-4 mr-2" />
                  Available Equipment (select all that apply)
                </label>
                <div className="space-y-2">
                  {equipmentOptions.map(equipment => (
                    <label key={equipment.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={goalData.equipment.includes(equipment.id)}
                        onChange={() => handleEquipmentChange(equipment.id)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-700">{equipment.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time per Workout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Time per Workout: {goalData.timePerWorkout} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={goalData.timePerWorkout}
                  onChange={(e) => handleInputChange('timePerWorkout', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>

              {/* Injuries/Limitations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Heart className="inline w-4 h-4 mr-2" />
                  Any injuries or limitations? (optional)
                </label>
                <textarea
                  value={goalData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  placeholder="e.g., Lower back issues, knee problems, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Context */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tell us your story</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                This is where the magic happens! Share your fitness journey, challenges, and what motivates you. 
                The more you tell us, the better we can personalize your plan.
              </p>
            </div>

            <div className="space-y-6">
              {/* Main Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MessageCircle className="inline w-4 h-4 mr-2" />
                  Your Fitness Journey
                </label>
                <textarea
                  value={goalData.personalContext}
                  onChange={(e) => handleInputChange('personalContext', e.target.value)}
                  placeholder="Tell me more about your fitness journey... What motivates you? What challenges have you faced? Any preferences or things you absolutely hate? Pretend you're talking to your personal trainer - the more details, the better your plan will be!"
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
                  rows={8}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-blue-600 font-medium">
                    ✨ This helps our AI create a plan that truly fits YOUR life
                  </p>
                  <span className={`text-sm ${goalData.personalContext.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {goalData.personalContext.length}/500
                  </span>
                </div>
              </div>

              {/* Inspiration Prompts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Lightbulb className="inline w-4 h-4 mr-2" />
                  Need inspiration? Click any prompt to add it:
                </label>
                <div className="flex flex-wrap gap-2">
                  {inspirationPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      disabled={goalData.personalContext.length + prompt.length > 500}
                      className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Encouraging Message */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-gray-700 font-medium mb-2">Remember, there are no wrong answers!</p>
                <p className="text-gray-600 text-sm">
                  Whether you're a complete beginner or getting back into fitness after a break, 
                  your honesty helps us create something amazing just for you.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Generate My Plan</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Generation */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to create your personalized plan?</h3>
              <p className="text-gray-600">
                Our AI will analyze your goals, preferences, and story to create the perfect fitness plan for you.
              </p>
            </div>

            {/* Preview of what AI will consider */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-gray-800 mb-4">🧠 What our AI will consider:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Goal:</strong> {selectedGoalOption?.title}</p>
                  <p><strong>Timeline:</strong> {goalData.timeline}</p>
                  <p><strong>Frequency:</strong> {goalData.frequency} days/week</p>
                  <p><strong>Experience:</strong> {goalData.experienceLevel}</p>
                </div>
                <div>
                  <p><strong>Time per workout:</strong> {goalData.timePerWorkout} minutes</p>
                  <p><strong>Equipment:</strong> {goalData.equipment.length > 0 ? goalData.equipment.join(', ') : 'None selected'}</p>
                  <p><strong>Personal story:</strong> {goalData.personalContext ? 'Provided' : 'Not provided'}</p>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 transform ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>AI is crafting your perfect plan...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Sparkles className="w-6 h-6" />
                    <span>Generate My AI Plan</span>
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </button>

              {isSubmitting && (
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600 text-sm">🤖 AI is analyzing your goals and personal story...</p>
                  <p className="text-gray-600 text-sm">💪 Crafting workouts that fit YOUR life...</p>
                  <p className="text-gray-600 text-sm">🎯 Personalizing every detail for your success...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetting;