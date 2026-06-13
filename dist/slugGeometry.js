"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugGeometryComponent = exports.slugGeometry = void 0;
const React = __importStar(require("react"));
const three_slug_1 = require("three-slug");
exports.slugGeometry = React.forwardRef(({ text, slugData, args }, ref) => {
    // Determine the max glyph count. When not provided, the max glyph count shall be the length of "text".
    const maxGlyphs = args && args[0] !== undefined ? args[0] : text.length;
    // Create the geometry instance. Recreate only if maxGlyphs changes.
    const geometry = React.useMemo(() => new three_slug_1.SlugGeometry(maxGlyphs), [maxGlyphs]);
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
            }
            else {
                ref.current = geometry;
            }
        }
        return () => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(null);
                }
                else {
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
});
// Export PascalCase alias for JSX standard compatibility
exports.SlugGeometryComponent = exports.slugGeometry;
