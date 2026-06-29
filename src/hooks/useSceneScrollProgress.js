import { useEffect, useState } from "react";

import { useScrollContext } from "../context/ScrollContext";

export default function useSceneScrollProgress(sceneIndex) {
  const scroll = useScrollContext();
  const [fallback, setFallback] = useState(0);

  useEffect(() => {
    if (scroll) return;

    const update = () => {
      const vh = window.innerHeight;
      const local = (window.scrollY - sceneIndex * vh) / vh;
      setFallback(Math.max(0, Math.min(1, local)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [scroll, sceneIndex]);

  if (scroll) {
    if (scroll.sceneIndex === sceneIndex) return scroll.sectionProgress;
    if (scroll.sceneIndex > sceneIndex) return 1;
    return 0;
  }

  return fallback;
}

export function scrollTextOpacity(progress) {
  if (progress < 0.12) return progress / 0.12;
  if (progress > 0.78) return (1 - progress) / 0.22;
  return 1;
}
