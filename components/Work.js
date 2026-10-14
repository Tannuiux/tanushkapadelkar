// The emerald "Shipped work" band with your case studies.
import Reveal from "@/components/Reveal";
import EBotDemo from "@/components/EBotDemo";
import CompareSlider from "@/components/CompareSlider";

const FRAMER = "https://tanushkanuiux.framer.website";

export default function Work() {
  return (
    <section className="band" id="work">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Shipped work</div>
          <h2 className="sec">Products where AI and people <i>work together.</i></h2>
          <p className="intro">Each one shows what AI handled and where I made the call. Read the case study, or try it yourself.</p>
        </Reveal>

        <div className="cases">
          {/* ---------- E-Bot ---------- */}
          <Reveal as="article" className="case">
            <div>
              <div className="logo">E-B<span>O</span>T</div>
              <h3>An AI chatbot that knows when to step aside</h3>
              <p className="sum">Working adults studying after 9pm waited until morning for answers. E-Bot answers first and hands the whole chat to a tutor when it is unsure, with dashboards so tutors know where to start.</p>
              <div className="chips"><span className="pill">AI interaction design</span><span className="pill">Internal tools</span><span className="pill">e-Careers</span></div>
              <div className="calls">
                <div className="call"><span className="tag ai">AI</span><span>Answers in seconds from the learner&apos;s course and module.</span></div>
                <div className="call"><span className="tag me">My call</span><span>Hand over to a tutor instead of guessing. Trust beat automation.</span></div>
              </div>
              <div className="metric"><b>55%</b><span>less student churn after launch</span></div>
              <div className="actions"><a className="btn solid" href={`${FRAMER}/tutor-portal`} target="_blank" rel="noopener">View case study</a></div>
            </div>
            <EBotDemo />
            <div className="shots" style={{ gridColumn: "1/-1" }}>
              <img src="/img/eb-chat.jpg" alt="E-Bot answering a learner's question with lesson links" loading="lazy" />
              <img src="/img/eb-handoff.jpg" alt="The tutor joining the chat, shown differently from E-Bot" loading="lazy" />
              <img src="/img/eb-decision.jpg" alt="The learner choosing to close the query or keep talking" loading="lazy" />
            </div>
          </Reveal>

          {/* ---------- Snap Budget ---------- */}
          <Reveal as="article" className="case">
            <div>
              <div className="logo">SNAP<span>·</span>BUDGET</div>
              <h3>Know what&apos;s left, what you have, and what you&apos;re saving for</h3>
              <p className="sum">A budgeting app that saves receipts item by item, so it remembers what you bought. Onboarding, budget, item memory, stats and goals.</p>
              <div className="chips"><span className="pill">Fintech</span><span className="pill">Mobile</span><span className="pill">From a 3-day workshop</span></div>
              <div className="calls">
                <div className="call"><span className="tag ai">AI</span><span>A first dashboard in minutes. It was a generic wallet.</span></div>
                <div className="call"><span className="tag me">My call</span><span>One number, &quot;left this month&quot;, and item memory as the hero.</span></div>
              </div>
              <div className="actions">
                <a className="btn em" href="/prototype.html" target="_blank" rel="noopener">Use live prototype</a>
                <a className="btn" href={`${FRAMER}/snap-budget`} target="_blank" rel="noopener">View case study</a>
              </div>
            </div>
            <CompareSlider />
          </Reveal>

          {/* ---------- Smaller cards ---------- */}
          <div className="mini">
            <Reveal as="article" className="case">
              <div>
                <div className="logo">E-STREAM</div>
                <h3>An in-house video library that replaced paid hosting</h3>
                <p className="sum">I led the research, design and testing: upload, access control and an engagement dashboard admins read at a glance.</p>
                <div className="metric"><b>87%</b><span>lower annual video costs, 12+ tutor uploads a day</span></div>
                <div className="actions"><a className="btn" href={`${FRAMER}/video-library`} target="_blank" rel="noopener">View case study</a></div>
              </div>
            </Reveal>
            <Reveal as="article" className="case" delay={0.12}>
              <div>
                <div className="logo">MIND<span>·</span>CHECK</div>
                <h3>Wellbeing check-ins for a Dublin football club</h3>
                <p className="sum">Research and prototype with UCD and Football Cooperative. Focus groups and thematic analysis moved us from long surveys to quick in-the-moment check-ins.</p>
                <div className="metric"><b>4</b><span>themes: stress relief, connection, habit, identity</span></div>
                <div className="actions"><a className="btn" href={`${FRAMER}/football-cooperative`} target="_blank" rel="noopener">View case study</a></div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
