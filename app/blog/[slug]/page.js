// One blog post, at /blog/<slug>.
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Connect from "@/components/Connect";
import Lightbox from "@/components/Lightbox";
import { posts, bySlug, fmtDate } from "@/data/blog";

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }) {
  const p = bySlug((await params).slug);
  return p ? { title: `${p.title} · Tanushka Padelkar`, description: p.excerpt } : {};
}

function Block({ b }) {
  switch (b.t) {
    case "p": return <p className="ar-p">{b.text}</p>;
    case "h": return <h2 className="ar-h">{b.text}</h2>;
    case "list": return <ul className="ar-list">{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
    case "quote": return <blockquote className="ar-quote">“{b.text}”{b.by && <cite>{b.by}</cite>}</blockquote>;
    case "img": return <figure className="ar-fig"><img className="cs3-media" src={b.src} alt={b.cap || ""} loading="lazy" />{b.cap && <figcaption>{b.cap}</figcaption>}</figure>;
    default: return null;
  }
}

export default async function Post({ params }) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const next = list[(list.indexOf(p) + 1) % list.length];
  return (
    <>
      <Nav />
      <Lightbox />
      <main className="pg">
        <header className="pg-hero">
          <div className="ar-col">
            <Link href="/blog" className="cs3-back">← All posts</Link>
            <p className="cs3-kicker"><b>{p.category}</b><i>·</i>{fmtDate(p.date)}<i>·</i>{p.read}</p>
            <h1>{p.title}</h1>
            <p className="cs3-intro">{p.excerpt}</p>
          </div>
        </header>
        <div className="ar-col ar-cover"><Reveal className="cs3-herocard"><img className="cs3-media" src={p.cover} alt="" /></Reveal></div>
        <article className="ar-col ar-body">
          {p.blocks.map((b, i) => <Block key={i} b={b} />)}
          <p className="ar-by">Written by Tanushka Padelkar</p>
          <Link href={`/blog/${next.slug}`} className="cs3-next"><span>Next post</span><b>{next.title} →</b></Link>
        </article>
      </main>
      <Connect />
    </>
  );
}
