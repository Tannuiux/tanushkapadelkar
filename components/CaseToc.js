"use client";
// Sticky "Contents" list beside a case study. Highlights the section you're reading.
import { useEffect, useState } from "react";

export default function CaseToc({ items }) {
  const [active, setActive] = useState(items[0]?.[0]);
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="cs3-toc" aria-label="Contents">
      <p>Contents</p>
      <ol>
        {items.map(([id, label], i) => (
          <li key={id} className={active === id ? "on" : ""}>
            <a href={`#${id}`}><span>{String(i + 1).padStart(2, "0")}</span><i />{label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
