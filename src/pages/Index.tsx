
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/Hero';
import AuthenticatedHero from '@/components/AuthenticatedHero';
import GoalInput from '@/components/GoalInput';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import SavedRoadmaps from '@/components/SavedRoadmaps';

type AppState = 'hero' | 'input' | 'roadmap' | 'saved-roadmaps';

interface SavedRoadmap {
  id: string;
  title: string;
  goal: string;
  steps: any[];
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [userGoal, setUserGoal] = useState<string>('');
  const [selectedRoadmap, setSelectedRoadmap] = useState<SavedRoadmap | null>(null);
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
    setSelectedRoadmap(null);
    setCurrentState('roadmap');
  };

  const handleReset = () => {
    setCurrentState('input');
    setUserGoal('');
    setSelectedRoadmap(null);
  };

  const handleViewSavedRoadmaps = () => {
    setCurrentState('saved-roadmaps');
  };

  const handleSelectRoadmap = (roadmap: SavedRoadmap) => {
    setSelectedRoadmap(roadmap);
    setUserGoal(roadmap.goal);
    setCurrentState('roadmap');
  };

  const handleBackToHero = () => {
    setCurrentState('hero');
    setUserGoal('');
    setSelectedRoadmap(null);
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
      {currentState === 'hero' && user && (
        <AuthenticatedHero 
          onStartJourney={handleStartJourney} 
          onViewSavedRoadmaps={handleViewSavedRoadmaps}
        />
      )}
      {currentState === 'input' && <GoalInput onSubmit={handleGoalSubmit} />}
      {currentState === 'roadmap' && (
        <RoadmapDisplay 
          goal={userGoal} 
          onReset={handleReset}
          savedRoadmap={selectedRoadmap}
        />
      )}
      {currentState === 'saved-roadmaps' && (
        <div className="min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <button
                onClick={handleBackToHero}
                className="text-neon-cyan hover:text-neon-purple transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
            <SavedRoadmaps onSelectRoadmap={handleSelectRoadmap} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
