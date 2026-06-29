import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SCENE_IDS } from "../utils/preloadScenes";

gsap.registerPlugin(ScrollTrigger);

const ScrollContext = createContext(null);

export function ScrollProvider({ children, enabled = true, initialSceneIndex = 0 }) {
  const [scene, setScene] = useState(SCENE_IDS[initialSceneIndex] ?? "intro");
  const [sceneIndex, setSceneIndex] = useState(initialSceneIndex);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);
  const activeIndex = useRef(initialSceneIndex);
  const transitioning = useRef(false);

  const transitionToScene = useCallback((index) => {
    if (index === activeIndex.current || transitioning.current) return;

    transitioning.current = true;
    const nextScene = SCENE_IDS[index];
    const overlay = document.getElementById("scene-fade-overlay");

    if (!overlay) {
      activeIndex.current = index;
      setScene(nextScene);
      setSceneIndex(index);
      transitioning.current = false;
      return;
    }

    gsap
      .timeline({
        onComplete: () => {
          transitioning.current = false;
        },
      })
      .to(overlay, {
        opacity: 0.65,
        duration: 0.28,
        ease: "power2.inOut",
      })
      .call(() => {
        activeIndex.current = index;
        setScene(nextScene);
        setSceneIndex(index);
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
      });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const scrollEl = document.getElementById("chronoverse-scroll");
    if (!scrollEl) return;

    const updateProgress = (self) => {
      const progress = self.progress;
      const rawIndex = progress * (SCENE_IDS.length - 1);
      const index = Math.min(
        Math.max(0, Math.floor(rawIndex + 0.0001)),
        SCENE_IDS.length - 1
      );
      const section = Math.min(1, Math.max(0, rawIndex - index));

      setGlobalProgress(progress);
      setSectionProgress(section);

      if (index !== activeIndex.current) {
        transitionToScene(index);
      }
    };

    const main = ScrollTrigger.create({
      trigger: scrollEl,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: updateProgress,
    });

    ScrollTrigger.create({
      trigger: scrollEl,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: 1 / (SCENE_IDS.length - 1),
        duration: { min: 0.35, max: 0.85 },
        delay: 0.04,
        ease: "power3.inOut",
      },
    });

    const startProgress = initialSceneIndex / (SCENE_IDS.length - 1);
    const scrollMax =
      document.documentElement.scrollHeight - window.innerHeight;

    if (initialSceneIndex > 0 && scrollMax > 0) {
      window.scrollTo(0, scrollMax * startProgress);
    }

    activeIndex.current = initialSceneIndex;
    setScene(SCENE_IDS[initialSceneIndex]);
    setSceneIndex(initialSceneIndex);
    setGlobalProgress(startProgress);
    setSectionProgress(0);

    updateProgress({ progress: startProgress });

    return () => {
      main.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [enabled, initialSceneIndex, transitionToScene]);

  return (
    <ScrollContext.Provider
      value={{
        scene,
        sceneIndex,
        sectionProgress,
        globalProgress,
        scenes: SCENE_IDS,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  return useContext(ScrollContext);
}
