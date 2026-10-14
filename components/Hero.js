"use client";
// The first screen: dot grid that glows near the cursor, your name, and the AI twin button.
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { site } from "@/data/content";
import { useTwin } from "@/components/Twin";

function DotGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"), hero = cv.parentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, mx = -999, my = -999, raf = 0;
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const g = 26;
      for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) {
        const k = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 160);
        ctx.fillStyle = k > 0 ? `rgba(11,115,80,${0.18 + k * 0.6})` : "rgba(17,22,20,.14)";
        ctx.beginPath(); ctx.arc(x, y, 1.2 + k * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      raf = 0;
    }
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; draw(); };
    const move = (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; if (!raf && !reduce) raf = requestAnimationFrame(draw); };
    const leave = () => { mx = my = -999; if (!raf) raf = requestAnimationFrame(draw); };
    hero.addEventListener("pointermove", move); hero.addEventListener("pointerleave", leave);
    addEventListener("resize", size); size();
    return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); removeEventListener("resize", size); };
  }, []);
  return <canvas id="dots" ref={ref} aria-hidden="true" />;
}

// Each child of the hero appears one after another ("stagger").
const parent = { show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const child = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

export default function Hero() {
  const { open } = useTwin();
  return (
    <header className="hero" id="top">
      <DotGrid />
      <div className="glow" />
      <motion.div className="hero-in" variants={parent} initial="hidden" animate="show">
        <motion.p className="hello" variants={child}>Dia duit, I&apos;m <b>{site.name}</b>.</motion.p>
        <motion.h1 variants={child}>Product Designer</motion.h1>
        <motion.p className="sub" variants={child}>
          I design with <b style={{ color: "var(--ai)" }}>AI</b> and decide like a <b style={{ color: "var(--em)" }}>human</b>. 4+ years turning messy ed-tech, fintech and travel problems into products people trust.
        </motion.p>
        <motion.div className="ctas" variants={child}>
          <a className="btn solid" href="#work">View work</a>
          <a className="btn" href={site.resume} target="_blank" rel="noopener">Resume</a>
          <a className="btn" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a className="btn" href="#connect">Email</a>
        </motion.div>
        <motion.div variants={child}>
          <button className="twinchip" type="button" onClick={open}>
            <span className="orb" aria-hidden="true" />
            <span><b>Ask my AI twin <kbd>⌘K</kbd></b><small>Trained on my CV and case studies. It tells you it&apos;s AI.</small></span>
          </button>
        </motion.div>
      </motion.div>
    </header>
  );
}
