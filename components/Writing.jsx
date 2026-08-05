// Writing — "Products I've shaped" style hero cards
function Writing() {
  const works = [    
    {
      id: "zhusan",
      kind: "Serialized Fiction",
      year: "coming soon",
      title: "The Zhusan Cycle",
      genre: "Fantasy",
      blurb: "As the realm fractures, four heroes must either restore the Empire's glory or tear it down themselves.",
      domain: "substack.com",
      link: "https://zhusancycle.substack.com/",
      tintFrom: "#2A1F1A",
      tintTo: "#5A3A2A",
      hasCover: false,
    },
    {
      id: "amf",
      kind: "Novel",
      year: "2025",
      title: "A Merchant's Feud",
      genre: "Fantasy",
      blurb: "The heir to a powerful merchant's house must navigate the cutthroat politics of a Regency-era fantasy city.",
      domain: "amazon.com",
      link: "https://www.amazon.com/dp/B0FDH6NRFG",
      image: "assets/amf-cover.png",
      imagePosition: "center bottom",
      tintFrom: "#2D3A30",
      tintTo: "#6B4A2B",
      hasCover: true,
    },
    {
      id: "kronos",
      kind: "Short Story",
      year: "2024",
      title: "Children of Kronos",
      genre: "Science Fiction",
      blurb: "A scientist on an alien planet must grapple with her morals while serving an authoritarian regime.",
      domain: "pdf",
      link: "docs/Oil World 7.pdf",
      image: "assets/kronos-cover.png",
      imagePosition: "center top",
      tintFrom: "#1F2A3A",
      tintTo: "#3A5A7A",
      hasCover: true,
    },
    {
      id: "shrimps",
      kind: "Short Story",
      year: "2024",
      title: "Shrimps",
      genre: "Fiction",
      blurb: "A college dropout's life is turned upside down when his roommate starts ordering hibachi to their apartment.",
      domain: "pdf",
      link: "docs/Hibachi 3.pdf",
      image: "assets/shrimps-cover.png",
      imagePosition: "center top",
      tintFrom: "#3A1F2A",
      tintTo: "#7A4A3A",
      hasCover: true,
    },
  ];

  return (
    <section className="writing" id="writing" data-screen-label="06 Writing">
      <div className="section-head">
        <span className="section-num">05</span>
        <span className="section-kicker">Writing</span>
      </div>
      <h2 className="section-title">
        Stories I've <em>written</em>
      </h2>
      <p className="section-lede">
        For the AI-free side of my brain.
      </p>

      <div className="writing-grid">
        {works.map((w) => (
          <article key={w.id} className="wcard" style={{ "--t1": w.tintFrom, "--t2": w.tintTo }}>
            <a className="wcard-link" href={w.link} target="_blank" rel="noreferrer">
              <div className="wcard-media">
                {w.hasCover ? (
                  <img src={w.image} alt={w.title} style={{ objectPosition: w.imagePosition }} />
                ) : (
                  <div className="wcard-placeholder">
                    <svg className="stripes" viewBox="0 0 400 500" preserveAspectRatio="none">
                      <defs>
                        <pattern id={"wp-"+w.id} patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                          <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(245,241,234,0.25)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="400" height="500" fill={"url(#wp-"+w.id+")"}/>
                    </svg>
                    <div className="wcard-placeholder-label mono">cover art TBD</div>
                  </div>
                )}
                <div className="wcard-overlay" />
              </div>
              <div className="wcard-body">
                <div className="wcard-meta mono">
                  {w.kind.toUpperCase()} · {w.year}
                </div>
                <h3 className="wcard-title">{w.title}</h3>
                <p className="wcard-blurb">{w.blurb}</p>
                <div className="wcard-foot">
                  <span className="wcard-cta">VIEW DETAILS <span aria-hidden>→</span></span>
                  <span className="wcard-domain mono">{w.domain} ↗</span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

window.Writing = Writing;
