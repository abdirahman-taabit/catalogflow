"use client";

import {
  ArrowSquareOutIcon,
  ClockCounterClockwiseIcon,
  PackageIcon,
  SquaresFourIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: SquaresFourIcon },
  { href: "/products", label: "Products", icon: PackageIcon },
  { href: "/imports", label: "Imports", icon: UploadSimpleIcon },
  { href: "/activity", label: "Activity", icon: ClockCounterClockwiseIcon },
] as const;

interface AppShellProps extends PropsWithChildren {
  title: string;
  action?: React.ReactNode;
}

export function AppShell({ children, title, action }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="hidden min-h-screen flex-col bg-sidebar px-[18px] py-6 text-sidebar-foreground lg:flex">
        <div className="px-2 pb-5">
          <Brand inverted />
        </div>
        <p className="mt-4 px-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#92988f]">
          Workspace
        </p>
        <nav className="mt-2 grid gap-1" aria-label="Workspace navigation">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#c7cbc4] transition-colors hover:bg-white/5 hover:text-white",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon size={17} weight={active ? "fill" : "regular"} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-sidebar-border px-2 pt-4 text-xs leading-5 text-[#abb0a8]">
          <p className="font-medium text-white">Rule-based enrichment</p>
          <p>System healthy</p>
          <Link
            href="/"
            className="focus-ring mt-3 inline-flex items-center gap-1 rounded text-[#dfe8d8]"
          >
            Public site <ArrowSquareOutIcon size={13} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:h-[72px] lg:px-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <p className="hidden text-xs text-muted-foreground lg:block">Demo workspace / {title}</p>
          <div className="flex items-center gap-2">
            {action}
            <div className="grid size-8 place-items-center rounded-full bg-secondary font-mono text-[0.6875rem] font-bold">
              AT
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-24 md:px-6 lg:px-8 lg:py-8 lg:pb-10">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid h-[70px] grid-cols-4 border-t border-border bg-card lg:hidden"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring grid place-items-center gap-0.5 text-[0.625rem] text-muted-foreground",
                active && "font-semibold text-primary",
              )}
            >
              <Icon size={20} weight={active ? "fill" : "regular"} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
