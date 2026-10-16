"use client";
// "How I go from 1 to 5": your process as a deck of numbered cards.
// Arrows (or swipe, or arrow keys) move through the deck. Tap a card to flip it:
// the front says what the step is, the back shows the chat between you and your AI mate.
import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/Reveal";
import { process, processTools } from "@/data/content";

export default function ProcessFlip() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState({});
  const N = process.length;
  const go = (d) => setI((x) => Math.max(0, Math.min(N - 1, x + d)));
  const flip = (n) => setFlipped((f) => ({ ...f, [n]: !f[n] }));

  return (
    <section className="blk pflip" id="process">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">My design process</div>
          <h2 className="sec">How I go from <i>1 to {N}.</i></h2>
          <p className="lead">Tap a card to see who does what: me, or my AI mate.</p>
        </Reveal>

        <div className="deck" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }} aria-roledescription="carousel">
          {process.map((p, k) => {
            const off = k - i;
            const hidden = Math.abs(off) > 2;
            return (
              <motion.div
                key={p.n}
                className="dcard-wrap"
                style={{ zIndex: 10 - Math.abs(off), pointerEvents: off === 0 ? "auto" : "none" }}
                animate={{ x: `${off * 62}%`, scale: 1 - Math.abs(off) * 0.12, opacity: hidden ? 0 : 1 - Math.abs(off) * 0.3, rotate: off * 3 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                drag={off === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
                aria-hidden={off !== 0}
              >
                <motion.button
                  type="button"
                  className="dcard"
                  onClick={() => off === 0 && flip(p.n)}
                  animate={{ rotateY: flipped[p.n] ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  aria-label={`Step ${p.n}, ${p.title}. ${flipped[p.n] ? "Showing chat" : "Tap to flip"}`}
                >
                  <span className="dface front">
                    <b className="dnum">{p.n}</b>
                    <span className="dtitle">{p.title}</span>
                    <span className="dline">{(p.chat.find(([w]) => w === "me") || p.chat[0])[1]}</span>
                    <span className="dtools">{(processTools[p.n] || []).map((t) => <i key={t}>{t}</i>)}</span>
                    <span className="dhint">Flip ↻</span>
                  </span>
                  <span className="dface back">
                    {p.chat.map(([who, text], j) => (
                      <span key={j} className={`dmsg ${who}`}><small>{who === "me" ? "Me" : "My AI mate"}</small>{text}</span>
                    ))}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <div className="deck-nav">
          <button type="button" className="btn" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous step">←</button>
          <span className="counter"><b>{process[i].n}</b><span>/{String(N).padStart(2, "0")}</span></span>
          <button type="button" className="btn" onClick={() => go(1)} disabled={i === N - 1} aria-label="Next step">→</button>
        </div>
      </div>
    </section>
  );
}
