// Contact footer
function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "bxia@mavenbio.io";
  const copy = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="contact" id="contact" data-screen-label="08 Contact">
      <div className="contact-card">
        <div className="contact-eyebrow mono">07 · Contact</div>
        <h2 className="contact-title">
          Let's <em>meet up</em>
        </h2>
        <p className="contact-lede">
          Open to coffee chats, climbing, and more.
        </p>

        <button className="contact-email" onClick={copy}>
          <span className="ce-label">Email</span>
          <span className="ce-val">{email}</span>
          <span className={"ce-copy " + (copied ? "on" : "")}>
            {copied ? "Copied ✓" : "Click to copy"}
          </span>
        </button>

        <div className="contact-socials">
          <a href="https://www.linkedin.com/in/william-xia-ab40b2218/" target="_blank" rel="noreferrer" className="cs-link">
            <span className="cs-label">LinkedIn</span>
            <span className="cs-arrow" aria-hidden>↗</span>
          </a>
          <a href="https://github.com/bill-from-ri" target="_blank" rel="noreferrer" className="cs-link">
            <span className="cs-label">GitHub</span>
            <span className="cs-arrow" aria-hidden>↗</span>
          </a>
          <a href="https://scholar.google.com/citations?hl=en&user=KoY_mHQAAAAJ" target="_blank" rel="noreferrer" className="cs-link">
            <span className="cs-label">Google Scholar</span>
            <span className="cs-arrow" aria-hidden>↗</span>
          </a>
        </div>

        <footer className="site-foot">
          <div>© William Xia · {new Date().getFullYear()}</div>
          <div className="mono">Last Updated August 2026 · ver 2.0</div>
        </footer>
      </div>
    </section>
  );
}

window.Contact = Contact;
