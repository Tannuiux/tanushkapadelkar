"use client";
// Hero from your design: centred polaroid with real tool logos floating around it,
// a big mono "Product Designer", one line about you, buttons, and the "Ask my AI twin" card.
// The polaroid tilts toward your mouse. The logos bob gently and can be dragged and thrown.
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { siFigma, siNotion, siApple, siGsap, siClaude, siFramer } from "simple-icons";
import { site, hero } from "@/data/content";
import { useTwin } from "@/components/Twin";

// [icon, left %, top %, rotation, size]: positions copied from your Figma frame.
const LOGOS = [
  [siFigma, -12, 4, -8, 40],
  [siNotion, -16, 40, -12, 48],
  [siGsap, 92, -4, -18, 40],
  [siApple, 108, 36, 10, 38],
  [siFramer, 98, 76, 8, 34],
  [siClaude, -6, 84, 0, 46],
];

function Logo({ icon, x, y, r, s, i }) {
  return (
    <motion.span
      className="hlogo"
      style={{ left: x + "%", top: y + "%", width: s, height: s, color: "#" + icon.hex }}
      title={icon.title}
      drag dragSnapToOrigin dragElastic={0.6}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
      whileHover={{ scale: 1.15, rotate: r + 10 }}
      initial={{ opacity: 0, scale: 0, rotate: r }}
      animate={{ opacity: 1, scale: 1, rotate: r, y: [0, -8, 0] }}
      transition={{ opacity: { delay: 0.4 + i * 0.08 }, scale: { delay: 0.4 + i * 0.08, type: "spring" }, y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} fill="currentColor" /></svg>
    </motion.span>
  );
}

function Polaroid() {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 150, damping: 15 });
  const rX = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  return (
    <div className="hpol-zone" ref={ref} onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0); }}>
      <motion.a
        href="#about" className="hpol" style={{ rotateX: rX, rotateY: rY }}
        initial={{ opacity: 0, y: 30, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 2 }}
        whileHover={{ rotate: 0, scale: 1.03 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <img src="/img/tanushka.jpg" alt="Tanushka Padelkar" />
        <span className="hpol-cap">About it →</span>
      </motion.a>
      {LOGOS.map(([icon, x, y, r, s], i) => <Logo key={icon.slug} icon={icon} x={x} y={y} r={r} s={s} i={i} />)}
    </div>
  );
}

export default function PhotoHero() {
  const { open } = useTwin();
  return (
    <header className="hero3" id="top">
      <div className="hero3-glow" aria-hidden="true" />
      <motion.p className="hero3-hello" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{hero.hello} <b>{site.name}</b>.</motion.p>
      <Polaroid />
      <motion.h1 className="hero3-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
        <span className="t-main">{hero.title}</span>
        <span className="t-sub">who designs with AI and</span>
        <span className="t-sub"><em>decides like a human.</em></span>
      </motion.h1>
      <motion.div className="hero3-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <a className="chip" href="#work">view work <span>↓</span></a>
        <a className="chip" href={site.resume} target="_blank" rel="noopener">resume <span>↗</span></a>
        <a className="chip" href={site.linkedin} target="_blank" rel="noopener">linkedin <span>↗</span></a>
        <a className="chip" href={`mailto:${site.email}`}>email <span>↗</span></a>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="twin-wrap">
        <motion.button type="button" className="twin-bar" onClick={open} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <span className="twin-orb" aria-hidden="true" />
          <span className="twin-sep" aria-hidden="true" />
          <span className="twin-label">Ask my AI twin</span>
          <kbd>⌘+K</kbd>
        </motion.button>
        <p className="twin-cap">Answers from my CV and case studies. It tells you it&apos;s AI.</p>
      </motion.div>
    </header>
  );
}
