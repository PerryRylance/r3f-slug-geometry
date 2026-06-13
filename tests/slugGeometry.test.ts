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
    }
  };
});

import { SlugGeometry, slugGeometry, SlugGeometryComponent } from '../src/slugGeometry';

test('slugGeometry component is defined and is a forwardRef component', () => {
  expect(SlugGeometry).toBeDefined();
  expect(slugGeometry).toBeDefined();
  expect(SlugGeometryComponent).toBeDefined();
  expect(slugGeometry).toBe(SlugGeometryComponent);
  expect(SlugGeometry).toBe(SlugGeometryComponent);
  expect(SlugGeometry.$$typeof).toBe(Symbol.for('react.forward_ref'));
});
