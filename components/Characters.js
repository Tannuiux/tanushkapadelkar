"use client";
// Your 3D character and your AI mate. The images live in public/characters/.
// To change a pose, replace the .webp file with a new one of the same name.
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Gently tilts toward the mouse so the characters feel alive.
function useTilt(ref, max = 4) {
  const mx = useMotionValue(0);
  useEffect(() => {
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect(); if (!r) return;
      mx.set(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 600)));
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, [ref, mx]);
  return useSpring(useTransform(mx, [-1, 1], [-max, max]), { stiffness: 120, damping: 14 });
}

// You. pose: "wave" (front, waving), "back" (sitting at the desk), "push" (side view, pushing).
export function MeFigure({ pose = "wave", alt = "" }) {
  const ref = useRef(null);
  const tilt = useTilt(ref, pose === "wave" ? 3 : 0);
  return (
    <motion.img
      ref={ref}
      src={`/characters/me-${pose}.webp`}
      alt={alt}
      className={`fig me-${pose}`}
      style={{ rotate: tilt, transformOrigin: "bottom center" }}
      draggable={false}
    />
  );
}
export const MeBack = () => <MeFigure pose="back" />;

// Your AI mate. pose: "wave", "push", "point". Floats gently up and down.
export function MateBot({ pose = "wave", float = true }) {
  const ref = useRef(null);
  const tilt = useTilt(ref, 8);
  return (
    <motion.img
      ref={ref}
      src={`/characters/mate-${pose}.webp`}
      alt=""
      className={`fig mate-${pose}`}
      style={{ rotate: tilt }}
      animate={float ? { y: [0, -10, 0] } : undefined}
      transition={float ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : undefined}
      draggable={false}
    />
  );
}
