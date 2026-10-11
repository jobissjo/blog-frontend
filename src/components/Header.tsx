"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const links = [{ href: "/", label: "Articles" }, { href: "/series", label: "Series" }, { href: "/about", label: "About" }];

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const navigation = links.map(({ href, label }) => {
    const active = href === "/" ? pathname === "/" || pathname.startsWith("/blog") : pathname.startsWith(href);
    return <Link key={href} href={href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{label}</Link>;
  });
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
      <a href="#main-content" className="absolute left-4 top-2 z-[60] -translate-y-24 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground focus:translate-y-0">Skip to content</a>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" aria-label="JoTech Blog home" className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/donmu4dj1/image/upload/v1764694824/logo_bxijb3.png" alt="JoTech Blog" width={70} height={50} className="object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">{navigation}</nav>
          <Button variant="ghost" size="icon" disabled={!mounted} className="h-11 w-11 rounded-full" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={mounted && resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            {mounted && resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="h-11 w-11 sm:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent className="sm:hidden">
              <SheetTitle>JoTech Blog</SheetTitle>
              <SheetDescription>Practical guides for developers.</SheetDescription>
              <nav aria-label="Mobile navigation" className="mt-6 flex flex-col gap-2">{navigation}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
