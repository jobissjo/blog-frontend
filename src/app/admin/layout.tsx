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
    Moon,
    ExternalLink
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
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

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
            href: "/admin/blogs",
            icon: FileText,
        },
        {
            title: "Series",
            href: "/admin/series",
            icon: Layers,
        },
        {
            title: "Settings",
            href: "/admin/change-password",
            icon: Settings,
        },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex text-foreground selection:bg-primary/20 selection:text-primary">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-card/80 backdrop-blur-md border-r border-border/80 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-xs",
                    !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-[72px]"
                )}
            >
                <div>
                    {/* Header Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border/60">
                        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                            <div className="p-1 rounded-xl bg-primary/10 border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Image
                                    src="https://res.cloudinary.com/donmu4dj1/image/upload/v1764694824/logo_bxijb3.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className={cn("flex flex-col transition-opacity duration-300", !isSidebarOpen && "lg:opacity-0 lg:hidden")}>
                                <span className="font-bold text-base leading-none text-foreground">
                                    JoTechBlog
                                </span>
                                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest mt-0.5">
                                    Admin Panel
                                </span>
                            </div>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Nav Items */}
                    <nav className="p-3 space-y-1.5">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer",
                                            active
                                                ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                            !isSidebarOpen && "lg:justify-center lg:px-0"
                                        )}
                                        title={!isSidebarOpen ? item.title : undefined}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className={cn("transition-all", !isSidebarOpen && "lg:hidden")}>
                                            {item.title}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Controls */}
                <div className="p-3 border-t border-border/60 space-y-1.5">
                    <Link href="/" target="_blank" className="block">
                        <div
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
                                !isSidebarOpen && "lg:justify-center lg:px-0"
                            )}
                            title="View Public Site"
                        >
                            <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                            <span className={cn(!isSidebarOpen && "lg:hidden")}>
                                View Public Site
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-all",
                            !isSidebarOpen && "lg:justify-center lg:px-0"
                        )}
                        title={!isSidebarOpen ? "Logout" : undefined}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span className={cn(!isSidebarOpen && "lg:hidden")}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
                            title="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-700" />
                            )}
                        </Button>

                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            <User className="h-4 w-4" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
