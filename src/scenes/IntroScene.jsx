import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function IntroScene() {
  const portal = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (portal.current) {
      portal.current.rotation.z += 0.01;
      portal.current.scale.x = 1 + Math.sin(t) * 0.1;
      portal.current.scale.y = 1 + Math.sin(t) * 0.1;
    }
  });

  return (
    <group>
      {/* DARK VOID BACKGROUND */}
      <color attach="background" args={["#000000"]} />

      {/* MAIN PORTAL RING */}
      <mesh ref={portal}>
        <torusGeometry args={[1.5, 0.2, 16, 100]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
      </mesh>

      {/* CENTER LIGHT */}
      <pointLight position={[0, 0, 2]} intensity={2} color="#00e5ff" />

      {/* FLOATING ENERGY DOTS */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#00e5ff" />
        </mesh>
      ))}
    </group>
  );
}