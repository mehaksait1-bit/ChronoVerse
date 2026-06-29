import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import * as THREE from "three";

import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

const EGYPT_INDEX = 2;

function duneHeight(x, z) {
  return (
    Math.sin(x * 0.08) * Math.cos(z * 0.06) * 0.8 +
    Math.sin(x * 0.2 + z * 0.15) * 0.35 +
    Math.exp(-((x - 6) ** 2 / 40 + (z + 4) ** 2 / 30)) * 1.2
  );
}

function GoldenDesert({ morph = 0 }) {
  const sandMat = useRef();
  const stoneMat = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 56, 56);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, duneHeight(x, y));
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(() => {
    if (sandMat.current) sandMat.current.opacity = 1 - morph;
    if (stoneMat.current) stoneMat.current.opacity = morph;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={sandMat}
          color="#d4a84b"
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh geometry={geometry} position={[0, 0, 0.02]}>
        <meshStandardMaterial
          ref={stoneMat}
          color="#6b6b72"
          roughness={0.88}
          metalness={0.1}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function DesertMountains() {
  const peaks = useMemo(
    () => [
      { pos: [-28, -2, -48], scale: [18, 8, 10] },
      { pos: [22, -2.5, -52], scale: [20, 9, 11] },
      { pos: [0, -2, -58], scale: [24, 10, 12] },
      { pos: [-12, -2.2, -44], scale: [14, 6, 8] },
    ],
    []
  );

  return (
    <group>
      {peaks.map((peak, i) => (
        <mesh key={i} position={peak.pos} scale={peak.scale}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#8b6b42" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Pyramid({ position, size }) {
  return (
    <group position={position}>
      <mesh position={[0, size * 0.5, 0]}>
        <coneGeometry args={[size, size * 1.2, 4]} />
        <meshStandardMaterial color="#c9a04a" roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[0, size * 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size * 2.2, size * 2.2]} />
        <meshStandardMaterial color="#b8923f" roughness={1} />
      </mesh>
    </group>
  );
}

function Pyramids() {
  return (
    <group>
      <Pyramid position={[0, -3, -38]} size={7} />
      <Pyramid position={[-16, -3, -30]} size={5.5} />
      <Pyramid position={[14, -3, -33]} size={4.8} />
    </group>
  );
}

function Sphinx() {
  return (
    <group position={[8, -3, -18]} rotation={[0, -0.4, 0]}>
      <mesh position={[0, 0.6, 0]} scale={[2.8, 0.9, 4.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b89a5a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 2.2]} scale={[1.8, 0.5, 1.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#a88a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, 2.8]} scale={[0.9, 1.1, 1.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c4a86a" roughness={0.85} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.15, 1.5]} scale={[0.35, 0.35, 0.8]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#9a7c3e" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Temple({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 2.2, 8]} />
          <meshStandardMaterial color="#d8c090" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 2.1, 0]} scale={[7, 0.5, 3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b89850" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} scale={[5, 1.2, 5]}>
        <coneGeometry args={[1, 0.6, 4]} />
        <meshStandardMaterial color="#a07838" roughness={0.9} />
      </mesh>
    </group>
  );
}

function PalmTree({ position }) {
  const leaves = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (leaves.current) {
      leaves.current.rotation.z = Math.sin(t * 1.2 + position[0]) * 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.22, 2.4, 6]} />
        <meshStandardMaterial color="#6b4a28" roughness={1} />
      </mesh>
      <group ref={leaves} position={[0, 2.5, 0]}>
        {[0, 1.2, 2.4, 3.6, 4.8].map((rot, i) => (
          <mesh key={i} rotation={[0.5, rot, 0]}>
            <coneGeometry args={[0.08, 1.6, 4]} />
            <meshStandardMaterial color="#2d6b2a" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Banner({ position }) {
  const cloth = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloth.current) {
      cloth.current.rotation.y = Math.sin(t * 2 + position[0]) * 0.15;
      cloth.current.rotation.z = Math.sin(t * 3) * 0.12;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshStandardMaterial color="#5a4020" />
      </mesh>
      <mesh ref={cloth} position={[0.6, 2.2, 0]}>
        <planeGeometry args={[1.2, 0.7, 4, 2]} />
        <meshStandardMaterial
          color="#8b1a1a"
          side={THREE.DoubleSide}
          emissive="#aa4422"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

function Hieroglyph({ position, shape }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.25;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={ref} position={position}>
      {shape === "ankh" && (
        <>
          <mesh>
            <torusGeometry args={[0.25, 0.06, 8, 16]} />
            <meshStandardMaterial color="#e8c060" emissive="#c9a040" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.08]} />
            <meshStandardMaterial color="#e8c060" emissive="#c9a040" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.18, -0.55, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <boxGeometry args={[0.1, 0.35, 0.08]} />
            <meshStandardMaterial color="#e8c060" emissive="#c9a040" emissiveIntensity={0.4} />
          </mesh>
        </>
      )}
      {shape === "eye" && (
        <mesh scale={[1.4, 0.7, 0.3]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#e8c060" emissive="#d4a830" emissiveIntensity={0.5} />
        </mesh>
      )}
      {shape === "bird" && (
        <mesh rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.2, 0.6, 4]} />
          <meshStandardMaterial color="#e8c060" emissive="#c9a040" emissiveIntensity={0.4} />
        </mesh>
      )}
      {shape === "wave" && (
        <mesh>
          <torusGeometry args={[0.35, 0.05, 6, 24, Math.PI]} />
          <meshStandardMaterial color="#e8c060" emissive="#c9a040" emissiveIntensity={0.4} />
        </mesh>
      )}
    </group>
  );
}

function Hieroglyphs() {
  const glyphs = useMemo(
    () => [
      { pos: [-5, 3, -10], shape: "ankh" },
      { pos: [4, 4.5, -14], shape: "eye" },
      { pos: [-8, 5, -16], shape: "bird" },
      { pos: [7, 3.5, -8], shape: "wave" },
      { pos: [0, 6, -20], shape: "ankh" },
      { pos: [-3, 4, -22], shape: "eye" },
    ],
    []
  );

  return (
    <group>
      {glyphs.map((g, i) => (
        <Hieroglyph key={i} position={g.pos} shape={g.shape} />
      ))}
    </group>
  );
}

function DesertBird({ offset, radius, height, speed }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (!ref.current) return;

    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius - 12;
    ref.current.position.y = height + Math.sin(t * 2.5) * 0.3;
    ref.current.rotation.y = -t + Math.PI / 2;
  });

  return (
    <group ref={ref}>
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.1, 0.45, 4]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.1, 0.45, 4]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  );
}

function Sandstorm() {
  const storm = useRef();

  useFrame(({ clock }) => {
    if (storm.current) {
      storm.current.position.x = Math.sin(clock.getElapsedTime() * 0.08) * 6;
    }
  });

  return (
    <group ref={storm} position={[0, 2, -25]}>
      <Cloud opacity={0.18} speed={0.08} bounds={[18, 3, 8]} segments={14} color="#c9a060" />
      <Cloud
        opacity={0.12}
        speed={0.06}
        bounds={[22, 4, 10]}
        segments={12}
        position={[4, 1, -3]}
        color="#b89050"
      />
    </group>
  );
}

function BlowingSand({ count = 60 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 3 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      speeds[i] = 0.03 + Math.random() * 0.05;
    }

    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + data.speeds[i];
      const y = pos.getY(i) + Math.sin(x * 0.5 + i) * 0.002;

      if (x > 18) x = -18;

      pos.setX(i, x);
      pos.setY(i, y);
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={data.positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#e8c878"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function DustParticles({ count = 70 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = Math.random() * 8 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28;
      speeds[i] = 0.004 + Math.random() * 0.01;
    }

    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + data.speeds[i];
      const x = pos.getX(i) + Math.sin(y + i) * 0.003;

      if (y > 10) y = 1;

      pos.setX(i, x);
      pos.setY(i, y);
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={data.positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c4a060"
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function SunRays() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
    }
  });

  const rays = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        rotation: [(i - 4) * 0.08, 0, (i - 4) * 0.12],
        length: 18 + (i % 3) * 4,
      })),
    []
  );

  return (
    <group ref={group} position={[-22, 6, -42]}>
      <mesh>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[4, -0.5, 0]}
          rotation={ray.rotation}
        >
          <planeGeometry args={[ray.length, 0.35]} />
          <meshBasicMaterial
            color="#ffaa44"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CastleEmergence({ morph }) {
  const group = useRef();

  useFrame(() => {
    if (!group.current) return;
    group.current.visible = morph > 0.02;
    group.current.scale.setScalar(0.3 + morph * 0.7);
    group.current.position.y = -3.5 + morph * 2.5;
  });

  return (
    <group ref={group} position={[0, -3.5, -10]} visible={false}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#5a5a62" roughness={0.95} />
      </mesh>
      <mesh position={[-3.2, 2.2, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 4.5, 8]} />
        <meshStandardMaterial color="#4a4a52" roughness={0.95} />
      </mesh>
      <mesh position={[3.2, 2.2, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 4.5, 8]} />
        <meshStandardMaterial color="#4a4a52" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.8, 0]}>
        <coneGeometry args={[1.2, 1.5, 4]} />
        <meshStandardMaterial color="#3a3a42" roughness={1} />
      </mesh>
      {[-2.8, 2.8].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 2.2]}>
          <boxGeometry args={[0.8, 2.5, 0.4]} />
          <meshStandardMaterial color="#6a6a72" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function AncientEgyptText() {
  const progress = useSceneScrollProgress(EGYPT_INDEX);
  const opacity = scrollTextOpacity(progress);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12%",
        width: "100%",
        textAlign: "center",
        color: "#ffe8b8",
        fontSize: "clamp(18px, 3vw, 26px)",
        fontFamily: "Georgia, 'Times New Roman', serif",
        letterSpacing: "0.04em",
        textShadow: "0 0 24px rgba(255, 180, 60, 0.55), 0 2px 8px rgba(0,0,0,0.9)",
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.35s ease",
        zIndex: 10,
      }}
    >
      Where civilizations first shaped history.
    </div>
  );
}

