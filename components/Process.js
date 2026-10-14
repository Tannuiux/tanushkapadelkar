"use client";
// "How I go from 0 → 1 with AI": the five-step timeline. The line draws itself as you scroll.
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import ToolsPile from "@/components/ToolsPile";
import { process, keepOut } from "@/data/content";

export default function Process() {
  const lineRef = useRef(null);
  // How far the timeline has scrolled through the screen, from 0 to 1.
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 75%", "end 60%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="blk" id="process">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">My process</div>
          <h2 className="sec">How I go from <i>0 → 1</i> with AI</h2>
        </Reveal>

        <div className="timeline grow" ref={lineRef}>
          <motion.span className="tl-fill" style={{ scaleY: grow }} aria-hidden="true" />
          {process.map((s) => (
            <Reveal key={s.n} className="st">
              <div>
                <h3><span>{s.n}</span>{s.title}</h3>
                <div className="twoside">
                  <div><span className="tag ai">AI</span><p>{s.ai}</p></div>
                  <div className="mine"><span className="tag me">Me</span><p>{s.me}</p></div>
                </div>
              </div>
              <p className="tools"><span>Tools</span>{s.tools}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="keepout">
          <h3>Where AI stays out</h3>
          <ul>{keepOut.map((k) => <li key={k}>{k}</li>)}</ul>
        </Reveal>

        <ToolsPile />
      </div>
    </section>
  );
}
