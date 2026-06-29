import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

const MODERN_INDEX = 4;

function Sky({ night }) {
  const { scene } = useThree();
  useFrame(() => {
    scene.background = new THREE.Color(
      THREE.MathUtils.lerp(0.45, 0.04, night),
      THREE.MathUtils.lerp(0.65, 0.06, night),
      THREE.MathUtils.lerp(0.95, 0.15, night)
    );
  });
  return null;
}

function Skyscraper({ position, height, width, night, morph }) {
  const windows = useRef();
  const future = useRef();

  useFrame(() => {
    if (windows.current) {
      windows.current.emissiveIntensity = night * 0.8 + 0.1;
    }
    if (future.current) {
      future.current.visible = morph > 0.05;
      future.current.scale.y = morph;
      future.current.material.emissiveIntensity = morph * 1.5;
    }
  });

  return (
    <group position={position}>
      <mesh scale={[width, height, width]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a2235" metalness={0.7} roughness={0.15} transparent opacity={1 - morph * 0.5} />
      </mesh>
      <mesh scale={[width * 0.85, height * 0.95, width * 1.02]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={windows} color="#0a1020" emissive="#ffcc66" emissiveIntensity={0.1} />
      </mesh>
      <mesh ref={future} visible={false} scale={[width, 0, width]} position={[0, height * 0.3, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a1530" emissive="#00e5ff" emissiveIntensity={0} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function City({ night, morph }) {
  const buildings = useMemo(
    () => [
      { pos: [-5, 0, -12], h: 6, w: 1.2 },
      { pos: [-2, 0, -15], h: 8, w: 1.4 },
      { pos: [1, 0, -10], h: 5, w: 1 },
      { pos: [4, 0, -18], h: 9, w: 1.5 },
      { pos: [-7, 0, -20], h: 4, w: 1 },
      { pos: [7, 0, -14], h: 7, w: 1.3 },
      { pos: [0, 0, -22], h: 10, w: 1.6 },
      { pos: [-3, 0, -8], h: 4.5, w: 0.9 },
      { pos: [5, 0, -25], h: 6.5, w: 1.1 },
    ],
    []
  );
  return (
    <group position={[0, -3, 0]}>
      {buildings.map((b, i) => (
        <Skyscraper key={i} position={b.pos} height={b.h} width={b.w} night={night} morph={morph} />
      ))}
    </group>
  );
}

function Road() {
  return (
    <group position={[0, -2.95, -8]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.9} />
      </mesh>
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x * 0.15, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 40]} />
          <meshBasicMaterial color="#ffcc44" />
        </mesh>
      ))}
    </group>
  );
}

function Car({ lane, speed, offset, night: isNight }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const z = ((clock.getElapsedTime() * speed + offset) % 30) - 15;
    ref.current.position.set(lane, -2.7, z);
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.5, 0.25, 0.9]} />
      <meshStandardMaterial color="#2244aa" emissive={isNight ? "#4488ff" : "#000000"} emissiveIntensity={isNight ? 0.4 : 0} />
    </mesh>
  );
}

function Traffic({ night }) {
  return (
    <group>
      <Car lane={-0.6} speed={4} offset={0} night={night} />
      <Car lane={0.6} speed={-3.5} offset={5} night={night} />
      <Car lane={-0.6} speed={5} offset={10} night={night} />
      <Car lane={0.6} speed={-4.5} offset={15} night={night} />
    </group>
  );
}

function Park() {
  return (
    <group position={[-8, -3, -10]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#2a5a30" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 1.2, 0.6, (i - 1) * 0.8]}>
          <coneGeometry args={[0.4, 1.2, 6]} />
          <meshStandardMaterial color="#1a4028" />
        </mesh>
      ))}
    </group>
  );
}

function Bridge() {
  return (
    <group position={[6, -2.5, -16]}>
      <mesh>
        <boxGeometry args={[6, 0.3, 1.2]} />
        <meshStandardMaterial color="#888890" metalness={0.5} />
      </mesh>
    </group>
  );
}

