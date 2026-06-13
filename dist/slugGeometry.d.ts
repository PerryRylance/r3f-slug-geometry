import * as React from 'react';
import { SlugGeometry, GeneratedSlugData } from 'three-slug';
export interface SlugGeometryProps {
    text: string;
    slugData: GeneratedSlugData;
    args?: [number] | number[];
}
export declare const slugGeometry: React.ForwardRefExoticComponent<SlugGeometryProps & React.RefAttributes<SlugGeometry>>;
export declare const SlugGeometryComponent: React.ForwardRefExoticComponent<SlugGeometryProps & React.RefAttributes<SlugGeometry>>;
