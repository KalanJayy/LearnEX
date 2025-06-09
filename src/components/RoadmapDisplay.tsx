
import React from 'react';
import { CheckCircle, Clock, Star, BookOpen, Award, ArrowRight } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface RoadmapDisplayProps {
  goal: string;
  onReset: () => void;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ goal, onReset }) => {
  // Mock roadmap data - in real app this would come from AI
  const roadmapSteps: RoadmapStep[] = [
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-16 h-16 text-neon-cyan animate-pulse-neon mr-4" />
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Your Roadmap
            </h2>
          </div>
          <div className="glass-effect p-6 rounded-2xl max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground mb-2">Goal:</p>
            <p className="text-xl font-semibold">{goal}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink"></div>

          {roadmapSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start mb-12">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-card border-4 border-neon-cyan rounded-full mr-8 animate-pulse-neon">
                <span className="text-lg font-bold text-neon-cyan">{step.id}</span>
              </div>

              {/* Content */}
              <div className="flex-1 glass-effect p-8 rounded-2xl animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 gradient-text">{step.title}</h3>
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
          ))}
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
            <button className="px-8 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold rounded-full transition-all duration-300 hover:scale-105">
              Save & Track Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;
