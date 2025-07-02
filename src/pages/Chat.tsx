
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-4 ">
          <Button
           
            onClick={() => navigate('/')}
            className="text-white hover:text-neon-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
         
        </div>
        <UserMenu />
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              AI Learning Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get personalized learning advice, career guidance, and answers to your questions
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;
