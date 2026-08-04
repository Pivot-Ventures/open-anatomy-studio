"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Grid,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Color,
  DoubleSide,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Plane,
  Vector3,
} from "three";
import type { Language, Organ } from "../lib/anatomy";
import { localize } from "../lib/anatomy";

type AnatomyViewerProps = {
  organ: Organ;
  nextModel?: string;
  lang: Language;
  autoRotate: boolean;
  showLabels: boolean;
  sectionMode: boolean;
  sectionDepth: number;
  selectedStructure: string | null;
  onSelectStructure: (name: string | null) => void;
  onSelectHotspot: (id: string) => void;
  resetSignal: number;
  loadingLabel: string;
};

function cloneMaterial(material: Material) {
  const cloned = material.clone();
  cloned.userData.baseOpacity = cloned.opacity;
  cloned.userData.baseTransparent = cloned.transparent;
  cloned.userData.baseSide = cloned.side;
  return cloned;
}

function prepareScene(source: Object3D) {
  const scene = source.clone(true);
  scene.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.castShadow = true;
    node.receiveShadow = true;
    node.material = Array.isArray(node.material)
      ? node.material.map(cloneMaterial)
      : cloneMaterial(node.material);
  });
  return scene;
}

function OrganModel({
  organ,
  lang,
  sectionMode,
  sectionDepth,
  selectedStructure,
  showLabels,
  onSelectStructure,
  onSelectHotspot,
}: Omit<AnatomyViewerProps, "autoRotate" | "resetSignal" | "loadingLabel" | "nextModel">) {
  const gltf = useGLTF(organ.model);
  const scene = useMemo(() => prepareScene(gltf.scene), [gltf.scene]);
  const clippingPlane = useMemo(
    () => new Plane(new Vector3(-1, 0, 0), sectionDepth),
    [sectionDepth],
  );

  useEffect(() => {
    scene.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const isSelected = selectedStructure === node.name;

      materials.forEach((material) => {
        material.clippingPlanes = sectionMode ? [clippingPlane] : [];
        material.clipShadows = sectionMode;
        material.side = sectionMode ? DoubleSide : material.userData.baseSide;
        material.opacity = selectedStructure && !isSelected ? 0.1 : material.userData.baseOpacity ?? 1;
        material.transparent = Boolean(selectedStructure && !isSelected) || Boolean(material.userData.baseTransparent);
        material.depthWrite = !(selectedStructure && !isSelected);

        if (material instanceof MeshStandardMaterial) {
          material.emissive = isSelected ? new Color(organ.accent).multiplyScalar(0.22) : new Color(0x000000);
          material.emissiveIntensity = isSelected ? 0.7 : 0;
        }
        material.needsUpdate = true;
      });
    });
  }, [clippingPlane, organ.accent, scene, sectionMode, selectedStructure]);

  const handleStructureClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const name = event.object.name || event.object.parent?.name || "Unnamed structure";
    onSelectStructure(selectedStructure === name ? null : name);
  };

  return (
    <Bounds fit clip observe margin={1.28}>
      <Center>
        <group>
          <primitive object={scene} onPointerDown={handleStructureClick} />
          {showLabels &&
            organ.hotspots.map((hotspot, index) => (
              <Html
                key={hotspot.id}
                position={hotspot.position}
                center
                distanceFactor={6.5}
                zIndexRange={[30 - index, 0]}
              >
                <button
                  type="button"
                  className="viewer-hotspot"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectHotspot(hotspot.id);
                  }}
                  style={{ "--hotspot-accent": organ.accent } as React.CSSProperties}
                >
                  <span aria-hidden="true" />
                  <strong>{localize(hotspot.name, lang)}</strong>
                </button>
              </Html>
            ))}
        </group>
      </Center>
    </Bounds>
  );
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

export function AnatomyViewer(props: AnatomyViewerProps) {
  useEffect(() => {
    if (props.nextModel) useGLTF.preload(props.nextModel);
  }, [props.nextModel]);

  return (
    <Canvas
      key={`${props.organ.id}-${props.resetSignal}`}
      camera={{ position: [2.8, 1.7, 3.5], fov: 38, near: 0.01, far: 200 }}
      dpr={[1, 1.6]}
      frameloop={props.autoRotate ? "always" : "demand"}
      shadows="soft"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
      }}
      onPointerMissed={() => props.onSelectStructure(null)}
      role="img"
      aria-label={`${localize(props.organ.name, props.lang)} 3D model`}
    >
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#d9f3ff", "#211711", 1.15]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={2.7}
        color="#fff6e7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 2, -4]} intensity={1.1} color="#69c6cf" />
      <Suspense fallback={<LoadingModel label={props.loadingLabel} />}>
        <OrganModel {...props} />
      </Suspense>
      <ContactShadows
        position={[0, -1.42, 0]}
        opacity={0.34}
        scale={7}
        blur={2.8}
        far={4}
        color="#030707"
      />
      <Grid
        position={[0, -1.46, 0]}
        args={[12, 12]}
        cellSize={0.24}
        cellThickness={0.45}
        cellColor="#294b50"
        sectionSize={1.2}
        sectionThickness={0.9}
        sectionColor="#37666b"
        fadeDistance={7}
        fadeStrength={1.4}
        infiniteGrid
      />
      <OrbitControls
        makeDefault
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.75}
        enableDamping
        dampingFactor={0.07}
        minDistance={1.25}
        maxDistance={7.5}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />
    </Canvas>
  );
}
