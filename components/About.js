"use client";
// The quote and your two-sides intro. Each word of the quote lights up as you scroll past it.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";
import { about } from "@/data/content";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }} className="qword">{children} </motion.span>;
}

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = about.quote.split(" ");
  return (
    <section className="blk about" id="about">
      <div className="wrap">
        <p className="bigquote" ref={ref}>
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
          ))}
        </p>
        <div className="about-cols">
          {about.paras.map((p, i) => (
            <Reveal key={i} delay={i * 0.12}><p>{p}</p></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
