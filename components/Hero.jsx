// Hero — typing subtitle, serif name
const { useState, useEffect, useRef } = React;

function Hero() {
  const roles = [
    "Founding AI Engineer",
    "BioNLP Researcher",
    "Game Designer",
    "Rock Climber",
    "Writer",
  ];
  const [roleIdx, setRoleIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | deleting

  useEffect(() => {
    const current = roles[roleIdx];
    let timeout;
    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 64 + Math.random() * 32);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), 3200);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 32);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, roleIdx]);

  return (
    <section className="hero" id="top">
      <div className="hero-portrait" aria-hidden="true">
        <img src="assets/headshot.jpg" alt="" />
      </div>
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="dot" />
          <span>Est. 2003 · Based in Boston, MA</span>
        </div>
        <h1 className="hero-title">
          William <em>Xia</em>
        </h1>
        <div className="hero-subtitle">
          <span className="subtitle-prefix">I'm a&nbsp;</span>
          <span className="typed">
            {text}
            <span className="caret" aria-hidden="true" />
          </span>
        </div>
        <p className="hero-blurb">
          Founding Applied AI Engineer at <a href="https://mavenbio.com/" target="_blank" rel="noreferrer">Maven Bio</a>.
          Building agentic systems, data pipelines, and business intelligence tools.
        </p>
        <div className="hero-meta">
          <div className="meta-col">
            <div className="meta-label">Currently</div>
            <div className="meta-val">Maven Bio</div>
          </div>
          <div className="meta-col">
            <div className="meta-label">Previously</div>
            <div className="meta-val">NIH · SolidWorks · Tufts</div>
          </div>
          <div className="meta-col">
            <div className="meta-label">After-Hours</div>
            <div className="meta-val">Climbing · Writing · Gaming</div>
          </div>
        </div>
      </div>

      <div className="hero-scrollcue">
        <span>scroll</span>
        <svg width="12" height="40" viewBox="0 0 12 40"><line x1="6" y1="0" x2="6" y2="38" stroke="currentColor" strokeWidth="1"/><polyline points="2,32 6,38 10,32" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
      </div>
    </section>
  );
}

window.Hero = Hero;
