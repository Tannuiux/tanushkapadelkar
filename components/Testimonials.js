"use client";
// Kind words, as a winding dotted path. A dot travels along the path as you scroll,
// and each person sits on the path as a circle. The path ends at "your turn", which links to Connect.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/data/content";

const PATH = "M 40 40 C 300 40, 360 200, 600 200 S 900 360, 1060 360";
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export default function Testimonials() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="blk testi" id="kind-words" ref={ref}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Kind words</div>
          <h2 className="sec">From people I&apos;ve <i>built with.</i></h2>
        </Reveal>

        <div className="trail">
          <svg viewBox="0 0 1100 400" preserveAspectRatio="none" aria-hidden="true">
            <path d={PATH} className="trail-bg" />
            <motion.path d={PATH} className="trail-fg" style={{ pathLength: draw }} />
          </svg>

          {testimonials.map((t) => (
            <motion.figure key={t.name} className="tnode t0"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}>
              <motion.span className="tavatar" whileHover={{ scale: 1.12, rotate: -6 }}>{initials(t.name)}</motion.span>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption><b>{t.name}</b><span>{t.role}</span></figcaption>
            </motion.figure>
          ))}

          <motion.a href="#connect" className="tnode tend"
            initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
            <span className="tavatar you">You?</span>
            <span className="tend-label">Worked with me? I&apos;d love to add your words. →</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
