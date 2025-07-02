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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900/80 ">
      <div className="text-center max-w-xlg mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-8xl font-bold gradient-text mb-4">
            oops! 404 :-(
          </h1>
          <p className="text-2xl text-muted-foreground mb-2">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="text-white hover:text-neon-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="bg-transparent border-2 border-purple-500 text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-purple-500 animate-slide-up"
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
