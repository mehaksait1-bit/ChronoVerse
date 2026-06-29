import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

const FUTURE_INDEX = 5;

function NeonTower({ position, height, color }) {
  const glow = useRef();
  useFrame(({ clock }) => {
    if (glow.current) {
      glow.current.emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh scale={[1, height, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={glow} color="#0a1028" emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0, height * 0.3, 0.55]} scale={[0.8, 0.15, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function FloatingBuilding({ position, floatOffset }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.6 + floatOffset) * 0.4;
      ref.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#101830" emissive="#8844ff" emissiveIntensity={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.5, 6]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function HoverRoad({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[12, 0.15, 2]} />
        <meshStandardMaterial color="#0a1530" emissive="#00ccff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Robot({ position, offset }) {
  const ref = useRef();
  const legL = useRef();
  const legR = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (legL.current) legL.current.rotation.x = Math.sin(t * 4) * 0.4;
    if (legR.current) legR.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.4;
    if (ref.current) ref.current.position.y = position[1] + Math.abs(Math.sin(t * 2)) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#223344" emissive="#00e5ff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.25]} />
        <meshStandardMaterial color="#334455" emissive="#ff44aa" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={legL} position={[-0.12, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color="#445566" />
      </mesh>
      <mesh ref={legR} position={[0.12, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color="#445566" />
      </mesh>
    </group>
  );
}

function FlyingCar({ offset, path }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.4 + offset;
    if (!ref.current) return;
    ref.current.position.set(
      Math.cos(t) * path,
      2 + Math.sin(t * 2) * 0.5,
      -10 + Math.sin(t) * path * 0.5
    );
    ref.current.rotation.y = -t;
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.8, 0.2, 1.4]} />
        <meshStandardMaterial color="#1a2040" emissive="#00ffff" emissiveIntensity={1} />
      </mesh>
      <pointLight color="#00e5ff" intensity={0.5} distance={3} />
    </group>
  );
}

function Hologram({ position, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.5;
    ref.current.material.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1.5, 0.05, 8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function EnergyTower({ position }) {
  const ring = useRef();
  const core = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring.current) {
      ring.current.rotation.y = t;
      ring.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (core.current) core.current.emissiveIntensity = 1 + Math.sin(t * 3) * 0.5;
  });
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial ref={core} color="#111" emissive="#aa44ff" emissiveIntensity={1} />
      </mesh>
      <mesh ref={ring} position={[0, 3.5, 0]}>
        <torusGeometry args={[0.8, 0.04, 8, 32]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.03, 8, 32]} />
        <meshBasicMaterial color="#ff44aa" />
      </mesh>
    </group>
  );
}

function FloatingIsland({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.4 + position[0]) * 0.3;
    }
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <cylinderGeometry args={[3, 3.5, 1, 8]} />
        <meshStandardMaterial color="#1a1535" emissive="#4422aa" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.5, 1.2, 6]} />
        <meshStandardMaterial color="#2a4060" emissive="#00ccff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function NeonPanel({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.3;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
  });
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1.5, 0.8]} />
      <meshBasicMaterial color="#ff44cc" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

function LaserLight({ position, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime();
  });
  return (
    <group position={position}>
      <spotLight ref={ref} color={color} intensity={2} angle={0.3} penumbra={0.5} distance={20} />
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function CosmicParticles({ count = 50 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 30;
    return arr;
  }, [count]);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#aa66ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function Future2200Text() {
  const progress = useSceneScrollProgress(FUTURE_INDEX);
  const opacity = scrollTextOpacity(progress);
  return (
    <div style={{
      position: "fixed", bottom: "12%", width: "100%", textAlign: "center",
      color: "#e0ccff", fontSize: "clamp(18px, 3vw, 26px)",
      fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.04em",
      textShadow: "0 0 24px rgba(180, 80, 255, 0.6), 0 0 12px rgba(0, 229, 255, 0.4), 0 2px 8px rgba(0,0,0,0.9)",
      pointerEvents: "none", opacity, transition: "opacity 0.35s ease", zIndex: 10,
    }}>
      The future belongs to the curious.
    </div>
  );
}

export default function Future2200() {
  const scroll = useSceneScrollProgress(FUTURE_INDEX);
  const lift = Math.max(0, (scroll - 0.6) / 0.4) * 30;
  const rig = useRef();

  useFrame(() => {
    const travel = scroll * 12;
    if (rig.current) {
      rig.current.position.z = -travel;
      rig.current.position.y = lift;
    }
  });

  return (
    <group ref={rig}>
      <color attach="background" args={["#050510"]} />
      <fog attach="fog" args={["#0a0820", 10, 55]} />

      <ambientLight intensity={0.25} color="#6644aa" />
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#00e5ff" />
      <pointLight position={[-8, 4, -10]} intensity={1} color="#ff44aa" />
      <pointLight position={[8, 4, -15]} intensity={1} color="#8844ff" />
      <hemisphereLight args={["#aa66ff", "#050510", 0.4]} />

      <NeonTower position={[-4, -3, -12]} height={7} color="#00e5ff" />
      <NeonTower position={[3, -3, -16]} height={9} color="#ff44cc" />
      <NeonTower position={[0, -3, -22]} height={11} color="#8844ff" />
      <NeonTower position={[-6, -3, -20]} height={5} color="#44ffcc" />

      <FloatingBuilding position={[-8, 2, -14]} floatOffset={0} />
      <FloatingBuilding position={[7, 3, -18]} floatOffset={2} />
      <FloatingBuilding position={[0, 4, -25]} floatOffset={4} />

      <HoverRoad position={[0, 0, -10]} />
      <HoverRoad position={[0, 1.5, -20]} />

      <Robot position={[-2, -2.8, -8]} offset={0} />
      <Robot position={[3, -2.8, -12]} offset={1.5} />

      <FlyingCar offset={0} path={6} />
      <FlyingCar offset={2} path={8} />
      <FlyingCar offset={4} path={5} />

      <Hologram position={[0, 3, -15]} color="#00e5ff" />
      <Hologram position={[-5, 4, -20]} color="#ff44aa" />

      <EnergyTower position={[5, -3, -14]} />
      <EnergyTower position={[-7, -3, -22]} />

      <FloatingIsland position={[-10, 5, -28]} />
      <FloatingIsland position={[12, 6, -30]} />

      <NeonPanel position={[-3, 2, -11]} />
      <NeonPanel position={[4, 3, -17]} />

      <LaserLight position={[-6, 0, -10]} color="#ff00ff" />
      <LaserLight position={[6, 0, -18]} color="#00ffff" />

      <CosmicParticles />
    </group>
  );
}
