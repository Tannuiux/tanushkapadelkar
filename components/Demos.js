"use client";
// Small live demos that sit on each project card, so people can try the idea, not just look at it.
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import EBotDemo from "@/components/EBotDemo";

// Snap Budget: the real tap-through prototype, loaded only when someone asks for it.
function SnapDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="demo-snap">
      {on ? (
        <iframe src="/prototype.html" title="Snap Budget prototype" loading="lazy" />
      ) : (
        <motion.button type="button" className="demo-start" onClick={() => setOn(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <span className="demo-play">▶</span>
          Tap to try the prototype
          <small>Scan a receipt, check an item, see your month</small>
        </motion.button>
      )}
    </div>
  );
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
const MOODS = [["Rough", 1], ["Low", 2], ["Okay", 3], ["Good", 4], ["Great", 5]];
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
        {MOODS.map(([label, v]) => (
          <motion.button key={label} type="button" onClick={() => tap(v)} whileTap={{ scale: 0.88 }} className={last === v ? "on" : ""}>
            <i style={{ height: 10 + v * 6 }} />{label}
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
  if (id === "ebot") return <EBotDemo />;
  if (id === "snap") return <SnapDemo />;
  if (id === "stream") return <StreamDemo />;
  if (id === "mind") return <CheckinDemo />;
  return null;
}
