import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PortalTransition({ trigger }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useEffect(() => {
    if (trigger) {
      // reset scale on trigger
      meshRef.current.scale.set(0.1, 0.1, 0.1);
      materialRef.current.opacity = 1;
    }
  }, [trigger]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    // expand ring (portal opening effect)
    meshRef.current.scale.x += 0.08;
    meshRef.current.scale.y += 0.08;

    // fade out
    materialRef.current.opacity -= 0.02;

    if (materialRef.current.opacity < 0) {
      materialRef.current.opacity = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[0.5, 2.5, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#00E5FF"
        transparent
        opacity={1}
      />
    </mesh>
  );
}