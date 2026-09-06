"use client";

import {
  Component,
  Fragment,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, createPortal, useThree, type RootState, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  FrontSide,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Plane,
  SRGBColorSpace,
  type Side,
  Vector3,
  type WebGLProgramParametersWithUniforms,
} from "three";
import type { Hotspot, Organ, TissueKind } from "../lib/anatomy";
import { describeStructure, structureGroupKey, type StructureInfo } from "../lib/structures";

export type SectionAxis = "x" | "y" | "z";
export type MaterialMode = "realistic" | "schematic";

export type AnatomyViewerProps = {
  organ: Organ;
  nextModel?: string;
  autoRotate: boolean;
  showLabels: boolean;
  sectionMode: boolean;
  sectionAxis: SectionAxis;
  sectionDepth: number;
  explode: number;
  materialMode: MaterialMode;
  selectedStructure: string | null;
  hiddenStructures: string[];
  onSelectStructure: (name: string | null) => void;
  onSelectHotspot: (id: string) => void;
  onStructuresLoaded: (names: string[]) => void;
  resetSignal: number;
  captureRef: MutableRefObject<(() => string | null) | null>;
  loadingLabel: string;
  errorLabel: string;
  webglFallbackLabel: string;
  contextLostTitle: string;
  contextLostDetail: string;
  contextLostAction: string;
};

type GltfOrgan = Organ & { model: string };

type RenderModelProps = Omit<
  AnatomyViewerProps,
  "autoRotate" | "resetSignal" | "loadingLabel" | "errorLabel" | "webglFallbackLabel" | "nextModel" | "captureRef"
  | "contextLostTitle" | "contextLostDetail" | "contextLostAction"
> & { plainMaterials: boolean };

class ModelErrorBoundary extends Component<{ model: string; label: string; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to render anatomy model", error, info.componentStack);
  }

  componentDidUpdate(previous: { model: string }) {
    if (previous.model !== this.props.model && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="viewer-error" role="alert">{this.props.label}</div>
        </Html>
      );
    }
    return this.props.children;
  }
}

/* --------------------------------------------------------------------------
   Realistic tissue materials
   -------------------------------------------------------------------------- */

type TissuePreset = {
  color: string;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  sheen: number;
  sheenColor: string;
  sheenRoughness: number;
  /** Frequency of the procedural surface detail in world units. */
  scale: number;
  /** Strength of the procedural bump. */
  bump: number;
  /** Roughness variation across the surface. */
  roughVar: number;
  /** Colour mottling across the surface. */
  tint: number;
  opacity?: number;
  envMapIntensity: number;
};

