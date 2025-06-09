
import React, { useState } from 'react';
import Hero from '@/components/Hero';
import GoalInput from '@/components/GoalInput';
import RoadmapDisplay from '@/components/RoadmapDisplay';

type AppState = 'hero' | 'input' | 'roadmap';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [userGoal, setUserGoal] = useState<string>('');

  const handleStartJourney = () => {
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

  // Add click handler to the CTA button in Hero
  React.useEffect(() => {
    const handleButtonClick = () => {
      handleStartJourney();
    };

    if (currentState === 'hero') {
      const button = document.querySelector('button');
      if (button) {
        button.addEventListener('click', handleButtonClick);
        return () => button.removeEventListener('click', handleButtonClick);
      }
    }
  }, [currentState]);

  return (
    <div className="relative">
      {currentState === 'hero' && <Hero />}
      {currentState === 'input' && <GoalInput onSubmit={handleGoalSubmit} />}
      {currentState === 'roadmap' && <RoadmapDisplay goal={userGoal} onReset={handleReset} />}
    </div>
  );
};

export default Index;
