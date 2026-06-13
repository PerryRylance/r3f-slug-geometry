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
exports.SlugGeometryComponent = exports.slugGeometry = exports.SlugGeometry = void 0;
const React = __importStar(require("react"));
const fiber_1 = require("@react-three/fiber");
const three_slug_1 = require("three-slug");
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
