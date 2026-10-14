"use client";
// <Reveal> fades and slides its content up the first time it scrolls into view.
// Wrap anything in it: <Reveal><h2>Hello</h2></Reveal>. "delay" is in seconds.
import { motion } from "motion/react";

export default function Reveal({ children, delay = 0, y = 28, as = "div", ...rest }) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}
