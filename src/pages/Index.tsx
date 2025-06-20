
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/Hero';
import AuthenticatedHero from '@/components/AuthenticatedHero';
import GoalInput from '@/components/GoalInput';
import RoadmapDisplay from '@/components/RoadmapDisplay';

type AppState = 'hero' | 'input' | 'roadmap';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [userGoal, setUserGoal] = useState<string>('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentState('input');
  };

  const handleGoalSubmit = (goal: string) => {
    setUserGoal(goal);
    setCurrentState('roadmap');
  };

  const handleReset = () => {
    setCurrentState('input');
    setUserGoal('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {currentState === 'hero' && !user && <Hero onStartJourney={handleStartJourney} />}
      {currentState === 'hero' && user && <AuthenticatedHero onStartJourney={handleStartJourney} />}
      {currentState === 'input' && <GoalInput onSubmit={handleGoalSubmit} />}
      {currentState === 'roadmap' && <RoadmapDisplay goal={userGoal} onReset={handleReset} />}
    </div>
  );
};

export default Index;
