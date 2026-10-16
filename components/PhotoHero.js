"use client";
// Hero from your sketch: your photo as a tilted polaroid with tool tags floating around it.
// The polaroid tilts toward the mouse, and the tool tags can be dragged and thrown.
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { site, hero, about } from "@/data/content";
import Magnetic from "@/components/Magnetic";

// Where each floating tag sits around the photo (percent) and how it bobs.
const SPOTS = [[2, 4], [98, 2], [0, 50], [100, 44], [6, 92], [94, 88]];

function Polaroid() {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rY = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 150, damping: 15 });
  const rX = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 150, damping: 15 });
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <div className="polaroid-zone" ref={ref} onPointerMove={move} onPointerLeave={leave}>
      <motion.a
        href="#about"
        className="polaroid"
        style={{ rotateX: rX, rotateY: rY }}
        initial={{ opacity: 0, y: 40, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        whileHover={{ rotate: 0, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <img src="/img/tanushka.jpg" alt="Tanushka Padelkar" />
        <span className="pol-cap">About me →</span>
      </motion.a>
      {about.floaters.map((t, i) => (
        <motion.span
          key={t}
          className={`floater f${i % 3}`}
          style={{ left: SPOTS[i][0] + "%", top: SPOTS[i][1] + "%" }}
          drag
          dragSnapToOrigin
          dragElastic={0.6}
          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 0.5 + i * 0.1 }, scale: { delay: 0.5 + i * 0.1, type: "spring" }, y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" } }}
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}

const parent = { show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
const child = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } } };

export default function PhotoHero() {
  return (
    <header className="phero" id="top">
      <motion.p className="hello" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{hero.hello} <b>{site.name}</b>.</motion.p>
      <Polaroid />
      <motion.div className="phero-text" variants={parent} initial="hidden" animate="show">
        <h1 aria-label={hero.title}>
          {hero.title.split(" ").map((w) => (
            <motion.span key={w} className="word" variants={child} whileHover={{ y: -8, rotate: -2, color: "#0E8C8A" }}>{w}</motion.span>
          ))}
        </h1>
        <motion.p className="sub" variants={child}>{hero.sub}</motion.p>
        <motion.div className="ctas" variants={child}>
          <Magnetic><a className="btn solid" href="#work">View work</a></Magnetic>
          <Magnetic><a className="btn" href={site.resume} target="_blank" rel="noopener">Resume</a></Magnetic>
          <Magnetic><a className="btn" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a></Magnetic>
          <Magnetic><a className="btn" href="#connect">Email</a></Magnetic>
        </motion.div>
      </motion.div>
    </header>
  );
}
