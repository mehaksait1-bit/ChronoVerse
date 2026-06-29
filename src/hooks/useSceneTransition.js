import { useState } from "react";
import gsap from "gsap";

export default function useSceneTransition(initialScene) {
  const [scene, setScene] = useState(initialScene);
  const [loading, setLoading] = useState(false);

  const changeScene = (nextScene) => {
    if (loading) return;

    setLoading(true);

    // fade out screen
    gsap.to(".fade", {
      opacity: 1,
      duration: 0.4,
      onComplete: () => {
        setScene(nextScene);

        // fade in after change
        gsap.to(".fade", {
          opacity: 0,
          duration: 0.6,
          onComplete: () => setLoading(false),
        });
      },
    });
  };

  return { scene, changeScene };
}