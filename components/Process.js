"use client";
// "How we build": five steps, each a short chat between you and your AI mate. The line draws itself as you scroll.
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import { process } from "@/data/content";

function Face({ who }) {
  return who === "me"
    ? <span className="face me" aria-hidden="true">T</span>
    : <span className="face mate" aria-hidden="true"><i /><i /></span>;
}

export default function Process() {
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 75%", "end 60%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="blk" id="process">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">How I design</div>
          <h2 className="sec">My mate and I, <i>step by step.</i></h2>
          <p className="lead">I lead and decide. My AI mate helps me move faster. Here&apos;s how a project actually goes.</p>
        </Reveal>

        <div className="timeline grow" ref={lineRef}>
          <motion.span className="tl-fill" style={{ scaleY: grow }} aria-hidden="true" />
          {process.map((s) => (
            <div key={s.n} className="st st-chat">
              <Reveal><h3><span>{s.n}</span>{s.title}</h3></Reveal>
              <div className="chatline">
                {s.chat.map(([who, text], i) => (
                  <motion.div
                    key={i}
                    className={`cl ${who}`}
                    initial={{ opacity: 0, x: who === "me" ? -24 : 24, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.35 }}
                  >
                    <Face who={who} />
                    <p><small>{who === "me" ? "Me" : "My AI mate"}</small>{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
