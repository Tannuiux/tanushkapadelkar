"use client";
// Projects, one at a time: a big 01 / 04 counter, the project's screens flicking in the middle,
// tilted screens flying in at the corners, and its colour swatches. Scrolling moves to the next project.
// "Read the story" opens the full problem → noticed → built → what changed.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import Magnetic from "@/components/Magnetic";
import EBotDemo from "@/components/EBotDemo";
import { cases, showcase } from "@/data/content";

const STEPS = [["problem", "The problem"], ["noticed", "What I noticed"], ["built", "What I built"]];
// The three tabs from your sketch: Tension (the problem), Immersion (what I built), Impact (what changed).
const TABS = [["tension", "Tension"], ["immersion", "Immersion"], ["impact", "Impact"]];
const tabText = (c, t) => t === "tension" ? c.problem : t === "immersion" ? c.built : `${c.metric[0]} ${c.metric[1]}`;
const pad = (n) => String(n).padStart(2, "0");

function Flicker({ images, metric }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 1400);
    return () => clearInterval(t);
  }, [images]);
  if (!images.length) {
    return <div className="sc-type"><b>{metric[0]}</b><span>{metric[1]}</span></div>;
  }
  return (
    <div className="sc-frame">
      <AnimatePresence mode="popLayout">
        <motion.img key={images[i]} src={images[i]} alt="" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
      </AnimatePresence>
    </div>
  );
}

export default function Showcase() {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState("tension");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.min(cases.length - 1, Math.floor(v * cases.length));
    setIdx((old) => { if (old !== n) setTab("tension"); return n; });
  });

  const c = cases[idx], s = showcase[c.id];

  return (
    <section className="showcase" id="work" ref={ref} style={{ height: `${cases.length * 100}vh` }}>
      <div className="sc-sticky">
        {/* the project's own screen, huge and blurred, as the room's backdrop */}
        <AnimatePresence>
          {s.images[0] && (
            <motion.img key={"bg" + c.id} src={s.images[0]} alt="" aria-hidden="true" className="sc-bg"
              initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 0.75, scale: 1.05 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
          )}
        </AnimatePresence>
        <div className="sc-head">
          <div className="counter big"><b>{pad(idx + 1)}</b><span>/{pad(cases.length)}</span></div>
          <div className="eyebrow">Projects</div>
        </div>

        {/* tilted screens flying in at the corners */}
        <AnimatePresence>
          {s.images.slice(1, 3).map((src, k) => (
            <motion.img
              key={c.id + src} src={src} alt="" className={`sc-fly f${k}`}
              initial={{ opacity: 0, x: k ? 120 : -120, y: k ? 60 : -60, rotate: k ? 14 : -12 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: k ? 8 : -7 }}
              exit={{ opacity: 0, x: k ? 160 : -160 }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={c.id} className="sc-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
            <Flicker images={s.images} metric={c.metric} />
            <p className="sc-cat">{s.category}</p>
            <h3 className="sc-name">{c.logo.join("")}</h3>
            <p className="sc-line">{c.title}</p>
            <div className="sc-tabs" role="tablist">
              {TABS.map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>
                  {tab === k && <motion.span layoutId="sctab" className="sctab-pill" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={c.id + tab} className="sc-tabtext" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {tabText(c, tab)}
              </motion.p>
            </AnimatePresence>
            <div className="sc-sw">{s.swatches.map((col) => <i key={col} style={{ background: col }} />)}</div>
            <div className="ctas">
              <Magnetic><button type="button" className="btn solid" onClick={() => setOpen(c.id)}>Read the story</button></Magnetic>
              {c.links.map(([label, href, kind]) => (
                <Magnetic key={label}><a className={`btn ${kind === "solid" ? "" : kind}`} href={href} target="_blank" rel="noopener">{label}</a></Magnetic>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="sc-dots" aria-hidden="true">{cases.map((x, k) => <i key={x.id} className={k === idx ? "on" : ""} />)}</div>
      </div>

      {/* the full story, as a drawer */}
      <AnimatePresence>
        {open && (() => {
          const cc = cases.find((x) => x.id === open);
          return (
            <motion.div className="drawer-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
              <motion.article
                className="drawer" role="dialog" aria-label={cc.title} data-lenis-prevent
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" className="x" aria-label="Close" onClick={() => setOpen(null)}>×</button>
                <div className="logo">{cc.logo.join("")}</div>
                <h3>{cc.title}</h3>
                <div className="chips">{cc.chips.map((ch) => <span key={ch} className="pill">{ch}</span>)}</div>
                <ol className="storysteps">
                  {STEPS.map(([k, label]) => <li key={k}><span className="sl">{label}</span><p>{cc[k]}</p></li>)}
                </ol>
                <div className="metric"><span className="sl">What changed</span><b>{cc.metric[0]}</b><span>{cc.metric[1]}</span></div>
                {cc.id === "ebot" && <div style={{ marginTop: 20 }}><EBotDemo /></div>}
                <div className="actions">
                  {cc.links.map(([label, href, kind]) => <a key={label} className={`btn ${kind}`} href={href} target="_blank" rel="noopener">{label}</a>)}
                </div>
              </motion.article>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
