// The blog list, at /blog. Posts live in data/blog.js.
import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Connect from "@/components/Connect";
import { posts, fmtDate } from "@/data/blog";

export const metadata = { title: "Blog · Tanushka Padelkar", description: "Thoughts, experiments and lessons from my journey as a product designer." };

export default function Blog() {
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <Nav />
      <main className="pg">
        <header className="pg-hero">
          <div className="cs3-wrap">
            <Link href="/" className="cs3-back">← Home</Link>
            <p className="cs3-kicker"><b>Blog</b><i>·</i>{list.length} posts</p>
            <h1>Thoughts, experiments and lessons.</h1>
            <p className="cs3-intro">Notes from my journey as a designer: how strategy, intuition and real-world limits shape the products I build.</p>
          </div>
        </header>
        <div className="cs3-wrap">
          <p className="wip"><span aria-hidden="true">✍️</span> This blog is a work in progress. I&apos;m still finishing these posts and adding photos, so check back soon.</p>
          <div className="bl-grid">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06} className={i === 0 ? "bl-feat" : ""}>
                <Link href={`/blog/${p.slug}`} className="bl-card">
                  <span className="bl-img"><img src={p.cover} alt="" loading="lazy" /></span>
                  <span className="bl-body">
                    <span className="bl-meta"><b>{p.category}</b> · {fmtDate(p.date)} · {p.read}</span>
                    <span className="bl-title">{p.title}</span>
                    <span className="bl-ex">{p.excerpt}</span>
                    <span className="bl-go">Read post →</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Connect />
    </>
  );
}
