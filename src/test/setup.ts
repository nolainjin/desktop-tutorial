import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'fake-indexeddb/auto';

// Jest-DOM matchers 확장
expect.extend(matchers);

// 각 테스트 후 cleanup 실행
afterEach(() => {
  cleanup();
});

// Global mocks
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Fetch mock (API 테스트용)
global.fetch = vi.fn();
