
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Target, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface SavedRoadmap {
  id: string;
  title: string;
  goal: string;
  steps: RoadmapStep[];
  created_at: string;
  updated_at: string;
}

interface SavedRoadmapsProps {
  onSelectRoadmap: (roadmap: SavedRoadmap) => void;
}

const SavedRoadmaps: React.FC<SavedRoadmapsProps> = ({ onSelectRoadmap }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRoadmaps();
    }
  }, [user]);

  const loadRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: SavedRoadmap[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        goal: item.goal,
        steps: Array.isArray(item.steps) ? item.steps as unknown as RoadmapStep[] : [],
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
      }));
      
      setRoadmaps(transformedData);
    } catch (error) {
      console.error('Error loading roadmaps:', error);
      toast({
        title: "Error loading roadmaps",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRoadmap = async (roadmapId: string) => {
    try {
      const { error } = await supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmapId);

      if (error) throw error;

      setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
      toast({
        title: "Roadmap deleted",
        description: "Your roadmap has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      toast({
        title: "Error deleting roadmap",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center p-12">
        <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No saved roadmaps</h3>
        <p className="text-muted-foreground">
          Create your first learning roadmap to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text-3 mb-6">Your Saved Roadmaps</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap) => (
          <div key={roadmap.id} className="glass-effect p-6 rounded-2xl hover:bg-muted/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg leading-tight">{roadmap.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRoadmap(roadmap.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {roadmap.goal}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{roadmap.steps?.length || 0} steps</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(roadmap.created_at)}</span>
              </div>
            </div>
            
            <button
              onClick={() => onSelectRoadmap(roadmap)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2  bg-transparent border-2 border-purple-500 text-white    text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:bg-purple-500"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRoadmaps;
