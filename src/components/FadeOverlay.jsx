export default function FadeOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 999,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}