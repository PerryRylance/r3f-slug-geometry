import * as React from 'react';
import { type Node } from '@react-three/fiber';
import { SlugGeometry as ThreeSlugGeometry, GeneratedSlugData } from 'three-slug';
declare module 'three-slug' {
    interface SlugGeometry {
        text?: string;
        slugData?: GeneratedSlugData;
        fontScale?: number;
        lineHeight?: number;
        startX?: number;
        startY?: number;
        justify?: 'left' | 'center' | 'right';
    }
}
declare module '@react-three/fiber' {
    interface ThreeElements {
        slugGeometry: Node<ThreeSlugGeometry, typeof ThreeSlugGeometry>;
    }
}
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
export declare const SlugGeometry: React.ForwardRefExoticComponent<SlugGeometryProps & React.RefAttributes<ThreeSlugGeometry>>;
export declare const slugGeometry: React.ForwardRefExoticComponent<SlugGeometryProps & React.RefAttributes<ThreeSlugGeometry>>;
export declare const SlugGeometryComponent: React.ForwardRefExoticComponent<SlugGeometryProps & React.RefAttributes<ThreeSlugGeometry>>;
