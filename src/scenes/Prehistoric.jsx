import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Prehistoric() {
  const group = useRef();
  const volcano = useRef();

  // simple animation loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      // slow world motion = alive feeling
      group.current.position.y = Math.sin(t * 0.3) * 0.1;
    }

    if (volcano.current) {
      volcano.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group}>
      {/* 🌫️ FOG COLOR (local illusion via background tone) */}
      <color attach="background" args={["#120805"]} />

      {/* 💡 MAIN LIGHT */}
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <ambientLight intensity={0.3} />

      {/* 🌋 VOLCANO (simple stylized cone) */}
      <mesh ref={volcano} position={[0, -1, -3]}>
        <coneGeometry args={[2, 5, 16]} />
        <meshStandardMaterial color="#3b2a1f" roughness={1} />
      </mesh>

      {/* 🌍 GROUND */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>

      {/* 🌫️ FLOATING SMOKE PARTICLES (fake simple version) */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 5,
            (Math.random() - 0.5) * 10,
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#777"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* 🦖 DINOSAUR (placeholder shape) */}
      <mesh position={[2, -1, -1]}>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="#1f3b2c" />
      </mesh>

      {/* 🦖 SECOND DINOSAUR */}
      <mesh position={[-2, -1, 2]}>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="#2d4a35" />
      </mesh>

      {/* 🦅 FLYING BIRD (simple dot) */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* 🌫️ ATMOSPHERIC DEPTH LIGHT */}
      <fog attach="fog" args={["#120805", 5, 20]} />

      {/* 📜 STORY TEXT (placeholder in 3D space) */}
      <mesh position={[0, 2, -2]}>
        <planeGeometry args={[3, 1]} />
        <meshBasicMaterial color="#000" transparent opacity={0} />
      </mesh>
    </group>
  );
}