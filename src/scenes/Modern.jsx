import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Modern() {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      group.current.position.y = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* NIGHT SKYLINE */}
      <color attach="background" args={["#0a0f1f"]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

      {/* BUILDINGS */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 12,
            Math.random() * 2,
            -Math.random() * 10,
          ]}
        >
          <boxGeometry args={[1, Math.random() * 5 + 1, 1]} />
          <meshStandardMaterial color="#111827" emissive="#2563eb" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* DRONES / LIGHTS */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            Math.random() * 4,
            (Math.random() - 0.5) * 10,
          ]}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
        </mesh>
      ))}

      {/* CITY FOG */}
      <fog attach="fog" args={["#0a0f1f", 6, 25]} />
    </group>
  );
}