"use client";
// The floating pill nav. The green highlight slides between links as you scroll (Motion "layoutId").
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/data/content";

const LINKS = [
  ["work", "Work", true],
  ["process", "Process"],
  ["beyond", "Beyond"],
  ["connect", "Connect"],
];

export default function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    // Watch each section; whichever crosses the middle of the screen becomes "active".
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const top = document.getElementById("top");
    const io2 = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" });
    if (top) io2.observe(top);
    return () => { io.disconnect(); io2.disconnect(); };
  }, []);

  return (
    <>
      <motion.nav
        className="top"
        aria-label="Main"
        initial={{ y: -40, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bar">
          <a className="mark" href="#top">TP<span>.</span></a>
          <div className="links">
            {LINKS.map(([id, label, keep]) => (
              <a key={id} href={`#${id}`} className={`${keep ? "keep " : ""}${active === id ? "on" : ""}`}>
                {active === id && <motion.span layoutId="navpill" className="navpill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                {label}
              </a>
            ))}
          </div>
          <span className="sep" />
          <div className="links">
            <a className="keep" href={site.resume} target="_blank" rel="noopener">Resume</a>
          </div>
        </div>
      </motion.nav>
      <motion.div
        className="avail"
        aria-hidden="true"
        initial={{ opacity: 0, x: "-50%", y: -8 }}
        animate={{ opacity: 1, x: "-50%", y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        OPEN TO PRODUCT DESIGNER ROLES
      </motion.div>
    </>
  );
}
