import '@testing-library/jest-dom';

// Jest in this workspace may use a Node environment that lacks TextEncoder/TextDecoder.
// Provide the browser-like globals required by react-router v7 during tests.
import { TextEncoder, TextDecoder } from 'util';

if (typeof (globalThis as any).TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = TextEncoder;
}

if (typeof (globalThis as any).TextDecoder === 'undefined') {
  (globalThis as any).TextDecoder = TextDecoder;
}