const tissuePresets: Record<TissueKind | "ligament" | "fluid" | "artery" | "vein", TissuePreset> = {
  muscle: { color: "#a03b38", roughness: 0.52, clearcoat: 0.42, clearcoatRoughness: 0.34, sheen: 0.45, sheenColor: "#ff9a8a", sheenRoughness: 0.6, scale: 9, bump: 0.55, roughVar: 0.22, tint: 0.16, envMapIntensity: 1.05 },
  neural: { color: "#d7b2a5", roughness: 0.58, clearcoat: 0.32, clearcoatRoughness: 0.4, sheen: 0.35, sheenColor: "#ffd9cf", sheenRoughness: 0.7, scale: 7, bump: 0.4, roughVar: 0.18, tint: 0.12, envMapIntensity: 0.95 },
  lung: { color: "#d68f8b", roughness: 0.66, clearcoat: 0.22, clearcoatRoughness: 0.5, sheen: 0.55, sheenColor: "#ffc4bd", sheenRoughness: 0.75, scale: 12, bump: 0.62, roughVar: 0.28, tint: 0.2, envMapIntensity: 0.9 },
  liver: { color: "#72302b", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: "#e58c78", sheenRoughness: 0.55, scale: 8, bump: 0.35, roughVar: 0.16, tint: 0.14, envMapIntensity: 1.1 },
  gland: { color: "#d9ab72", roughness: 0.6, clearcoat: 0.28, clearcoatRoughness: 0.45, sheen: 0.4, sheenColor: "#ffe2b8", sheenRoughness: 0.7, scale: 14, bump: 0.7, roughVar: 0.25, tint: 0.18, envMapIntensity: 0.9 },
  mucosa: { color: "#d68c82", roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.32, sheen: 0.4, sheenColor: "#ffc7bd", sheenRoughness: 0.6, scale: 10, bump: 0.45, roughVar: 0.2, tint: 0.14, envMapIntensity: 1.05 },
  kidney: { color: "#8f3d39", roughness: 0.48, clearcoat: 0.4, clearcoatRoughness: 0.34, sheen: 0.35, sheenColor: "#f09c8c", sheenRoughness: 0.6, scale: 9, bump: 0.4, roughVar: 0.18, tint: 0.14, envMapIntensity: 1.05 },
  vessel: { color: "#b0302f", roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.36, sheen: 0.3, sheenColor: "#ff9d92", sheenRoughness: 0.6, scale: 16, bump: 0.3, roughVar: 0.14, tint: 0.1, envMapIntensity: 1.05 },
  artery: { color: "#b8302c", roughness: 0.45, clearcoat: 0.42, clearcoatRoughness: 0.36, sheen: 0.3, sheenColor: "#ff9d92", sheenRoughness: 0.6, scale: 16, bump: 0.3, roughVar: 0.14, tint: 0.1, envMapIntensity: 1.05 },
  vein: { color: "#4b5b9d", roughness: 0.48, clearcoat: 0.38, clearcoatRoughness: 0.4, sheen: 0.3, sheenColor: "#9fb0ff", sheenRoughness: 0.65, scale: 16, bump: 0.3, roughVar: 0.14, tint: 0.1, envMapIntensity: 1 },
  bone: { color: "#e7ddc4", roughness: 0.74, clearcoat: 0.04, clearcoatRoughness: 0.8, sheen: 0.12, sheenColor: "#fff6e6", sheenRoughness: 0.9, scale: 18, bump: 0.5, roughVar: 0.3, tint: 0.12, envMapIntensity: 0.8 },
  cartilage: { color: "#dfe7e4", roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.45, sheen: 0.25, sheenColor: "#ffffff", sheenRoughness: 0.7, scale: 14, bump: 0.25, roughVar: 0.15, tint: 0.06, envMapIntensity: 0.95 },
  eye: { color: "#efeae1", roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.2, sheen: 0.2, sheenColor: "#ffffff", sheenRoughness: 0.5, scale: 20, bump: 0.12, roughVar: 0.1, tint: 0.05, envMapIntensity: 1.15 },
  lymphoid: { color: "#b6838a", roughness: 0.58, clearcoat: 0.3, clearcoatRoughness: 0.45, sheen: 0.4, sheenColor: "#f0bfc4", sheenRoughness: 0.7, scale: 12, bump: 0.5, roughVar: 0.22, tint: 0.16, envMapIntensity: 0.95 },
  ligament: { color: "#e5d8c8", roughness: 0.6, clearcoat: 0.15, clearcoatRoughness: 0.6, sheen: 0.3, sheenColor: "#fff3e6", sheenRoughness: 0.8, scale: 22, bump: 0.35, roughVar: 0.2, tint: 0.08, envMapIntensity: 0.9 },
  fluid: { color: "#b9d9ea", roughness: 0.12, clearcoat: 0.6, clearcoatRoughness: 0.1, sheen: 0, sheenColor: "#ffffff", sheenRoughness: 1, scale: 1, bump: 0, roughVar: 0, tint: 0, opacity: 0.42, envMapIntensity: 1.3 },
  skin: { color: "#d8a07e", roughness: 0.58, clearcoat: 0.18, clearcoatRoughness: 0.7, sheen: 0.3, sheenColor: "#ffd4bd", sheenRoughness: 0.8, scale: 10, bump: 0.4, roughVar: 0.2, tint: 0.1, envMapIntensity: 0.85 },
};

/** Name-based refinements applied on top of the tissue preset. */
function refineColour(name: string, info: StructureInfo, organ: Organ, base: string) {
  const lower = name.toLowerCase();
  if (info.tissue === "vessel") {
    return /vein|sinus|vena/.test(lower) ? tissuePresets.vein.color : tissuePresets.artery.color;
  }
  if (organ.id === "eye") {
    if (/retina|macula|fovea|ora_serrata/.test(lower)) return "#c9603a";
    if (/iris/.test(lower)) return "#5d7a63";
    if (/pupil/.test(lower)) return "#0b0b0d";
    if (/choroid/.test(lower)) return "#5a2b24";
    if (/optic_disc/.test(lower)) return "#f0c9a2";
    if (/cornea|lens|humor/.test(lower)) return "#dcecf6";
    if (/ciliary|trabecular|schlemm/.test(lower)) return "#b5716c";
    if (/conjunctiva/.test(lower)) return "#f1c7c1";
  }
  if (organ.id === "kidney") {
    if (/capsule/.test(lower)) return "#a9524b";
    if (/cortex|column/.test(lower)) return "#8d3a36";
    if (/pyramid/.test(lower)) return "#c17a74";
    if (/papilla/.test(lower)) return "#d9a19a";
  }
  if (organ.id === "brain") {
    if (/ventricle|aqueduct|canal/.test(lower)) return tissuePresets.fluid.color;
    if (/white_matter|corpus_callosum|commissure|fornix|tract|radiation|peduncle|capsule/.test(lower)) return "#efe3d8";
    if (/cerebell/.test(lower)) return "#cba397";
    if (/pons|medulla|midbrain|colliculus|tegmentum|pyramidal|olive|nigra|red_nucleus/.test(lower)) return "#c39a8b";
    if (/thalam|caudate|putamen|pallidus|amygdal|hippocamp|accumbens|claustrum|geniculate/.test(lower)) return "#c48f9c";
  }
  if (organ.id === "lymph_node") {
    if (/capsule/.test(lower)) return "#d8c6b0";
    if (/follicle/.test(lower)) return "#c97a86";
    if (/paracortex/.test(lower)) return "#b98493";
    if (/medulla/.test(lower)) return "#a6706f";
  }
  if (organ.id === "prostate" && /vas_deferens|ejaculatory|duct/.test(lower)) return "#c9a7a2";
  if (organ.id === "intervertebral_disk" && /nucleus_pulposus/.test(lower)) return "#c4d4e3";
  if (organ.id === "mouth") {
    if (/teeth/.test(lower)) return "#f4efe3";
    if (/mandible|hard_palate/.test(lower)) return tissuePresets.bone.color;
    if (/tongue|papillae/.test(lower)) return "#c9666a";
  }
  if (organ.id === "lungs" && /cartilage/.test(lower)) return tissuePresets.cartilage.color;
  if (organ.id === "trachea" && /cartilage/.test(lower)) return tissuePresets.cartilage.color;
  if (organ.id === "bronchi" && /cartilage/.test(lower)) return tissuePresets.cartilage.color;
  if (organ.id === "heart" && /valve/.test(lower)) return "#e9d3c6";
  if (organ.id === "heart" && /papillary/.test(lower)) return "#8c2f2d";
  if (organ.id === "liver" && /ligament/.test(lower)) return tissuePresets.ligament.color;
  return base;
}

