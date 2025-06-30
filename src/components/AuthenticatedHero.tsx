
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, BookOpen, TrendingUp, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';

interface AuthenticatedHeroProps {
  onStartJourney: () => void;
  onViewSavedRoadmaps: () => void;
}

const AuthenticatedHero: React.FC<AuthenticatedHeroProps> = ({ onStartJourney, onViewSavedRoadmaps }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background with original dark purple gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
          `
        }} />
        {/* Neon grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <Target className="w-8 h-8 text-neon-cyan neon-text" />
          <span className="text-2xl font-bold text-white neon-text">LearnEX</span>
        </div>
        
        {/* Right side - Notification and User Menu */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="relative p-2">
            <Bell className="w-6 h-6 text-neon-cyan neon-text" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full animate-pulse"></span>
          </Button>
          <span className="text-white text-sm hidden sm:block">{displayName}</span>
          <UserMenu />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white neon-text">
            Welcome, <span className="text-neon-cyan">{displayName}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Ready to continue your learning journey? Let's create your next personalized roadmap to success.
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <button 
              onClick={onViewSavedRoadmaps}
              className="glass-effect neon-border p-6 rounded-2xl hover:bg-white/10 transition-all text-left backdrop-blur-md group hover:scale-105"
            >
              <BookOpen className="w-12 h-12 text-neon-cyan mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-semibold mb-2 text-white">Continue Learning</h3>
              <p className="text-sm text-gray-300">
                Pick up where you left off on your saved roadmaps
              </p>
            </button>
            
            <button 
              onClick={onStartJourney}
              className="glass-effect neon-border p-6 rounded-2xl hover:bg-white/10 transition-all text-left backdrop-blur-md group hover:scale-105"
            >
              <Target className="w-12 h-12 text-neon-purple mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-semibold mb-2 text-white">New Goal</h3>
              <p className="text-sm text-gray-300">
                Set a new career goal and generate a fresh roadmap
              </p>
            </button>
            
            <button 
              onClick={() => navigate('/chat')}
              className="glass-effect neon-border p-6 rounded-2xl hover:bg-white/10 transition-all text-left backdrop-blur-md group hover:scale-105"
            >
              <MessageCircle className="w-12 h-12 text-neon-pink mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-semibold mb-2 text-white">AI Assistant</h3>
              <p className="text-sm text-gray-300">
                Chat with AI for learning advice and career guidance
              </p>
            </button>
            
            <button 
              onClick={onViewSavedRoadmaps}
              className="glass-effect neon-border p-6 rounded-2xl hover:bg-white/10 transition-all text-left backdrop-blur-md group hover:scale-105"
            >
              <TrendingUp className="w-12 h-12 text-neon-blue mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
              <p className="text-sm text-gray-300">
                View your learning analytics and achievements
              </p>
            </button>
          </div>

          <Button
            onClick={onStartJourney}
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 border-0 neon-border"
          >
            Generate
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedHero;
