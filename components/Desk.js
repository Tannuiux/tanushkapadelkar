"use client";
// The desk scene (your hero). You sit at your desk, seen from behind, with your AI mate by the screen.
// A spinning ring invites people to say "Hey!". When they click, you turn around and wave, and your intro appears.
// Later you can swap the drawn room for your Spline scene or a looping video (see data/content.js).
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MeFigure, MeBack, MateBot } from "@/components/Characters";
import Magnetic from "@/components/Magnetic";
import { site, hero, desk } from "@/data/content";
import { useTwin } from "@/components/Twin";

function Room() {
  // The 3D room (public/characters/room.webp). Swap it for your own render or a looping video later.
  return <img className="room" src="/characters/room.webp" alt="" aria-hidden="true" draggable={false} />;
}

export default function Desk() {
  const [said, setSaid] = useState(false);
  const { open } = useTwin();

  return (
    <header className={`desk ${said ? "said" : ""}`} id="top">
      {/* The scene keeps the room and characters lined up at any screen size. */}
      <div className="scene">
      <Room />

      {/* you, at the desk */}
      <div className="desk-me">
        <AnimatePresence mode="wait">
          {!said ? (
            <motion.div key="back" className="me-back" exit={{ scaleX: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
              <MeBack />
            </motion.div>
          ) : (
            <motion.div key="front" className="me-front" initial={{ scaleX: 0, y: 10 }} animate={{ scaleX: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
              <MeFigure pose="wave" alt="Tanushka waving hello" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* your AI mate by the screen */}
      <motion.button
        type="button" className="desk-mate" onClick={open} aria-label="Ask my AI mate about my work"
        animate={said ? { y: [0, -40, 0], rotate: [0, -10, 0] } : { y: 0 }}
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.08 }}
      >
        <MateBot pose={said ? "point" : "wave"} />
        {said && <motion.span className="bubble" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>Ask me about her work!</motion.span>}
      </motion.button>
      </div>

      {/* the "say hey" ring */}
      <AnimatePresence>
        {!said && (
          <motion.button
            type="button" className="hey" onClick={() => setSaid(true)}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.6 }} transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.2 }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            aria-label='Say "Hey!" to Tanushka'
          >
            <svg viewBox="0 0 200 200" className="ring" aria-hidden="true">
              <defs><path id="ringpath" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" /></defs>
              <text><textPath href="#ringpath">{desk.ring.repeat(2)}</textPath></text>
            </svg>
            <span className="hey-in"><small>{desk.prompt}</small><b>“{desk.hey}”</b></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* your intro, after hey */}
      <AnimatePresence>
        {said && (
          <motion.div className="desk-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.35 }}>
            <p className="reply">{desk.reply}</p>
            <h1>{hero.title}</h1>
            <p className="quote">“{hero.quote}”</p>
            <div className="ctas">
              <Magnetic><a className="btn solid" href="#work">See my projects</a></Magnetic>
              <Magnetic><a className="btn" href={site.resume} target="_blank" rel="noopener">Resume</a></Magnetic>
              <Magnetic><a className="btn" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a></Magnetic>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* name stays visible for anyone who doesn't click */}
      {!said && <p className="desk-name"><b>{site.name}</b> · {hero.title}, Dublin</p>}
    </header>
  );
}
