
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-theme-darker via-theme-primary to-theme-secondary">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <p className="text-2xl text-white mb-2">Oops! Page not found</p>
          <p className="text-white/80">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-theme-accent hover:text-theme-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-theme-primary to-theme-secondary text-white font-bold"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
