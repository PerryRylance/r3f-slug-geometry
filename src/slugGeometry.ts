/// <reference path="../three-slug.d.ts" />
import * as React from 'react';
import { extend, type Node } from '@react-three/fiber';
import { SlugGeometry as ThreeSlugGeometry, GeneratedSlugData } from 'three-slug';

// Augment the React Three Fiber JSX namespace with the custom elements and their specific props
declare module '@react-three/fiber' {
  interface ThreeElements {
    slugGeometry: Node<ThreeSlugGeometry, typeof ThreeSlugGeometry> & {
      text?: string;
      slugData?: any;
      fontScale?: number;
      lineHeight?: number;
      startX?: number;
      startY?: number;
      justify?: 'left' | 'center' | 'right';
    };
  }
}

// Intercept properties on SlugGeometry.prototype so that R3F property assignments trigger updates automatically.
const proto = ThreeSlugGeometry.prototype;

const defineReactiveProperty = (propName: string, defaultValue?: any) => {
  const privatePropName = `_${propName}`;
  Object.defineProperty(proto, propName, {
    get() {
      return this[privatePropName] !== undefined ? this[privatePropName] : defaultValue;
    },
    set(val) {
      if (this[privatePropName] !== val) {
        this[privatePropName] = val;
        if (this.clear && this.addText) {
          this.clear();
          if (this._text !== undefined && this._slugData !== undefined) {
            this.addText(this._text, this._slugData, {
              fontScale: this._fontScale,
              lineHeight: this._lineHeight,
              startX: this._startX,
              startY: this._startY,
              justify: this._justify
            });
          }
        }
      }
    },
    configurable: true,
    enumerable: true,
  });
};

defineReactiveProperty('text');
defineReactiveProperty('slugData');
defineReactiveProperty('fontScale');
defineReactiveProperty('lineHeight');
defineReactiveProperty('startX');
defineReactiveProperty('startY');
defineReactiveProperty('justify');

// Register the SlugGeometry with R3F so it can be used natively as <slugGeometry /> in camelCase
extend({ SlugGeometry: ThreeSlugGeometry });

export interface SlugGeometryProps {
  text: string;
  slugData: GeneratedSlugData;
  args?: [number] | number[];
  fontScale?: number;
  lineHeight?: number;
  startX?: number;
  startY?: number;
  justify?: 'left' | 'center' | 'right';
}

export const SlugGeometry = React.forwardRef<ThreeSlugGeometry, SlugGeometryProps>(
  ({ text, slugData, args, fontScale, lineHeight, startX, startY, justify, ...props }, ref) => {
    return React.createElement('slugGeometry', {
      ref,
      args,
      text,
      slugData,
      fontScale,
      lineHeight,
      startX,
      startY,
      justify,
      ...props
    });
  }
);

// Keep existing exports for backwards compatibility
export const slugGeometry = SlugGeometry;
export const SlugGeometryComponent = SlugGeometry;
