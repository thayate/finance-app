import '@testing-library/jest-dom';

// Polyfill ResizeObserver for Recharts ResponsiveContainer in Jest/JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