/** A stable pastel hue for schematic colour-coding of each structure group. */
function schematicColour(name: string) {
  const key = structureGroupKey(name);
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  const hue = (hash % 360) / 360;
  const light = 0.58 + ((hash >> 8) % 20) / 100;
  return new Color().setHSL(hue, 0.55, light);
}

const tissueShader = {
  vertexDeclare: "varying vec3 vTissuePos;",
  vertexBody: "vTissuePos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
  fragmentDeclare: `
    varying vec3 vTissuePos;
    uniform float uTissueScale;
    uniform float uTissueBump;
    uniform float uTissueRough;
    uniform float uTissueTint;
    float tissueHash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float tissueNoise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(tissueHash(i), tissueHash(i + vec3(1, 0, 0)), f.x), mix(tissueHash(i + vec3(0, 1, 0)), tissueHash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(tissueHash(i + vec3(0, 0, 1)), tissueHash(i + vec3(1, 0, 1)), f.x), mix(tissueHash(i + vec3(0, 1, 1)), tissueHash(i + vec3(1, 1, 1)), f.x), f.y),
        f.z);
    }
    float tissueFbm(vec3 p) {
      return 0.55 * tissueNoise(p) + 0.3 * tissueNoise(p * 2.13 + 3.7) + 0.15 * tissueNoise(p * 4.41 + 9.1);
    }
  `,
  colorBody: `
    {
      float mottle = tissueFbm(vTissuePos * uTissueScale * 0.55 + 11.0);
      diffuseColor.rgb *= 1.0 + (mottle - 0.5) * uTissueTint * 2.0;
    }
  `,
  roughnessBody: `
    {
      float rv = tissueFbm(vTissuePos * uTissueScale * 1.7 + 5.0);
      roughnessFactor = clamp(roughnessFactor + (rv - 0.5) * uTissueRough * 2.0, 0.04, 1.0);
    }
  `,
  normalBody: `
    if (uTissueBump > 0.0) {
      vec3 tp = vTissuePos * uTissueScale;
      float e = 0.015;
      vec3 g = vec3(
        tissueFbm(tp + vec3(e, 0.0, 0.0)) - tissueFbm(tp - vec3(e, 0.0, 0.0)),
        tissueFbm(tp + vec3(0.0, e, 0.0)) - tissueFbm(tp - vec3(0.0, e, 0.0)),
        tissueFbm(tp + vec3(0.0, 0.0, e)) - tissueFbm(tp - vec3(0.0, 0.0, e))
      ) / (2.0 * e);
      g -= normal * dot(g, normal);
      normal = normalize(normal - g * uTissueBump * 0.06);
    }
  `,
};

type TissueUniforms = {
  uTissueScale: { value: number };
  uTissueBump: { value: number };
  uTissueRough: { value: number };
  uTissueTint: { value: number };
};

type TissueMaterial = MeshPhysicalMaterial & {
  userData: {
    tissueUniforms: TissueUniforms;
    realistic: { color: Color; preset: TissuePreset };
    schematic: { color: Color };
    baseOpacity: number;
    baseTransparent: boolean;
    baseSide: Side;
  };
};

function installTissueShader(material: MeshPhysicalMaterial, uniforms: TissueUniforms) {
  material.onBeforeCompile = (parameters: WebGLProgramParametersWithUniforms) => {
    Object.assign(parameters.uniforms, uniforms);
    parameters.vertexShader = parameters.vertexShader
      .replace("#include <common>", `#include <common>\n${tissueShader.vertexDeclare}`)
      .replace("#include <worldpos_vertex>", `#include <worldpos_vertex>\n${tissueShader.vertexBody}`);
    parameters.fragmentShader = parameters.fragmentShader
      .replace("#include <common>", `#include <common>\n${tissueShader.fragmentDeclare}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n${tissueShader.colorBody}`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>\n${tissueShader.roughnessBody}`)
      .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>\n${tissueShader.normalBody}`);
  };
  material.customProgramCacheKey = () => "human-atlas-tissue-v1";
}

