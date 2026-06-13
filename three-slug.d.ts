declare module 'three-slug' {
  import * as THREE from 'three';

  export interface CodePointData {
    codePoint: number;
    width: number;
    height: number;
    advanceWidth: number;
    bearingX: number;
    bearingY: number;
    bandCount: number;
    bandDimX: number;
    bandDimY: number;
    bandsTexCoordX: number;
    bandsTexCoordY: number;
  }

  export interface GeneratedSlugData {
    codePoints: Map<number, CodePointData>;
    curvesTex: THREE.DataTexture;
    bandsTex: THREE.DataTexture;
    ascender: number;
    descender: number;
    lineGap: number;
    unitsPerEm: number;
    _raw: {
      codePoints: CodePointData[];
      curvesList: number[];
      bandOffsets: number[];
      curveOffsets: number[];
      metrics: {
        ascender: number;
        descender: number;
        lineGap: number;
        unitsPerEm: number;
      };
    };
    _depthMaterial?: THREE.MeshDepthMaterial;
    _distanceMaterial?: THREE.MeshDistanceMaterial;
  }

  export interface SlugGeneratorParameters {
    fullRange?: boolean;
    whitelist?: number[] | null;
  }

  export class SlugGenerator {
    bandCount: number;
    fullRange: boolean;
    whitelist: number[] | null;

    constructor(parameters?: SlugGeneratorParameters);

    generateFromUrl(url: string): Promise<GeneratedSlugData>;
    generateFromFile(file: File): Promise<GeneratedSlugData>;
    generateFromBuffer(buffer: ArrayBuffer): Promise<GeneratedSlugData>;
    generate(font: any): GeneratedSlugData;
    buildOutput(
      codePoints: CodePointData[],
      curvesList: number[],
      bandOffsets: number[],
      curveOffsets: number[],
      font: any
    ): GeneratedSlugData;
    exportSluggish(generatedData: GeneratedSlugData): ArrayBuffer;
  }

  export interface SlugGeometryAddTextOptions {
    fontScale?: number;
    lineHeight?: number;
    startX?: number;
    startY?: number;
    justify?: 'left' | 'center' | 'right';
  }

  export class SlugGeometry extends THREE.InstancedBufferGeometry {
    maxGlyphs: number;
    glyphCount: number;
    aScaleBias: Float32Array;
    aGlyphBandScale: Float32Array;
    aBandMaxTexCoords: Float32Array;
    instanceCount: number;
    boundingBox: THREE.Box3;
    boundingSphere: THREE.Sphere;

    constructor(maxGlyphs?: number);

    clear(): void;
    computeBoundingSphere(): void;
    addGlyph(
      codePointData: CodePointData,
      x: number,
      y: number,
      width: number,
      height: number,
      displayWidth: number,
      displayHeight: number
    ): boolean;
    updateBuffers(): void;
    addText(
      text: string,
      slugData: GeneratedSlugData,
      options?: SlugGeometryAddTextOptions
    ): void;
  }

  export class SlugLoader {
    manager: THREE.LoadingManager;

    constructor(manager?: THREE.LoadingManager);

    load(
      url: string,
      onLoad: (data: GeneratedSlugData) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (err: any) => void
    ): void;
    parse(buffer: ArrayBuffer): GeneratedSlugData;
  }

  export function injectSlug(mesh: THREE.Mesh, material: THREE.Material, slugData: GeneratedSlugData): void;
  export function injectSlug(material: THREE.Material, slugData: GeneratedSlugData): void;

  export interface SlugMaterialParameters extends THREE.ShaderMaterialParameters {
    curvesTex?: THREE.Texture | null;
    bandsTex?: THREE.Texture | null;
  }

  export class SlugMaterial extends THREE.RawShaderMaterial {
    constructor(parameters?: SlugMaterialParameters);
  }
}

