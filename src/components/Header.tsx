'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Moon, Sun, LogIn, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import Image from "next/image";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthenticated(authService.isAuthenticated());

    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Image src="https://res.cloudinary.com/donmu4dj1/image/upload/v1764694824/logo_bxijb3.png" alt="JoTechBlog Logo" width={70} height={50} className="object-contain" />
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/series"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Series
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-border/50">
            {mounted && (
              <>
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/admin")}
                    aria-label="Go to admin dashboard"
                    title="Admin Dashboard"
                    className="h-9 w-9 rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/login")}
                    aria-label="Login"
                    title="Login"
                    className="h-9 w-9 rounded-full"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                  className="h-9 w-9 rounded-full"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
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