function buildTissueMaterial(name: string, organ: Organ, source?: Material, plain = false): TissueMaterial {
  const info = describeStructure(name);
  const lower = name.toLowerCase();
  let kind: keyof typeof tissuePresets = info.tissue ?? organ.tissue;
  if (kind === "vessel") kind = /vein|sinus|vena/.test(lower) ? "vein" : "artery";
  const preset = tissuePresets[kind];
  const isTranslucent = kind === "fluid" || (organ.id === "eye" && /cornea|lens|humor/.test(lower));

  const material = new MeshPhysicalMaterial({
    color: new Color(refineColour(name, info, organ, preset.color)),
    roughness: preset.roughness,
    metalness: 0,
    clearcoat: preset.clearcoat,
    clearcoatRoughness: preset.clearcoatRoughness,
    sheen: preset.sheen,
    sheenColor: new Color(preset.sheenColor),
    sheenRoughness: preset.sheenRoughness,
    envMapIntensity: preset.envMapIntensity,
    transparent: isTranslucent,
    opacity: isTranslucent ? (preset.opacity ?? 0.42) : 1,
    side: FrontSide,
  }) as TissueMaterial;

  if (source?.name) material.name = source.name;
  const uniforms: TissueUniforms = {
    uTissueScale: { value: preset.scale },
    uTissueBump: { value: preset.bump },
    uTissueRough: { value: preset.roughVar },
    uTissueTint: { value: preset.tint },
  };
  // Devices whose GPU rejects the injected shader (reported through
  // renderer.debug.onShaderError) fall back to the stock physical material so
  // the stage never goes blank; only the procedural surface detail is lost.
  if (!plain) installTissueShader(material, uniforms);
  material.userData = {
    tissueUniforms: uniforms,
    realistic: { color: material.color.clone(), preset },
    schematic: { color: schematicColour(name) },
    baseOpacity: material.opacity,
    baseTransparent: material.transparent,
    baseSide: material.side,
  };
  source?.dispose();
  return material;
}

type PreparedMesh = {
  mesh: Mesh;
  name: string;
  basePosition: Vector3;
  explodeDirection: Vector3;
  localCenter: Vector3;
};

type PreparedScene = {
  scene: Object3D;
  meshes: PreparedMesh[];
  scale: number;
  position: Vector3;
  largestDimension: number;
};

function prepareScene(source: Object3D, organ: Organ, plainMaterials = false): PreparedScene {
  const scene = source.clone(true);
  const meshes: PreparedMesh[] = [];
  const usedNames = new Map<string, number>();

  scene.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.castShadow = false;
    node.receiveShadow = false;
    let name = node.name || node.parent?.name || "structure";
    const seen = usedNames.get(name) ?? 0;
    usedNames.set(name, seen + 1);
    if (seen > 0) name = `${name}_${seen + 1}`;
    node.name = name;

    const geometry = node.geometry as BufferGeometry;
    if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
    if (!geometry.boundingBox) geometry.computeBoundingBox();

    const sourceMaterial = Array.isArray(node.material) ? node.material[0] : node.material;
    node.material = buildTissueMaterial(name, organ, sourceMaterial, plainMaterials);
    meshes.push({
      mesh: node,
      name,
      basePosition: node.position.clone(),
      explodeDirection: new Vector3(),
      localCenter: geometry.boundingBox?.getCenter(new Vector3()) ?? new Vector3(),
    });
  });

  scene.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(scene);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const largestDimension = Math.max(size.x, size.y, size.z, 0.001);
  const scale = 1.72 / largestDimension;

  meshes.forEach((entry) => {
    const meshBounds = new Box3().setFromObject(entry.mesh);
    const meshCenter = meshBounds.getCenter(new Vector3());
    const direction = meshCenter.clone().sub(center);
    if (direction.lengthSq() < 1e-9) direction.set(0, 1, 0);
    direction.normalize();
    // Express the direction in the mesh's parent space so it can be added to
    // the local position directly. Parents in HRA files carry no rotation, but
    // guard against scale so the offset stays proportional.
    const parentScale = entry.mesh.parent?.getWorldScale(new Vector3()) ?? new Vector3(1, 1, 1);
    entry.explodeDirection.set(direction.x / (parentScale.x || 1), direction.y / (parentScale.y || 1), direction.z / (parentScale.z || 1));
  });

  return {
    scene,
    meshes,
    scale,
    largestDimension,
    position: new Vector3(-center.x * scale, -center.y * scale, -center.z * scale),
  };
}

function sectionPlaneFor(axis: SectionAxis, depth: number) {
  const normal = axis === "x" ? new Vector3(-1, 0, 0) : axis === "y" ? new Vector3(0, -1, 0) : new Vector3(0, 0, -1);
  return new Plane(normal, depth * 1.12);
}

