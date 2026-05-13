export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-header">
        <span className="section-num">05</span>
        <span className="section-line"></span>
        <span className="section-tag">Contact</span>
      </div>

      <h2 className="contact-headline">
        <span className="line">Let's build</span>
        <span className="line">something <em className="serif">extraordinary</em></span>
        <span className="line">together.</span>
      </h2>

      <a href="mailto:mohittantway1234@gmail.com" className="contact-email magnetic" data-cursor="hover">
        <span className="email-text">mohittantway1234@gmail.com</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </a>

      <div className="contact-grid">
        <a href="https://www.linkedin.com/in/mohit-tantway-61522a252/" target="_blank" rel="noreferrer" className="contact-link" data-cursor="hover">
          <span className="contact-label">LinkedIn</span>
          <span className="contact-value">/in/Mohit-Tantway →</span>
        </a>
        <a href="mailto:mohittantway1234@gmail.com" className="contact-link" data-cursor="hover">
          <span className="contact-label">Email</span>
          <span className="contact-value">mohittantway1234@gmail.com →</span>
        </a>
        <a href="https://github.com/" target="_blank" rel="noreferrer" className="contact-link" data-cursor="hover">
          <span className="contact-label">GitHub</span>
          <span className="contact-value">@mohittantway →</span>
        </a>
      </div>
    </section>
  );
}
