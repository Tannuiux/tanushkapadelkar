"use client";
// Makes any button or link gently pull toward the mouse. Wrap it: <Magnetic><a className="btn">Hi</a></Magnetic>
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15 }), sy = useSpring(y, { stiffness: 250, damping: 15 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} onPointerMove={move} onPointerLeave={reset} style={{ x: sx, y: sy, display: "inline-flex" }}>
      {children}
    </motion.span>
  );
}
