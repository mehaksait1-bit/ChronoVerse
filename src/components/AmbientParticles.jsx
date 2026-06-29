import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SCENE_COLORS = {
  intro: "#00e5ff",
  prehistoric: "#ff8844",
  egypt: "#ffcc66",
  medieval: "#8899cc",
  modern: "#66aaff",
  future: "#cc66ff",
  beyond: "#ffffff",
};

function useParticleCount() {
  return useMemo(() => {
    if (typeof window === "undefined") return 120;
    return window.innerWidth < 768 ? 60 : window.innerWidth < 1200 ? 90 : 140;
  }, []);
}

export default function AmbientParticles({ scene = "intro" }) {
  const ref = useRef();
  const count = useParticleCount();
  const targetColor = useRef(new THREE.Color(SCENE_COLORS.intro));
  const currentColor = useRef(new THREE.Color(SCENE_COLORS.intro));

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05;

    targetColor.current.set(SCENE_COLORS[scene] || SCENE_COLORS.intro);
    currentColor.current.lerp(targetColor.current, 0.04);
    ref.current.material.color.copy(currentColor.current);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
