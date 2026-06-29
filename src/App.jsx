import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import { ScrollProvider, useScrollContext } from "./context/ScrollContext";
import LoadingScreen from "./components/LoadingScreen";
import CameraRig from "./components/CameraRig";
import VolumetricFog from "./components/VolumetricFog";
import AmbientParticles from "./components/AmbientParticles";
import SceneFadeOverlay from "./components/SceneFadeOverlay";
import SceneOverlays from "./components/SceneOverlays";
import { preloadStaticAssets } from "./utils/preloadScenes";

const IntroScene = lazy(() => import("./scenes/IntroScene"));
const PrehistoricEra = lazy(() => import("./scenes/PrehistoricEra"));
const AncientEgypt = lazy(() => import("./scenes/AncientEgypt"));
const MedievalKingdom = lazy(() => import("./scenes/MedievalKingdom"));
const ModernWorld = lazy(() => import("./scenes/ModernWorld"));
const Future2200 = lazy(() => import("./scenes/Future2200"));
const BeyondTime = lazy(() => import("./scenes/BeyondTime"));

const PREHISTORIC_INDEX = 1;
const LOADER_MAX_MS = 8000;

function SceneCanvas({ forceScene, isPreloading }) {
  const { scene } = useScrollContext() ?? {};
  const activeScene = forceScene ?? scene;

  return (
    <Canvas
      camera={{ position: [2, 2, 3], fov: 48 }}
      dpr={[1, 1.75]}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
      }}
    >
      <CameraRig loadingZoom={isPreloading ? 1 : 0} />
      <VolumetricFog scene={activeScene} />
      <AmbientParticles scene={activeScene} />
      <OrbitControls enableZoom={false} enablePan={false} />

      <Suspense fallback={null}>
        {activeScene === "intro" && <IntroScene />}
        {activeScene === "prehistoric" && <PrehistoricEra />}
        {activeScene === "egypt" && <AncientEgypt />}
        {activeScene === "medieval" && <MedievalKingdom />}
        {activeScene === "modern" && <ModernWorld />}
        {activeScene === "future" && <Future2200 />}
        {activeScene === "beyond" && <BeyondTime />}
      </Suspense>

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />

      <EffectComposer>
        <Bloom
          intensity={
            activeScene === "beyond" ? 1.9 : activeScene === "future" ? 1.55 : 1.25
          }
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.55} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}

function Experience({ forceScene, isPreloading, revealed }) {
  return (
    <>
      <div id="chronoverse-scroll" className="scroll-track" />

      <div
        className="canvas-shell"
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <SceneCanvas forceScene={forceScene} isPreloading={isPreloading} />
      </div>

      {revealed && (
        <>
          <SceneFadeOverlay />
          <SceneOverlays />
        </>
      )}
    </>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [overlayPhase, setOverlayPhase] = useState("loading");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let exitStarted = false;

    const beginExit = () => {
      if (cancelled || exitStarted) return;
      exitStarted = true;
      setProgress(100);
      setOverlayPhase("journey");

      window.setTimeout(() => {
        if (!cancelled) setOverlayPhase("exiting");
      }, 1000);
    };

    preloadStaticAssets((value) => {
      if (!cancelled) setProgress((prev) => Math.max(prev, value));
    })
      .then(beginExit)
      .catch(beginExit);

    const maxTimer = window.setTimeout(beginExit, LOADER_MAX_MS);

    return () => {
      cancelled = true;
      clearTimeout(maxTimer);
    };
  }, []);

  const isLoading = overlayPhase === "loading" || overlayPhase === "journey";
  const revealed = overlayPhase === "exiting" || overlayPhase === "gone";
  const scrollEnabled = overlayPhase === "gone";

  return (
    <>
      <ScrollProvider enabled={scrollEnabled} initialSceneIndex={PREHISTORIC_INDEX}>
        <Experience
          forceScene={isLoading ? "prehistoric" : undefined}
          isPreloading={isLoading}
          revealed={revealed}
        />
      </ScrollProvider>

      {overlayPhase !== "gone" && (
        <LoadingScreen
          progress={progress}
          phase={overlayPhase}
          onExitComplete={() => setOverlayPhase("gone")}
        />
      )}
    </>
  );
}
