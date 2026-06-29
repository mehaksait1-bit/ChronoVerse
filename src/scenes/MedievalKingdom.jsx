import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import * as THREE from "three";

import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

const MEDIEVAL_INDEX = 3;

function Mountains() {
  const peaks = useMemo(
    () => [
      { pos: [-25, -1, -50], scale: [20, 10, 12] },
      { pos: [20, -1.5, -55], scale: [22, 11, 13] },
      { pos: [0, -1, -60], scale: [28, 12, 14] },
    ],
    []
  );
  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <coneGeometry args={[1, 1, 8]} />
          <meshStandardMaterial color="#2a3040" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Forest() {
  const trees = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 40,
          -2.8,
          (Math.random() - 0.5) * 20 - 8,
        ],
        scale: 0.6 + Math.random() * 0.8,
      })),
    []
  );
  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={t.pos} scale={t.scale}>
          <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.5, 1.8, 6]} />
            <meshStandardMaterial color="#1a3a28" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.5, 5]} />
            <meshStandardMaterial color="#3a2818" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Castle({ morph }) {
  const castle = useRef();
  const glass = useRef();

  useFrame(() => {
    if (!castle.current || !glass.current) return;
    castle.current.scale.setScalar(1 - morph * 0.15);
    glass.current.scale.setScalar(morph);
    glass.current.visible = morph > 0.05;
  });

  return (
    <group position={[0, -2, -28]}>
      <group ref={castle}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[8, 5, 6]} />
          <meshStandardMaterial color="#5a5a62" roughness={0.95} />
        </mesh>
        {[-4, 4].map((x, i) => (
          <mesh key={i} position={[x, 4.5, 0]}>
            <cylinderGeometry args={[1.2, 1.5, 6, 8]} />
            <meshStandardMaterial color="#4a4a52" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, 6.8, 0]}>
          <coneGeometry args={[1.8, 2, 4]} />
          <meshStandardMaterial color="#3a3a42" />
        </mesh>
        {[-5.5, 5.5].map((x, i) => (
          <mesh key={i} position={[x, 1.5, 3.2]}>
            <boxGeometry args={[1.5, 3, 0.5]} />
            <meshStandardMaterial color="#6a6a72" />
          </mesh>
        ))}
        <mesh position={[0, 1, 4]} scale={[10, 2, 0.5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#555560" />
        </mesh>
      </group>
      <group ref={glass} visible={false} scale={0}>
        {[
          [-3, 0, 0],
          [0, 0, -1],
          [3, 0, 1],
          [-1.5, 0, 2],
          [2, 0, -2],
        ].map((pos, i) => (
          <mesh key={i} position={pos} scale={[0.8, 3 + i * 0.5, 0.8]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#1a2840"
              emissive="#4488ff"
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function StoneBridge() {
  return (
    <group position={[0, -2.5, -14]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.4, 2]} />
        <meshStandardMaterial color="#5a5a60" roughness={0.95} />
      </mesh>
      {[-3.5, 3.5].map((x, i) => (
        <mesh key={i} position={[x, -0.8, 0]}>
          <boxGeometry args={[0.6, 2, 0.6]} />
          <meshStandardMaterial color="#4a4a50" />
        </mesh>
      ))}
    </group>
  );
}

function River() {
  const water = useRef();
  useFrame(({ clock }) => {
    if (water.current) {
      water.current.position.y = -3.1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      water.current.material.opacity = 0.65 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }
  });
  return (
    <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, -14]}>
      <planeGeometry args={[30, 6, 16, 4]} />
      <meshStandardMaterial color="#1a3050" transparent opacity={0.65} metalness={0.3} roughness={0.2} />
    </mesh>
  );
}

function Torch({ position }) {
  const light = useRef();
  useFrame(({ clock }) => {
    if (light.current) {
      light.current.intensity = 1.8 + Math.sin(clock.getElapsedTime() * 12 + position[0]) * 0.6;
    }
  });
  return (
    <group position={position}>
      <pointLight ref={light} color="#ff7722" intensity={1.8} distance={8} />
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshBasicMaterial color="#ffaa44" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 4]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
    </group>
  );
}

function RoyalFlag({ position }) {
  const cloth = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloth.current) {
      cloth.current.rotation.y = Math.sin(t * 2.5) * 0.2;
      cloth.current.rotation.z = Math.sin(t * 3.5) * 0.1;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 4, 6]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <mesh ref={cloth} position={[0.8, 3.2, 0]}>
        <planeGeometry args={[1.4, 0.9, 4, 2]} />
        <meshStandardMaterial color="#8b1a2a" side={THREE.DoubleSide} emissive="#aa2233" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Rain({ count = 80 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      speeds[i] = 0.15 + Math.random() * 0.1;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - data.speeds[i];
      if (y < -2) y = 12;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={data.positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#99aacc" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Lightning() {
  const flash = useRef();
  useFrame(() => {
    if (!flash.current) return;
    if (Math.random() < 0.008) {
      flash.current.intensity = 4 + Math.random() * 3;
    } else {
      flash.current.intensity *= 0.85;
    }
  });
  return <directionalLight ref={flash} position={[10, 20, 5]} color="#aabbff" intensity={0} />;
}

function Bird({ offset, radius, height }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.28 + offset;
    if (!ref.current) return;
    ref.current.position.set(Math.cos(t) * radius, height, Math.sin(t) * radius - 10);
    ref.current.rotation.y = -t + Math.PI / 2;
  });
  return (
    <group ref={ref}>
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.35, 4]} />
        <meshStandardMaterial color="#111820" />
      </mesh>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.08, 0.35, 4]} />
        <meshStandardMaterial color="#111820" />
      </mesh>
    </group>
  );
}

