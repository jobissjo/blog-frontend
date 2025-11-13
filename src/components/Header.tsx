import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard } from "lucide-react";
import { authService } from "@/services/authService";

const Header = () => {
  const isAdmin = authService.isAdmin();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-8 w-8" />
            <span>DevBlog</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/series" className="text-foreground hover:text-primary transition-colors">
              Series
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="default" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
