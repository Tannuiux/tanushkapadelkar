"use client";
// Small live demos that sit on each project card, so people can try the idea, not just look at it.
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// A 3D phone that holds a real prototype. It sits angled, and straightens when you hover.
export function Phone({ src, still, alt, label, theme = "dark", flat = false }) {
  const [on, setOn] = useState(!still);
  return (
    <div className="phone3d-wrap">
      <motion.div className={`phone3d ${theme}`} initial={flat ? { rotateY: -6, rotateX: 2 } : { rotateY: -14, rotateX: 6 }} whileHover={{ rotateY: 0, rotateX: 0, y: -8 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
        <div className="phone3d-screen">
          {on ? (
            <iframe src={src} title={alt} loading="lazy" />
          ) : (
            <button type="button" className="snap-shot" onClick={() => setOn(true)} aria-label={`Open ${alt}`}>
              <img src={still} alt={alt} />
              <span className="snap-try">{label}</span>
            </button>
          )}
        </div>
        <span className="phone3d-side" aria-hidden="true" />
      </motion.div>
      <div className="phone3d-shadow" aria-hidden="true" />
    </div>
  );
}

// E-Bot: your real MVP from Figma Make, opened on the chat (message bar, chips and tutor handoff all work).
function EBotPhone() {
  return <Phone src="/ebot/index.html#chat" alt="E-Bot prototype" theme="light" />;
}

// Snap Budget: shows the item memory feature first. Tap to run the full prototype.
function SnapDemo() {
  return <Phone src="/snap/index.html" still="/img/snap-memory.webp" alt="Snap Budget prototype, Kitchen Roll bought twice at Dunnes Stores" label="Tap to try the prototype" />;
}

// e-Stream: flip a video between outside hosting and the in-house library, and toggle who can see it.
const GROUPS = ["Learners", "Tutors", "Admins"];
function StreamDemo() {
  const [inHouse, setInHouse] = useState(false);
  const [access, setAccess] = useState({ Learners: true, Tutors: true, Admins: true });
  return (
    <div className="demo demo-stream">
      <div className="top"><span className="eyebrow">Try the library</span></div>
      <div className="ds-switch" role="group" aria-label="Where videos are hosted">
        {[[false, "External hosting"], [true, "In-house library"]].map(([v, label]) => (
          <button key={label} type="button" className={inHouse === v ? "on" : ""} onClick={() => setInHouse(v)}>
            {inHouse === v && <motion.span layoutId="dsw" className="ds-pill" />}<span>{label}</span>
          </button>
        ))}
      </div>
      <div className="ds-cost">
        <span>Yearly video cost</span>
        <div className="ds-bar"><motion.i animate={{ width: inHouse ? "13%" : "100%" }} transition={{ type: "spring", stiffness: 120, damping: 18 }} /></div>
        <AnimatePresence mode="wait">
          <motion.b key={String(inHouse)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {inHouse ? "−87%" : "Several subscriptions"}
          </motion.b>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.ul key={String(inHouse)} className="ds-list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {(inHouse
            ? ["One library for every upload", "Access set per group, in one click", "Engagement dashboard on first login"]
            : ["Files spread across several tools", "Access managed somewhere else", "No clear view of what learners watch"]
          ).map((t) => <li key={t} className={inHouse ? "ok" : "no"}>{t}</li>)}
        </motion.ul>
      </AnimatePresence>
      <div className="ds-video">
        <div className="ds-thumb">▶</div>
        <div>
          <b>Module 4 · Payroll basics</b>
          <small>{inHouse ? "Who can see this video:" : "Access settings live in another tool"}</small>
          <div className="ds-groups">
            {GROUPS.map((g) => (
              <button key={g} type="button" disabled={!inHouse} className={access[g] && inHouse ? "on" : ""} onClick={() => setAccess((a) => ({ ...a, [g]: !a[g] }))}>
                {access[g] && inHouse ? "✓ " : ""}{g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mental Health Tracker: the ten-second check-in. Each tap lands as a dot on the founder's trend line.
const MOODS = [["Rough", 1, "😫"], ["Low", 2, "😕"], ["Okay", 3, "😐"], ["Good", 4, "🙂"], ["Great", 5, "😄"]];
function CheckinDemo() {
  const [log, setLog] = useState([3, 2, 4, 3]);
  const [last, setLast] = useState(null);
  const tap = (v) => { setLog((l) => [...l.slice(-7), v]); setLast(v); };
  const W = 260, H = 90, n = log.length;
  const pts = log.map((v, i) => [12 + (i * (W - 24)) / Math.max(1, n - 1), H - 10 - ((v - 1) / 4) * (H - 20)]);
  return (
    <div className="demo demo-mind">
      <div className="top"><span className="eyebrow">Try the check-in</span><span className="dm-time">Just after the game</span></div>
      <p className="dm-q">How do you feel right now?</p>
      <div className="dm-moods">
        {MOODS.map(([label, v, emo]) => (
          <motion.button key={label} type="button" onClick={() => tap(v)} whileTap={{ scale: 0.88 }} className={last === v ? "on" : ""}>
            <motion.span className="emo" animate={last === v ? { scale: [1, 1.35, 1], rotate: [0, -10, 0] } : {}} transition={{ duration: 0.4 }}>{emo}</motion.span>{label}
          </motion.button>
        ))}
      </div>
      <div className="dm-dash">
        <small>Steven&apos;s dashboard · mood over recent games</small>
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <motion.polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" animate={{ points: pts.map((p) => p.join(",")).join(" ") }} />
          {pts.map(([x, y], i) => (
            <motion.circle key={i + "-" + n} cx={x} cy={y} r={i === n - 1 ? 6 : 4} initial={i === n - 1 ? { scale: 0 } : false} animate={{ scale: 1 }} className={i === n - 1 ? "new" : ""} />
          ))}
        </svg>
        <AnimatePresence>{last && <motion.span className="dm-saved" key={log.length} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Logged in one tap. No form.</motion.span>}</AnimatePresence>
      </div>
    </div>
  );
}

export default function Demo({ id }) {
  if (id === "ebot") return <EBotPhone />;
  if (id === "snap") return <SnapDemo />;
  if (id === "stream") return <StreamDemo />;
  if (id === "mind") return <CheckinDemo />;
  return null;
}