export function MedievalKingdomText() {
  const progress = useSceneScrollProgress(MEDIEVAL_INDEX);
  const opacity = scrollTextOpacity(progress);
  return (
    <div style={{
      position: "fixed", bottom: "12%", width: "100%", textAlign: "center",
      color: "#c8d4f0", fontSize: "clamp(18px, 3vw, 26px)",
      fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.04em",
      textShadow: "0 0 20px rgba(100, 140, 255, 0.5), 0 2px 8px rgba(0,0,0,0.9)",
      pointerEvents: "none", opacity, transition: "opacity 0.35s ease", zIndex: 10,
    }}>
      The age of kings, courage, and legends.
    </div>
  );
}

export default function MedievalKingdom() {
  const scroll = useSceneScrollProgress(MEDIEVAL_INDEX);
  const morph = Math.max(0, (scroll - 0.72) / 0.28);
  const rig = useRef();
  const far = useRef();
  const near = useRef();

  useFrame(() => {
    const travel = scroll * 16;
    if (rig.current) rig.current.position.z = -travel;
    if (far.current) far.current.position.z = -travel * 0.25;
    if (near.current) near.current.position.z = -travel * 0.75;
  });

  return (
    <group ref={rig}>
      <color attach="background" args={["#0a1228"]} />
      <fog attach="fog" args={["#0b1020", 4, 35]} />

      <ambientLight intensity={0.2} color="#6677aa" />
      <directionalLight position={[5, 12, 8]} intensity={0.6} color="#8899cc" />
      <hemisphereLight args={["#223355", "#0a0e18", 0.4]} />
      <Lightning />

      <group ref={far}>
        <Mountains />
        <Castle morph={morph} />
        <Cloud opacity={0.25} speed={0.1} bounds={[20, 4, 8]} segments={12} color="#1a2040" position={[0, 4, -30]} />
        <Cloud opacity={0.2} speed={0.08} bounds={[25, 5, 10]} segments={10} color="#151a35" position={[5, 6, -35]} />
      </group>

      <group>
        <Forest />
        <River />
        <StoneBridge />
        <Torch position={[-4, -2, -13]} />
        <Torch position={[4, -2, -13]} />
        <Torch position={[-6, -1, -26]} />
        <Torch position={[6, -1, -26]} />
        <RoyalFlag position={[-5, -2, -27]} />
        <RoyalFlag position={[5, -2, -27]} />
      </group>

      <group ref={near}>
        <Rain />
        <Bird offset={0} radius={8} height={5} />
        <Bird offset={2} radius={10} height={6.5} />
      </group>
    </group>
  );
}
