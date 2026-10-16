"use client";
// The opening: your name is painted on a blue wall. You and your AI mate walk in from the left
// and push the wall away, and behind it is your desk (the real page). One continuous moment.
// Plays once per visit (per browser tab), has a Skip button, and is skipped if someone prefers reduced motion.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MeFigure, MateBot } from "@/components/Characters";
import { site } from "@/data/content";

const KEY = "tp-intro-seen";
const ease = [0.65, 0, 0.35, 1];

export default function Intro() {
  const [show, setShow] = useState(true);
  const [go, setGo] = useState(false); // false: walking in, true: pushing the wall away

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShow(false); return; }
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setGo(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const finish = () => {
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    document.documentElement.style.overflow = "";
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {/* The wall moves right, revealing the desk underneath. */}
          <motion.div
            className="intro-wall"
            aria-hidden="true"
            initial={{ x: "0%" }}
            animate={{ x: go ? "105%" : "0%" }}
            transition={{ duration: 1.6, ease }}
            onAnimationComplete={() => go && finish()}
          >
            <div className="intro-name">
              <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                {site.name.split(" ")[0]}
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                {site.name.split(" ").slice(1).join(" ")}
              </motion.span>
              <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>Product Designer · Dublin</motion.small>
            </div>

            {/* You and your mate walk in from off-screen, reach the wall's left edge, then push. */}
            <motion.div
              className="pushers"
              initial={{ x: "-60vw" }}
              animate={{ x: "0vw" }}
              transition={{ delay: 0.5, duration: 1.1, ease: "easeOut" }}
            >
              <motion.div className="push-me" animate={go ? { y: [0, -6, 0, -6, 0, -6, 0] } : { y: [0, -4, 0, -4, 0] }} transition={{ duration: go ? 1.6 : 1.1, delay: go ? 0 : 0.5 }}>
                <MeFigure pose="push" />
              </motion.div>
              <motion.div className="push-mate" animate={{ y: [0, -14, 0, -14, 0, -14, 0] }} transition={{ duration: 2.4, delay: 0.5 }}>
                <MateBot pose="push" float={false} />
              </motion.div>
            </motion.div>
          </motion.div>

          <button type="button" className="intro-skip" onClick={finish}>Skip intro</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
