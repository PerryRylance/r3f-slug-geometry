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
  const THREE = require('three');
  return {
    SlugGeometry: class extends THREE.InstancedBufferGeometry {
      maxGlyphs: number;
      boundingBox: any;
      boundingSphere: any;
      constructor(maxGlyphs: number) {
        super();
        this.maxGlyphs = maxGlyphs;
        this.boundingBox = new THREE.Box3();
        this.boundingSphere = new THREE.Sphere();

        // Setup same position attribute as real SlugGeometry to simulate the bug
        const vertices = new Float32Array([
          -1.0, -1.0,
          -1.0,  1.0,
           1.0,  1.0,
           1.0, -1.0
        ]);
        (this as any).setAttribute('position', new THREE.BufferAttribute(vertices, 2));
      }
      clear = jest.fn(() => {
        this.boundingBox.makeEmpty();
      });
      addText = jest.fn((text: string, slugData: any, options?: any) => {
        this.boundingBox.min.set(0, -10, 0);
        this.boundingBox.max.set(50, 10, 0);
      });
      dispose = jest.fn();
    },
    injectSlug: jest.fn()
  };
});

import { extend, createRoot } from '@react-three/fiber';
import * as THREE from 'three';
import { SlugText } from '../src/slugGeometry'; // Ensure extend is called side-effectfully

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

test('rendering SlugText component in R3F root does not crash', async () => {
  const canvas = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }),
    style: {},
    getContext: () => ({}),
  } as any;

  const root = createRoot(canvas);

  root.render(
    React.createElement(
      SlugText,
      {
        text: 'hello',
        slugData: { codePoints: new Map() } as any,
        name: 'test-mesh',
        children: React.createElement('meshStandardMaterial', { color: 'red' })
      }
    )
  );

  await new Promise((resolve) => setTimeout(resolve, 0));
  root.unmount();
});

test('SlugText throws error when it has multiple children or no children', () => {
  expect(() => {
    (SlugText as any).render({
      text: 'hello',
      slugData: {},
      children: [
        React.createElement('meshStandardMaterial'),
        React.createElement('meshStandardMaterial')
      ]
    }, null);
  }).toThrow(/React\.Children\.only/);

  expect(() => {
    (SlugText as any).render({
      text: 'hello',
      slugData: {},
      children: null
    }, null);
  }).toThrow(/React\.Children\.only/);
});

test('SlugText throws error when child is not a material', () => {
  expect(() => {
    (SlugText as any).render({
      text: 'hello',
      slugData: {},
      children: React.createElement('div')
    }, null);
  }).toThrow(/SlugText child must be a material element/);
});

test('attaching a ref to SlugText, rendering, and computing bounding box', async () => {
  const canvas = {
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100 }),
    style: {},
    getContext: () => ({}),
  } as any;

  const root = createRoot(canvas);
  const ref = React.createRef<THREE.Mesh>();

  root.render(
    React.createElement(
      SlugText,
      {
        ref,
        text: 'hello',
        slugData: { codePoints: new Map() } as any,
        name: 'test-mesh',
        children: React.createElement('meshStandardMaterial', { color: 'red' })
      }
    )
  );

  // Let the fiber reconciler process a tick
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Verify the ref is attached
  expect(ref.current).toBeInstanceOf(THREE.Mesh);

  const mesh = ref.current!;
  const geometry = mesh.geometry as any;

  // Verify the bounding box has been populated
  expect(geometry.boundingBox).toBeDefined();
  expect(geometry.boundingBox.min.x).toBe(0);
  expect(geometry.boundingBox.max.x).toBe(50);

  // When we compute the bounding box, it should NOT reset to -1 / +1
  geometry.computeBoundingBox();

  expect(geometry.boundingBox.min.x).toBe(0);
  expect(geometry.boundingBox.max.x).toBe(50);

  root.unmount();
});
