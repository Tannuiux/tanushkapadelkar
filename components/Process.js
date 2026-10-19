"use client";
// Design process as a deck of big cards you swap through (same swap interaction as before),
// with Divyansh-style content inside: number + title, a short line, tools, and who does what.
// Swipe, use the arrows, press ← →, or click a side card to bring it to the front.
import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/Reveal";
import { processSteps } from "@/data/content";

export default function Process() {
  const [i, setI] = useState(0);
  const N = processSteps.length;
  const go = (d) => setI((x) => Math.max(0, Math.min(N - 1, x + d)));

  return (
    <section className="blk proc" id="process">
      <div className="proc-wrap">
        <Reveal>
          <p className="eyebrow">My design process</p>
          <h2 className="sec">How I go from <i>idea → MVP.</i></h2>
          <p className="lead">Five steps. Each card shows what I decide, and where AI helps me move faster.</p>
        </Reveal>

        <div className="deck2" tabIndex={0} aria-roledescription="carousel" aria-label="Design process steps"
          onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
          {processSteps.map((s, k) => {
            const off = k - i, abs = Math.abs(off);
            return (
              <motion.article key={s.n}
                className={`pcard ${off === 0 ? "front" : ""} ${s.n === "04" ? "hot" : ""}`}
                style={{ zIndex: 10 - abs }}
                animate={{ x: `${off * 58}%`, scale: 1 - abs * 0.08, rotate: off * 2.5, opacity: abs > 2 ? 0 : 1 - abs * 0.25, filter: `blur(${abs > 0 ? 1.5 : 0}px)` }}
                transition={{ type: "spring", stiffness: 210, damping: 26 }}
                drag={off === 0 ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.35}
                onDragEnd={(_, info) => { if (info.offset.x < -70) go(1); else if (info.offset.x > 70) go(-1); }}
                onClick={() => off !== 0 && setI(k)}
                whileHover={off === 0 ? { y: -6 } : {}}
                aria-hidden={off !== 0}>
                {s.n === "04" && <span className="pcard-badge">How the demos above were made</span>}
                <h3><span className="pnum">{s.n}</span>{s.title}</h3>
                <p className="pbody">{s.body}</p>
                <div className="pwho">
                  <div><span className="tag me">My call</span><p>{s.me}</p></div>
                  <div><span className="tag ai">AI helps</span><p>{s.ai}</p></div>
                </div>
                <p className="ptools">{s.tools}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="deck2-nav">
          <motion.button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous step" whileTap={{ scale: 0.9 }}>←</motion.button>
          <div className="deck2-dots" aria-hidden="true">
            {processSteps.map((s, k) => <button key={s.n} type="button" className={k === i ? "on" : ""} onClick={() => setI(k)} tabIndex={-1} />)}
          </div>
          <span className="deck2-count"><b>{processSteps[i].n}</b>/{String(N).padStart(2, "0")}</span>
          <motion.button type="button" onClick={() => go(1)} disabled={i === N - 1} aria-label="Next step" whileTap={{ scale: 0.9 }}>→</motion.button>
        </div>
      </div>
    </section>
  );
}
