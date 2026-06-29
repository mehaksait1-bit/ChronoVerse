import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import * as THREE from "three";

import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

const PREHISTORIC_INDEX = 1;

function terrainHeight(x, z) {
  const ridge =
    Math.sin(x * 0.12) * Math.cos(z * 0.1) * 2.2 +
    Math.sin(x * 0.28 + 1.1) * Math.cos(z * 0.32) * 0.9 +
    Math.sin((x + z) * 0.06) * 1.4;
  const crater = Math.exp(-((x * x) / 120 + (z + 18) * (z + 18) / 80)) * 3;
  return ridge + crater;
}

function VolcanicTerrain({ size = 90, segments = 48 }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, terrainHeight(x, y));
    }

    geo.computeVertexNormals();
    return geo;
  }, [size, segments]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} geometry={geometry}>
      <meshStandardMaterial color="#3d2818" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function DistantHills() {
  const hills = useMemo(
    () => [
      { pos: [-22, -3.5, -42], scale: [14, 5, 8] },
      { pos: [18, -3.8, -48], scale: [16, 6, 9] },
      { pos: [-8, -3.2, -55], scale: [20, 7, 10] },
      { pos: [30, -4, -38], scale: [12, 4.5, 7] },
    ],
    []
  );

  return (
    <group>
      {hills.map((hill, i) => (
        <mesh key={i} position={hill.pos} scale={hill.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#2a1a10" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Volcano({ scroll }) {
  const group = useRef();
  const glow = useRef();
  const smoke = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (group.current) {
      group.current.position.y = -2 + Math.sin(t * 0.4) * 0.08;
    }

    if (glow.current) {
      glow.current.intensity = 2.2 + Math.sin(t * 3) * 0.6;
    }

    if (smoke.current) {
      smoke.current.position.y = 5.5 + Math.sin(t * 0.5) * 0.3;
      smoke.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, -2, -38 - scroll * 4]}>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[5, 9, 12]} />
        <meshStandardMaterial color="#2b1c14" roughness={1} />
      </mesh>

      <mesh position={[1.8, 1.2, 1.2]} scale={[0.6, 0.5, 0.6]}>
        <coneGeometry args={[2.5, 4, 8]} />
        <meshStandardMaterial color="#352218" roughness={1} />
      </mesh>

      <mesh position={[-2, 3.8, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[4, 3, 8]} />
        <meshStandardMaterial color="#1f1410" roughness={1} />
      </mesh>

      <mesh position={[0, 5.2, 0]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial
          color="#ff6b1a"
          emissive="#ff4500"
          emissiveIntensity={2}
        />
      </mesh>

      <pointLight
        ref={glow}
        position={[0, 5.5, 0]}
        color="#ff7722"
        intensity={2.2}
        distance={30}
      />

      <group ref={smoke} position={[0, 5.5, 0]}>
        <Cloud opacity={0.35} speed={0.15} bounds={[6, 2, 2]} segments={12} color="#554433" />
        <Cloud
          opacity={0.25}
          speed={0.2}
          bounds={[4, 3, 2]}
          segments={10}
          position={[0, 2, 0]}
          color="#665544"
        />
        <Cloud
          opacity={0.2}
          speed={0.12}
          bounds={[5, 4, 2]}
          segments={8}
          position={[0, 4.5, 0]}
          color="#443322"
        />
      </group>
    </group>
  );
}

function SmokeParticles({ count = 40 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 10;
      speeds[i] = 0.008 + Math.random() * 0.015;
    }

    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + data.speeds[i];
      let x = pos.getX(i) + Math.sin(y * 2 + i) * 0.003;

      if (y > 12) {
        y = Math.random() * 2;
        x = (Math.random() - 0.5) * 18;
      }

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
        size={0.18}
        color="#887766"
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function AshParticles({ count = 80 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 14 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = 0.02 + Math.random() * 0.04;
    }

    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - data.speeds[i];
      const x = pos.getX(i) + Math.sin(y + i) * 0.004;

      if (y < -2) {
        y = 12 + Math.random() * 4;
        pos.setZ(i, (Math.random() - 0.5) * 20);
      }

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
        size={0.06}
        color="#aa8866"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Bird({ offset, radius, height, speed }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (!ref.current) return;

    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius - 8;
    ref.current.position.y = height + Math.sin(t * 2) * 0.4;
    ref.current.rotation.y = -t + Math.PI / 2;
    ref.current.rotation.z = Math.sin(t * 3) * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.6]}>
        <coneGeometry args={[0.12, 0.5, 4]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.6]}>
        <coneGeometry args={[0.12, 0.5, 4]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  );
}

function Birds() {
  return (
    <group>
      <Bird offset={0} radius={7} height={5} speed={0.35} />
      <Bird offset={2.1} radius={9} height={6.5} speed={0.28} />
      <Bird offset={4.5} radius={5.5} height={4.2} speed={0.42} />
    </group>
  );
}

function Dinosaur({ position, scale = 1, color = "#2d4a35" }) {
  const body = useRef();
  const tail = useRef();
  const head = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (body.current) {
      body.current.position.y = Math.sin(t * 0.8) * 0.06;
    }
    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 0.6) * 0.12;
    }
    if (head.current) {
      head.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      <group ref={body}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.9, 2.8]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>

        <mesh ref={head} position={[0, 0.5, 1.6]}>
          <boxGeometry args={[0.5, 0.5, 0.9]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>

        <group ref={tail} position={[0, 0.1, -1.5]}>
          <mesh position={[0, 0.1, -0.8]}>
            <boxGeometry args={[0.35, 0.35, 1.4]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        </group>

        {[
          [-0.45, -0.5, 0.8],
          [0.45, -0.5, 0.8],
          [-0.45, -0.5, -0.6],
          [0.45, -0.5, -0.6],
        ].map((leg, i) => (
          <mesh key={i} position={leg}>
            <boxGeometry args={[0.25, 0.7, 0.25]} />
            <meshStandardMaterial color="#1f3028" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ForegroundRocks() {
  const rocks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 30,
          -3.8 + Math.random() * 0.5,
          (Math.random() - 0.5) * 15 + 4,
        ],
        scale: 0.4 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <group>
      {rocks.map((rock, i) => (
        <mesh key={i} position={rock.pos} scale={rock.scale}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#2a1c12" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function PrehistoricEraText() {
  const progress = useSceneScrollProgress(PREHISTORIC_INDEX);
  const opacity = scrollTextOpacity(progress);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12%",
        width: "100%",
        textAlign: "center",
        color: "#ffd4a8",
        fontSize: "clamp(18px, 3vw, 26px)",
        fontFamily: "Georgia, 'Times New Roman', serif",
        letterSpacing: "0.04em",
        textShadow: "0 0 24px rgba(255, 100, 30, 0.6), 0 2px 8px rgba(0,0,0,0.9)",
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.35s ease",
        zIndex: 10,
      }}
    >
      Every story begins at the dawn of time.
    </div>
  );
}

export default function PrehistoricEra() {
  const scroll = useSceneScrollProgress(PREHISTORIC_INDEX);
  const farLayer = useRef();
  const midLayer = useRef();
  const nearLayer = useRef();
  const rig = useRef();

  useFrame(() => {
    const travel = scroll * 22;

    if (rig.current) {
      rig.current.position.z = -travel;
    }
    if (farLayer.current) {
      farLayer.current.position.z = -travel * 0.25;
    }
    if (midLayer.current) {
      midLayer.current.position.z = -travel * 0.55;
    }
    if (nearLayer.current) {
      nearLayer.current.position.z = -travel * 0.85;
    }
  });

  return (
    <group ref={rig}>
      <color attach="background" args={["#1a0c06"]} />

      <fog attach="fog" args={["#2a1208", 8, 55]} />

      <ambientLight intensity={0.22} color="#ffaa66" />
      <directionalLight
        position={[-8, 12, 6]}
        intensity={1.8}
        color="#ff8833"
      />
      <directionalLight
        position={[12, 4, -10]}
        intensity={0.5}
        color="#ff6622"
      />
      <hemisphereLight
        args={["#ff9944", "#1a0a05", 0.45]}
      />

      <group ref={farLayer}>
        <DistantHills />
        <Volcano scroll={scroll} />
      </group>

      <group ref={midLayer}>
        <VolcanicTerrain />
        <Dinosaur position={[-14, -2.8, -18]} scale={1.4} color="#2a4535" />
        <Dinosaur position={[16, -2.6, -24]} scale={1.8} color="#1f3b2c" />
        <Dinosaur position={[-6, -2.5, -30]} scale={2.2} color="#243d30" />
      </group>

      <group ref={nearLayer}>
        <ForegroundRocks />
        <Birds />
        <SmokeParticles />
        <AshParticles />
      </group>
    </group>
  );
}
