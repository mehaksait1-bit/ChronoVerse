import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const data = {
  intro: { color: "#000000", near: 1, far: 10 },
  prehistoric: { color: "#2a1208", near: 6, far: 50 },
  egypt: { color: "#5a3820", near: 8, far: 55 },
  medieval: { color: "#0b1020", near: 4, far: 38 },
  modern: { color: "#081229", near: 6, far: 48 },
  future: { color: "#0a0820", near: 8, far: 55 },
  beyond: { color: "#000010", near: 15, far: 80 },
};

export default function Atmosphere({ scene }) {
  const { scene: threeScene } = useThree();

  useFrame(() => {
    const target = data[scene] || data.intro;

    if (!threeScene.fog) {
      threeScene.fog = new THREE.Fog(target.color, target.near, target.far);
    }

    const fog = threeScene.fog;

    // smooth distance transition
    fog.near += (target.near - fog.near) * 0.04;
    fog.far += (target.far - fog.far) * 0.04;

    // smooth color transition
    const current = new THREE.Color(fog.color);
    const targetColor = new THREE.Color(target.color);

    current.lerp(targetColor, 0.03);
    fog.color.copy(current);
  });

  return null;
}