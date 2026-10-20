"use client";
// Work experience as ONE career ruler (from your reference recording).
// The ruler scrolls under a fixed marker. As the years pass, the company, role and year change.
// It plays through on its own when it comes into view. Drag it (or use ← →) to scrub. ↺ replays.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/Tilt";
import { experience, education } from "@/data/content";

// Oldest first, laid end to end so the ruler reads as one career.
const JOBS = [...experience].sort((a, b) => a.start - b.start);
let acc = 0;
const SEG = JOBS.map((j) => { const s = { ...j, from: acc, to: acc + j.years }; acc += j.years; return s; });
const TOTAL = +acc.toFixed(1);
const MARK = 0.32;         // marker sits 32% from the left
const MAXY = Math.ceil(TOTAL) + 3;

const jobAt = (y) => SEG.find((s) => y < s.to) || SEG[SEG.length - 1];

export default function Experience() {
  const box = useRef(null);
  const inView = useInView(box, { once: true, margin: "-20%" });
  const y = useMotionValue(0);
  const [shown, setShown] = useState(0);
  const [touched, setTouched] = useState(false); // hide the hint once they've used the ruler
  const [w, setW] = useState(700);
  const PX = Math.max(56, Math.min(130, w / 6.5)); // pixels per year, smaller on phones
  const x = useTransform(y, (v) => w * MARK - v * PX);
  useMotionValueEvent(y, "change", (v) => setShown(v));

  useEffect(() => {
    const r = () => box.current && setW(box.current.offsetWidth);
    r(); addEventListener("resize", r); return () => removeEventListener("resize", r);
  }, []);

  const play = () => { y.set(0); animate(y, TOTAL, { duration: 4.2, ease: [0.45, 0, 0.2, 1] }); };
  useEffect(() => { if (inView) play(); }, [inView]); // eslint-disable-line

  // drag to scrub
  const drag = useRef(null);
  const down = (e) => { setTouched(true); drag.current = { x: e.clientX, y: y.get() }; e.currentTarget.setPointerCapture(e.pointerId); y.stop(); };
  const move = (e) => {
    if (!drag.current) return;
    const v = drag.current.y - (e.clientX - drag.current.x) / PX;
    y.set(Math.max(0, Math.min(TOTAL, v)));
  };
  const up = () => { drag.current = null; };
  const key = (e) => {
    if (e.key === "ArrowRight") animate(y, Math.min(TOTAL, y.get() + 0.5), { duration: 0.3 });
    if (e.key === "ArrowLeft") animate(y, Math.max(0, y.get() - 0.5), { duration: 0.3 });
  };

  const job = jobAt(shown);
  const year = job.start + Math.floor(shown - job.from);
  const ticks = [];
  for (let t = 0; t <= MAXY * 10; t++) {
    const v = t / 10, major = t % 10 === 0, mid = t % 5 === 0;
    ticks.push(<i key={t} className={`${major ? "maj" : mid ? "mid" : ""} ${v <= shown + 0.001 ? "past" : ""} ${v > TOTAL ? "ghost" : ""}`} style={{ left: v * PX }} />);
  }

  return (
    <section className="blk xp" id="experience">
      <div className="xp-wrap">
        <Reveal>
          <p className="eyebrow">Work experience</p>
          <h2 className="sec">The best years of a designer&apos;s life are <i>spent designing.</i></h2>
          <p className="lead">Drag the ruler to travel through my career.</p>
        </Reveal>

        <Tilt className="xp-tilt" max={5}>
          <div className="xp-card" ref={box}>
            <div className="xp-ruler" role="slider" tabIndex={0} aria-label="Years of experience" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={+shown.toFixed(1)} aria-valuetext={`${shown.toFixed(1)} years, ${job.role} at ${job.company}`}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
              <motion.div className="xp-track" style={{ x }}>
                {Array.from({ length: MAXY + 1 }, (_, n) => <span key={n} className={`xp-num ${n <= shown + 0.001 ? "past" : ""} ${n > TOTAL ? "ghost" : ""}`} style={{ left: n * PX }}>{n}</span>)}
                {ticks}
              </motion.div>
              <span className="xp-mark" style={{ left: `${MARK * 100}%` }} />
              <AnimatePresence>
                {inView && !touched && (
                  <motion.span className="xp-hint" aria-hidden="true"
                    initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 4.4, type: "spring", stiffness: 260, damping: 20 }}>
                    <motion.i animate={{ x: [0, -14, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 4.6 }}>👆</motion.i>
                    Drag to scroll through my work experience
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="xp-fade l" /><div className="xp-fade r" />
            </div>
            <motion.button type="button" className="xp-replay" onClick={play} aria-label="Replay" whileHover={{ rotate: -180 }} whileTap={{ scale: 0.9 }}>↺</motion.button>

            <div className="xp-meta">
              <AnimatePresence mode="wait">
                <motion.div key={job.company} initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.25 }}>
                  <p className="xp-co">{job.company}</p>
                  <h3 className="xp-role">{job.role}</h3>
                </motion.div>
              </AnimatePresence>
              <div className="xp-yrs">
                <b>{shown >= TOTAL - 0.01 ? TOTAL : shown.toFixed(1)}<span>yr</span></b>
                <small>{year}</small>
              </div>
            </div>

            <div className="xp-steps" aria-hidden="true">
              {SEG.map((s) => (
                <button key={s.company} type="button" className={s === job ? "on" : ""} onClick={() => { setTouched(true); animate(y, s.from + 0.05, { duration: 0.6, ease: [0.65, 0, 0.35, 1] }); }}>
                  {s.company}<span>{s.start}</span>
                </button>
              ))}
            </div>
          </div>
        </Tilt>

        {/* A few lines about the company the ruler is on. Changes as you scrub. */}
        <div className="xp-about" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={job.company} className="xp-about-in" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <div className="xp-about-l">
                <p className="xp-about-h"><b>{job.company}</b><span>{job.where}</span></p>
                <p className="xp-about-p">{job.about}</p>
                <p className="xp-about-w">{job.work}</p>
                {job.link && <a className="xp-about-link" href={job.link} target="_blank" rel="noopener">Visit {job.company} ↗</a>}
              </div>
              <div className="xp-about-r">
                <p className="eyebrow">What I learned</p>
                <ul>{job.learned.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="xp-edu">
          <p className="eyebrow">Education</p>
          <ul>
            {education.map((e) => (
              <li key={e.degree}><b>{e.degree}</b><span>{e.school}{e.years ? ` · ${e.years}` : ""}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
