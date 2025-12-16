---
applyTo: "**"
name: "Technical Instructions"
description: "Coding standards, architecture patterns, and testing guidelines"
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

## Testing Standards

### Component Testing

- **Testing Framework** - Use appropriate testing libraries for the framework (e.g., React Testing Library with Jest/Vitest)
- **Test Structure** - Follow Arrange-Act-Assert pattern; one assertion per test when possible
- **Coverage Requirements** - Achieve high code coverage for all components; exclude only config files
- **Mock External Dependencies** - Mock API calls, database queries, and third-party services
- **Accessibility Testing** - Include accessibility tests using appropriate matchers
- **Snapshot Testing** - Use sparingly; prefer explicit assertions for critical elements
- **Test Data Builders** - Create factory functions for test data to reduce duplication

### E2E Testing

- **Testing Framework** - Use comprehensive E2E testing tools (e.g., Playwright, Cypress)
- **Critical User Journeys** - Test complete user workflows from entry to completion
- **Coverage Requirements** - Cover all primary user flows, authentication paths, and error scenarios
- **Page Object Model** - Organize tests using Page Object Model for maintainability
- **Test Isolation** - Each test should be independent; reset state between tests
- **Visual Regression** - Include screenshot comparison tests for critical components
- **Performance Testing** - Monitor load times and performance metrics in E2E tests
- **Mobile Testing** - Test responsive layouts on various viewport sizes
- **Error Scenarios** - Test network failures, error pages, and error boundaries

### Testing Best Practices

- **Continuous Integration** - Run all tests in CI pipeline; block merges on test failures
- **Test Naming** - Use descriptive names that explain the expected behavior
- **Avoid Implementation Details** - Test behavior, not implementation; query by role/label, not internal structure
- **Test Environment** - Use separate environment configurations for testing
- **Code Coverage Tools** - Use coverage tools and enforce thresholds in CI
- **Fast Tests** - Keep unit tests fast; optimize E2E tests for speed
- **Parallel Execution** - Run tests in parallel to reduce CI time
- **Flaky Test Prevention** - Avoid arbitrary waits; use proper wait utilities for async operations
