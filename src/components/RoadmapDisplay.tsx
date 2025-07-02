import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Star, BookOpen, Award, ArrowRight, Save, Check } from 'lucide-react';
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

interface RoadmapDisplayProps {
  goal: string;
  onReset: () => void;
  savedRoadmap?: SavedRoadmap | null;
}

interface StepProgress {
  step_id: number;
  completed: boolean;
  notes?: string;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ goal, onReset, savedRoadmap }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [savedRoadmapId, setSavedRoadmapId] = useState<string | null>(savedRoadmap?.id || null);
  const [stepProgress, setStepProgress] = useState<Record<number, StepProgress>>({});

  // Use saved roadmap steps if available, otherwise use mock data
  const roadmapSteps: RoadmapStep[] = savedRoadmap?.steps || [
    {
      id: 1,
      title: "Foundation & Assessment",
      description: "Evaluate current skills and establish learning fundamentals",
      duration: "2-4 weeks",
      skills: ["Self-assessment", "Goal setting", "Learning methodology"],
      resources: ["Skill assessment tools", "Learning platform setup", "Community joining"],
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Core Technical Skills",
      description: "Build essential technical competencies for your target role",
      duration: "3-6 months",
      skills: ["Programming languages", "Frameworks", "Development tools"],
      resources: ["Online courses", "Practice projects", "Coding challenges"],
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Specialized Knowledge",
      description: "Deep dive into role-specific technologies and methodologies",
      duration: "4-8 months",
      skills: ["Advanced frameworks", "System design", "Best practices"],
      resources: ["Advanced courses", "Open source contributions", "Mentorship"],
      difficulty: "Advanced"
    },
    {
      id: 4,
      title: "Portfolio & Experience",
      description: "Build portfolio projects and gain practical experience",
      duration: "2-4 months",
      skills: ["Project management", "Full-stack development", "Problem solving"],
      resources: ["Personal projects", "Freelance work", "Internships"],
      difficulty: "Intermediate"
    },
    {
      id: 5,
      title: "Career Transition",
      description: "Prepare for job search and career advancement",
      duration: "1-3 months",
      skills: ["Interview preparation", "Networking", "Resume building"],
      resources: ["Mock interviews", "Industry networking", "Job applications"],
      difficulty: "Intermediate"
    }
  ];

  // Load progress if roadmap is already saved
  useEffect(() => {
    if (savedRoadmapId) {
      loadProgress();
    }
  }, [savedRoadmapId]);

  const loadProgress = async () => {
    if (!savedRoadmapId) return;

    try {
      const { data, error } = await supabase
        .from('roadmap_progress')
        .select('step_id, completed, notes')
        .eq('roadmap_id', savedRoadmapId);

      if (error) throw error;

      const progressMap: Record<number, StepProgress> = {};
      data?.forEach(item => {
        progressMap[item.step_id] = {
          step_id: item.step_id,
          completed: item.completed,
          notes: item.notes || undefined
        };
      });
      setStepProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveRoadmap = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your roadmap.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const roadmapTitle = `Roadmap: ${goal.slice(0, 50)}${goal.length > 50 ? '...' : ''}`;
      
      const { data, error } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: roadmapTitle,
          goal: goal,
          steps: roadmapSteps as any
        })
        .select('id')
        .single();

      if (error) throw error;

      setSavedRoadmapId(data.id);
      toast({
        title: "Roadmap saved!",
        description: "Your learning roadmap has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving roadmap:', error);
      toast({
        title: "Error saving roadmap",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStepCompletion = async (stepId: number) => {
    if (!savedRoadmapId || !user) return;

    const currentProgress = stepProgress[stepId];
    const newCompletedState = !currentProgress?.completed;

    try {
      if (currentProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('roadmap_progress')
          .update({
            completed: newCompletedState,
            completed_at: newCompletedState ? new Date().toISOString() : null
          })
          .eq('roadmap_id', savedRoadmapId)
          .eq('step_id', stepId);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('roadmap_progress')
          .insert({
            roadmap_id: savedRoadmapId,
            step_id: stepId,
            completed: newCompletedState,
            completed_at: newCompletedState ? new Date().toISOString() : null
          });

        if (error) throw error;
      }

      // Update local state
      setStepProgress(prev => ({
        ...prev,
        [stepId]: {
          step_id: stepId,
          completed: newCompletedState,
          notes: currentProgress?.notes
        }
      }));

      toast({
        title: newCompletedState ? "Step completed!" : "Step marked as incomplete",
        description: `Step "${roadmapSteps.find(s => s.id === stepId)?.title}" updated.`
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error updating progress",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCompletedSteps = () => {
    return Object.values(stepProgress).filter(p => p.completed).length;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* <Award className="w-16 h-16 text-neon-cyan animate-pulse-neon mr-4" /> */}
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Your Roadmap
            </h2>
          </div>
          <div className="glass-effect p-6 rounded-2xl max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground mb-2">Goal:</p>
            <p className="text-xl font-semibold mb-4">{goal}</p>
            {savedRoadmapId && (
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>Progress: {getCompletedSteps()}/{roadmapSteps.length} steps completed</span>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-neon-purple h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(getCompletedSteps() / roadmapSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-neon-purple to-[#ffffff]"></div>

          {roadmapSteps.map((step, index) => {
            const isCompleted = stepProgress[step.id]?.completed;
            return (
              <div key={step.id} className="relative flex items-start mb-12">
                {/* Timeline dot with completion status */}
                <div 
                  className={`relative z-10 flex items-center justify-center w-16 h-16 border-4 rounded-full mr-8 cursor-pointer transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-card border-purple-500 animate-pulse-neon'
                  }`}
                  onClick={() => savedRoadmapId && toggleStepCompletion(step.id)}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <span className="text-lg font-bold text-purple-100">{step.id}</span>
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 glass-effect p-8 rounded-2xl animate-slide-up transition-all duration-300 ${
                  isCompleted ? 'opacity-75' : ''
                }`} style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-2 ${isCompleted ? 'line-through text-muted-foreground' : 'gradient-text-3'}`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-neon-yellow mr-1" />
                          <span>{step.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 mr-1 ${getDifficultyColor(step.difficulty)}`} />
                          <span className={getDifficultyColor(step.difficulty)}>{step.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-neon-cyan mr-2" />
                        Key Skills
                      </h4>
                      <ul className="space-y-2">
                        {step.skills.map((skill, skillIndex) => (
                          <li key={skillIndex} className="text-sm text-muted-foreground flex items-center">
                            <ArrowRight className="w-3 h-3 mr-2 text-neon-purple" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 text-neon-purple mr-2" />
                        Resources
                      </h4>
                      <ul className="space-y-2">
                        {step.resources.map((resource, resourceIndex) => (
                          <li key={resourceIndex} className="text-sm text-muted-foreground flex items-center">
                            <ArrowRight className="w-3 h-3 mr-2 text-neon-yellow" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="px-8 py-3 glass-effect rounded-full font-semibold hover:bg-muted/30 transition-colors"
            >
              Create New Roadmap
            </button>
            
            {!savedRoadmapId ? (
              <button 
                onClick={saveRoadmap}
                disabled={isSaving || !user}
                className="w-[290px] flex group relative px-8 py-4 bg-transparent border-2 border-purple-500 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-500 animate-slide-up "
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mt-1" />
                    <span className='ml-3'> Save & Track Progress</span>
                   
                  </>
                )}
              </button>
            ) : (
              <div className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Roadmap Saved
              </div>
            )}
          </div>
          
          {!user && (
            <p className="text-sm text-muted-foreground mt-4">
              Please log in to save and track your progress
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;
