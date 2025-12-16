---
applyTo: '**/*.{ts,tsx}'
name: "Next.js Framework Conventions"
description: "Next.js App Router conventions and React best practices for this project"
---

# Next.js Framework Conventions

> Refer to `../../docs/tech-stack.md` for framework versions and `../../docs/domain-standards.md` for component patterns.

## App Router Conventions

- **Use Server Components by default** - Components in `app/` directory are Server Components unless marked with `'use client'`
- **Client Components only when needed** - Add `'use client'` directive only for interactivity (hooks, event handlers, browser APIs)
- **Colocate files** - Keep related components, styles, and utilities in feature-based directories within `app/`
- **Optimize images** - Always use Next.js `<Image>` component from `next/image` with `width`, `height`, and `alt` props
- **Lazy load components** - Use `next/dynamic` for code splitting large client components
- **Font optimization** - Leverage `next/font` for automatic font optimization (see `layout.tsx` for Geist fonts example)
- **Static metadata** - Export `metadata` object in Server Components instead of using runtime head management
- **Streaming and Suspense** - Wrap slow components in React `<Suspense>` for progressive rendering
- **Path aliases** - Use `@/*` import paths (configured in `tsconfig.json`) for cleaner imports and easier refactoring
- **Strict TypeScript** - Project uses strict mode; ensure all types are properly defined
- **ESLint enforcement** - Run `npm run lint` before committing to catch issues early

## Page Component Structure

```tsx
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  // Component logic
}
```

## Next.js-Specific Patterns

- Extract repeated logic into reusable utilities in `@/lib` or `@/utils`
- Implement error boundaries for Client Components

## Next.js Security

- Never expose secrets in client code; use `NEXT_PUBLIC_` prefix only for truly public values
- Validate permissions in Server Components/Actions; never trust client-side checks
- Implement rate limiting for API routes and Server Actions
- Set secure headers in `next.config.ts`

```tsx
// Server Component - OK
const apiKey = process.env.API_SECRET_KEY;

// Client Component - NEVER (exposes secrets to browser!)
const apiKey = process.env.API_SECRET_KEY;
```

## Next.js Testing

### Server Components

- Test Server Components using integration tests; mock data fetching functions
- Test async data loading and error states

```tsx
// Mock fetch for Server Component testing
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ name: 'Test User' }) })
);
```

### Client Components

- Test interactivity, event handlers, and state management in isolation
- Mark test files with 'use client' when testing Client Components

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';

test('handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```
