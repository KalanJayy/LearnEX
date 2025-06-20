
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';

interface AuthenticatedHeroProps {
  onStartJourney: () => void;
  onViewSavedRoadmaps: () => void;
}

const AuthenticatedHero: React.FC<AuthenticatedHeroProps> = ({ onStartJourney, onViewSavedRoadmaps }) => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Target className="w-8 h-8 text-neon-cyan" />
          <span className="text-2xl font-bold gradient-text">LearnEX</span>
        </div>
        <UserMenu />
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome back, <span className="gradient-text">{displayName}</span>!
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Ready to continue your learning journey? Let's create your next personalized roadmap to success.
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <button 
              onClick={onViewSavedRoadmaps}
              className="glass-effect p-6 rounded-2xl hover:bg-muted/30 transition-colors text-left"
            >
              <BookOpen className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Continue Learning</h3>
              <p className="text-sm text-muted-foreground">
                Pick up where you left off on your saved roadmaps
              </p>
            </button>
            
            <button 
              onClick={onStartJourney}
              className="glass-effect p-6 rounded-2xl hover:bg-muted/30 transition-colors text-left"
            >
              <Target className="w-12 h-12 text-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">New Goal</h3>
              <p className="text-sm text-muted-foreground">
                Set a new career goal and generate a fresh roadmap
              </p>
            </button>
            
            <button 
              onClick={onViewSavedRoadmaps}
              className="glass-effect p-6 rounded-2xl hover:bg-muted/30 transition-colors text-left"
            >
              <TrendingUp className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                View your learning analytics and achievements
              </p>
            </button>
          </div>

          <Button
            onClick={onStartJourney}
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-black text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
          >
            Create New Roadmap
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHero;