function HotspotButton({ hotspot, index, accent, onSelect }: { hotspot: Hotspot; index: number; accent: string; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      className="viewer-hotspot"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(hotspot.id);
      }}
      style={{ "--hotspot-accent": accent } as React.CSSProperties}
    >
      <span aria-hidden="true">{index + 1}</span>
      <strong>{hotspot.name}</strong>
    </button>
  );
}

function findMesh(meshes: PreparedMesh[], target: string) {
  return meshes.find((entry) => entry.name === target)
    ?? meshes.find((entry) => entry.name.startsWith(target))
    ?? meshes.find((entry) => entry.name.toLowerCase().includes(target.toLowerCase()));
}

function OrganModel({
  organ,
  sectionMode,
  sectionAxis,
  sectionDepth,
  explode,
  materialMode,
  selectedStructure,
  hiddenStructures,
  showLabels,
  onSelectStructure,
  onSelectHotspot,
  onStructuresLoaded,
  plainMaterials,
}: Omit<RenderModelProps, "organ"> & { organ: GltfOrgan }) {
  const gltf = useGLTF(organ.model);
  const invalidate = useThree((state) => state.invalidate);
  const prepared = useMemo(() => prepareScene(gltf.scene, organ, plainMaterials), [gltf.scene, organ, plainMaterials]);
  const clippingPlane = useMemo(() => sectionPlaneFor(sectionAxis, sectionDepth), [sectionAxis, sectionDepth]);

  useEffect(() => {
    onStructuresLoaded(prepared.meshes.map((entry) => entry.name));
  }, [onStructuresLoaded, prepared]);

  useEffect(() => {
    // Materials are created per prepared scene; release them when the organ
    // changes. Geometry is shared with the loader cache and stays alive.
    return () => {
      prepared.meshes.forEach(({ mesh }) => {
        const material = mesh.material as Material | Material[];
        (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose());
      });
    };
  }, [prepared]);

  useEffect(() => {
    const hidden = new Set(hiddenStructures);
    const accent = new Color(organ.accent);
    prepared.meshes.forEach(({ mesh, name }) => {
      mesh.visible = !hidden.has(name);
      const material = mesh.material as TissueMaterial;
      const isSelected = selectedStructure === name;
      const isFaded = Boolean(selectedStructure && !isSelected);
      const data = material.userData;

      const nextPlanes = sectionMode ? [clippingPlane] : [];
      const nextSide = sectionMode ? DoubleSide : data.baseSide;
      // A program rebuild is only needed when clipping or face side changes;
      // colour, roughness, and uniform edits apply without recompiling.
      const needsProgram = (material.clippingPlanes?.length ?? 0) !== nextPlanes.length || material.side !== nextSide;
      material.clippingPlanes = nextPlanes;
      material.clipShadows = false;
      material.side = nextSide;
      material.opacity = isFaded ? Math.min(0.14, data.baseOpacity) : data.baseOpacity;
      material.transparent = isFaded || data.baseTransparent;
      material.depthWrite = !isFaded;

      if (materialMode === "realistic") {
        material.color.copy(data.realistic.color);
        material.clearcoat = data.realistic.preset.clearcoat;
        material.sheen = data.realistic.preset.sheen;
        material.roughness = data.realistic.preset.roughness;
        data.tissueUniforms.uTissueBump.value = data.realistic.preset.bump;
        data.tissueUniforms.uTissueRough.value = data.realistic.preset.roughVar;
        data.tissueUniforms.uTissueTint.value = data.realistic.preset.tint;
      } else {
        material.color.copy(data.schematic.color);
        material.clearcoat = 0.08;
        material.sheen = 0.1;
        material.roughness = 0.55;
        data.tissueUniforms.uTissueBump.value = 0;
        data.tissueUniforms.uTissueRough.value = 0;
        data.tissueUniforms.uTissueTint.value = 0;
      }

      material.emissive.copy(isSelected ? accent.clone().multiplyScalar(0.28) : new Color(0x000000));
      material.emissiveIntensity = isSelected ? 0.9 : 0;
      if (needsProgram) material.needsUpdate = true;
    });
    invalidate();
  }, [clippingPlane, hiddenStructures, invalidate, materialMode, organ.accent, prepared, sectionMode, selectedStructure]);

  useEffect(() => {
    const spread = prepared.largestDimension * 0.42 * explode;
    prepared.meshes.forEach(({ mesh, basePosition, explodeDirection }) => {
      mesh.position.copy(basePosition).addScaledVector(explodeDirection, spread);
    });
    invalidate();
  }, [explode, invalidate, prepared]);

  const handleStructureClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const name = event.object.name || event.object.parent?.name || "structure";
    onSelectStructure(selectedStructure === name ? null : name);
  };

  const anchoredHotspots = useMemo(() => {
    return organ.hotspots.map((hotspot, index) => {
      const target = hotspot.mesh ? findMesh(prepared.meshes, hotspot.mesh) : undefined;
      return { hotspot, index, target };
    });
  }, [organ.hotspots, prepared.meshes]);

  return (
    <group>
      <group position={prepared.position} scale={prepared.scale}>
        <primitive object={prepared.scene} onPointerDown={handleStructureClick} />
      </group>

      {showLabels
        && anchoredHotspots.map(({ hotspot, index, target }) => {
          if (target && !hiddenStructures.includes(target.name)) {
            return (
              <Fragment key={hotspot.id}>
                {createPortal(
                  <Html position={target.localCenter} center zIndexRange={[30 - index, 0]}>
                    <HotspotButton hotspot={hotspot} index={index} accent={organ.accent} onSelect={onSelectHotspot} />
                  </Html>,
                  target.mesh,
                )}
              </Fragment>
            );
          }
          if (hotspot.position) {
            return (
              <Html key={hotspot.id} position={hotspot.position} center zIndexRange={[30 - index, 0]}>
                <HotspotButton hotspot={hotspot} index={index} accent={organ.accent} onSelect={onSelectHotspot} />
              </Html>
            );
          }
          return null;
        })}
    </group>
  );
}

