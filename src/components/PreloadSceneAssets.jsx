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

function ProgressReporter({ onProgress, onIdle, staticReady }) {
  const { progress, active, loaded, total } = useProgress();
  const idleSent = useRef(false);

  useEffect(() => {
    if (!staticReady) return;

    const threePct = total > 0 ? progress : 100;
    const combined = 40 + Math.round(threePct * 0.6);
    onProgress(Math.min(100, combined));
  }, [progress, total, staticReady, onProgress]);

  useEffect(() => {
    if (!staticReady || idleSent.current) return;

    if (total > 0 && !active && loaded >= total) {
      idleSent.current = true;
      onProgress(100);
      onIdle();
    }
  }, [active, loaded, total, staticReady, onProgress, onIdle]);

  useEffect(() => {
    if (!staticReady || idleSent.current) return;

    const fallback = window.setTimeout(() => {
      if (!idleSent.current) {
        idleSent.current = true;
        onProgress(100);
        onIdle();
      }
    }, 2500);

    return () => clearTimeout(fallback);
  }, [staticReady, onProgress, onIdle]);

  return null;
}

export default function PreloadSceneAssets({ onProgress, onIdle, staticReady }) {
  return (
    <>
      <ProgressReporter
        onProgress={onProgress}
        onIdle={onIdle}
        staticReady={staticReady}
      />
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
