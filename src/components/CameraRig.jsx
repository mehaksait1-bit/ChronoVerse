import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useScrollContext } from "../context/ScrollContext";

export default function CameraRig({ loadingZoom = 0 }) {
  const { camera, mouse } = useThree();
  const scroll = useScrollContext();

  const sectionProgress = scroll?.sectionProgress ?? 0;
  const globalProgress = scroll?.globalProgress ?? 0;
  const sceneIndex = scroll?.sceneIndex ?? 0;

  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const baseZ = 3;
  const zoomRef = useRef(0);

  useFrame(() => {
    zoomRef.current += (loadingZoom - zoomRef.current) * 0.03;

    const dolly = Math.sin(sectionProgress * Math.PI) * 0.9;
    const crane = Math.sin(globalProgress * Math.PI * 2) * 0.12;
    const eraBias = sceneIndex * 0.04;
    const loadPull = zoomRef.current * 0.35;

    const targetX = mouse.x * 1.1 + Math.sin(sectionProgress * Math.PI) * 0.25;
    const targetY = mouse.y * 0.7 + crane + eraBias;
    const targetZ = baseZ - dolly - loadPull;

    camera.position.x += (targetX - camera.position.x) * 0.045;
    camera.position.y += (targetY - camera.position.y) * 0.045;
    camera.position.z += (targetZ - camera.position.z) * 0.06;

    lookAt.current.set(
      Math.sin(sectionProgress * Math.PI) * 0.3,
      Math.cos(sectionProgress * Math.PI * 0.5) * 0.15,
      0
    );
    camera.lookAt(lookAt.current);

    if (camera.isPerspectiveCamera) {
      const targetFov = 48 + Math.sin(sectionProgress * Math.PI) * 3 - zoomRef.current * 4;
      camera.fov += (targetFov - camera.fov) * 0.04;
      camera.updateProjectionMatrix();
    }

    camera.rotation.z += ((mouse.x * 0.015 - camera.rotation.z) * 0.03);
  });

  return null;
}
