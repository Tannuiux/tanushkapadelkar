"use client";
// "Beyond design": five circles on a pentagon. Hover or tap one to swap the story on the right.
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/Reveal";
import { beyond } from "@/data/content";

// Work out where each circle sits on the pentagon (percent of the box).
const points = beyond.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / beyond.length;
  return [50 + 36 * Math.cos(a), 52 + 36 * Math.sin(a)];
});

export default function Beyond() {
  const [idx, setIdx] = useState(0);
  const item = beyond[idx];

  return (
    <section className="blk" id="beyond" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Beyond design</div>
          <h2 className="sec">Five things that shape my <i>thinking.</i></h2>
        </Reveal>
        <div className="beyond">
          <Reveal className="penta">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <motion.polygon
                points={points.map((p) => p.join(",")).join(" ")}
                fill="none" stroke="var(--em)" strokeWidth=".8" strokeDasharray="2 2"
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.9 }} style={{ transformOrigin: "50% 52%" }}
              />
            </svg>
            <div className="center">Tanushka</div>
            {beyond.map((it, i) => (
              <motion.button
                key={it.title} type="button" className="node"
                style={{ left: points[i][0] + "%", top: points[i][1] + "%" }}
                aria-pressed={i === idx}
                onClick={() => setIdx(i)} onMouseEnter={() => setIdx(i)}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={it.icon} /></svg>
                  <b>{it.title}</b>
                </span>
              </motion.button>
            ))}
          </Reveal>
          <div className="story" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
