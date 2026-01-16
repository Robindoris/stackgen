# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StackGen is a project boilerplate generator that helps developers quickly scaffold new projects with modern tech stacks. It provides a web interface where users select their preferred tech stack (Next.js, PHP, or Vanilla HTML5), configure project settings, and receive comprehensive setup instructions and project structure templates.

## Tech Stack

- **Framework**: Next.js 16.0.10 with React 19.2.0
- **Styling**: Tailwind CSS v4.1.9 with PostCSS
- **UI Components**: shadcn/ui (collection of Radix UI components)
- **Language**: TypeScript 5
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## Build, Lint, and Test Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting (ESLint configured)
npm run lint
```

## Code Architecture

### Directory Structure

- **app/**: Next.js App Router pages
  - `layout.tsx`: Root layout with metadata and Vercel Analytics
  - `page.tsx`: Home page - main entry point that renders Header and StackGenerator
  - `globals.css`: Global Tailwind styles

- **components/**: React components
  - `ui/`: shadcn/ui components (pre-built UI primitives from Radix UI)
  - `stack-generator.tsx`: Main form component managing app configuration state
  - `tech-stack-selector.tsx`: Tech stack selection UI with three options (Next.js, PHP, HTML)
  - `generated-output.tsx`: Displays generated setup instructions and project templates
  - `header.tsx`: Header navigation component
  - `theme-provider.tsx`: Theme context setup with next-themes

- **lib/**: Utilities
  - `utils.ts`: `cn()` function for merging Tailwind classes with clsx and tailwind-merge

- **hooks/**: Custom React hooks
  - `use-mobile.ts`: Responsive design hook for mobile detection
  - `use-toast.ts`: Toast notification hook

### Core Data Flow

1. **StackGenerator** (`components/stack-generator.tsx`) is the main stateful component that manages:
   - App name input
   - Storage path input
   - Selected tech stack (state: `TechStack | null`)
   - Generation state (before/after generation)

2. **TechStackSelector** (`components/tech-stack-selector.tsx`) displays three options:
   - Next.js: TypeScript, App Router, Server Actions, API Routes
   - PHP: Composer, PSR-4, MVC Structure
   - Vanilla HTML5: Semantic HTML, CSS Variables, no build step

3. **GeneratedOutput** (`components/generated-output.tsx`) generates context-specific content for each stack:
   - Setup commands (npm/terminal commands)
   - CSS configuration (Tailwind CSS v4 setup)
   - Project structure templates
   - Sample starter code

### Type System

- `TechStack` type is defined in `stack-generator.tsx` as a union type: `"nextjs" | "php" | "html"`
- TypeScript strict mode enabled
- Path alias configured: `@/*` maps to project root

## Important Implementation Details

### Tailwind CSS v4 Integration

- Uses the new CSS-based configuration approach (not `tailwind.config.js`)
- PostCSS with `@tailwindcss/postcss` for CSS import
- CSS variables for theming (visible in `generated-output.tsx` CSS setup examples)
- All UI components use Tailwind classes without pre-built CSS files

### shadcn/ui Components

- 60+ pre-built components in `components/ui/` directory
- Components are composable, headless (no built-in styling beyond Tailwind)
- Built on Radix UI primitives for accessibility
- Each component is standalone and can be individually modified

### Form Handling

- React Hook Form manages form state efficiently
- Zod for schema validation
- Custom Field component in `components/ui/field.tsx` for form integration

### Client vs Server Components

- Most components are client components (`"use client"`) because they manage state or handle user interactions
- `app/layout.tsx` and `app/page.tsx` are server components by default
- Analytics component is client-side (Vercel Analytics)

## Development Workflow

### Adding New Components

1. Create the component in `components/` directory
2. Use TypeScript for type safety
3. Leverage existing UI components from `components/ui/`
4. Use the `cn()` utility from `lib/utils.ts` to merge Tailwind classes

### Styling Approach

- Utility-first Tailwind CSS - avoid creating custom CSS classes
- Use inline Tailwind classes for component styling
- CSS variables defined in `globals.css` for theme colors
- Dark mode is hardcoded in the root `<html>` element with `className="dark"`

### Adding New Tech Stacks

To add a new tech stack option:

1. Update `TechStack` type in `components/stack-generator.tsx`
2. Add stack definition to `stacks` array in `components/tech-stack-selector.tsx` with name, description, icon, and features
3. Add case handlers in `components/generated-output.tsx` for:
   - `getSetupCommand()` - terminal commands
   - `getCssSetup()` - CSS initialization
   - `getProjectStructure()` - folder layout template
   - `getSampleCode()` - starter code snippet
   - `getPrerequisites()` - required tools

## Key Files to Understand

- **components/stack-generator.tsx**: Core business logic and state management
- **components/generated-output.tsx**: Output formatting for each stack type
- **components/tech-stack-selector.tsx**: UI for tech stack selection with feature badges
- **app/page.tsx**: Entry point showing overall page layout
