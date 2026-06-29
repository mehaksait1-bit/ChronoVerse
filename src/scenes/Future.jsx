import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Future() {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 🌌 floating futuristic motion
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* 🌌 NEON SKY */}
      <color attach="background" args={["#050510"]} />

      {/* 💡 FUTURE LIGHT */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#00e5ff" />

      {/* 🏙️ MAIN SKY CITY BLOCKS */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 2,
            -Math.random() * 10,
          ]}
        >
          <boxGeometry args={[1, Math.random() * 4 + 1, 1]} />
          <meshStandardMaterial color="#111827" emissive="#00e5ff" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* 🚁 FLOATING ENERGY ORBS */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            Math.random() * 5,
            (Math.random() - 0.5) * 15,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* 🌫️ ENERGY FOG */}
      <fog attach="fog" args={["#050510", 5, 25]} />
    </group>
  );
}