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

import { slugGeometry, SlugGeometryComponent } from '../src/slugGeometry';

test('slugGeometry component is defined and is a forwardRef component', () => {
  expect(slugGeometry).toBeDefined();
  expect(SlugGeometryComponent).toBeDefined();
  expect(slugGeometry).toBe(SlugGeometryComponent);
  expect(slugGeometry.$$typeof).toBe(Symbol.for('react.forward_ref'));
});
