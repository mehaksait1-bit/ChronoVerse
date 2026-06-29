import { useCallback, useState } from "react";
import { motion } from "framer-motion";

export default function BeyondTimeUI() {
  const [hovered, setHovered] = useState(false);
  const [rippling, setRippling] = useState(false);

  const handleClick = useCallback(() => {
    setRippling(true);
    setTimeout(() => setRippling(false), 600);
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 20,
        padding: "1.5rem",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{
          color: "#ffffff",
          fontSize: "clamp(28px, 5vw, 48px)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 400,
          letterSpacing: "0.06em",
          textAlign: "center",
          margin: 0,
          textShadow: "0 0 40px rgba(0, 229, 255, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)",
        }}
      >
        Time Changes Everything.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        style={{
          color: "#c4b5fd",
          fontSize: "clamp(16px, 2.5vw, 22px)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          marginTop: "1rem",
          marginBottom: "2.5rem",
          textAlign: "center",
          textShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
        }}
      >
        But Curiosity Changes You.
      </motion.p>
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: hovered ? 1.08 : 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.65 },
          scale: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          pointerEvents: "auto",
          position: "relative",
          overflow: "hidden",
          padding: "1rem 2.5rem",
          fontSize: "clamp(14px, 2vw, 18px)",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#ffffff",
          background: "linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #ff44aa 100%)",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 0 40px rgba(0, 229, 255, 0.6), 0 0 80px rgba(168, 85, 247, 0.4), 0 12px 40px rgba(0, 0, 0, 0.5)"
            : "0 0 25px rgba(0, 229, 255, 0.4), 0 8px 30px rgba(0, 0, 0, 0.4)",
        }}
      >
        {rippling && (
          <motion.span
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50px",
              background: "rgba(255,255,255,0.35)",
            }}
          />
        )}
        Begin Your Journey
      </motion.button>
    </motion.div>
  );
}
