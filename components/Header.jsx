// Header — name left, socials right, shrinks on scroll
function Header() {
  const [shrunk, setShrunk] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem("theme");
      return t === "light" || t === "dark" ? t : "auto";
    } catch (e) {
      return "auto";
    }
  });

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cycleTheme = () => {
    const next = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
    const root = document.documentElement;
    if (next === "auto") {
      root.removeAttribute("data-theme");
      try { localStorage.removeItem("theme"); } catch (e) {}
    } else {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    }
    setTheme(next);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText("bxia@mavenbio.io");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <header className={"site-header " + (shrunk ? "shrunk" : "")}>
      <a href="#top" className="brand">
        <span className="brand-name">
          William Xia
        </span>
      </a>

      <div className="header-socials">
        <a href="https://www.linkedin.com/in/william-xia-ab40b2218/" target="_blank" rel="noreferrer" className="hs-btn" aria-label="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3V9zm7 0h3.8v1.7h.06c.53-.95 1.82-1.95 3.74-1.95 4 0 4.74 2.5 4.74 5.74V21h-4v-5.45c0-1.3-.03-2.97-1.9-2.97-1.9 0-2.2 1.4-2.2 2.87V21H10V9z"/>
          </svg>
        </a>
        <a href="https://github.com/bill-from-ri" target="_blank" rel="noreferrer" className="hs-btn" aria-label="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 1.5A10.5 10.5 0 0 0 1.5 12c0 4.64 3.01 8.58 7.19 9.97.53.1.72-.23.72-.5v-1.76c-2.93.64-3.55-1.41-3.55-1.41-.48-1.22-1.17-1.54-1.17-1.54-.96-.66.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.69.37-1.15.67-1.42-2.34-.27-4.8-1.17-4.8-5.22 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.8 0 0 .89-.29 2.9 1.08a10 10 0 0 1 5.28 0c2.01-1.37 2.89-1.08 2.89-1.08.58 1.46.22 2.53.11 2.8.68.74 1.09 1.68 1.09 2.83 0 4.06-2.47 4.94-4.82 5.2.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 22.5 12 10.5 10.5 0 0 0 12 1.5z"/>
          </svg>
        </a>
        <a href="https://scholar.google.com/citations?hl=en&user=KoY_mHQAAAAJ" target="_blank" rel="noreferrer" className="hs-btn" aria-label="Google Scholar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2 1 9l4 2.6V17a1 1 0 0 0 .4.8l6 4.2a1 1 0 0 0 1.2 0l6-4.2A1 1 0 0 0 19 17v-5.4L23 9 12 2zm0 2.2L20.3 9 12 14 3.7 9 12 4.2zM7 12.4l4.4 2.7a1 1 0 0 0 1.2 0L17 12.4V16l-5 3.5L7 16v-3.6z"/>
          </svg>
        </a>
        <button className="hs-btn hs-email" onClick={copyEmail} aria-label="Copy email">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="1.5"/>
            <path d="M3.5 6 12 13l8.5-7"/>
          </svg>
          <span className={"hs-tip " + (copied ? "on" : "")}>{copied ? "copied" : "copy email"}</span>
        </button>
        <button className="hs-btn" onClick={cycleTheme} aria-label={"Theme: " + (theme === "auto" ? "system" : theme)}>
          {theme === "auto" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <rect x="3" y="4" width="18" height="13" rx="1.5"/>
              <path d="M9 21h6M12 17v4"/>
            </svg>
          )}
          {theme === "light" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>
            </svg>
          )}
          {theme === "dark" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

window.Header = Header;
