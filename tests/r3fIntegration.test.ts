import { expect, test, jest } from '@jest/globals';
import * as React from 'react';

// Setup basic global mocks for a headless Node test environment
if (typeof global.window === 'undefined') {
  (global as any).window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout,
    clearTimeout,
  };
}
if (typeof global.requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
}
if (typeof global.cancelAnimationFrame === 'undefined') {
  (global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}
if (typeof global.document === 'undefined') {
  (global as any).document = {
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: () => ({
      style: {},
      getContext: () => ({}),
    }),
  };
}

// Mock Three.js WebGLRenderer to prevent crashing in a headless Node environment
jest.mock('three', () => {
  const actualThree = jest.requireActual('three') as any;
  return {
    ...actualThree,
    WebGLRenderer: class {
      constructor() {}
      setSize() {}
      setPixelRatio() {}
      render() {}
      dispose() {}
      forceContextLoss() {}
      domElement = {
        addEventListener: () => {},
        removeEventListener: () => {},
        style: {},
      };
    }
  };
});

// Mock three-slug so that the geometry logic is isolated and has mock implementations
jest.mock('three-slug', () => {
  return {
    SlugGeometry: class {
      maxGlyphs: number;
      constructor(maxGlyphs: number) {
        this.maxGlyphs = maxGlyphs;
      }
      clear = jest.fn();
      addText = jest.fn();
      dispose = jest.fn();
    }
  };
});

import { extend, createRoot } from '@react-three/fiber';
import * as THREE from 'three';
import '../src/slugGeometry'; // Ensure extend is called side-effectfully

// Register standard Three.js classes with R3F for manually created roots
extend(THREE);

test('rendering slugGeometry in R3F root does not crash', async () => {
  const canvas = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }),
    style: {},
    getContext: () => ({}), // Return a mock context to prevent WebGL/2D context errors
  } as any;

  const root = createRoot(canvas);

  // Render the native camelCase element inside standard R3F mesh element
  root.render(
    React.createElement('mesh', null,
      React.createElement('slugGeometry', { text: 'hello', slugData: { codePoints: new Map() } as any })
    )
  );

  // Let the fiber reconciler process a tick
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Verify no crashes and unmount cleanly
  root.unmount();
});
