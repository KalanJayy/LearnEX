
import React from 'react';
import { Sparkles, Target, Zap } from 'lucide-react';

interface HeroProps {
  onStartJourney: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartJourney }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements with neon theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan opacity-10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-neon-pink opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <Zap className="w-12 h-12 text-neon-cyan mr-3 animate-pulse-neon neon-text" />
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider neon-text">
            LEARNEX
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl text-gray-300 mb-4 animate-slide-up">
          Navigate Your Future with AI-Powered Learning Roadmaps
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Enter your career aspirations and discover personalized learning paths crafted by advanced AI. 
          Transform your ambitions into structured, achievable roadmaps.
        </p>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-effect neon-border p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Target className="w-8 h-8 text-neon-cyan mx-auto mb-4 neon-text" />
            <h3 className="text-lg font-semibold mb-2 text-white">Precision Targeting</h3>
            <p className="text-sm text-gray-300">AI analyzes your goals to create laser-focused learning paths</p>
          </div>
          
          <div className="glass-effect neon-border p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Sparkles className="w-8 h-8 text-neon-purple mx-auto mb-4 neon-text" />
            <h3 className="text-lg font-semibold mb-2 text-white">Adaptive Learning</h3>
            <p className="text-sm text-gray-300">Dynamic roadmaps that evolve with industry trends</p>
          </div>
          
          <div className="glass-effect neon-border p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Zap className="w-8 h-8 text-neon-pink mx-auto mb-4 neon-text" />
            <h3 className="text-lg font-semibold mb-2 text-white">Accelerated Growth</h3>
            <p className="text-sm text-gray-300">Optimize your learning journey for maximum efficiency</p>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={onStartJourney}
          className="group relative px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up neon-border" 
          style={{ animationDelay: '1s' }}
        >
          <span className="relative z-10">Start Your Journey</span>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default Hero;
