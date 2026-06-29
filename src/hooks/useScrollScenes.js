import { useEffect, useState } from "react";

export default function useScrollScenes() {
  const scenes = [
    "intro",
    "prehistoric",
    "egypt",
    "medieval",
    "modern",
    "future",
    "beyond",
  ];

  const [scene, setScene] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const index = Math.floor(scrollY / vh);

      setScene(scenes[Math.max(0, Math.min(index, scenes.length - 1))]);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scene;
}