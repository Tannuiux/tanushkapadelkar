"use client";
// The tools fall into a box when you scroll to them, and you can drag them around (Matter.js physics).
// Until it starts (or if someone prefers reduced motion) the chips just sit in a neat row.
import { useEffect, useRef } from "react";
import { tools } from "@/data/content";

export default function ToolsPile() {
  const ref = useRef(null);

  useEffect(() => {
    const pile = ref.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop = () => {};

    const startPile = async () => {
      const Matter = (await import("matter-js")).default; // loaded only when needed
      const { Engine, Bodies, Composite, Mouse, MouseConstraint, Runner } = Matter;
      const chips = [...pile.querySelectorAll(".toolchip")];
      const sizes = chips.map((c) => [c.offsetWidth, c.offsetHeight]);
      pile.classList.remove("static");
      const PW = pile.clientWidth, PH = pile.clientHeight;
      const engine = Engine.create(); engine.gravity.y = 1;
      const wall = (x, y, w, h) => Bodies.rectangle(x, y, w, h, { isStatic: true });
      Composite.add(engine.world, [wall(PW / 2, PH + 30, PW * 2, 60), wall(-30, PH / 2, 60, PH * 3), wall(PW + 30, PH / 2, 60, PH * 3)]);
      const bodies = chips.map((c, i) => {
        const [w, h] = sizes[i];
        return Bodies.rectangle(40 + Math.random() * (PW - 80), -60 - i * 45, w, h, { chamfer: { radius: 12 }, restitution: 0.3, friction: 0.4, angle: (Math.random() - 0.5) * 0.6 });
      });
      Composite.add(engine.world, bodies);
      const mouse = Mouse.create(pile); mouse.pixelRatio = 1;
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2 } }));
      const runner = Runner.create(); Runner.run(runner, engine);
      let raf;
      const loop = () => {
        bodies.forEach((b, i) => { const [w, h] = sizes[i]; chips[i].style.transform = `translate(${b.position.x - w / 2}px,${b.position.y - h / 2}px) rotate(${b.angle}rad)`; });
        raf = requestAnimationFrame(loop);
      };
      loop();
      stop = () => { cancelAnimationFrame(raf); Runner.stop(runner); Engine.clear(engine); };
    };

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); startPile(); } }, { threshold: 0.4 });
    io.observe(pile);
    return () => { io.disconnect(); stop(); };
  }, []);

  return (
    <>
      <div className="pilewrap static" ref={ref} aria-label="Tools I use">
        {tools.map(([name, kind]) => <span key={name} className={`toolchip ${kind}`}>{name}</span>)}
      </div>
      <p className="pilehint">Drag the tools around. Violet ones are AI tools, green ones are where I keep it human.</p>
    </>
  );
}
