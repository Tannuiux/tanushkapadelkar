"use client";
// Design process: big metallic step cards on a timeline (Divyansh's layout, your process).
// The rail fills as you scroll, each card lifts in with depth, tilts toward the mouse,
// and a light sheen runs across the metal. Every card says what I decide and where AI helps.
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/Tilt";
import { processSteps } from "@/data/content";

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  return (
    <section className="blk proc" id="process">
      <div className="proc-wrap">
        <Reveal>
          <p className="eyebrow">My design process</p>
          <h2 className="sec">How I go from <i>idea → MVP.</i></h2>
          <p className="lead">Five steps. In each one you can see what I decide, and where AI helps me move faster.</p>
        </Reveal>

        <div className="proc-list" ref={ref}>
          <div className="proc-rail" aria-hidden="true"><motion.span style={{ scaleY: fill }} /></div>
          {processSteps.map((s, i) => (
            <motion.div key={s.n} className="proc-row"
              initial={{ opacity: 0, y: 60, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-12%" }} transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>
              <motion.span className="proc-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-30%" }} transition={{ type: "spring", stiffness: 300, damping: 16 }} />
              <Tilt max={4}>
                <article className={`metal ${s.n === "04" ? "metal-hot" : ""}`}>
                  <div className="metal-main">
                    <h3><span className="metal-num">{s.n}</span>{s.title}</h3>
                    <p className="metal-body">{s.body}</p>
                    <p className="metal-tools">{s.tools}</p>
                  </div>
                  <div className="metal-split">
                    <div className="who me"><span>My call</span><p>{s.me}</p></div>
                    <div className="who ai"><span>AI helps</span><p>{s.ai}</p></div>
                  </div>
                  {s.n === "04" && <span className="metal-badge">This is how the demos above were made</span>}
                </article>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
