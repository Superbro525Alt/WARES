"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/teacher-start-here", label: "Teacher Start Here" },
  { href: "/guides", label: "Guides" },
  { href: "/lessons", label: "Lessons" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <img
            src="https://warobotics.education/wp-content/uploads/2024/05/cropped-FullLogoWARES.png"
            alt="WARES"
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline" className="border-foreground/20">
            <Link href="/admin">Admin</Link>
          </Button>
          <Button asChild>
            <a href="https://warobotics.education/shop/">Browse Products</a>
          </Button>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open ? (
        <div className="border-t border-border/60 bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="border-foreground/20">
                <Link href="/admin">Admin</Link>
              </Button>
              <Button asChild>
                <a href="https://warobotics.education/shop/">Browse Products</a>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
