"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Layers,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Sun,
    Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { authService } from "@/services/authService";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Auto-collapse sidebar on mobile
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    const navItems = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Blogs",
            href: "/admin/blogs", // Note: This route might need to be handled if it doesn't exist, or we just rely on the dashboard tabs
            icon: FileText,
        },
        {
            title: "Series",
            href: "/admin/series", // Same note as above
            icon: Layers,
        },
        {
            title: "Settings",
            href: "/admin/change-password",
            icon: Settings,
        },
    ];

    // Helper to check if link is active
    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r transition-transform duration-300 ease-in-out flex flex-col",
                    !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-[70px]"
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <Link href="/" className="flex items-center gap-2 overflow-hidden">
                        <Image
                            src="https://res.cloudinary.com/donmu4dj1/image/upload/v1764694824/logo_bxijb3.png"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain min-w-[40px]"
                        />
                        <span className={cn("font-bold text-lg whitespace-nowrap transition-opacity duration-300", !isSidebarOpen && "lg:opacity-0 lg:hidden")}>
                            Admin
                        </span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive(item.href) ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    !isSidebarOpen && "lg:justify-center lg:px-2"
                                )}
                                title={!isSidebarOpen ? item.title : undefined}
                            >
                                <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
                                <span className={cn(
                                    "transition-all duration-300",
                                    !isSidebarOpen && "lg:hidden"
                                )}>
                                    {item.title}
                                </span>
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-muted-foreground hover:text-foreground",
                            !isSidebarOpen && "lg:justify-center lg:px-2"
                        )}
                        onClick={handleLogout}
                        title={!isSidebarOpen ? "Logout" : undefined}
                    >
                        <LogOut className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
                        <span className={cn(
                            "transition-all duration-300",
                            !isSidebarOpen && "lg:hidden"
                        )}>
                            Logout
                        </span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 border-b bg-card/50 backdrop-blur sticky top-0 z-30 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:flex"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
