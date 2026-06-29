import { useScrollContext } from "../context/ScrollContext";
import useSceneScrollProgress, {
  scrollTextOpacity,
} from "../hooks/useSceneScrollProgress";

import MotionSceneText from "./MotionSceneText";
import BeyondTimeUI from "./BeyondTimeUI";

const CAPTIONS = [
  {
    key: "prehistoric",
    index: 1,
    text: "Every story begins at the dawn of time.",
    style: {
      color: "#ffd4a8",
      textShadow: "0 0 24px rgba(255, 100, 30, 0.6), 0 2px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    key: "egypt",
    index: 2,
    text: "Where civilizations first shaped history.",
    style: {
      color: "#ffe8b8",
      textShadow: "0 0 24px rgba(255, 180, 60, 0.55), 0 2px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    key: "medieval",
    index: 3,
    text: "The age of kings, courage, and legends.",
    style: {
      color: "#c8d4f0",
      textShadow: "0 0 20px rgba(100, 140, 255, 0.5), 0 2px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    key: "modern",
    index: 4,
    text: "The world we continue to build.",
    style: {
      color: "#e8f0ff",
      textShadow: "0 0 20px rgba(100, 160, 255, 0.5), 0 2px 8px rgba(0,0,0,0.9)",
    },
  },
  {
    key: "future",
    index: 5,
    text: "The future belongs to the curious.",
    style: {
      color: "#e0ccff",
      textShadow:
        "0 0 24px rgba(180, 80, 255, 0.6), 0 0 12px rgba(0, 229, 255, 0.4), 0 2px 8px rgba(0,0,0,0.9)",
    },
  },
];

function EraCaption({ sceneKey, sceneIndex, text, style }) {
  const { scene } = useScrollContext();
  const progress = useSceneScrollProgress(sceneIndex);
  const opacity = scrollTextOpacity(progress);

  return (
    <MotionSceneText visible={scene === sceneKey} style={{ opacity }}>
      <span
        style={{
          fontSize: "clamp(18px, 3vw, 26px)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "0.04em",
          ...style,
        }}
      >
        {text}
      </span>
    </MotionSceneText>
  );
}

export default function SceneOverlays() {
  const { scene } = useScrollContext() ?? {};

  if (scene === "beyond") {
    return <BeyondTimeUI />;
  }

  return (
    <>
      {CAPTIONS.map((caption) => (
        <EraCaption
          key={caption.key}
          sceneKey={caption.key}
          sceneIndex={caption.index}
          text={caption.text}
          style={caption.style}
        />
      ))}
    </>
  );
}
