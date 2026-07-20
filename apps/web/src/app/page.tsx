import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileCsvIcon,
  GithubLogoIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: MagnifyingGlassIcon,
    index: "01",
    title: "See what needs attention",
    description: "Quality scores and precise field-level problems turn a messy catalog into a clear review queue.",
  },
  {
    icon: SlidersHorizontalIcon,
    index: "02",
    title: "Review transparent rules",
    description: "Every suggestion explains the deterministic rules behind it. Nothing changes without approval.",
  },
  {
    icon: ShieldCheckIcon,
    index: "03",
    title: "Keep an accountable history",
    description: "Imports, suggestions, approvals, and rejections are recorded in an easy-to-follow audit timeline.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-[72px] items-center justify-between border-b border-border px-5 md:px-10 lg:px-20">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          <a href="#benefits" className="focus-ring rounded hover:text-foreground">Benefits</a>
          <a href="#workflow" className="focus-ring rounded hover:text-foreground">Workflow</a>
          <a href="#technology" className="focus-ring rounded hover:text-foreground">Technology</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a href="https://github.com/abdirahman-taabit/catalogflow" target="_blank" rel="noreferrer">
              <GithubLogoIcon size={16} aria-hidden="true" /> GitHub
            </a>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">Open demo</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="grid items-center gap-12 px-5 py-16 md:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-[72px] lg:px-20 lg:py-20">
          <div>
            <p className="eyebrow">Catalog quality, made reviewable</p>
            <h1 className="mt-4 max-w-2xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.055em] md:text-[3.625rem]">
              Turn messy product data into a catalog you can trust.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-[1.0625rem] md:leading-7">
              Upload a CSV, surface quality problems, and approve clear rule-based improvements—without losing control of your source data.
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Open the demo <ArrowRightIcon size={17} aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/imports">
                  <FileCsvIcon size={17} aria-hidden="true" /> Import a catalog
                </Link>
              </Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircleIcon size={15} className="text-primary" aria-hidden="true" />
              Deterministic enrichment. No artificial-intelligence claims.
            </p>
          </div>

          <div className="rounded-2xl bg-[#20231f] p-3.5 shadow-[0_24px_64px_rgba(32,35,31,0.18)]" aria-label="CatalogFlow product review preview">
            <div className="overflow-hidden rounded-[10px] bg-background">
              <div className="flex h-8 items-center gap-1.5 bg-[#2e332e] px-3" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-[#737b72]" />
                <span className="size-1.5 rounded-full bg-[#737b72]" />
                <span className="size-1.5 rounded-full bg-[#737b72]" />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-primary">Review spotlight</p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.025em]">Wireless mechanical keyboard</h2>
                    <p className="mt-1 font-mono text-[0.625rem] text-muted-foreground">KEY-1042 · 3 quality problems</p>
                  </div>
                  <span className="rounded-full bg-[#f6ead3] px-2.5 py-1 font-mono text-[0.6875rem] font-semibold text-[#7a4c12]">42 / 100</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-[1fr_28px_1fr] md:items-stretch">
                  <div className="rounded-[10px] border border-border bg-[#fbfaf6] p-4">
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Original product data</p>
                    <p className="mt-3 text-sm font-semibold">WIRELESS KEYBOARD</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">Compact keyboard.</p>
                    <p className="mt-2 text-[0.6875rem] font-medium text-[#a84c43]">Missing category · description too short</p>
                  </div>
                  <ArrowRightIcon className="m-auto rotate-90 text-primary md:rotate-0" size={18} aria-hidden="true" />
                  <div className="rounded-[10px] border border-[#c8d2c2] bg-[#f3f6f0] p-4">
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Suggested improvement</p>
                    <p className="mt-3 text-sm font-semibold">Wireless Mechanical Keyboard</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">Compact wireless keyboard with tactile switches and dependable battery life.</p>
                    <p className="mt-2 text-[0.6875rem] font-medium text-primary">Computer accessories · 88% confidence</p>
                  </div>
                </div>
                <div className="mt-3 border-l-[3px] border-primary bg-[#e4eadf] px-3.5 py-3 text-[0.6875rem] leading-5 text-[#46533f]">
                  Rules applied: normalized title case, expanded a short description, and matched the category using known keywords.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="border-t border-border bg-card px-5 py-16 md:px-10 lg:px-20 lg:py-[72px]">
          <div className="max-w-2xl">
            <p className="eyebrow">A focused review workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">From uncertain data to deliberate decisions.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.index} className="rounded-[10px] border border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6875rem] font-semibold text-primary">{benefit.index}</span>
                    <Icon size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="px-5 py-16 md:px-10 lg:px-20 lg:py-[72px]">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Four clear steps. Every change remains yours.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Upload", "Choose a standard product CSV."],
              ["02", "Validate", "See invalid rows and duplicate SKUs."],
              ["03", "Review", "Compare original and suggested values."],
              ["04", "Decide", "Approve or reject with a recorded audit event."],
            ].map(([index, title, text]) => (
              <div key={index} className="border-t-2 border-primary bg-card p-5">
                <span className="font-mono text-[0.6875rem] text-primary">{index}</span>
                <strong className="mt-4 block text-sm">{title}</strong>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="technology" className="flex flex-col gap-4 bg-[#20231f] px-5 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10 lg:px-20">
          <div>
            <p className="text-sm font-semibold">Built for a transparent portfolio demo</p>
            <p className="mt-1 text-xs text-[#bfc5bd]">A simple modular monolith with a replaceable enrichment provider.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[#c8cec6]">
            <span>Next.js</span><span>Spring Boot</span><span>PostgreSQL</span><span>Rule engine</span>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-3 border-t border-border px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10 lg:px-20">
        <Brand />
        <p>Built as a learning-focused full-stack portfolio project.</p>
      </footer>
    </div>
  );
}

