// One page per case study, at /work/<slug>. Same sections, order and theme as your Framer pages,
// so nobody has to leave this site. The content lives in data/studies.js.
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Demo from "@/components/Demos";
import Connect from "@/components/Connect";
import { cases } from "@/data/content";
import { studies } from "@/data/studies";

const bySlug = (slug) => cases.find((c) => studies[c.id].slug === slug);

export function generateStaticParams() {
  return cases.map((c) => ({ slug: studies[c.id].slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = bySlug(slug);
  return c ? { title: `${studies[c.id].name} · Tanushka Padelkar`, description: studies[c.id].intro } : {};
}

// Small line icons for the "Solution" lists (like the purple icons on Framer).
const ICONS = {
  chat: <path d="M4 5h16v10H9l-5 4z" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3 0 5 2 5 4" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  pulse: <path d="M2 12h4l3-7 4 14 3-7h6" />,
};

function Media({ src, alt, poster, narrow }) {
  const cls = `cs2-media${narrow ? " narrow" : ""}`;
  if (src.endsWith(".mp4")) return <video className={cls} src={src} poster={poster} autoPlay muted loop playsInline aria-label={alt} />;
  return <img className={cls} src={src} alt={alt} loading="lazy" />;
}

function Block({ b, id }) {
  switch (b.t) {
    case "h":
      return (
        <Reveal className={`cs2-h${b.small ? " small" : ""}`}>
          <h2 className={[b.color ? "c-" + b.color : "", b.accent ? "accent" : ""].join(" ")}>{b.text}</h2>
          {b.sub && <p className="cs2-sub">{b.sub}</p>}
        </Reveal>
      );
    case "eyebrow": return <p className="cs2-eyebrow">{b.text}</p>;
    case "p": return <Reveal><p className="cs2-p">{b.text}</p></Reveal>;
    case "sub": return <Reveal className="cs2-subblock"><h3>{b.text}</h3><p className="cs2-p">{b.body}</p></Reveal>;
    case "img": return <Reveal as="figure" className="cs2-fig"><Media src={b.src} alt={b.cap || ""} narrow={b.narrow} />{b.cap && <figcaption>{b.cap}</figcaption>}</Reveal>;
    case "video": return <Reveal as="figure" className="cs2-fig"><Media src={b.src} poster={b.poster} alt={b.cap} />{b.cap && <figcaption>{b.cap}</figcaption>}</Reveal>;
    case "chips": return <div className="cs2-chips">{b.items.map((x) => <span key={x}>{x}</span>)}</div>;
    case "quotes":
      return (
        <div className="cs2-quotes">
          {b.items.map(([who, q, need, note], k) => (
            <Reveal key={who} delay={k * 0.08} className={`cs2-quote q${k}`}>
              <p className="who">{who}{note && <small>({note})</small>}</p>
              <blockquote>&ldquo;{q}&rdquo;</blockquote>
              <p className="need"><span>Need</span>{need}</p>
            </Reveal>
          ))}
        </div>
      );
    case "features":
      return (
        <ul className="cs2-features">
          {b.items.map(([icon, title, body], k) => (
            <Reveal as="li" key={title} delay={k * 0.06}>
              <span className="ic"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[icon]}</svg></span>
              <div><b>{title}</b><p>{body}</p></div>
            </Reveal>
          ))}
        </ul>
      );
    case "stat": return <Reveal className="cs2-stat"><b>{b.value}</b><span>{b.label}</span></Reveal>;
    case "list": return <ul className="cs2-list">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case "table":
      return (
        <Reveal className="cs2-table">
          <table><thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody></table>
        </Reveal>
      );
    case "phones":
      return (
        <div className="cs2-phones">
          {b.items.map(([src, cap], k) => (
            <Reveal as="figure" key={src} delay={k * 0.1}><img src={src} alt={cap} loading="lazy" /><figcaption>{cap}</figcaption></Reveal>
          ))}
        </div>
      );
    case "demo": return <Reveal className="cs2-demo"><p className="cs2-eyebrow">{b.label}</p><Demo id={id} /></Reveal>;
    default: return null;
  }
}

// Group blocks so anything between {t:"band", start:true} and {t:"band", start:false} sits on a tinted band.
function group(blocks) {
  const out = []; let band = null;
  blocks.forEach((b, i) => {
    if (b.t === "band") { if (b.start) { band = { band: true, items: [], key: "band" + i }; out.push(band); } else band = null; return; }
    (band ? band.items : out).push({ ...b, key: i });
  });
  return out;
}

export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const c = bySlug(slug);
  if (!c) notFound();
  const s = studies[c.id];
  const next = cases[(cases.indexOf(c) + 1) % cases.length];

  return (
    <>
      <Nav />
      <main className={`cs2 theme-${s.theme}`}>
        <header className="cs2-hero">
          <div className="cs2-col">
            <Link href="/#work" className="cs2-back">← All work</Link>
            {s.title && <p className="cs2-kicker">{s.name}</p>}
            <h1>{s.title || s.name}</h1>
            {s.tags && <p className="cs2-tags">{s.tags.map((t, i) => <span key={t}>{i > 0 && <i>•</i>}{t}</span>)}</p>}
            <p className="cs2-intro">{s.intro}</p>
            {s.hero && <Media src={s.hero} alt={`${s.name} overview`} />}
            {s.intro2 && <p className="cs2-intro">{s.intro2}</p>}
          </div>
        </header>

        <section className="cs2-meta">
          <dl className="cs2-col">
            {s.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>

        <div className="cs2-body">
          {group(s.blocks).map((g) =>
            g.band
              ? <section key={g.key} className="cs2-band"><div className="cs2-col">{g.items.map((b) => <Block key={b.key} b={b} id={c.id} />)}</div></section>
              : <div key={g.key} className="cs2-col"><Block b={g} id={c.id} /></div>
          )}
        </div>

        <div className="cs2-col">
          <Link href={`/work/${studies[next.id].slug}`} className="cs2-next">
            <span>Next project</span>
            <b>{studies[next.id].name} →</b>
          </Link>
        </div>
      </main>
      <Connect />
    </>
  );
}
