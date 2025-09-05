import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const createPersonalizedWorkoutPrompt = (userProfile: any, goal: any) => {
  const bmi = userProfile.weight / ((userProfile.height / 100) ** 2);
  const bmiCategory = getBMICategory(bmi);
  const age = calculateAge(userProfile.date_of_birth);
  
  const prompt = `
You are an empathetic and expert personal trainer having a one-on-one consultation. Create a personalized workout plan for this person:

PERSON DETAILS:
- Age: ${age} years old
- Gender: ${userProfile.gender}
- BMI: ${bmi.toFixed(1)} (${bmiCategory})
- Experience: ${goal.experienceLevel}
- Available time: ${goal.timePerWorkout} minutes per session
- Frequency: ${goal.frequency} days per week
- Equipment: ${goal.equipment.join(', ')}
- Injuries/Limitations: ${goal.injuries || 'None specified'}

PRIMARY GOAL: ${goal.goalType}
Timeline: ${goal.timeline}

PERSONAL CONTEXT (MOST IMPORTANT - READ CAREFULLY):
"${goal.personalContext}"

Based on their personal story above, create a workout plan that addresses their specific challenges, preferences, and lifestyle. Pay special attention to:
- Their motivation and what drives them
- Past struggles or failures they've mentioned
- Time constraints or lifestyle factors
- Specific preferences or dislikes
- Emotional relationship with fitness

Create a plan that feels like it was designed specifically for THEM, not a generic program.

Please create a structured workout plan with:
1. Personalized welcome message acknowledging their context
2. Weekly schedule that fits their life
3. Specific exercises they'll actually enjoy
4. Sets, reps, and rest periods
5. Motivation tips based on their personal story
6. How to overcome their specific challenges

Format as JSON with this structure:
{
  "plan_name": "Personalized name reflecting their journey",
  "personal_message": "Encouraging message that shows you understand them",
  "overview": "Plan description that addresses their context",
  "weekly_schedule": [
    {
      "day": "Monday",
      "workout_type": "Upper Body Strength",
      "duration": "${goal.timePerWorkout} minutes",
      "focus": "Chest, shoulders, triceps"
    }
  ],
  "workouts": [
    {
      "name": "Upper Body Strength",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "8-12",
          "rest": "60 seconds",
          "notes": "Modify on knees if needed"
        }
      ]
    }
  ],
  "personalized_tips": ["Tips based on their specific situation"],
  "motivation_reminders": ["Encouragement based on their story"]
}
`;

  return prompt;
};

export const generateWorkoutPlan = async (userProfile: any, goalData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = createPersonalizedWorkoutPrompt(userProfile, goalData);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const workoutPlan = JSON.parse(jsonMatch[0]);
    return { success: true, data: workoutPlan };
    
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate workout plan' 
    };
  }
};