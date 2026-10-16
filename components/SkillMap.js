"use client";
// Skills as a system map: you in the middle, six skills around you, each linked to its tools.
// A big 01 / 06 counter steps through them as you scroll. You can also click a skill.
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { skills } from "@/data/content";

const pad = (n) => String(n).padStart(2, "0");
const N = skills.length;
const pos = skills.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  return [50 + 34 * Math.cos(a), 50 + 34 * Math.sin(a), a];
});

export default function SkillMap() {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setIdx(Math.min(N - 1, Math.max(0, Math.floor(v * N)))));
  const s = skills[idx];

  return (
    <section className="skillmap" id="skills" ref={ref} style={{ height: `${N * 70}vh` }}>
      <div className="sm-sticky">
        <div className="sm-side">
          <div className="eyebrow">What I bring to the table</div>
          <div className="counter big"><b>{pad(idx + 1)}</b><span>/{pad(N)}</span></div>
          <AnimatePresence mode="wait">
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              <h2 className="sec">{s.title}</h2>
              <p className="lead">{s.text}</p>
              <div className="chips">{s.tools.map((t) => <span key={t} className="pill">{t}</span>)}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sm-map">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {pos.map(([x, y], i) => (
              <motion.line key={i} x1="50" y1="50" x2={x} y2={y}
                stroke={i === idx ? "#0E8C8A" : "#C9E2DF"} strokeWidth={i === idx ? 0.8 : 0.4}
                strokeDasharray={i === idx ? "0" : "1.5 1.5"}
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }} />
            ))}
            {/* leaf links for the active skill */}
            {skills[idx].tools.map((t, k) => {
              const [x, y, a] = pos[idx];
              const spread = (k - (skills[idx].tools.length - 1) / 2) * 0.6;
              const lx = x + 17 * Math.cos(a + spread), ly = y + 17 * Math.sin(a + spread);
              return <motion.line key={skills[idx].title + t} x1={x} y1={y} x2={lx} y2={ly} stroke="#6A47DB" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 + k * 0.08 }} />;
            })}
          </svg>
          <div className="sm-core">Tanushka</div>
          {skills.map((sk, i) => (
            <motion.button
              key={sk.title} type="button" className={`sm-node ${i === idx ? "on" : ""}`}
              style={{ left: pos[i][0] + "%", top: pos[i][1] + "%" }}
              onClick={() => setIdx(i)}
              animate={{ scale: i === idx ? 1.12 : 1 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <span>{pad(i + 1)}</span>{sk.title}
            </motion.button>
          ))}
          <AnimatePresence>
            {skills[idx].tools.map((t, k) => {
              const [x, y, a] = pos[idx];
              const spread = (k - (skills[idx].tools.length - 1) / 2) * 0.6;
              return (
                <motion.span key={skills[idx].title + t} className="sm-leaf"
                  style={{ left: x + 17 * Math.cos(a + spread) + "%", top: y + 17 * Math.sin(a + spread) + "%" }}
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 + k * 0.06 }}
                >{t}</motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
