
# Testing Documentation for ACDRP

This document provides guidance on how to use the testing infrastructure for the Advanced Clothing Donation & Resale Platform (ACDRP).

## Testing Architecture

We use the following testing stack:
- **Vitest**: Fast test runner compatible with Vite
- **React Testing Library**: For component testing
- **Jest DOM**: For DOM assertions
- **User Event**: For simulating user interactions

## Types of Tests

1. **Unit Tests**: Test individual components, hooks, or functions in isolation
2. **Integration Tests**: Test how multiple components work together
3. **End-to-End Tests**: Test complete user workflows

## Running Tests

Add these scripts to your package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

Run tests with:
```bash
npm run test
```

Get test coverage with:
```bash
npm run test:coverage
```

## Test File Naming Conventions

- Unit tests: `ComponentName.test.tsx`
- Integration tests: Can be in the same files as unit tests
- End-to-end tests: `WorkflowName.test.tsx`

## Writing Tests

### Unit Test Example

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Integration Test Example

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import ParentComponent from './ParentComponent';

describe('ParentComponent with children', () => {
  it('updates child components when parent state changes', () => {
    render(<ParentComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

## Best Practices

1. Test behavior, not implementation
2. Use `data-testid` sparingly; prefer accessible queries
3. Mock external dependencies
4. Keep tests simple and focused
5. Test error states and edge cases
