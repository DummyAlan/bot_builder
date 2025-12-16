---
applyTo: "generate-implementation-plan"
name: "Gaming Design System"
description: "Visual design guidelines for gaming-themed UI with neon aesthetics"
---

# Gaming Design System

> Full design system details in `../../docs/domain-standards.md`

## Visual Style

- **Gaming Aesthetics** - Modern, sleek UI inspired by gaming interfaces with sharp edges, dynamic layouts, and tech-forward design
- **Dark Theme by Default** - Use dark backgrounds (`bg-black`, `bg-zinc-900`, `bg-zinc-950`) as the primary color scheme
- **Neon Accents** - Incorporate vibrant neon colors for emphasis:
  - Primary: cyan (`text-cyan-400`, `border-cyan-500`, `shadow-cyan-500/50`)
  - Secondary: purple/magenta (`text-purple-500`, `border-purple-400`)
  - Accent: green (`text-green-400`) for success states
  - Warning: orange/red neon (`text-orange-500`, `text-red-500`)
- **Glow Effects** - Use shadows and blur for neon glow: `shadow-lg shadow-cyan-500/50`, `blur-sm`
- **Typography** - Prefer monospace fonts for tech aesthetic; use Geist Mono for code-like elements

## Tailwind Configuration

- **Tailwind v4 with PostCSS** - Use Tailwind classes via `@tailwindcss/postcss` (see `postcss.config.mjs`)
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints:
  - Base: Mobile (< 640px)
  - `sm:` Tablet (≥ 640px)
  - `md:` Desktop (≥ 768px)
  - `lg:` Large screens (≥ 1024px)

## Layout Patterns

- **Flex & Grid** - Use `flex` and `grid` for dynamic layouts; avoid fixed widths when possible
- **Spacing** - Consistent spacing scale: `gap-4`, `p-6`, `space-y-8` for visual rhythm
- **Full Height Sections** - Use `min-h-screen` for hero sections and primary views

## Interactive Elements

- **Hover States** - Add subtle animations and glow effects on hover
  ```tsx
  className="transition-all hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
  ```
- **Borders & Outlines** - Use thin neon borders (`border border-cyan-500/30`) for gaming UI cards
- **Buttons** - Dark backgrounds with neon borders/text, glow on hover
- **Animations** - Subtle `transition-all` or `transition-colors` for smooth interactions
