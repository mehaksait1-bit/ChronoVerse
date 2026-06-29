import { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./LoadingScreen.css";

const PARTICLE_COUNT = 28;

function StarfieldCanvas({ zoom }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((window.innerWidth * window.innerHeight) / 4500);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random(),
        size: 0.4 + Math.random() * 1.4,
        drift: (Math.random() - 0.5) * 0.15,
      }));
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = 1 + zoom * 0.12;

      ctx.clearRect(0, 0, w, h);

      for (const star of starsRef.current) {
        const sx = (star.x - w / 2) * scale + w / 2 + star.drift * frameRef.current * 0.02;
        const sy = (star.y - h / 2) * scale + h / 2 + star.drift * frameRef.current * 0.01;
        const alpha = 0.2 + star.z * 0.7;

        ctx.beginPath();
        ctx.arc(sx, sy, star.size * (0.5 + star.z * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.fill();
      }

      frameRef.current += 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [zoom]);

  return <canvas ref={canvasRef} className="loading-screen__starfield" aria-hidden />;
}

function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="loading-screen__particles" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="loading-screen__particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoadingScreen({ progress, phase, onExitComplete }) {
  const zoom = progress / 100;
  const isJourney = phase === "journey" || phase === "exiting";
  const showPercent = phase === "loading" && progress < 100;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (phase === "exiting") setVisible(false);
  }, [phase]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="loader"
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(16px)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ "--progress": progress }}
        >
          <StarfieldCanvas zoom={zoom} />
          <div className="loading-screen__glow" />
          <div className="loading-screen__bloom" />
          <FloatingParticles />
          <div className="loading-screen__vignette" />

          <motion.div
            className="loading-screen__content"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="loading-screen__logo-wrap">
              <div className="loading-screen__ring loading-screen__ring--outer" />
              <div
                className="loading-screen__ring loading-screen__ring--progress"
                style={{ "--progress": progress }}
              />
              <div className="loading-screen__ring loading-screen__ring--inner" />

              <motion.h1
                className="loading-screen__title"
                animate={{
                  scale: [1, 1.04, 1],
                  filter: [
                    "drop-shadow(0 0 20px rgba(0,229,255,0.3))",
                    "drop-shadow(0 0 32px rgba(0,229,255,0.55))",
                    "drop-shadow(0 0 20px rgba(0,229,255,0.3))",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ChronoVerse
              </motion.h1>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={isJourney ? "journey" : "loading"}
                className={`loading-screen__subtitle${isJourney ? " loading-screen__subtitle--complete" : ""}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
              >
                {isJourney
                  ? "Your Journey Begins..."
                  : "Preparing Your Journey Through Time..."}
              </motion.p>
            </AnimatePresence>

            {!isJourney && (
              <motion.div
                className="loading-screen__progress-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="loading-screen__progress-track">
                  <div
                    className="loading-screen__progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {showPercent && (
                  <motion.span
                    className="loading-screen__percent"
                    key={progress}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    {progress}%
                  </motion.span>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
