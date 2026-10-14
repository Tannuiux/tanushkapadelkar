"use client";
// The scripted E-Bot → tutor handoff you can click through. Messages pop in with Motion.
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

let uid = 0;

export default function EBotDemo() {
  const [msgs, setMsgs] = useState([]);
  const [choices, setChoices] = useState([]);
  const timers = useRef([]);

  const add = (cls, who, text) => setMsgs((m) => [...m, { id: ++uid, cls, who, text }]);
  const later = (ms, fn) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(setTimeout(fn, reduce ? 0 : ms));
  };

  const tutor = useCallback(() => {
    setChoices([]);
    add("msg learner", "AOIFE", "I need my tutor, my case has two employers.");
    later(600, () => add("sys", "", "Queued for Sarah. Nothing is lost overnight."));
    later(1400, () => add("sys", "", "Next morning · Sarah has read the whole chat"));
    later(2100, () => add("msg tutor", "SARAH · TUTOR", "Hi Aoife, I read E-Bot's answer and your follow-up. I've attached a worked example for two employers, step by step."));
    later(2800, () => setChoices([
      ["Close this query", () => { setChoices([]); add("sys", "", "Closed. Nobody had to explain twice."); }],
      ["Keep talking", () => { setChoices([]); add("sys", "", "Conversation stays open with Sarah."); }],
    ]));
  }, []);

  const start = useCallback(() => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setChoices([]);
    setMsgs([
      { id: ++uid, cls: "sys", who: "", text: "21:14 · Computerised Payroll, Module 4" },
      { id: ++uid, cls: "msg learner", who: "AOIFE · LEARNER", text: "How do I work out emergency tax on a first payslip?" },
    ]);
    later(700, () => add("msg bot", "E-BOT", "Emergency tax applies until Revenue has your tax credit certificate. Lesson 4.2 walks through a worked example for a first payslip."));
    later(1500, () => add("sys", "", "Saved for your tutor. They will review this answer."));
    later(2100, () => setChoices([
      ["That helps, thanks", () => { setChoices([]); add("msg learner", "AOIFE", "That helps, thanks!"); later(500, () => add("sys", "", "Closed by Aoife. Saved to My Questions.")); }],
      ["I need my tutor", tutor],
    ]));
  }, [tutor]);

  useEffect(() => { start(); return () => timers.current.forEach(clearTimeout); }, [start]);

  return (
    <div className="demo" aria-label="E-Bot handoff demo">
      <div className="top">
        <span className="eyebrow">Try the handoff</span>
        <button className="btn ghost" type="button" onClick={start} style={{ padding: "6px 12px", fontSize: 13 }}>Restart</button>
      </div>
      <div className="thread" aria-live="polite">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              className={m.cls}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {m.who && <small>{m.who}</small>}
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="choices">
        {choices.map(([label, fn]) => (
          <motion.button key={label} type="button" onClick={fn} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.96 }}>
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
