
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers);

// Add explicit type augmentation for jest-dom matchers
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toBeVisible(): void;
      toBeEnabled(): void;
      toBeDisabled(): void;
      toHaveTextContent(text: string): void;
      toHaveClass(className: string): void;
      toHaveAttribute(attr: string, value?: string): void;
    }
  }
}

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});
