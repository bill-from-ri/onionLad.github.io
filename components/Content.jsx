// Content — Substack featured cards
function Content() {
  // Fallback used until posts.json loads (or if the fetch fails). A GitHub
  // Action refreshes posts.json from the Substack RSS feed every few hours.
  const fallback = [
    {
      title: "Public Health Policy",
      date: "May 16, 2026",
      embed: "https://billxia.substack.com/p/public-health-policy",
    },
    {
      title: "Intro to Epidemiology",
      date: "May 12, 2026",
      embed: "https://billxia.substack.com/p/intro-to-epidemiology",
    },
    {
      title: "Epigenetics",
      date: "May 7, 2026",
      embed: "https://billxia.substack.com/p/epigenetics",
    },
  ];
  const [substack, setSubstack] = React.useState(fallback);

  React.useEffect(() => {
    let cancelled = false;
    fetch("posts.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setSubstack(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Build the Substack iframe URL ourselves instead of using their embed.js,
  // which has a stateful-regex bug that breaks every embed after the first.
  const substackIframe = (embedUrl) => {
    const u = new URL(embedUrl);
    const slug = u.pathname.replace(/^\/p\//, "");
    const frame = new URL(`${u.origin}/embed/p/${slug}`);
    frame.searchParams.set("origin", window.location.origin);
    frame.searchParams.set("fullURL", window.location.href);
    return { src: frame.toString(), origin: u.origin };
  };

  // Substack's child frame posts its content height; mirror it onto the iframe
  // so the embed grows to fit the post and doesn't show a scrollbar.
  React.useEffect(() => {
    const onMessage = (event) => {
      if (!event.data || !event.data.iframeHeight) return;
      document.querySelectorAll("iframe.substack-iframe").forEach((iframe) => {
        if (event.source === iframe.contentWindow) {
          iframe.height = event.data.iframeHeight;
        }
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // const youtube = [
  //   { title: "Building an isometric VTT", date: "Coming soon", dur: "15:00", kind: "Dev Diary" },
  //   { title: "MapSlice: Game Engine Dev Diary", date: "Coming soon", dur: "15:00", kind: "Dev Diary" },
  //   { title: "Welcome to my channel!", date: "Coming soon", dur: "3:00", kind: "Welcome" },
  // ];

  return (
    <section className="content" id="content" data-screen-label="07 Content">
      <div className="section-head">
        <span className="section-num">06</span>
        <span className="section-kicker">Substack</span>
      </div>
      <h2 className="section-title">
        Recent <em>articles</em>
      </h2>
      <p className="section-lede">
        I publish on Substack to learn new things
        {/* YouTube is where I share dev diaries and other project updates. */}
      </p>

      <div className="cc-block">
        <div className="cc-row">
          {substack.map((p, i) => (
            p.embed ? (
              <div key={i} className="cc-card cc-card-embed">
                <iframe
                  className="substack-iframe"
                  src={substackIframe(p.embed).src}
                  title={p.title}
                  height="500"
                  sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups"
                  allow="clipboard-read clipboard-write allow-top-navigation allow-scripts allow-same-origin allow-popups"
                />
              </div>
            ) : (
              <article key={i} className="cc-card cc-card-post">
                <div className="cc-card-art">
                  <svg viewBox="0 0 400 240" preserveAspectRatio="none">
                    <defs>
                      <pattern id={"sp-"+i} patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="240" fill="currentColor" opacity="0.08"/>
                    <rect width="400" height="240" fill={"url(#sp-"+i+")"}/>
                  </svg>
                  <div className="cc-card-placeholder mono">post preview</div>
                </div>
                <div className="cc-card-body">
                  <h3 className="cc-card-title">{p.title}</h3>
                  <div className="cc-card-date mono">{p.date}</div>
                </div>
              </article>
            )
          ))}
        </div>
      </div>

      {/*
      <div className="cc-block">
        <div className="cc-head">
          <div className="cc-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden><rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor"/><polygon points="10,9 16,12 10,15" fill="#F5F1EA"/></svg>
            <span className="cc-name">YouTube</span>
            <span className="cc-handle mono">@bill-from-ri</span>
          </div>
          <a className="ghost-link" href="https://www.youtube.com/@bill-from-ri" target="_blank" rel="noreferrer">Subscribe <span aria-hidden>→</span></a>
        </div>
        <div className="cc-row">
          {youtube.map((v, i) => (
            <article key={i} className="cc-card cc-card-video">
              <div className="cc-card-art">
                <svg viewBox="0 0 400 225" preserveAspectRatio="none">
                  <defs>
                    <pattern id={"yp-"+i} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(-45)">
                      <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.28"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="225" fill="currentColor" opacity="0.08"/>
                  <rect width="400" height="225" fill={"url(#yp-"+i+")"}/>
                </svg>
                <div className="cc-play" aria-hidden>
                  <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.2"/><polygon points="19,15 35,24 19,33" fill="currentColor"/></svg>
                </div>
                <div className="cc-dur mono">{v.dur}</div>
              </div>
              <div className="cc-card-body">
                <div className="cc-card-meta mono">{v.kind.toUpperCase()}</div>
                <h3 className="cc-card-title">{v.title}</h3>
                <div className="cc-card-date mono">{v.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      */}
    </section>
  );
}

window.Content = Content;
