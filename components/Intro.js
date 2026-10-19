"use client";
// The opening, in 3 beats:
//  1. A light room with a big teal wall on the right, your name painted on it.
//  2. You and your AI mate walk in from the left and put your hands on the wall's edge.
//  3. You push: the wall AND the two of you slide to the right together, then the light
//     backdrop fades, revealing your desk (the real page underneath).
// Plays once per visit (per browser tab), has a Skip button, and is skipped if someone prefers reduced motion.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MeFigure, MateBot } from "@/components/Characters";
import { site } from "@/data/content";

const KEY = "tp-intro-seen";
const ease = [0.65, 0, 0.35, 1];
const PUSH = "75vw"; // how far the wall (and you) travel

export default function Intro() {
  const [show, setShow] = useState(true);
  const [beat, setBeat] = useState(0); // 0 walk in, 1 push, 2 fade out

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setShow(false); return; }
    document.documentElement.style.overflow = "hidden";
    const t1 = setTimeout(() => setBeat(1), 1900);
    const t2 = setTimeout(() => setBeat(2), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const finish = () => {
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    document.documentElement.style.overflow = "";
    setShow(false);
  };

  const pushX = beat >= 1 ? PUSH : "0vw";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro"
          animate={{ opacity: beat === 2 ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => beat === 2 && finish()}
        >
          {/* 1. light backdrop that hides the desk until the end */}
          <motion.div className="intro-floor" aria-hidden="true" animate={{ opacity: beat >= 1 ? 0 : 1 }} transition={{ delay: beat >= 1 ? 0.5 : 0, duration: 1 }} />

          {/* the teal wall with your name, sliding right when pushed */}
          <motion.div className="intro-wall" aria-hidden="true" animate={{ x: pushX }} transition={{ duration: 1.5, ease }}>
            <div className="intro-name">
              <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                {site.name.split(" ")[0]}
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                {site.name.split(" ").slice(1).join(" ")}
              </motion.span>
              <motion.small initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>Product Designer · Dublin</motion.small>
            </div>
          </motion.div>

          {/* 2. you and your mate, standing OUTSIDE the wall on the light side */}
          <motion.div
            className="pushers"
            aria-hidden="true"
            initial={{ x: "-45vw" }}
            animate={{ x: beat >= 1 ? PUSH : "0vw" }}
            transition={beat >= 1 ? { duration: 1.5, ease } : { delay: 0.5, duration: 1.2, ease: "easeOut" }}
          >
            <motion.div className="push-mate" animate={{ y: [0, -12, 0, -12, 0, -12, 0, -12, 0] }} transition={{ duration: 3, delay: 0.5 }}>
              <MateBot pose="push" float={false} />
            </motion.div>
            <motion.div className="push-me" animate={{ y: [0, -5, 0, -5, 0, -5, 0, -5, 0] }} transition={{ duration: 3, delay: 0.5 }}>
              <MeFigure pose="push" />
            </motion.div>
          </motion.div>

          <button type="button" className="intro-skip" onClick={finish}>Skip intro</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
