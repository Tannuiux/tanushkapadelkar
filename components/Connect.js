"use client";
// The dark "Connect" card: copy email, LinkedIn, Book a call (Cal.com), and the AI twin. Plus the footer.
import { useEffect, useRef, useState } from "react";
import { getCalApi } from "@calcom/embed-react";
import Reveal from "@/components/Reveal";
import { site } from "@/data/content";
import { useTwin } from "@/components/Twin";

export default function Connect() {
  const { open } = useTwin();
  const [label, setLabel] = useState("Copy email");
  const mailRef = useRef(null);

  // Load Cal.com's popup only if you've set calLink in data/content.js.
  useEffect(() => {
    if (!site.calLink) return;
    getCalApi().then((cal) => cal("ui", { theme: "light", styles: { branding: { brandColor: "#2A3BFF" } } }));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(site.email)
      .then(() => { setLabel("Copied"); setTimeout(() => setLabel("Copy email"), 1600); })
      .catch(() => {
        const r = document.createRange(); r.selectNodeContents(mailRef.current);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        setLabel("Selected, press ⌘C");
      });
  };

  return (
    <section className="blk" id="connect" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="connect">
          <div>
            <div className="eyebrow">Connect with me</div>
            <h2>Need a designer who <span>ships</span>?</h2>
            <p>I&apos;m looking for Product Designer roles in Dublin, hybrid or remote, and I&apos;m happy to travel or relocate for the right team. A friendly hello works too.</p>
          </div>
          <div className="cstack">
            <span className="mail" ref={mailRef}>{site.email}</span>
            <button className="btn solid" type="button" onClick={copy}>{label}</button>
            {site.calLink && (
              <button className="btn cal" type="button" data-cal-link={site.calLink} data-cal-config='{"layout":"month_view"}'>Book a 30-min call</button>
            )}
            <a className="btn" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <button className="btn" type="button" onClick={open}>Ask my AI twin</button>
          </div>
        </Reveal>
        <footer><span>© 2026 {site.name} · Dublin</span><span>Designed by me, built with AI.</span></footer>
      </div>
    </section>
  );
}
