/// <reference path="../three-slug.d.ts" />
import * as React from 'react';
import * as THREE from 'three';
import { extend, type Node, type MeshProps } from '@react-three/fiber';
import { SlugGeometry as ThreeSlugGeometry, GeneratedSlugData, injectSlug } from 'three-slug';

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

export interface SlugTextProps extends Omit<MeshProps, 'children' | 'args'> {
  text: string;
  slugData: any;
  args?: [number] | number[];
  fontScale?: number;
  lineHeight?: number;
  startX?: number;
  startY?: number;
  justify?: 'left' | 'center' | 'right';
  children: React.ReactElement;
}

export const SlugText = React.forwardRef<THREE.Mesh, SlugTextProps>(
  (
    {
      text,
      slugData,
      args,
      fontScale,
      lineHeight,
      startX,
      startY,
      justify,
      children,
      ...meshProps
    },
    ref
  ) => {
    // 1. Ensure exactly one child is passed
    const child = React.Children.only(children);

    // 2. Validate that the single child is a material
    if (!child || typeof child !== 'object') {
      throw new Error('SlugText must have a single react child');
    }
    const childType = child.type;
    const typeName = typeof childType === 'string'
      ? childType
      : (childType && ((childType as any).displayName || (childType as any).name || ''));

    const isMaterial = (typeof childType === 'string' && childType.toLowerCase().endsWith('material')) ||
                       (typeof typeName === 'string' && typeName.toLowerCase().includes('material')) ||
                       (child.props && child.props.attach === 'material');

    if (!isMaterial) {
      throw new Error('SlugText child must be a material element (e.g., <meshStandardMaterial />)');
    }

    const meshRef = React.useRef<any>(null);
    const materialRef = React.useRef<any>(null);

    // Combine refs for mesh and material
    const combinedMeshRef = React.useCallback((node: any) => {
      meshRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<any>).current = node;
      }
    }, [ref]);

    const combinedMaterialRef = React.useCallback((node: any) => {
      materialRef.current = node;
      const originalRef = (child as any).ref;
      if (typeof originalRef === 'function') {
        originalRef(node);
      } else if (originalRef && typeof originalRef === 'object') {
        originalRef.current = node;
      }
    }, [child]);

    // Re-inject slug when refs or data changes
    React.useLayoutEffect(() => {
      if (meshRef.current && materialRef.current && slugData) {
        injectSlug(meshRef.current, materialRef.current, slugData);
      }
    }, [slugData, text]);

    const clonedMaterial = React.cloneElement(child, {
      ref: combinedMaterialRef,
    });

    return React.createElement(
      'mesh',
      {
        ref: combinedMeshRef,
        ...meshProps,
      },
      React.createElement('slugGeometry', {
        text,
        slugData,
        args,
        fontScale,
        lineHeight,
        startX,
        startY,
        justify,
      }),
      clonedMaterial
    );
  }
);
