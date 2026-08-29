"use client";

import * as React from "react";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";

import { cn } from "@/lib/utils";

import Logo from "./logo";

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
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4  md:grid md:grid-cols-[1fr_auto_1fr] ">
        {/* Left: Logo */}
        <div className="md:justify-self-start lg:pl-5 sm:pl-0">
          <Logo />
        </div>

        {/* Center: Desktop Nav */}
        <ul className="hidden items-center justify-center gap-8 text-sm text-muted-foreground md:flex">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                scroll={true}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive(item.href)
                    ? "text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:justify-self-end">
          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex mr-11">
            <ModeToggle variant="ghost" />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "border-t bg-background md:hidden ",
          isOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto max-w-5xl space-y-2 px-3 py-4">
          <ul className="ml-6 space-y-3 text-sm">
            {MENU_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  scroll={true}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isActive(item.href)
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="mr-7 pb-4">
              <ModeToggle variant="ghost" className="pr-4" />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
