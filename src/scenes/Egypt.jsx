import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Egypt() {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 🌬️ subtle world motion (not zoom, just life)
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* 🌅 SKY / BACKGROUND COLOR */}
      <color attach="background" args={["#2b1b0e"]} />

      {/* ☀️ SUN LIGHT (warm desert feel) */}
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffcc88" />
      <ambientLight intensity={0.4} />

      {/* 🏜️ DESERT GROUND */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#c2a15a" roughness={1} />
      </mesh>

      {/* 🏜️ SECOND LAYER (sand depth illusion) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, -5]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#b08a4a" />
      </mesh>

      {/* 🏛️ PYRAMID 1 */}
      <mesh position={[-2, 0, -5]}>
        <coneGeometry args={[2, 4, 4]} />
        <meshStandardMaterial color="#d6b36a" roughness={1} />
      </mesh>

      {/* 🏛️ PYRAMID 2 */}
      <mesh position={[3, 0, -8]}>
        <coneGeometry args={[2.5, 5, 4]} />
        <meshStandardMaterial color="#caa55c" roughness={1} />
      </mesh>

      {/* 🏺 STATUE BLOCK */}
      <mesh position={[0, -1, -3]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#8b6b3e" />
      </mesh>

      {/* 🌫️ SIMPLE SAND PARTICLES */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            Math.random() * 4,
            (Math.random() - 0.5) * 15,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color="#e0c07a"
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* 🌫️ ATMOSPHERE DEPTH */}
      <fog attach="fog" args={["#2b1b0e", 5, 25]} />
    </group>
  );
}