import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import useSceneScrollProgress from "../hooks/useSceneScrollProgress";

const BEYOND_INDEX = 6;

function StarField({ count = 400 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Nebula() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02;
      ref.current.material.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -30]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="#6633aa" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Planet({ position, radius, color, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.8} />
    </mesh>
  );
}

function Asteroid({ position, scale }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.3;
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#665544" roughness={1} />
    </mesh>
  );
}

function BlackHole() {
  const disk = useRef();
  useFrame(({ clock }) => {
    if (disk.current) disk.current.rotation.z = clock.getElapsedTime() * 0.5;
  });
  return (
    <group position={[0, 2, -45]}>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh ref={disk} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3, 32]} />
        <meshBasicMaterial color="#ff6622" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Galaxy() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.001;
  });
  return (
    <mesh ref={ref} position={[8, -3, -35]} rotation={[0.5, 0.3, 0]}>
      <torusGeometry args={[3, 0.8, 8, 48]} />
      <meshBasicMaterial color="#aaccff" transparent opacity={0.2} wireframe />
    </mesh>
  );
}

function GiantPortal({ scroll }) {
  const portal = useRef();
  const inner = useRef();
  const glow = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (portal.current) portal.current.rotation.z = t * 0.3;
    if (inner.current) {
      inner.current.rotation.z = -t * 0.5;
      inner.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (glow.current) {
      glow.current.intensity = 3 + Math.sin(t * 2) * 1.5;
    }
  });

  const flyThrough = Math.max(0, (scroll - 0.5) / 0.5);

  return (
    <group position={[0, 0, -5 - flyThrough * 20]} scale={2 + flyThrough * 0.5}>
      <pointLight ref={glow} color="#00e5ff" intensity={3} distance={30} />
      <mesh ref={portal}>
        <torusGeometry args={[2.5, 0.25, 16, 100]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[1.8, 0.12, 12, 80]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial color="#001830" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
          <planeGeometry args={[5, 0.08]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function CosmicDust({ count = 60 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = 0.005 + Math.random() * 0.01;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let z = pos.getZ(i) + data.speeds[i];
      if (z > 10) z = -10;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#cc88ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function BeyondTime() {
  const scroll = useSceneScrollProgress(BEYOND_INDEX);
  const group = useRef();

  useFrame(() => {
    const flyThrough = Math.max(0, (scroll - 0.4) / 0.6);
    if (group.current) {
      group.current.rotation.y += 0.001;
      group.current.position.z = -flyThrough * 18;
    }
  });

  const asteroids = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 15, -10 - Math.random() * 20],
        scale: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <group ref={group}>
      <color attach="background" args={["#000005"]} />
      <fog attach="fog" args={["#000010", 15, 80]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#a855f7" />
      <pointLight position={[10, 5, -20]} intensity={1} color="#00e5ff" />

      <StarField />
      <Nebula />
      <Galaxy />
      <BlackHole />

      <Planet position={[-6, 3, -18]} radius={0.8} color="#4488cc" speed={0.2} />
      <Planet position={[7, -2, -22]} radius={1.2} color="#cc6644" speed={0.15} />
      <Planet position={[-4, -4, -28]} radius={0.5} color="#88cc88" speed={0.3} />
      <Planet position={[5, 5, -32]} radius={0.6} color="#aa88ff" speed={0.25} />

      {asteroids.map((a, i) => (
        <Asteroid key={i} position={a.pos} scale={a.scale} />
      ))}

      <GiantPortal scroll={scroll} />
      <CosmicDust />
    </group>
  );
}
