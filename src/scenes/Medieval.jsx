import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Medieval() {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 🌫️ subtle world breathing motion
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.25) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* 🌌 SKY (storm mood) */}
      <color attach="background" args={["#0b1020"]} />

      {/* ⚡ LIGHTNING LIGHT */}
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#aab6ff" />
      <ambientLight intensity={0.25} />

      {/* 🏰 CASTLE */}
      <mesh position={[0, -1, -6]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#6b6b6b" roughness={1} />
      </mesh>

      {/* 🧱 TOWER */}
      <mesh position={[-2, 0, -5]}>
        <cylinderGeometry args={[0.8, 1, 4, 16]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>

      {/* 🌉 BRIDGE */}
      <mesh position={[0, -2, -3]}>
        <boxGeometry args={[5, 0.3, 1]} />
        <meshStandardMaterial color="#3f3f3f" />
      </mesh>

      {/* 🔥 TORCHES */}
      <pointLight position={[2, 1, -4]} intensity={2} color="#ff8844" />
      <pointLight position={[-2, 1, -4]} intensity={2} color="#ff8844" />

      {/* 🌧️ RAIN PARTICLES */}
      {Array.from({ length: 60 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 12,
            Math.random() * 6,
            (Math.random() - 0.5) * 12,
          ]}
        >
          <boxGeometry args={[0.02, 0.2, 0.02]} />
          <meshStandardMaterial color="#99aaff" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* 🌫️ FOG */}
      <fog attach="fog" args={["#0b1020", 4, 20]} />
    </group>
  );
}