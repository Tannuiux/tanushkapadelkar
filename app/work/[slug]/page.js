// One page per case study, at /work/<slug>. Every case study uses the same frame (like Divyansh's):
// a coloured hero with the facts, a big image card, then a sticky contents list on the left and
// numbered sections on the right. Only the accent colour changes per project. Content: data/studies.js.
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { Phone } from "@/components/Demos";
import Connect from "@/components/Connect";
import Lightbox from "@/components/Lightbox";
import CaseToc from "@/components/CaseToc";
import { cases } from "@/data/content";
import { studies } from "@/data/studies";

const bySlug = (slug) => cases.find((c) => studies[c.id].slug === slug);

// One accent per project. Everything else is shared.
const ACCENT = {
  tutor: ["#16A37F", "#0E7C62", "#05392D"],
  stream: ["#9B4DFF", "#6A1FC9", "#25104A"],
  mind: ["#45B862", "#2E8A47", "#123A1E"],
  snap: ["#8B6CFF", "#5B3FD9", "#1C1240"],
};

export function generateStaticParams() {
  return cases.map((c) => ({ slug: studies[c.id].slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = bySlug(slug);
  return c ? { title: `${studies[c.id].name} · Tanushka Padelkar`, description: studies[c.id].intro } : {};
}

const ICONS = {
  chat: <path d="M4 5h16v10H9l-5 4z" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3 0 5 2 5 4" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  pulse: <path d="M2 12h4l3-7 4 14 3-7h6" />,
};

function Media({ src, alt, poster, narrow }) {
  const cls = `cs3-media${narrow ? " narrow" : ""}`;
  if (src.endsWith(".mp4")) return <video className={cls} src={src} poster={poster} autoPlay muted loop playsInline aria-label={alt} />;
  return <img className={cls} src={src} alt={alt} loading="lazy" />;
}

// "Problem: They knew it worked." -> label "Problem", title "They knew it worked."
function splitHeading(b) {
  const i = b.text.indexOf(":");
  if (i > 0 && i < 30) return { label: b.text.slice(0, i), title: b.text.slice(i + 1).trim(), sub: b.sub };
  if (b.sub && b.sub.length < 90) return { label: b.text, title: b.sub, sub: null };
  return { label: b.text, title: b.text, sub: b.sub };
}

// Turn the flat block list into numbered sections. A big heading starts a new section.
// Projects told only through images (Snap Budget) get one section per image.
function sections(s) {
  const blocks = s.blocks.filter((b) => b.t !== "band");
  const hasH = blocks.some((b) => b.t === "h" && !b.small);
  const out = [];
  let cur = null;
  blocks.forEach((b, i) => {
    const starts = hasH ? b.t === "h" && !b.small : b.t === "img";
    if (starts) {
      const head = hasH ? splitHeading(b) : { label: b.cap, title: null, sub: null };
      cur = { id: `s${out.length + 1}`, ...head, items: hasH ? [] : [{ ...b, key: i, cap: null }] };
      out.push(cur);
      return;
    }
    if (!cur) { cur = { id: "s1", label: "Overview", title: null, sub: null, items: [] }; out.push(cur); }
    cur.items.push({ ...b, key: i });
  });
  return out;
}

const WIDE = new Set(["img", "video", "phones", "proto", "quotes"]);

function Block({ b }) {
  const wide = WIDE.has(b.t) && !b.narrow ? " wide" : "";
  switch (b.t) {
    case "h": return <Reveal className="cs3-h3"><h3>{b.text}</h3>{b.sub && <p>{b.sub}</p>}</Reveal>;
    case "eyebrow": return <p className="cs3-eyebrow">{b.text}</p>;
    case "p": return <Reveal><p className="cs3-p">{b.text}</p></Reveal>;
    case "sub": return <Reveal className="cs3-sub"><h4>{b.text}</h4><p>{b.body}</p></Reveal>;
    case "img":
    case "video":
      return (
        <Reveal as="figure" className={`cs3-fig${wide}`}>
          <Media src={b.src} poster={b.poster} alt={b.alt || b.cap || ""} narrow={b.narrow} />
          {b.cap && <figcaption>{b.cap}</figcaption>}
        </Reveal>
      );
    case "chips": return <div className="cs3-chips">{b.items.map((x) => <span key={x}>{x}</span>)}</div>;
    case "quotes":
      return (
        <div className={`cs3-quotes${wide}`}>
          {b.items.map(([who, q, need, note], k) => (
            <Reveal key={who} delay={k * 0.08} className="cs3-card">
              <p className="cs3-tag">{who}{note ? ` · ${note}` : ""}</p>
              <blockquote>&ldquo;{q}&rdquo;</blockquote>
              <p className="cs3-need"><span>Need</span>{need}</p>
            </Reveal>
          ))}
        </div>
      );
    case "features":
      return (
        <ul className="cs3-features">
          {b.items.map(([icon, title, body], k) => (
            <Reveal as="li" key={title} delay={k * 0.06} className="cs3-card">
              <span className="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[icon]}</svg></span>
              <b>{title}</b><p>{body}</p>
            </Reveal>
          ))}
        </ul>
      );
    case "stat": return <Reveal className="cs3-stat"><p className="cs3-tag">Result</p><b>{b.value}</b><span>{b.label}</span></Reveal>;
    case "list": return <ul className="cs3-list">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case "table":
      return (
        <Reveal className="cs3-table">
          <table><thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody></table>
        </Reveal>
      );
    case "phones":
      return (
        <div className={`cs3-phones${wide}`}>
          {b.items.map(([src, cap], k) => (
            <Reveal as="figure" key={src} delay={k * 0.1}><img src={src} alt={cap} loading="lazy" /><figcaption>{cap}</figcaption></Reveal>
          ))}
        </div>
      );
    case "proto":
      return (
        <Reveal className={`cs3-proto${wide}`} id="prototype">
          <div className="cs3-proto-txt">
            <p className="cs3-tag">Live prototype</p>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
            <span className="cs3-hint">Scroll and tap inside the phone →</span>
          </div>
          <Phone src={b.src} alt={b.title} theme={b.theme || "dark"} flat />
        </Reveal>
      );
    default: return null;
  }
}

export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();
  const s = studies[c.id];
  const next = cases[(cases.indexOf(c) + 1) % cases.length];
  const secs = sections(s);
  const hasProto = s.blocks.some((b) => b.t === "proto");
  const [a1, a2, a3] = ACCENT[s.theme] || ACCENT.tutor;
  const style = { "--acc": a2, "--acc1": a1, "--acc3": a3 };

  return (
    <>
      <Nav />
      <Lightbox />
      <main className="cs3" style={style}>
        <header className="cs3-hero">
          <div className="cs3-wrap">
            <Link href="/#work" className="cs3-back">← All work</Link>
            <p className="cs3-kicker"><b>{s.name}</b><i>·</i>Case study</p>
            <h1>{s.title || s.name}</h1>
            <p className="cs3-intro">{s.intro}</p>
            <div className="cs3-ctas">
              {hasProto && <a href="#prototype" className="cs3-btn solid">Try the prototype ↗</a>}
              <a href={`#${secs[0]?.id || "s1"}`} className="cs3-btn ghost">Read the story ↓</a>
            </div>
            <dl className="cs3-meta">
              {s.meta.slice(0, 4).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </header>

        {s.hero && (
          <div className="cs3-wrap">
            <Reveal className="cs3-herocard"><Media src={s.hero} alt={`${s.name} overview`} /></Reveal>
          </div>
        )}

        <div className="cs3-wrap cs3-body">
          <CaseToc items={secs.map((x) => [x.id, x.label])} />
          <div className="cs3-main">
            {s.intro2 && <Reveal><p className="cs3-lead">{s.intro2}</p></Reveal>}
            {secs.map((sec, n) => (
              <section key={sec.id} id={sec.id} className="cs3-sec">
                <Reveal>
                  <p className="cs3-num"><b>{String(n + 1).padStart(2, "0")}</b><i />{sec.label}</p>
                  {sec.title && <h2>{sec.title}</h2>}
                  {sec.sub && <p className="cs3-p">{sec.sub}</p>}
                </Reveal>
                {sec.items.map((b) => <Block key={b.key} b={b} />)}
              </section>
            ))}
            <Link href={`/work/${studies[next.id].slug}`} className="cs3-next">
              <span>Next project</span>
              <b>{studies[next.id].name} →</b>
            </Link>
          </div>
        </div>
      </main>
      <Connect />
    </>
  );
}
