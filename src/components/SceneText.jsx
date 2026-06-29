export default function SceneText({ scene }) {
    const texts = {
      intro: "Initializing Time Machine...",
      prehistoric: "Every story begins at the dawn of time.",
      egypt: "Where civilizations first shaped history.",
      medieval: "The age of kings, courage, and legends.",
      modern: "The world we continue to build.",
      future: "The future belongs to the curious.",
      beyond: "Time changes everything. Curiosity changes you.",
    };
  
    return (
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          width: "100%",
          textAlign: "center",
          color: "white",
          fontSize: "20px",
          fontFamily: "sans-serif",
          textShadow: "0 0 10px black",
          pointerEvents: "none",
        }}
      >
        {texts[scene]}
      </div>
    );
  }