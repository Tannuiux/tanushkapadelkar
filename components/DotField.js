"use client";
// The interactive dotted background (the Divyansh feel): a quiet grid of grey dots behind the whole page.
// Move your mouse (or drag a finger) and the dots near you swell and turn teal, then slowly settle back.
import { useEffect, useRef } from "react";

const GAP = 41;          // distance between dots, same rhythm as his grid
const BASE = 1.5;        // resting dot radius
const MAX = 5.5;         // radius right under the cursor
const REACH = 150;       // how far the effect spreads (px)
const ACCENT = [14, 140, 138]; // your teal
const GREY = [155, 155, 155];

export default function DotField() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, dpr, cols, rows, heat, raf = 0, mx = -9999, my = -9999, last = 0;

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cols = Math.ceil(w / GAP) + 1; rows = Math.ceil(h / GAP) + 1;
      heat = new Float32Array(cols * rows);
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const oy = -(scrollY % GAP); // dots drift with the page so it feels like part of it
      let busy = false;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = j * cols + i, x = i * GAP, y = j * GAP + oy;
        const d = Math.hypot(x - mx, y - my);
        const target = reduce ? 0 : Math.max(0, 1 - d / REACH) ** 1.6;
        // rise fast, fall slowly
        heat[k] += (target - heat[k]) * (target > heat[k] ? 0.35 : 0.06);
        if (heat[k] > 0.005) busy = true;
        const t = heat[k];
        const r = BASE + (MAX - BASE) * t;
        const c = GREY.map((g, n) => Math.round(g + (ACCENT[n] - g) * t));
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.22 + 0.7 * t})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      return busy;
    };

    const loop = () => { raf = 0; if (draw() || performance.now() - last < 120) raf = requestAnimationFrame(loop); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e) => { mx = e.clientX; my = e.clientY; last = performance.now(); kick(); };
    const leave = () => { mx = my = -9999; kick(); };

    size();
    addEventListener("resize", size);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    addEventListener("scroll", kick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
      removeEventListener("scroll", kick);
    };
  }, []);

  return <canvas ref={ref} className="dotfield" aria-hidden="true" />;
}
