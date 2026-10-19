"use client";
// The lines under the hero. Each one fades and sharpens in as it reaches the middle of the screen,
// then fades out again as you scroll past, so only one thought is in focus at a time.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { about } from "@/data/content";

function Line({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [40, 0, 0, -40]);
  const filter = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  return <motion.div ref={ref} className={`fline ${className}`} style={{ opacity, y, filter }}>{children}</motion.div>;
}

export default function About() {
  return (
    <section className="fade-story" id="about">
      <Line className="fquote">
        <p>{about.quote}</p>
        <span>{about.quoteBy}</span>
      </Line>
      {about.paras.map((p, i) => (
        <Line key={i}><p dangerouslySetInnerHTML={{ __html: p }} /></Line>
      ))}
    </section>
  );
}
