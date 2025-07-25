import React, { useState } from "react";
import { ArrowRight, Brain, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface GoalInputProps {
  onSubmit: (goal: string) => void;
}

const GoalInput: React.FC<GoalInputProps> = ({ onSubmit }) => {
  const [goal, setGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit(goal);
    setIsLoading(false);
  };

  const exampleGoals = [
    "Become a Senior Full-Stack Developer",
    "Transition to AI/Machine Learning Engineer",
    "Start a Tech Startup",
    "Become a Cybersecurity Expert",
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-black to-purple-900/80">
      <div className="absolute top-4 left-4 z-10 ">
        <Button
          // variant="ghost"
          onClick={() => navigate("/auth")}
          className="text-white hover:text-neon-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* <Brain className="w-16 h-16 text-neon-cyan animate-pulse-neon mr-4" /> */}
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Define Your Future
            </h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Describe your career aspirations and let our AI craft your
            personalized learning roadmap
          </p>
        </div>

        {/* Goal Input Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-effect p-8 rounded-2xl">
            <label
              htmlFor="career-goal"
              className="block text-lg font-semibold mb-4 flex items-center"
            >
              <Lightbulb className="w-6 h-6 text-neon-yellow mr-2" />
              What's your career goal?
            </label>

            <Textarea
              id="career-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="I want to become a senior software engineer specializing in AI and machine learning. I'm currently a junior developer with 2 years of experience in React and Node.js..."
              className="flex h-10 w-full rounded-md  focus-visible:!ring-purple-500 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-32"
              disabled={isLoading}
            />

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Be specific about your current level, desired role, and timeline
              </p>

              <Button
                type="submit"
                disabled={!goal.trim() || isLoading}
                className="group relative px-8 py-4 bg-transparent border-2 border-purple-500 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-purple-500 animate-slide-up"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating Roadmap...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Generate Roadmap
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Example Goals */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-6 text-center">
            Need inspiration? Try these examples:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {exampleGoals.map((example, index) => (
              <button
                key={index}
                onClick={() => setGoal(example)}
                className="glass-effect p-4 rounded-xl text-left hover:bg-muted/30 transition-colors group"
                disabled={isLoading}
              >
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  "{example}"
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalInput;
