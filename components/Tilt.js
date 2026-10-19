"use client";
// Adds depth: the element tilts toward your mouse in 3D, with a soft light glare that follows the cursor.
// Used on the work cards, the experience ruler and the phones so the page feels less flat.
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";

export default function Tilt({ children, className = "", max = 6, glare = true }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 18 });
  const gx = useTransform(px, (v) => `${v * 100}%`), gy = useTransform(py, (v) => `${v * 100}%`);
  const bg = useMotionTemplate`radial-gradient(600px circle at ${gx} ${gy}, rgba(255,255,255,.35), transparent 45%)`;
  const move = (e) => {
    if (e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };
  return (
    <div className={`tilt ${className}`} style={{ perspective: 1400 }} onPointerMove={move} onPointerLeave={leave}>
      <motion.div ref={ref} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", position: "relative" }}>
        {children}
        {glare && <motion.span className="tilt-glare" style={{ background: bg }} aria-hidden="true" />}
      </motion.div>
    </div>
  );
}
