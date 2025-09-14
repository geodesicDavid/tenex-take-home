import "@testing-library/jest-dom";
import React from 'react';

// Mock react-markdown
jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: string }) => {
      return React.createElement('div', {}, children);
    }
  };
});