/* --------------------------------------------------------------------------
   Procedural skin cross section
   -------------------------------------------------------------------------- */

const fatLobules = [
  [-0.92, -0.43, 0.74, 0.17],
  [-0.58, -0.48, 0.75, 0.2],
  [-0.2, -0.4, 0.74, 0.18],
  [0.18, -0.48, 0.75, 0.21],
  [0.58, -0.4, 0.74, 0.18],
  [0.92, -0.49, 0.73, 0.2],
] as const;

const skinStructures = [
  "Epidermis",
  "Dermis",
  "Subcutaneous tissue",
  "Adipose lobule",
  "Hair follicle",
  "Hair shaft",
  "Sweat gland",
  "Dermal artery",
  "Dermal vein",
];

function SkinPatchModel({
  organ,
  sectionMode,
  sectionAxis,
  sectionDepth,
  explode,
  selectedStructure,
  hiddenStructures,
  showLabels,
  onSelectStructure,
  onSelectHotspot,
  onStructuresLoaded,
}: RenderModelProps) {
  const clippingPlane = useMemo(() => sectionPlaneFor(sectionAxis, sectionDepth), [sectionAxis, sectionDepth]);
  const lift = explode * 0.55;

  useEffect(() => {
    onStructuresLoaded(skinStructures);
  }, [onStructuresLoaded]);

  const arterialCurve = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-1.02, -0.12, 0.76),
      new Vector3(-0.52, -0.2, 0.77),
      new Vector3(0, -0.1, 0.76),
      new Vector3(0.52, -0.19, 0.77),
      new Vector3(1.02, -0.13, 0.75),
    ]),
    [],
  );
  const venousCurve = useMemo(
    () => new CatmullRomCurve3([
      new Vector3(-1.02, -0.28, 0.75),
      new Vector3(-0.48, -0.22, 0.76),
      new Vector3(0.02, -0.31, 0.75),
      new Vector3(0.54, -0.24, 0.76),
      new Vector3(1.02, -0.3, 0.74),
    ]),
    [],
  );

  const materialState = (name: string) => {
    const isSelected = selectedStructure === name;
    const isFaded = Boolean(selectedStructure && !isSelected);
    return {
      clippingPlanes: sectionMode ? [clippingPlane] : [],
      depthWrite: !isFaded,
      emissive: isSelected ? organ.accent : "#000000",
      emissiveIntensity: isSelected ? 0.48 : 0,
      opacity: isFaded ? 0.14 : 1,
      side: sectionMode ? DoubleSide : FrontSide,
      transparent: isFaded,
    };
  };
  const visible = (name: string) => !hiddenStructures.includes(name);

  const handleStructureClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const name = event.object.name || event.object.parent?.name || "structure";
    onSelectStructure(selectedStructure === name ? null : name);
  };

  return (
    <group>
      <group scale={0.82} rotation={[-0.08, -0.18, 0]} position={[0, -0.06, 0]}>
        <RoundedBox name="Epidermis" visible={visible("Epidermis")} args={[2.34, 0.2, 1.42]} radius={0.055} smoothness={4} position={[0, 0.56 + lift * 1.4, 0]} onPointerDown={handleStructureClick}>
          <meshPhysicalMaterial color="#d8a07e" roughness={0.58} clearcoat={0.18} clearcoatRoughness={0.7} sheen={0.3} sheenColor="#ffd4bd" envMapIntensity={0.82} {...materialState("Epidermis")} />
        </RoundedBox>

        <RoundedBox name="Dermis" visible={visible("Dermis")} args={[2.31, 0.58, 1.39]} radius={0.07} smoothness={4} position={[0, 0.16 + lift * 0.6, 0]} onPointerDown={handleStructureClick}>
          <meshPhysicalMaterial color="#b9655e" roughness={0.62} clearcoat={0.1} clearcoatRoughness={0.74} sheen={0.35} sheenColor="#ffb3a6" envMapIntensity={0.76} {...materialState("Dermis")} />
        </RoundedBox>

        <RoundedBox name="Subcutaneous tissue" visible={visible("Subcutaneous tissue")} args={[2.25, 0.52, 1.34]} radius={0.1} smoothness={4} position={[0, -0.41 - lift * 0.5, 0]} onPointerDown={handleStructureClick}>
          <meshPhysicalMaterial color="#d6a752" roughness={0.72} clearcoat={0.04} envMapIntensity={0.64} {...materialState("Subcutaneous tissue")} />
        </RoundedBox>

        {fatLobules.map(([x, y, z, radius], index) => (
          <mesh key={`${x}-${index}`} name="Adipose lobule" visible={visible("Adipose lobule")} position={[x, y - lift * 0.5, z]} scale={[1.18, 0.78, 0.52]} onPointerDown={handleStructureClick}>
            <sphereGeometry args={[radius, 20, 14]} />
            <meshPhysicalMaterial color={index % 2 === 0 ? "#edc96d" : "#dfb553"} roughness={0.66} envMapIntensity={0.72} {...materialState("Adipose lobule")} />
          </mesh>
        ))}

        <RoundedBox name="Hair follicle" visible={visible("Hair follicle")} args={[0.15, 0.72, 0.15]} radius={0.07} smoothness={4} position={[0.5, 0.14 + lift * 0.6, 0.75]} rotation={[0, 0, -0.2]} onPointerDown={handleStructureClick}>
          <meshPhysicalMaterial color="#7b4b3c" roughness={0.5} envMapIntensity={0.78} {...materialState("Hair follicle")} />
        </RoundedBox>

        <mesh name="Hair shaft" visible={visible("Hair shaft")} position={[0.42, 0.88 + lift * 1.4, 0.75]} rotation={[0, 0, -0.2]} onPointerDown={handleStructureClick}>
          <cylinderGeometry args={[0.028, 0.04, 0.78, 14]} />
          <meshPhysicalMaterial color="#34221d" roughness={0.42} envMapIntensity={0.86} {...materialState("Hair shaft")} />
        </mesh>

        <mesh name="Sweat gland" visible={visible("Sweat gland")} position={[-0.54, -0.04 + lift * 0.6, 0.76]} onPointerDown={handleStructureClick}>
          <torusKnotGeometry args={[0.12, 0.026, 56, 10, 2, 3]} />
          <meshPhysicalMaterial color="#e5a2a0" roughness={0.48} envMapIntensity={0.82} {...materialState("Sweat gland")} />
        </mesh>

        <mesh name="Dermal artery" visible={visible("Dermal artery")} position={[0, lift * 0.6, 0]} onPointerDown={handleStructureClick}>
          <tubeGeometry args={[arterialCurve, 36, 0.028, 10, false]} />
          <meshPhysicalMaterial color="#a63f45" roughness={0.38} envMapIntensity={0.92} {...materialState("Dermal artery")} />
        </mesh>

        <mesh name="Dermal vein" visible={visible("Dermal vein")} position={[0, lift * 0.6, 0]} onPointerDown={handleStructureClick}>
          <tubeGeometry args={[venousCurve, 36, 0.027, 10, false]} />
          <meshPhysicalMaterial color="#356f83" roughness={0.4} envMapIntensity={0.9} {...materialState("Dermal vein")} />
        </mesh>
      </group>

      {showLabels
        && organ.hotspots.map((hotspot, index) => hotspot.position && (
          <Html key={hotspot.id} position={hotspot.position} center zIndexRange={[30 - index, 0]}>
            <HotspotButton hotspot={hotspot} index={index} accent={organ.accent} onSelect={onSelectHotspot} />
          </Html>
        ))}
    </group>
  );
}

