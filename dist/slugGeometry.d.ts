import * as React from 'react';
import * as THREE from 'three';
import { type Node, type MeshProps } from '@react-three/fiber';
import { SlugGeometry as ThreeSlugGeometry, GeneratedSlugData } from 'three-slug';
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
export declare const SlugText: React.ForwardRefExoticComponent<Omit<SlugTextProps, "ref"> & React.RefAttributes<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material<THREE.MaterialEventMap> | THREE.Material<THREE.MaterialEventMap>[], THREE.Object3DEventMap>>>;
