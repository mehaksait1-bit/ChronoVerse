import { AnimatePresence, motion } from "framer-motion";

export default function MotionSceneText({ visible, children, style = {} }) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="scene-text"
          initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: "clamp(8%, 12vh, 14%)",
            width: "100%",
            textAlign: "center",
            padding: "0 1.5rem",
            pointerEvents: "none",
            zIndex: 10,
            ...style,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
