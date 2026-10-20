"use client";
// The AI twin: a pop-up chat. Any component can open it with useTwin().open().
// Preset questions always work. Typed questions go to /api/chat, only when you've added an API key.
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRESETS, site } from "@/data/content";

const TwinContext = createContext({ open: () => {} });
export const useTwin = () => useContext(TwinContext);

let uid = 0;
const HELLO = { id: 0, cls: "bot", who: "MY AI TWIN", text: "Hi, I'm Tanushka's AI twin. Ask me about her work, how she designs with AI, or whether she's available." };

export function TwinProvider({ children }) {
  const dlg = useRef(null);
  const log = useRef(null);
  const [msgs, setMsgs] = useState([HELLO]);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  const open = () => { if (!dlg.current.open) dlg.current.showModal(); };

  // ⌘K / Ctrl+K toggles the twin, and ask the server once whether typed chat is on.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dlg.current.open ? dlg.current.close() : open();
      }
    };
    addEventListener("keydown", onKey);
    fetch("/api/chat").then((r) => r.json()).then((d) => setEnabled(!!d.enabled)).catch(() => {});
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [msgs]);

  const push = (cls, who, text) => { const id = ++uid; setMsgs((m) => [...m, { id, cls, who, text }]); return id; };
  const update = (id, text) => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text } : x)));

  // Types an answer out a few letters at a time, like it's thinking.
  const typeOut = (id, text) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return update(id, text);
    let i = 0;
    const step = () => { i = Math.min(text.length, i + 3); update(id, text.slice(0, i)); if (i < text.length) requestAnimationFrame(step); };
    step();
  };

  const history = () => msgs.filter((m) => m.id !== 0 && (m.cls === "bot" || m.cls === "learner"))
    .map((m) => ({ role: m.cls === "bot" ? "assistant" : "user", content: m.text }));

  const askPreset = (question, answer) => { push("learner", "YOU", question); typeOut(push("bot", "MY AI TWIN", ""), answer); };

  const askOwn = async (e) => {
    e.preventDefault();
    const text = q.trim(); if (!text || busy) return;
    setQ(""); setBusy(true);
    const messages = [...history(), { role: "user", content: text }];
    push("learner", "YOU", text);
    const id = push("bot", "MY AI TWIN", "Thinking...");
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }) });
      const d = await r.json();
      if (r.ok) typeOut(id, d.text);
      else if (d.error === "rate_limited") update(id, "Too many questions right now. Try one above, or email " + site.email + ".");
      else update(id, "Something went wrong. Try one of the questions above, or email " + site.email + ".");
    } catch {
      update(id, "Something went wrong. Try one of the questions above, or email " + site.email + ".");
    } finally { setBusy(false); }
  };

  return (
    <TwinContext.Provider value={{ open }}>
      {children}
      <dialog ref={dlg} aria-label="Ask my AI twin" onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        <div className="chat">
          <div className="dhead">
            <span className="tag ai">My AI twin</span>
            <button className="x" type="button" aria-label="Close" onClick={() => dlg.current.close()}>×</button>
          </div>
          <div className="log" ref={log} aria-live="polite" data-lenis-prevent>
            <AnimatePresence initial={false}>
              {msgs.map((m) => (
                <motion.div key={m.id} className={`msg ${m.cls}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <small>{m.who}</small><span>{m.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {!enabled && <p className="presets-h">Ask one of these</p>}
          <div className="presets">
            {PRESETS.map(([question, answer]) => (
              <button key={question} type="button" onClick={() => askPreset(question, answer)}>{question}</button>
            ))}
          </div>
          {enabled && (
            <form className="ask" onSubmit={askOwn}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask your own question" aria-label="Ask your own question" autoComplete="off" maxLength={600} />
              <button className="btn solid" type="submit" disabled={busy}>Ask</button>
            </form>
          )}
          <p className="fine">{enabled ? "Answers come from my CV and case studies only." : "Pick a question. It only knows my CV and case studies."}</p>
        </div>
      </dialog>
    </TwinContext.Provider>
  );
}
