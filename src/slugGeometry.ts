import * as React from 'react';
import { SlugGeometry, GeneratedSlugData } from 'three-slug';

export interface SlugGeometryProps {
  text: string;
  slugData: GeneratedSlugData;
  args?: [number] | number[];
}

export const slugGeometry = React.forwardRef<SlugGeometry, SlugGeometryProps>(
  ({ text, slugData, args }, ref) => {
    // Determine the max glyph count. When not provided, the max glyph count shall be the length of "text".
    const maxGlyphs = args && args[0] !== undefined ? args[0] : text.length;

    // Create the geometry instance. Recreate only if maxGlyphs changes.
    const geometry = React.useMemo(() => new SlugGeometry(maxGlyphs), [maxGlyphs]);

    // Update text whenever text or slugData changes.
    React.useLayoutEffect(() => {
      geometry.clear();
      geometry.addText(text, slugData);
    }, [geometry, text, slugData]);

    // Handle ref forwarding and disposal.
    React.useLayoutEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(geometry);
        } else {
          ref.current = geometry;
        }
      }
      return () => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(null);
          } else {
            ref.current = null;
          }
        }
        geometry.dispose();
      };
    }, [ref, geometry]);

    return React.createElement('primitive', {
      object: geometry,
      attach: 'geometry',
    });
  }
);

// Export PascalCase alias for JSX standard compatibility
export const SlugGeometryComponent = slugGeometry;