/* --------------------------------------------------------------------------
   Stage
   -------------------------------------------------------------------------- */

function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer form="rect" intensity={3.2} color="#fff2e2" position={[0, 4, 4]} scale={[5, 2]} />
      <Lightformer form="rect" intensity={1.9} color="#b9e6e8" position={[-4, 1, 2]} scale={[3, 4]} />
      <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[4, -1, -2]} scale={2.5} />
      <Lightformer form="rect" intensity={0.8} color="#ffe7d4" position={[0, -3, 2]} scale={[4, 1]} />
    </Environment>
  );
}

/** A soft pool of light under the specimen so it reads as sitting on a stage. */
function SpotlightPool({ accent }: { accent: string }) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.42, "rgba(255, 255, 255, 0.26)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
  const tint = useMemo(() => new Color(accent).lerp(new Color("#ffffff"), 0.55), [accent]);
  if (!texture) return null;
  return (
    <mesh position={[0, -1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.6, 3.6]} />
      <meshBasicMaterial map={texture} color={tint} transparent opacity={0.3} depthWrite={false} blending={AdditiveBlending} />
    </mesh>
  );
}

function RenderModel(props: RenderModelProps) {
  if (props.organ.modelKind === "skin-patch") return <SkinPatchModel {...props} />;
  if (typeof props.organ.model === "string") {
    // Pass the same organ object through: a fresh object here would rebuild
    // the prepared scene on every render and loop through onStructuresLoaded.
    return <OrganModel {...props} organ={props.organ as GltfOrgan} />;
  }
  throw new Error(`No renderable model configured for ${props.organ.id}`);
}

