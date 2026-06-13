import { expect, test, jest } from '@jest/globals';

jest.mock('three-slug', () => {
  return {
    SlugGeometry: class {
      maxGlyphs: number;
      constructor(maxGlyphs: number) {
        this.maxGlyphs = maxGlyphs;
      }
      clear() {}
      addText() {}
      dispose() {}
    },
    SlugLoader: class {
      load(url: string, onLoad: any, onProgress: any, onError: any) {
        onLoad('mocked-slug-data');
      }
    }
  };
});

jest.mock('suspend-react', () => {
  return {
    suspend: jest.fn((fn: any, keys: any) => {
      if (typeof fn === 'function') {
        fn(...keys);
      }
      return 'mocked-data';
    }),
    preload: jest.fn((fn: any, keys: any) => {
      if (typeof fn === 'function') {
        fn(...keys);
      }
    }),
    clear: jest.fn(),
  };
});

import { SlugGeometry, slugGeometry, SlugGeometryComponent, useSlugLoader } from '../src/slugGeometry';
import { suspend, preload, clear } from 'suspend-react';

test('slugGeometry component is defined and is a forwardRef component', () => {
  expect(SlugGeometry).toBeDefined();
  expect(slugGeometry).toBeDefined();
  expect(SlugGeometryComponent).toBeDefined();
  expect(slugGeometry).toBe(SlugGeometryComponent);
  expect(SlugGeometry).toBe(SlugGeometryComponent);
  expect(SlugGeometry.$$typeof).toBe(Symbol.for('react.forward_ref'));
});

test('useSlugLoader hook loads a single url', () => {
  const result = useSlugLoader('DejaVuSansMono.sluggish');
  expect(result).toBe('mocked-data');
  expect(suspend).toHaveBeenCalledWith(expect.any(Function), ['useSlugLoader', 'DejaVuSansMono.sluggish']);
});

test('useSlugLoader hook loads multiple urls', () => {
  const result = useSlugLoader(['font1.sluggish', 'font2.sluggish']);
  expect(result).toEqual(['mocked-data', 'mocked-data']);
  expect(suspend).toHaveBeenCalledWith(expect.any(Function), ['useSlugLoader', 'font1.sluggish']);
  expect(suspend).toHaveBeenCalledWith(expect.any(Function), ['useSlugLoader', 'font2.sluggish']);
});

test('useSlugLoader.preload utility preloads single and multiple urls', () => {
  useSlugLoader.preload('font1.sluggish');
  expect(preload).toHaveBeenCalledWith(expect.any(Function), ['useSlugLoader', 'font1.sluggish']);

  useSlugLoader.preload(['font1.sluggish', 'font2.sluggish']);
  expect(preload).toHaveBeenCalledWith(expect.any(Function), ['useSlugLoader', 'font2.sluggish']);
});

test('useSlugLoader.clear utility clears single and multiple urls', () => {
  useSlugLoader.clear('font1.sluggish');
  expect(clear).toHaveBeenCalledWith(['useSlugLoader', 'font1.sluggish']);

  useSlugLoader.clear(['font1.sluggish', 'font2.sluggish']);
  expect(clear).toHaveBeenCalledWith(['useSlugLoader', 'font2.sluggish']);
});