export default function AncientEgypt() {
  const scroll = useSceneScrollProgress(EGYPT_INDEX);
  const morph = Math.max(0, (scroll - 0.72) / 0.28);

  const farLayer = useRef();
  const midLayer = useRef();
  const nearLayer = useRef();
  const rig = useRef();

  useFrame(() => {
    const travel = scroll * 18;

    if (rig.current) rig.current.position.z = -travel;
    if (farLayer.current) farLayer.current.position.z = -travel * 0.22;
    if (midLayer.current) midLayer.current.position.z = -travel * 0.5;
    if (nearLayer.current) nearLayer.current.position.z = -travel * 0.8;
  });

  return (
    <group ref={rig}>
      <color attach="background" args={["#3d2818"]} />
      <fog attach="fog" args={["#5a3820", 10, 60]} />

      <ambientLight intensity={0.35} color="#ffcc88" />
      <directionalLight position={[-18, 10, -20]} intensity={2.2} color="#ff9944" />
      <directionalLight position={[8, 6, 10]} intensity={0.4} color="#ffddaa" />
      <hemisphereLight args={["#ffbb66", "#3a2010", 0.5]} />
      <pointLight position={[-15, 5, -30]} intensity={1.5} color="#ff8833" distance={50} />

      <SunRays />

      <group ref={farLayer}>
        <DesertMountains />
        <Pyramids />
        <Sandstorm />
      </group>

      <group ref={midLayer}>
        <GoldenDesert morph={morph} />
        <Sphinx />
        <Temple position={[-10, -3, -22]} rotation={0.3} />
        <Temple position={[12, -3, -26]} rotation={-0.5} />
        <PalmTree position={[-6, -3, -12]} />
        <PalmTree position={[5, -3, -14]} />
        <PalmTree position={[-14, -3, -16]} />
        <Banner position={[-9, -3, -20]} />
        <Banner position={[11, -3, -24]} />
        <Hieroglyphs />
      </group>

      <group ref={nearLayer}>
        <DesertBird offset={0} radius={9} height={5} speed={0.3} />
        <DesertBird offset={1.8} radius={11} height={6} speed={0.25} />
        <DesertBird offset={3.5} radius={7} height={4.5} speed={0.35} />
        <BlowingSand />
        <DustParticles />
        <CastleEmergence morph={morph} />
      </group>
    </group>
  );
}
