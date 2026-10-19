"use client";
// Work, the Divyansh way, with your card designs:
// - When this section reaches the screen, the whole page background fades to a metallic teal.
// - Cards are big (up to 1280 wide, ~85% of the screen tall) and stack as you scroll:
//   the card you're on is full size, the ones behind shrink back slightly (no grey).
// - Each card has a live demo on the right.
import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import Demo from "@/components/Demos";
import Tilt from "@/components/Tilt";
import { cases, studies, cardExtra, workIntro } from "@/data/content";

function Card({ c, i, total }) {
  const ref = useRef(null);
  // progress from "this card reaches its sticky spot" to "the section ends"
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 130px", "end start"] });
  const last = i === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, last ? 1 : 1 - (total - i) * 0.035]);
  const x = cardExtra[c.id] || {};
  const st = studies[c.id];
  const [num, ...unit] = c.metric[0].split(" ");

  return (
    <div className="wk-slot" ref={ref} style={{ top: 110 + i * 18 }}>
      <motion.article className={`wk-card wk-${c.id}`} style={{ scale }}
        initial={{ opacity: 0, y: 120, rotateX: 18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>
        <Tilt max={3}>
        <div className="wk-inner">
          <div className="wk-info">
            <p className="wk-num">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
            <p className="wk-mark">{c.logo.map((p, k) => <span key={k} className={k === 1 ? "acc" : ""}>{p}</span>)}</p>
            <h3 className="wk-title">{x.title || c.title}</h3>
            {x.desc && <p className="wk-desc">{x.desc}</p>}
            <div className="wk-tags">{c.chips.map((t) => <span key={t}>{t}</span>)}</div>
            {x.ai && (
              <ul className="wk-who">
                <li><span className="pill ai">● AI</span><p>{x.ai}</p></li>
                <li><span className="pill me">● My call</span><p>{x.mine}</p></li>
              </ul>
            )}
            <div className="wk-metric">
              <b>{num}{unit.length > 0 && <span className="unit"> {unit.join(" ")}</span>}</b>
              <span>{c.metric[1]}</span>
            </div>
            <Link className="wk-cta" href={`/work/${st.slug}`}>{x.cta || "Read the case study"} <span>→</span></Link>
          </div>
          <div className="wk-demo"><Demo id={c.id} /></div>
        </div>
        </Tilt>
      </motion.article>
    </div>
  );
}

export default function WorkCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  useEffect(() => {
    document.documentElement.classList.toggle("theme-work", inView);
    return () => document.documentElement.classList.remove("theme-work");
  }, [inView]);

  return (
    <section className="work2" id="work" ref={ref}>
      <header className="wk-head">
        <div>
          <p className="eyebrow">{workIntro.eyebrow}</p>
          <h2 className="wk-h2">{workIntro.title[0]} {workIntro.title[1]} <i>{workIntro.title[2]}</i></h2>
          <p className="wk-sub">{workIntro.sub}</p>
        </div>
        <p className="wk-side">{workIntro.side}</p>
      </header>
      <div className="wk-stack">
        {cases.map((c, i) => <Card key={c.id} c={c} i={i} total={cases.length} />)}
      </div>
    </section>
  );
}
