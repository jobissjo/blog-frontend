import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Moon, Sun, LogIn, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthenticated(authService.isAuthenticated());
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };
    
    // Listen for custom auth-change event
    window.addEventListener("auth-change", handleAuthChange);
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", handleAuthChange);
    
    // Also check on focus (in case user logged in/out in same tab)
    window.addEventListener("focus", handleAuthChange);
    
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            {/* <BookOpen className="h-8 w-8" />
            <span>DevBlog</span> */}
            <img src="/logo.png" alt="logo" style={{ width: "70px", height: "50px" }} />
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/series" className="text-foreground hover:text-primary transition-colors">
              Series
            </Link>
            {mounted && (
              <>
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/admin")}
                    aria-label="Go to admin dashboard"
                    title="Admin Dashboard"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/login")}
                    aria-label="Login"
                    title="Login"
                  >
                    <LogIn className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