function Drone({ offset }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (!ref.current) return;
    ref.current.position.set(Math.sin(t * 0.5) * 6, 3 + Math.sin(t) * 0.5, -8 + Math.cos(t * 0.4) * 4);
    ref.current.rotation.y = t;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.3, 0.08, 0.3]} />
      <meshStandardMaterial color="#333" emissive="#00ccff" emissiveIntensity={0.8} />
    </mesh>
  );
}

function Person({ offset, x }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const t = clock.getElapsedTime() * 0.8 + offset;
    ref.current.position.set(x + Math.sin(t) * 0.3, -2.85, -6 + ((t * 0.5) % 8));
  });
  return (
    <mesh ref={ref} scale={[0.15, 0.4, 0.1]}>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="#334455" />
    </mesh>
  );
}

function Billboard({ position }) {
  const mat = useRef();
  useFrame(({ clock }) => {
    if (mat.current) {
      const c = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 0.5;
      mat.current.emissive.setRGB(c * 0.2, c * 0.5, 1);
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial ref={mat} color="#111" emissive="#2266ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}

function Helicopter({ offset }) {
  const ref = useRef();
  const rotor = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t * 0.2) * 10, 5 + Math.sin(t * 0.5), -14);
    }
    if (rotor.current) rotor.current.rotation.y = t * 8;
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.8, 0.4, 1.2]} />
        <meshStandardMaterial color="#445566" />
      </mesh>
      <mesh ref={rotor} position={[0, 0.35, 0]}>
        <boxGeometry args={[2.5, 0.04, 0.15]} />
        <meshBasicMaterial color="#222" />
      </mesh>
    </group>
  );
}

export function ModernWorldText() {
  const progress = useSceneScrollProgress(MODERN_INDEX);
  const opacity = scrollTextOpacity(progress);
  return (
    <div style={{
      position: "fixed", bottom: "12%", width: "100%", textAlign: "center",
      color: "#e8f0ff", fontSize: "clamp(18px, 3vw, 26px)",
      fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.04em",
      textShadow: "0 0 20px rgba(100, 160, 255, 0.5), 0 2px 8px rgba(0,0,0,0.9)",
      pointerEvents: "none", opacity, transition: "opacity 0.35s ease", zIndex: 10,
    }}>
      The world we continue to build.
    </div>
  );
}

export default function ModernWorld() {
  const scroll = useSceneScrollProgress(MODERN_INDEX);
  const night = Math.min(1, scroll * 1.4);
  const morph = Math.max(0, (scroll - 0.72) / 0.28);
  const sun = useRef();
  const amb = useRef();
  const rig = useRef();

  useFrame(() => {
    const travel = scroll * 14;
    if (rig.current) rig.current.position.z = -travel;
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.2, 0.3, night);
      sun.current.color.setRGB(
        THREE.MathUtils.lerp(1, 0.3, night),
        THREE.MathUtils.lerp(0.95, 0.4, night),
        THREE.MathUtils.lerp(0.8, 0.9, night)
      );
    }
    if (amb.current) amb.current.intensity = THREE.MathUtils.lerp(0.5, 0.15, night);
  });

  return (
    <group ref={rig}>
      <Sky night={night} />
      <fog attach="fog" args={["#081229", 8, 45]} />

      <ambientLight ref={amb} intensity={0.5} />
      <directionalLight ref={sun} position={[10, 15, 8]} intensity={2.2} castShadow />
      <hemisphereLight args={["#88aaff", "#0a1020", 0.5]} />

      <City night={night} morph={morph} />
      <Road />
      <Traffic night={night} />
      <Park />
      <Bridge />
      <Billboard position={[3, -3, -11]} />
      <Billboard position={[-4, -3, -17]} />
      <Drone offset={0} />
      <Drone offset={3} />
      <Person offset={0} x={-1} />
      <Person offset={2} x={1.2} />
      <Person offset={4} x={0} />
      <Helicopter offset={0} />
      <Helicopter offset={5} />
    </group>
  );
}
