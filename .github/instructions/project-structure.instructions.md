---
applyTo: "generate-implementation-plan"
name: "Project Structure Reference"
description: "Directory layout and file organization for this Next.js application"
---

# Project Structure Reference

```
prompt-exercise-two/
├── .github/
│   ├── agents/
│   │   ├── architect-planner.agent.md       # Technical planning persona
│   │   ├── product-elicitor.agent.md        # Requirements gathering persona
│   │   └── senior-debugger.agent.md         # Debugging specialist persona
│   ├── instructions/
│   │   ├── behavioral.instructions.md       # Communication guidelines
│   │   ├── design-system.instructions.md    # Gaming UI design system
│   │   ├── main.instructions.md             # Core AI role and methodology
│   │   ├── next-js.instructions.md          # Next.js conventions
│   │   ├── project-structure.instructions.md # This file
│   │   └── technical.instructions.md        # Coding standards
│   └── prompts/
│       ├── 1_instruction_extraction.prompt.md
│       ├── 2_agent_extraction.prompt.md
│       ├── 3_context_extraction.prompt.md
│       └── 4_shared_context_extraction.prompt.md
├── app/                                     # Next.js App Router directory
│   ├── favicon.ico                          # Site favicon
│   ├── globals.css                          # Global styles with Tailwind
│   ├── layout.tsx                           # Root layout component
│   └── page.tsx                             # Home page component
├── docs/                                    # Project context documentation
│   ├── project-context.md                   # Tech stack and conventions
│   ├── design-standards.md                  # Gaming UI design system
│   └── development-standards.md             # Quality and security standards
├── public/                                  # Static assets served from root
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── eslint.config.mjs                        # ESLint configuration
├── next-env.d.ts                            # Next.js TypeScript declarations
├── next.config.ts                           # Next.js configuration
├── package.json                             # Dependencies and scripts
├── postcss.config.mjs                       # PostCSS with Tailwind v4
├── tsconfig.json                            # TypeScript configuration
└── README.md                                # Project documentation
```

## Key Directories

- **app/** - Next.js App Router with Server Components by default
- **public/** - Static assets served at root URL path
- **docs/** - Project context and standards documentation
- **.github/agents/** - Reusable AI agent personas
- **.github/instructions/** - AI coding guidelines organized by concern
- **.github/prompts/** - Workflow and task prompts
