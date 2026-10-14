"use client";
// Drag to compare: the AI's generic first draft (left) against your final Snap Budget home (right).
import { useState } from "react";

export default function CompareSlider() {
  const [v, setV] = useState(50);
  return (
    <figure className="compare" style={{ margin: 0 }}>
      <div className="device" style={{ "--pos": v / 100 }}>
        <div className="screen">
          <div className="layer draft" aria-hidden="true">
            <div className="row"><span>Hi there</span><span>⚙︎</span></div>
            <div><div style={{ color: "#777" }}>Total balance</div><div className="bal">$12,480.55</div></div>
            <div className="card">Main account •••• 4821<b>$8,214.00</b></div>
            <div className="icons"><span>Send</span><span>Pay</span><span>Top up</span><span>More</span></div>
            <div className="chart">{[40, 70, 55, 90, 35, 65, 80].map((h, i) => <i key={i} style={{ height: h + "%" }} />)}</div>
            <div className="tx"><div><span>Netflix</span><span>-$15.99</span></div><div><span>Uber</span><span>-$23.40</span></div><div><span>Salary</span><span>+$3,200</span></div></div>
          </div>
          <div className="layer after" style={{ "--cut": v + "%" }}>
            <img src="/img/sb-home.jpg" alt="Snap Budget home: money left this month, categories and items bought recently" />
          </div>
        </div>
        <div className="divider" />
        <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label="Compare the AI first draft with the final design" />
      </div>
      <div className="labels"><span className="tag ai">AI draft</span><span className="tag me">My design</span></div>
      <figcaption className="note">Drag to compare</figcaption>
    </figure>
  );
}
