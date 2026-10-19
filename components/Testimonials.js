"use client";
// Kind words. Starts with me working with my team, then a winding path through floating avatars.
// Hover (or tap) an avatar to read what they said. The path ends at a target that links to Connect.
// Only real quotes go here. Empty circles are open spots, never made-up people.
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/data/content";

const W = 1200, H = 700;
const PATH = "M 330 560 C 430 560, 470 600, 560 600 S 700 190, 780 190 S 900 560, 980 560 S 1080 170, 1120 170";
// spots along the path (x, y in the 1200x640 box)
const SPOTS = [
  { x: 560, y: 600 },
  { x: 780, y: 190 },
  { x: 980, y: 560 },
];
const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

const nodes = [
  ...testimonials.map((t) => ({ kind: "real", ...t })),
  { kind: "open" },
  { kind: "open" },
].slice(0, SPOTS.length);

function Bubble({ n }) {
  if (n.kind === "real") {
    return (
      <>
        <blockquote>&ldquo;{n.quote}&rdquo;</blockquote>
        <figcaption><b>{n.name}</b><span>{n.role}</span></figcaption>
      </>
    );
  }
  return (
    <>
      <blockquote className="open">This spot is open for someone I&apos;ve worked with.</blockquote>
      <figcaption><a href="#connect">Worked with me? Add your words →</a></figcaption>
    </>
  );
}

function Target() {
  return (
    <motion.a href="#connect" className="tg" aria-label="Let's work together. Go to contact"
      whileHover="hover" initial="rest" animate="rest">
      <span className="tg-stage">
        <motion.span className="tg-board" variants={{ rest: { rotateY: -24, rotateX: 8 }, hover: { rotateY: -8, rotateX: 4 } }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}>
          <span className="tg-edge" />
          <span className="tg-face" />
          <span className="tg-arrow-w"><motion.svg className="tg-arrow" viewBox="0 0 120 40" aria-hidden="true"
            variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -4, 3, -2, 0] } }} transition={{ duration: 0.6 }}>
            <line x1="6" y1="20" x2="104" y2="20" />
            <path d="M6 20 L-4 10 M6 20 L-4 30 M14 20 L4 10 M14 20 L4 30" />
            <path className="tip" d="M104 12 L120 20 L104 28 Z" />
          </motion.svg></span>
        </motion.span>
      </span>
      <span className="tg-label">Your turn. Let&apos;s work together →</span>
    </motion.a>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const [active, setActive] = useState(0);
  const [dot, setDot] = useState({ x: 330, y: 560 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 70%"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(draw, "change", (v) => {
    const p = pathRef.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * Math.min(1, Math.max(0, v)));
    setDot({ x: pt.x, y: pt.y });
  });
  useEffect(() => { setDot({ x: 330, y: 560 }); }, []);

  const pos = (s) => ({ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` });

  return (
    <section className="blk testi2" id="kind-words" ref={ref}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Kind words</div>
          <h2 className="sec">From people I&apos;ve <i>built with.</i></h2>
        </Reveal>

        <div className="kw">
          <motion.img src="/img/team.webp" alt="Illustration of me talking through a design with two teammates at a standing table"
            className="kw-team" loading="lazy"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 90, damping: 16 }} />

          <svg className="kw-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path d={PATH} className="kw-bg" />
            <motion.path ref={pathRef} d={PATH} className="kw-fg" style={{ pathLength: draw }} />
            <circle cx={dot.x} cy={dot.y} r="7" className="kw-dot" />
          </svg>

          {nodes.map((n, i) => {
            const s = SPOTS[i];
            const on = active === i;
            const below = s.y < H / 2;
            return (
              <div key={i} className={`kw-node ${on ? "on" : ""} ${below ? "below" : "above"}`} style={pos(s)}>
                <motion.button type="button"
                  className={`kw-av ${n.kind}`}
                  aria-label={n.kind === "real" ? `Read what ${n.name} said` : "Open spot for a testimonial"}
                  aria-expanded={on}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                  animate={{ y: [0, -9, 0] }} transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  whileHover={{ scale: 1.12 }}>
                  {n.kind === "real" ? initials(n.name) : "+"}
                </motion.button>
                <AnimatePresence>
                  {on && (
                    <motion.figure className="kw-card" key="c"
                      initial={{ opacity: 0, y: below ? -10 : 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                      <Bubble n={n} />
                    </motion.figure>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="kw-end" style={pos({ x: 1120, y: 170 })}><Target /></div>
        </div>

        {/* phones: simple stack */}
        <div className="kw-m">
          <img src="/img/team.webp" alt="Illustration of me talking through a design with two teammates" className="kw-team-m" loading="lazy" />
          {testimonials.map((t) => (
            <figure key={t.name} className="kw-card"><span className="kw-av real">{initials(t.name)}</span><Bubble n={{ kind: "real", ...t }} /></figure>
          ))}
          <figure className="kw-card"><span className="kw-av open">+</span><Bubble n={{ kind: "open" }} /></figure>
          <Target />
        </div>
      </div>
    </section>
  );
}
