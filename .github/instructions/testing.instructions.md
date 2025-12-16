---
applyTo: "generate-test"
name: "Testing Instructions"
description: "Testing standards and best practices for component and E2E testing"
---

# Testing Instructions

## Component Testing

- **Testing Framework** - Use appropriate testing libraries for the framework (e.g., React Testing Library with Jest/Vitest)
- **Test Structure** - Follow Arrange-Act-Assert pattern; one assertion per test when possible
- **Coverage Requirements** - Achieve high code coverage for all components; exclude only config files
- **Mock External Dependencies** - Mock API calls, database queries, and third-party services
- **Accessibility Testing** - Include accessibility tests using appropriate matchers
- **Snapshot Testing** - Use sparingly; prefer explicit assertions for critical elements
- **Test Data Builders** - Create factory functions for test data to reduce duplication

## E2E Testing

- **Testing Framework** - Use comprehensive E2E testing tools (e.g., Playwright, Cypress)
- **Critical User Journeys** - Test complete user workflows from entry to completion
- **Coverage Requirements** - Cover all primary user flows, authentication paths, and error scenarios
- **Page Object Model** - Organize tests using Page Object Model for maintainability
- **Test Isolation** - Each test should be independent; reset state between tests
- **Visual Regression** - Include screenshot comparison tests for critical components
- **Performance Testing** - Monitor load times and performance metrics in E2E tests
- **Mobile Testing** - Test responsive layouts on various viewport sizes
- **Error Scenarios** - Test network failures, error pages, and error boundaries

## Testing Best Practices

- **Continuous Integration** - Run all tests in CI pipeline; block merges on test failures
- **Test Naming** - Use descriptive names that explain the expected behavior
- **Avoid Implementation Details** - Test behavior, not implementation; query by role/label, not internal structure
- **Test Environment** - Use separate environment configurations for testing
- **Code Coverage Tools** - Use coverage tools and enforce thresholds in CI
- **Fast Tests** - Keep unit tests fast; optimize E2E tests for speed
- **Parallel Execution** - Run tests in parallel to reduce CI time
- **Flaky Test Prevention** - Avoid arbitrary waits; use proper wait utilities for async operations
