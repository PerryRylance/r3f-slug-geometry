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
exports.SlugText = exports.SlugGeometryComponent = exports.slugGeometry = exports.SlugGeometry = void 0;
exports.useSlugLoader = useSlugLoader;
/// <reference path="../three-slug.d.ts" />
const React = __importStar(require("react"));
const fiber_1 = require("@react-three/fiber");
const three_slug_1 = require("three-slug");
const suspend_react_1 = require("suspend-react");
// Intercept properties on SlugGeometry.prototype so that R3F property assignments trigger updates automatically.
const proto = three_slug_1.SlugGeometry.prototype;
const defineReactiveProperty = (propName, defaultValue) => {
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
(0, fiber_1.extend)({ SlugGeometry: three_slug_1.SlugGeometry });
exports.SlugGeometry = React.forwardRef(({ text, slugData, args, fontScale, lineHeight, startX, startY, justify, ...props }, ref) => {
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
});
// Keep existing exports for backwards compatibility
exports.slugGeometry = exports.SlugGeometry;
exports.SlugGeometryComponent = exports.SlugGeometry;
exports.SlugText = React.forwardRef(({ text, slugData, args, fontScale, lineHeight, startX, startY, justify, children, ...meshProps }, ref) => {
    // 1. Ensure exactly one child is passed
    const child = React.Children.only(children);
    // 2. Validate that the single child is a material
    if (!child || typeof child !== 'object') {
        throw new Error('SlugText must have a single react child');
    }
    const childType = child.type;
    const typeName = typeof childType === 'string'
        ? childType
        : (childType && (childType.displayName || childType.name || ''));
    const isMaterial = (typeof childType === 'string' && childType.toLowerCase().endsWith('material')) ||
        (typeof typeName === 'string' && typeName.toLowerCase().includes('material')) ||
        (child.props && child.props.attach === 'material');
    if (!isMaterial) {
        throw new Error('SlugText child must be a material element (e.g., <meshStandardMaterial />)');
    }
    const meshRef = React.useRef(null);
    const materialRef = React.useRef(null);
    // Combine refs for mesh and material
    const combinedMeshRef = React.useCallback((node) => {
        meshRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        }
        else if (ref && typeof ref === 'object') {
            ref.current = node;
        }
    }, [ref]);
    const combinedMaterialRef = React.useCallback((node) => {
        materialRef.current = node;
        const originalRef = child.ref;
        if (typeof originalRef === 'function') {
            originalRef(node);
        }
        else if (originalRef && typeof originalRef === 'object') {
            originalRef.current = node;
        }
    }, [child]);
    // Re-inject slug when refs or data changes
    React.useLayoutEffect(() => {
        if (meshRef.current && materialRef.current && slugData) {
            (0, three_slug_1.injectSlug)(meshRef.current, materialRef.current, slugData);
        }
    }, [slugData, text]);
    const clonedMaterial = React.cloneElement(child, {
        ref: combinedMaterialRef,
    });
    return React.createElement('mesh', {
        ref: combinedMeshRef,
        ...meshProps,
    }, React.createElement('slugGeometry', {
        text,
        slugData,
        args,
        fontScale,
        lineHeight,
        startX,
        startY,
        justify,
    }), clonedMaterial);
});
const loadSlugData = (_namespace, url) => {
    return new Promise((resolve, reject) => {
        const loader = new three_slug_1.SlugLoader();
        loader.load(url, (data) => resolve(data), undefined, (error) => reject(error));
    });
};
function useSlugLoader(input) {
    if (Array.isArray(input)) {
        const results = input.map((url) => (0, suspend_react_1.suspend)(loadSlugData, ['useSlugLoader', url]));
        return results;
    }
    return (0, suspend_react_1.suspend)(loadSlugData, ['useSlugLoader', input]);
}
useSlugLoader.preload = (input) => {
    if (Array.isArray(input)) {
        input.forEach((url) => (0, suspend_react_1.preload)(loadSlugData, ['useSlugLoader', url]));
    }
    else {
        (0, suspend_react_1.preload)(loadSlugData, ['useSlugLoader', input]);
    }
};
useSlugLoader.clear = (input) => {
    if (Array.isArray(input)) {
        input.forEach((url) => (0, suspend_react_1.clear)(['useSlugLoader', url]));
    }
    else {
        (0, suspend_react_1.clear)(['useSlugLoader', input]);
    }
};
