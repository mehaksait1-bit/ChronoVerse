import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import * as THREE from "three";

const FOG = {
  intro: { color: "#000000", density: 0.045 },
  prehistoric: { color: "#2a1208", density: 0.028 },
  egypt: { color: "#5a3820", density: 0.022 },
  medieval: { color: "#0b1020", density: 0.032 },
  modern: { color: "#081229", density: 0.02 },
  future: { color: "#0a0820", density: 0.025 },
  beyond: { color: "#000010", density: 0.015 },
};

export default function VolumetricFog({ scene = "intro" }) {
  const { scene: threeScene } = useThree();
  const clouds = useRef();
  const target = useRef(new THREE.Color(FOG.intro.color));
  const current = useRef(new THREE.Color(FOG.intro.color));
  const density = useRef(FOG.intro.density);

  useFrame(() => {
    const cfg = FOG[scene] || FOG.intro;
    target.current.set(cfg.color);
    current.current.lerp(target.current, 0.035);
    density.current += (cfg.density - density.current) * 0.04;

    if (!threeScene.fog) {
      threeScene.fog = new THREE.FogExp2(current.current, density.current);
    }

    const fog = threeScene.fog;
    if (fog.isFogExp2) {
      fog.color.copy(current.current);
      fog.density = density.current;
    }

    if (clouds.current) {
      clouds.current.position.y = Math.sin(performance.now() * 0.0003) * 0.5;
    }
  });

  return (
    <group ref={clouds}>
      <Cloud
        opacity={0.08}
        speed={0.06}
        bounds={[30, 4, 20]}
        segments={12}
        color="#ffffff"
        position={[0, -2, -15]}
      />
      <Cloud
        opacity={0.06}
        speed={0.04}
        bounds={[25, 3, 18]}
        segments={10}
        color="#8899aa"
        position={[5, 1, -20]}
      />
      <Cloud
        opacity={0.05}
        speed={0.05}
        bounds={[20, 5, 15]}
        segments={8}
        color="#6644aa"
        position={[-6, 3, -12]}
      />
    </group>
  );
}
