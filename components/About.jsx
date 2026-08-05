// About — bio + Live Telemetry card
function About() {
  const telemetry = [
    { label: "Reading", value: "Genghis Khan", sub: "Frank McLynn" },
    { label: "Bouldering", value: "V4-V5", sub: "CRG North Station" },
    { label: "Listening", value: "Whatever the algorithm gives me", sub: "Anyone" },
    { label: "Gaming", value: "Expedition 33", sub: "Sandfall Interactive" },
  ];

  return (
    <section className="about" id="about" data-screen-label="02 About">
      <div className="section-head">
        <span className="section-num">01</span>
        <span className="section-kicker">About</span>
      </div>

      <div className="about-grid">
        <div className="about-prose">
          <h2 className="section-title">
            I build <em>AI agents</em> to accelerate <em>life sciences</em>
          </h2>
          <div className="about-body">
            <p>
              Hi, I'm Bill! I'm a Founding Applied AI Engineer at
              {" "}<a href="https://mavenbio.com/" target="_blank" rel="noreferrer">Maven Bio</a>,
              where I'm building AI agents for biopharma intelligence workflows. I
              graduated from Tufts in May 2025 with a BS in Computer Science
              and minors in English and Mathematics.
            </p>
            <p>
              My work is centered around natural language processing — AI agents,
              information retrieval, source grounding, and structured data extraction. 
            </p>
            <p>
              When I'm not working on agents, I'm usually climbing,
              reading, or playing strategy games. When I find time,
              I also like to write and draw.
            </p>
          </div>
        </div>

        <div className="about-aside">
          <aside className="telemetry-card" aria-label="Live telemetry">
            <div className="telemetry-head">
              <div className="telemetry-title">Recent Updates</div>
            </div>
            <dl className="telemetry-list">
              {telemetry.map((t, i) => (
                <div className="telemetry-row" key={i}>
                  <dt>{t.label}</dt>
                  <dd>
                    <span className="tv-main">{t.value}</span>
                    <span className="tv-sub">{t.sub}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
          <div className="doc-cta">
            <a
              className="doc-btn"
              href="docs/CVs/Resume%2025_8_7.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <span className="doc-btn-label">Resume</span>
              <span className="doc-btn-arrow" aria-hidden="true">↗</span>
            </a>
            <a
              className="doc-btn"
              href="docs/CVs/William%20Xia%20CV%20-%20August%208%2C%202025.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <span className="doc-btn-label">CV</span>
              <span className="doc-btn-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.About = About;
