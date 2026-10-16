"use client";
// Projects as a stack of big cards, like Divyansh's: each card sticks to the top and gently shrinks
// as the next one slides over it. Left: what the project is. Right: a live demo you can try.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import Demo from "@/components/Demos";
import { cases, studies } from "@/data/content";

function Card({ c, i, total, progress }) {
  // As you scroll past this card, it scales down a little and dims, so the stack feels physical.
  const start = i / total, end = (i + 1) / total;
  const scale = useTransform(progress, [start, end], [1, i === total - 1 ? 1 : 0.92]);
  const filter = useTransform(progress, [start, end], ["brightness(1)", i === total - 1 ? "brightness(1)" : "brightness(0.9)"]);
  const st = studies[c.id];
  return (
    <div className="wc-slot" style={{ top: `calc(90px + ${i * 14}px)` }}>
      <motion.article className="wc-card" style={{ scale, filter }}>
        <div className="wc-info">
          <div className="wc-num">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
          <p className="wc-mark">{c.logo.map((part, k) => <span key={k} className={k === 1 ? "acc" : ""}>{part}</span>)}</p>
          <h3 className="wc-title">{c.title}</h3>
          <div className="wc-tags">{c.chips.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="wc-metric"><b>{c.metric[0]}</b><span>{c.metric[1]}</span></div>
          <div className="wc-ctas">
            <Magnetic><Link className="btn solid" href={`/work/${st.slug}`}>Read the case study</Link></Magnetic>
          </div>
        </div>
        <div className="wc-demo">
          <Demo id={c.id} />
        </div>
      </motion.article>
    </div>
  );
}

export default function WorkCards() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="blk work-cards" id="work">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Shipped work</div>
          <h2 className="sec">Don&apos;t just look at it. <i>Try it.</i></h2>
          <p className="lead">Every project has a small live demo. Have a play, then read how it came together.</p>
        </Reveal>
        <div className="wc-stack" ref={ref}>
          {cases.map((c, i) => <Card key={c.id} c={c} i={i} total={cases.length} progress={scrollYProgress} />)}
        </div>
      </div>
    </section>
  );
}
