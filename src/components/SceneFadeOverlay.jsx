export default function SceneFadeOverlay() {
  return (
    <div
      id="scene-fade-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(ellipse at center, #0a0a12 0%, #000000 70%)",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 900,
      }}
    />
  );
}
