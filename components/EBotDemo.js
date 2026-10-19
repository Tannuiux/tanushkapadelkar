"use client";
// The E-Bot demo from your design: a scripted chat you can steer with three suggestion chips,
// or by typing your own question. Typed questions get an honest "I'll save this for your tutor" reply.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

let uid = 0;
const START = [
  { cls: "sys", text: "21:14 · Computerised Payroll, Module 4" },
  { cls: "msg learner", who: "AOIFE · LEARNER", text: "How do I work out emergency tax on a first payslip?" },
  { cls: "msg bot", who: "E-BOT", text: "Emergency tax applies until Revenue has your tax credit certificate. Lesson 4.2 walks through a worked example for a first payslip." },
  { cls: "sys", text: "Saved for your tutor. They will review this answer." },
];

export default function EBotDemo() {
  const [msgs, setMsgs] = useState([]);
  const [q, setQ] = useState("");
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const log = useRef(null);

  const add = (m) => setMsgs((x) => [...x, { id: ++uid, ...m }]);
  const later = (ms, fn) => {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(setTimeout(fn, reduce ? 0 : ms));
  };
  const reset = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setMsgs([]); setDone(false);
    START.forEach((m, i) => later(250 + i * 650, () => add(m)));
  };
  useEffect(() => { reset(); return () => timers.current.forEach(clearTimeout); }, []); // eslint-disable-line
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [msgs]);

  const chips = {
    "Show me an example": () => {
      add({ cls: "msg learner", who: "AOIFE", text: "Show me an example?" });
      later(700, () => add({ cls: "msg bot", who: "E-BOT", text: "Say you earn €600 a week with no certificate yet: tax is worked out at the higher rate with no credits. Lesson 4.2, example B, shows each line of that payslip." }));
    },
    "That helped": () => {
      add({ cls: "msg learner", who: "AOIFE", text: "That helped, thanks!" });
      later(500, () => add({ cls: "sys", text: "Closed by Aoife. Saved to My Questions." }));
      later(600, () => setDone(true));
    },
    "Ask my tutor": () => {
      add({ cls: "msg learner", who: "AOIFE", text: "I need my tutor, my case has two employers." });
      later(600, () => add({ cls: "sys", text: "Queued for Sarah. Nothing is lost overnight." }));
      later(1400, () => add({ cls: "sys", text: "Next morning · Sarah has read the whole chat" }));
      later(2100, () => add({ cls: "msg tutor", who: "SARAH · TUTOR", text: "Hi Aoife, I read E-Bot's answer and your follow-up. Here's a worked example for two employers, step by step." }));
      later(2300, () => setDone(true));
    },
  };

  const send = (e) => {
    e.preventDefault();
    const t = q.trim(); if (!t) return;
    setQ("");
    add({ cls: "msg learner", who: "YOU", text: t });
    later(700, () => add({ cls: "msg bot", who: "E-BOT", text: "Good question. In this demo I only know Module 4, so I won't guess. I've saved it for your tutor, who will see the whole chat." }));
  };

  return (
    <div className="ebot" aria-label="E-Bot demo">
      <div className="ebot-top">
        <span className="ebot-label">Try E-Bot</span>
        <button type="button" className="ebot-restart" onClick={reset}>Restart</button>
      </div>
      <div className="ebot-log" ref={log} aria-live="polite" data-lenis-prevent>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} className={m.cls} layout initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {m.who && <small>{m.who}</small>}{m.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="ebot-chips">
        {Object.entries(chips).map(([label, fn]) => (
          <motion.button key={label} type="button" onClick={fn} disabled={done} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>{label}</motion.button>
        ))}
      </div>
      <form className="ebot-input" onSubmit={send}>
        <span aria-hidden="true">📎</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask E-Bot anything about your course" aria-label="Ask E-Bot a question" />
        <motion.button type="submit" aria-label="Send" whileTap={{ scale: 0.9 }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z" /></svg>
        </motion.button>
      </form>
    </div>
  );
}
