import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  Play, 
  Search, 
  Target, 
  Calendar,
  Clock,
  Flame,
  TrendingUp,
  ChevronRight,
  Award,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [hasActiveGoal] = useState(true); // Toggle this to test different states

  // Get user's first name from profile or fallback to email
  const userName = user?.email?.split('@')[0] || 'User';

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get user initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Placeholder workout data
  const recentWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      date: '2 days ago',
      duration: '45 min',
      calories: 320,
      emoji: '💪'
    },
    {
      id: 2,
      name: 'Morning Cardio',
      date: '3 days ago',
      duration: '30 min',
      calories: 280,
      emoji: '🏃‍♂️'
    },
    {
      id: 3,
      name: 'Core & Flexibility',
      date: '4 days ago',
      duration: '25 min',
      calories: 150,
      emoji: '🧘‍♀️'
    },
    {
      id: 4,
      name: 'HIIT Training',
      date: '6 days ago',
      duration: '35 min',
      calories: 400,
      emoji: '🔥'
    }
  ];

  const motivationalQuotes = [
    "Your only limit is your mind! 💭",
    "Push yourself because no one else will! 🚀",
    "Great things never come from comfort zones! ⭐",
    "Don't stop when you're tired, stop when you're done! 💯",
    "The pain you feel today will be the strength you feel tomorrow! 💪"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStartWorkout = () => {
    console.log('Starting today\'s workout...');
  };

  const handleBrowseWorkouts = () => {
    console.log('Browsing workouts...');
  };

  const handleSetNewGoal = () => {
    console.log('Setting new goal...');
  };

  const handleConfigureGoals = () => {
    console.log('Configuring goals...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(userName)}
              </div>
              
              {/* Welcome Message */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-gray-600 text-sm">{currentDate}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Goal Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Today's Goal</h3>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="space-y-2">
              {hasActiveGoal ? (
                <>
                  <p className="text-lg font-bold text-gray-800">Upper Body Strength</p>
                  <p className="text-sm text-gray-600">45 min • 300-400 cal</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-0"></div>
                  </div>
                  <p className="text-xs text-gray-500">Ready to start!</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-800">No Active Goal</p>
                  <p className="text-sm text-gray-600">Set up your fitness goals</p>
                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    Create Goal →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Streak</h3>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-orange-600">7</p>
              <p className="text-sm text-gray-600">consecutive days</p>
              <p className="text-xs text-green-600 font-medium">Keep it up! 💪</p>
            </div>
          </div>

          {/* This Week Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">This Week</h3>
              </div>
              <span className="text-2xl">📊</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600">4<span className="text-lg text-gray-400">/5</span></p>
              <p className="text-sm text-gray-600">workouts completed</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-4/5"></div>
              </div>
              <p className="text-xs text-gray-500">1 more to go!</p>
            </div>
          </div>
        </div>

        {/* Main Action Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to crush your goals? 💪</h2>
              <p className="text-gray-600">Choose your next move and let's get started!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              {/* Start Today's Workout Button */}
              <button
                onClick={handleStartWorkout}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
              >
                <Play className="w-6 h-6" />
                <span>Start Today's Workout</span>
              </button>

              {/* Secondary Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleBrowseWorkouts}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Workouts</span>
                </button>

                <button
                  onClick={hasActiveGoal ? handleConfigureGoals : handleSetNewGoal}
                  className="px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>{hasActiveGoal ? 'Configure Goals' : 'Set New Goal'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1 hover:underline">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{workout.emoji}</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{workout.name}</h4>
                      <p className="text-sm text-gray-600">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{workout.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4" />
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Chart Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Weekly Progress</h3>
            </div>

            {/* Placeholder Chart */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 text-center mb-6">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-gray-600 font-medium">Progress Chart</p>
              <p className="text-gray-500 text-sm">Coming Soon</p>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-semibold">Daily Motivation</span>
              </div>
              <p className="text-sm font-medium">{randomQuote}</p>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;