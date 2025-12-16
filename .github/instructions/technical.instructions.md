---
applyTo: "generate-implementation-plan"
name: "Technical Instructions"
description: "Coding standards and architecture patterns"
---

# Technical Instructions

## SOLID Principles

- **Single Responsibility** - Each component/function has one clear purpose; split large components into smaller ones
- **Open/Closed** - Use composition and props over modification; leverage generics for extensibility
- **Liskov Substitution** - Ensure child components can replace parent types; maintain consistent interfaces
- **Interface Segregation** - Define focused interfaces; avoid bloated types with many optional fields
- **Dependency Inversion** - Pass dependencies as parameters; avoid hardcoded external services

## Code Quality Standards

- **Avoid Cognitive Complexity** - Keep functions under 15 lines; extract nested logic into named helper functions
- **No Code Duplication** - Extract repeated logic into reusable utilities
- **Proper Error Handling** - Use strict null checks; implement error boundaries where appropriate
- **Remove Dead Code** - Delete unused imports, variables, and commented code before committing
- **Consistent Naming** - Use camelCase for variables/functions, PascalCase for types/classes, UPPER_CASE for constants
- **Avoid Magic Numbers** - Define constants with descriptive names instead of hardcoded values
- **Export typed components** - Always define proper types for parameters and return values
- **Pure functions** - Extract business logic into pure functions for easier testing
- **Type-safe parameters** - Use type systems to catch errors at compile time
- **Isolate side effects** - Keep data fetching, API calls, and mutations separate from presentation logic
