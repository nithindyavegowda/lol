"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SPIDER_URL = "/assets/3d/spiderman.glb";
const WEB_URL = "/assets/3d/spiderweb.glb";

type PointerNorm = { x: number; y: number };

function useClonedGltf(url: string) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const std = m as THREE.MeshStandardMaterial;
          if (std?.isMeshStandardMaterial) {
            std.envMapIntensity = 0.32;
            std.needsUpdate = true;
          }
        });
      }
    });
    return c;
  }, [scene]);
}

/** Normalize unknown GLB units so the figure fits in view as a background element */
function fitObject(obj: THREE.Object3D, targetHeight = 2.4) {
  obj.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const s = targetHeight / Math.max(size.y, 0.001);
  obj.scale.setScalar(s);

  // Re-measure after scale and center on origin
  const box2 = new THREE.Box3().setFromObject(obj);
  box2.getCenter(center);
  obj.position.x -= center.x;
  obj.position.y -= center.y;
  obj.position.z -= center.z;

  // Rest feet near shadow plane
  const box3 = new THREE.Box3().setFromObject(obj);
  obj.position.y += -1.2 - box3.min.y;
}

function SoftLights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF9F5" />
      <directionalLight
        position={[3, 5, 2.5]}
        intensity={0.95}
        color="#FFF5EE"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2.5, 2, 1]} intensity={0.32} color="#F7D9DC" />
      <directionalLight position={[0, 2.5, -3]} intensity={0.18} color="#E8DFD6" />
    </>
  );
}

/**
 * Spiderman + spiderweb — full-bleed background scene.
 * Mouse X → rotation Y (damped)
 * Mouse Y → position Y (damped)
 */
function SpideyScene({
  pointer,
  reducedMotion,
}: {
  pointer: PointerNorm;
  reducedMotion: boolean;
}) {
  const spider = useClonedGltf(SPIDER_URL);
  const web = useClonedGltf(WEB_URL);
  const root = useRef<THREE.Group>(null);
  const webGroup = useRef<THREE.Group>(null);
  const spiderGroup = useRef<THREE.Group>(null);
  const fitted = useRef(false);

  const rotY = useRef(0);
  const posY = useRef(0);

  useLayoutEffect(() => {
    if (fitted.current) return;
    if (spiderGroup.current) {
      fitObject(spiderGroup.current, 2.15);
    }
    if (webGroup.current) {
      fitObject(webGroup.current, 3.4);
      webGroup.current.position.z -= 1.4;
      webGroup.current.position.y += 0.35;
    }
    fitted.current = true;
  }, [spider, web]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const damp = 1 - Math.exp(-4.2 * dt);

    const targetRotY = reducedMotion ? 0 : pointer.x * 0.7;
    const targetPosY = reducedMotion ? 0 : pointer.y * 0.4;

    rotY.current = THREE.MathUtils.lerp(rotY.current, targetRotY, damp);
    posY.current = THREE.MathUtils.lerp(posY.current, targetPosY, damp);

    if (root.current) {
      root.current.rotation.y = rotY.current;
      root.current.position.y = posY.current;
    }

    if (webGroup.current) {
      webGroup.current.rotation.y = rotY.current * 0.28;
    }
  });

  return (
    <group ref={root} position={[0.55, 0, 0]}>
      {/* Web behind character */}
      <group ref={webGroup}>
        <primitive object={web} />
      </group>
      {/* Character in foreground of web */}
      <group ref={spiderGroup} position={[0, 0, 0.35]}>
        <primitive object={spider} />
      </group>
    </group>
  );
}

export function Hero3D({
  pointer,
  reducedMotion = false,
}: {
  progress?: number;
  pointer: PointerNorm;
  reducedMotion?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      data-sprint="hero-spidey-fullscreen"
      style={{ touchAction: "none", background: "transparent", zIndex: 0 }}
      aria-hidden
    >
      <Canvas
        shadows={!reducedMotion}
        dpr={reducedMotion ? [1, 1] : [1, 1.6]}
        camera={{ position: [0, 0.35, 9.5], fov: 45, near: 0.1, far: 60 }}
        gl={{
          antialias: !reducedMotion,
          alpha: true,
          powerPreference: reducedMotion ? "low-power" : "high-performance",
        }}
        frameloop={reducedMotion ? "demand" : "always"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SoftLights />
        {!reducedMotion ? <Environment preset="apartment" environmentIntensity={0.22} /> : null}

        <Suspense fallback={null}>
          <SpideyScene pointer={pointer} reducedMotion={reducedMotion} />
        </Suspense>

        {!reducedMotion ? (
          <ContactShadows position={[0, -1.35, 0]} opacity={0.22} scale={14} blur={3} far={5} />
        ) : null}
      </Canvas>
    </div>
  );
}