function LoadingModel({ label }: { label: string }) {
  return (
    <Html center>
      <div className="viewer-loader" role="status">
        <span aria-hidden="true" />
        {label}
      </div>
    </Html>
  );
}

function CaptureBridge({ captureRef }: { captureRef: AnatomyViewerProps["captureRef"] }) {
  const state = useThree();
  useEffect(() => {
    captureRef.current = () => {
      try {
        state.gl.render(state.scene, state.camera);
        return state.gl.domElement.toDataURL("image/png");
      } catch (error) {
        console.error("Unable to capture the viewer", error);
        return null;
      }
    };
    return () => {
      captureRef.current = null;
    };
  }, [captureRef, state]);
  return null;
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

/** Resolve a model path relative to the page so nested hosting (for example /atlas/organs/) works. */
export function resolveModelUrl(model: string) {
  if (typeof window === "undefined") return model;
  return new URL(model, window.location.href).toString();
}

function StageNotice({ title, detail, action, onAction }: { title: string; detail: string; action: string; onAction: () => void }) {
  return (
    <div className="viewer-stage-notice" role="alert">
      <strong>{title}</strong>
      <p>{detail}</p>
      <button type="button" onClick={onAction}>{action}</button>
    </div>
  );
}

export function AnatomyViewer(props: AnatomyViewerProps) {
  const [webglSupported] = useState(canCreateWebGLContext);
  const [plainMaterials, setPlainMaterials] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const organ = useMemo<Organ>(
    () => (props.organ.model ? { ...props.organ, model: resolveModelUrl(props.organ.model) } : props.organ),
    [props.organ],
  );

  useEffect(() => {
    if (props.nextModel) useGLTF.preload(resolveModelUrl(props.nextModel));
  }, [props.nextModel]);

  if (!webglSupported) {
    return (
      <div className="viewer-webgl-fallback" role="img" aria-label={`${organ.name} 3D model unavailable`}>
        <span aria-hidden="true">3D</span>
        <strong>{organ.name}</strong>
        <p>{props.webglFallbackLabel}</p>
      </div>
    );
  }

  const onCreated = ({ gl }: RootState) => {
    gl.localClippingEnabled = true;
    gl.toneMappingExposure = 1.08;
    gl.debug.checkShaderErrors = true;
    gl.debug.onShaderError = (context, program, vertexShader, fragmentShader) => {
      console.error(
        "Tissue shader failed to compile on this GPU; switching to plain materials.",
        context.getShaderInfoLog(vertexShader),
        context.getShaderInfoLog(fragmentShader),
        context.getProgramInfoLog(program),
      );
      setPlainMaterials(true);
    };
    gl.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      setContextLost(true);
    });
  };

  const restartStage = () => {
    setContextLost(false);
    setRestartCount((value) => value + 1);
  };

  if (contextLost) {
    return (
      <StageNotice
        title={props.contextLostTitle}
        detail={props.contextLostDetail}
        action={props.contextLostAction}
        onAction={restartStage}
      />
    );
  }

  return (
    <Canvas
      key={`anatomy-viewer-${props.resetSignal}-${restartCount}-${plainMaterials ? "plain" : "tissue"}`}
      camera={{ position: [0, 0.08, 4.25], fov: 34, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop={props.autoRotate ? "always" : "demand"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      onCreated={onCreated}
      onPointerMissed={() => props.onSelectStructure(null)}
      role="img"
      aria-label={`${organ.name} 3D model`}
    >
      <CaptureBridge captureRef={props.captureRef} />
      <StudioEnvironment />
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#dff7ff", "#1a0e0c", 0.58]} />
      <directionalLight position={[3.8, 5.2, 4.4]} intensity={2.05} color="#fff3e4" />
      <directionalLight position={[-4.5, 1.4, 2.2]} intensity={0.7} color="#9adce2" />
      <directionalLight position={[0, -3.5, -3.5]} intensity={0.5} color={organ.accent} />
      <directionalLight position={[-2, 3, -4]} intensity={0.9} color="#ffffff" />

      <ModelErrorBoundary model={organ.model ?? organ.modelKind ?? organ.id} label={props.errorLabel}>
        <Suspense fallback={<LoadingModel label={props.loadingLabel} />}>
          <RenderModel key={organ.id} {...props} organ={organ} plainMaterials={plainMaterials} />
        </Suspense>
      </ModelErrorBoundary>

      <SpotlightPool accent={organ.accent} />
      <ContactShadows
        key={`shadow-${organ.id}-${props.autoRotate ? "moving" : "still"}`}
        position={[0, -1.08, 0]}
        scale={6.5}
        far={2.4}
        blur={2.5}
        opacity={0.55}
        resolution={256}
        color="#1c2f2b"
        frames={props.autoRotate ? Infinity : 1}
      />

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.62}
        enableDamping
        dampingFactor={0.075}
        minDistance={1.6}
        maxDistance={7}
        minPolarAngle={0.12}
        maxPolarAngle={Math.PI - 0.12}
      />
    </Canvas>
  );
}
