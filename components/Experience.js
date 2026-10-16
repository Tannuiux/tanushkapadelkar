"use client";
// Work experience as rulers. When a card scrolls into view, the marker slides to how many years
// you spent there and the number counts up. Drag the ruler to play with it; ↺ replays.
import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView, useMotionValue, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";
import { experience } from "@/data/content";

const MAX = 5;       // the ruler shows 0 to 5 years
const TICKS = MAX * 10;

function Ruler({ job }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const val = useMotionValue(0);
  const left = useTransform(val, (v) => `${(v / MAX) * 100}%`);
  const [shown, setShown] = useState("0.0");

  useEffect(() => val.on("change", (v) => setShown(v.toFixed(1))), [val]);
  const play = () => { val.set(0); animate(val, job.years, { duration: 1.4, ease: [0.22, 1, 0.36, 1] }); };
  useEffect(() => { if (inView) play(); }, [inView]); // eslint-disable-line

  // Drag along the ruler to move the marker; it springs back to the real value.
  const track = useRef(null);
  const drag = (e) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const r = track.current.getBoundingClientRect();
    val.set(Math.max(0, Math.min(MAX, ((e.clientX - r.left) / r.width) * MAX)));
  };
  const release = () => animate(val, job.years, { type: "spring", stiffness: 120, damping: 14 });

  return (
    <div className="xcard" ref={ref}>
      <div className="ruler" ref={track} onPointerDown={drag} onPointerMove={drag} onPointerUp={release} onPointerLeave={(e) => e.buttons === 1 && release()}>
        <div className="rnums">{Array.from({ length: MAX + 1 }, (_, i) => <span key={i} style={{ left: `${(i / MAX) * 100}%` }}>{i}</span>)}</div>
        <div className="rticks">
          {Array.from({ length: TICKS + 1 }, (_, i) => (
            <i key={i} className={i % 10 === 0 ? "major" : i % 5 === 0 ? "mid" : ""} style={{ left: `${(i / TICKS) * 100}%` }} />
          ))}
        </div>
        <motion.span className="rmark" style={{ left }} />
      </div>
      <button type="button" className="replay" onClick={play} aria-label={`Replay ${job.company}`}>↺</button>
      <div className="xmeta">
        <div><p className="xco">{job.company}</p><h3>{job.role}</h3></div>
        <div className="xyrs"><b>{shown}</b><span>yr</span><small>{job.start}</small></div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section className="blk" id="experience">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Work experience</div>
          <h2 className="sec">The best years of a designer&apos;s life are <i>spent designing.</i></h2>
        </Reveal>
        <div className="xlist">
          {experience.map((j) => <Ruler key={j.company} job={j} />)}
        </div>
      </div>
    </section>
  );
}
