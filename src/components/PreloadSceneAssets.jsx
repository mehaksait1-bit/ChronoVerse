import { Suspense, lazy, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

const IntroScene = lazy(() => import("../scenes/IntroScene"));
const PrehistoricEra = lazy(() => import("../scenes/PrehistoricEra"));
const AncientEgypt = lazy(() => import("../scenes/AncientEgypt"));
const MedievalKingdom = lazy(() => import("../scenes/MedievalKingdom"));
const ModernWorld = lazy(() => import("../scenes/ModernWorld"));
const Future2200 = lazy(() => import("../scenes/Future2200"));
const BeyondTime = lazy(() => import("../scenes/BeyondTime"));

const ALL_SCENES = [
  IntroScene,
  PrehistoricEra,
  AncientEgypt,
  MedievalKingdom,
  ModernWorld,
  Future2200,
  BeyondTime,
];

function ProgressReporter({ onProgress, onIdle }) {
  const { progress, active, loaded, total } = useProgress();
  const idleSent = useRef(false);

  const finish = () => {
    if (idleSent.current) return;
    idleSent.current = true;
    onProgress(100);
    onIdle();
  };

  useEffect(() => {
    const threePct = total > 0 ? progress : 100;
    const combined = 40 + Math.round(threePct * 0.6);
    onProgress(Math.min(99, combined));
  }, [progress, total, onProgress]);

  useEffect(() => {
    if (total > 0 && !active && loaded >= total) {
      finish();
    }
  }, [active, loaded, total]);

  useEffect(() => {
    const fallback = window.setTimeout(finish, 1500);
    return () => clearTimeout(fallback);
  }, []);

  return null;
}

export default function PreloadSceneAssets({ onProgress, onIdle }) {
  return (
    <>
      <ProgressReporter onProgress={onProgress} onIdle={onIdle} />
      <Suspense fallback={null}>
        <group position={[0, -5000, 0]} visible={false}>
          {ALL_SCENES.map((Scene, i) => (
            <Scene key={i} />
          ))}
        </group>
      </Suspense>
    </>
  );
}
