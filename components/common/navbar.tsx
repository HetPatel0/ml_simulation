"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToogle } from "@/components/mode-toogle";
import Logo from "./logo";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Learn", href: "/learn" },
  { label: "Simulations", href: "/simulations" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
        <Logo />

        {/* Center: Desktop Nav */}
        <ul className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm text-muted-foreground mr-35">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "relative transition-colors hover:text-primary",
                  isActive(item.href)
                    ? "text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                    : "text-muted-foreground",
                )}
                scroll={true}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex">
            <ModeToogle variant="link" />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t bg-background",
          isOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto max-w-5xl px-4 py-4 space-y-4">
          <ul className="space-y-3 text-sm">
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ModeToogle variant="link" className="pr-3 m" />
        </div>
      </div>
    </header>
  );
}
