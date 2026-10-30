import { useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUpRight,
  FiSend,
  FiCopy,
  FiCheck,
  FiDownload,
  FiCode,
  FiBriefcase,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import "./styles/Contact.css";
import {
  PROFILE_INFO,
  RESUME_FILE,
  triggerResumeDownload,
  getRecruiterSocialLinks,
  copyTextToClipboard,
  validateContactForm,
  ContactFormErrors,
} from "../data/portfolioData";

const Contact = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const socialLinks = getRecruiterSocialLinks();

  const handleCopy = async (text: string, type: string) => {
    await copyTextToClipboard(text);
    setCopiedType(type);
    window.setTimeout(() => {
      setCopiedType((prev) => (prev === type ? null : prev));
    }, 2500);
  };

  const runValidation = (nextEmail: string, nextMessage: string) => {
    const result = validateContactForm({
      name,
      email: nextEmail,
      subject,
      message: nextMessage,
    });
    setFormErrors(result.errors);
    return result;
  };

  const handleEmailChange = (value: string) => {
    setSenderEmail(value);
    if (submittedSuccess) setSubmittedSuccess(false);
    if (touched.email) {
      runValidation(value, message);
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (submittedSuccess) setSubmittedSuccess(false);
    if (touched.message) {
      runValidation(senderEmail, value);
    }
  };

  const handleBlur = (field: "email" | "message") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runValidation(senderEmail, message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, message: true });
    const validation = runValidation(senderEmail, message);

    if (!validation.isValid) {
      setSubmittedSuccess(false);
      return;
    }

    setSubmittedSuccess(true);

    const mailtoSubject = encodeURIComponent(
      subject.trim() || `Portfolio Inquiry from ${name.trim() || senderEmail.trim()}`
    );
    const mailtoBody = encodeURIComponent(
      `Hello Daksh,\n\n${message.trim()}\n\nFrom: ${name.trim() || "Visitor"}\nEmail: ${senderEmail.trim()}`
    );
    window.location.href = `mailto:${PROFILE_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <section
      className="contact-section section-container"
      id="contact"
      data-testid="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="contact-container">
        <div className="contact-header">
          <span className="contact-kicker">
            <FiBriefcase /> Open to Internships &amp; Software / AI Engineering Roles
          </span>
          <h2 id="contact-heading">
            Contact <span>Me</span>
          </h2>
          <p className="contact-subtitle">
            Looking to hire or collaborate on AI, Machine Learning, or Full-Stack Python projects? Send a message below or connect directly via email, LinkedIn, and GitHub.
          </p>
        </div>

        {/* Prominent Recruiter Quick-Action Bar: Copy Email + LinkedIn + GitHub */}
        <div className="recruiter-quick-bar" data-testid="recruiter-contact-bar">
          <div className="recruiter-email-spotlight">
            <div className="recruiter-email-meta">
              <span className="recruiter-email-badge">Direct Recruiter Line</span>
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="recruiter-email-address"
                data-cursor="disable"
              >
                <FiMail className="recruiter-mail-icon" />
                <span>{PROFILE_INFO.email}</span>
              </a>
            </div>

            <div className="recruiter-email-actions">
              <button
                type="button"
                className={`copy-email-cta-btn ${
                  copiedType === "email-hero" ? "copied" : ""
                }`}
                onClick={() => handleCopy(PROFILE_INFO.email, "email-hero")}
                data-cursor="disable"
                data-testid="copy-email-btn"
                aria-label="Copy Email Address"
              >
                {copiedType === "email-hero" ? (
                  <>
                    <FiCheck className="copy-cta-icon" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="copy-cta-icon" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${PROFILE_INFO.email}?subject=${encodeURIComponent(
                  "Opportunity Inquiry — Daksh Mehra"
                )}`}
                className="send-email-direct-btn"
                data-cursor="disable"
              >
                <FiSend />
                <span>Email Now</span>
              </a>
            </div>
          </div>

          {/* Prominent Social Media Cards (LinkedIn, GitHub, LeetCode) */}
          <div className="recruiter-socials-grid">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`recruiter-social-card social-card-${social.id}`}
                data-cursor="disable"
                data-testid={`contact-social-${social.id}`}
                aria-label={`${PROFILE_INFO.name} ${social.label} Profile`}
              >
                <div className="recruiter-social-icon">
                  {social.id === "linkedin" && <FaLinkedinIn />}
                  {social.id === "github" && <FaGithub />}
                  {social.id === "leetcode" && <FiCode />}
                </div>
                <div className="recruiter-social-info">
                  <div className="recruiter-social-top">
                    <strong>{social.label}</strong>
                    <span className="recruiter-social-tag">{social.badge}</span>
                  </div>
                  <span className="recruiter-social-handle">{social.handle}</span>
                </div>
                <FiArrowUpRight className="recruiter-social-arrow" />
              </a>
            ))}
          </div>
        </div>

        <div className="contact-main-grid">
          {/* Contact Details & Resume */}
          <div className="contact-info-panel">
            <h3>Direct Contact Channels</h3>

            <div className="contact-channel-card" data-cursor="disable">
              <div className="channel-icon">
                <FiMail />
              </div>
              <div className="channel-details">
                <span className="channel-label">Official Email</span>
                <a href={`mailto:${PROFILE_INFO.email}`} className="channel-value">
                  {PROFILE_INFO.email}
                </a>
              </div>
              <button
                type="button"
                className={`copy-btn ${copiedType === "email" ? "copied" : ""}`}
                onClick={() => handleCopy(PROFILE_INFO.email, "email")}
                aria-label="Copy email address"
                title="Copy email to clipboard"
              >
                {copiedType === "email" ? <FiCheck /> : <FiCopy />}
                <span className="copy-btn-text">
                  {copiedType === "email" ? "Copied" : "Copy Email"}
                </span>
              </button>
            </div>

            <div className="contact-channel-card" data-cursor="disable">
              <div className="channel-icon">
                <FiPhone />
              </div>
              <div className="channel-details">
                <span className="channel-label">Phone / WhatsApp</span>
                <a href={`tel:${PROFILE_INFO.phone}`} className="channel-value">
                  {PROFILE_INFO.phone}
                </a>
              </div>
              <button
                type="button"
                className={`copy-btn ${copiedType === "phone" ? "copied" : ""}`}
                onClick={() => handleCopy(PROFILE_INFO.phone, "phone")}
                aria-label="Copy phone number"
                title="Copy phone to clipboard"
              >
                {copiedType === "phone" ? <FiCheck /> : <FiCopy />}
                <span className="copy-btn-text">
                  {copiedType === "phone" ? "Copied" : "Copy"}
                </span>
              </button>
            </div>

            <div className="contact-channel-card" data-cursor="disable">
              <div className="channel-icon">
                <FiMapPin />
              </div>
              <div className="channel-details">
                <span className="channel-label">Location &amp; Institution</span>
                <span className="channel-value">
                  {PROFILE_INFO.location} &bull; JECRC Foundation
                </span>
              </div>
            </div>

            <h3 style={{ marginTop: "28px" }}>Official Resume &amp; Profiles</h3>
            <div className="contact-social-row">
              <a
                href={RESUME_FILE.url}
                download={RESUME_FILE.filename}
                onClick={(e) => {
                  void triggerResumeDownload(e);
                }}
                className="contact-social-btn contact-resume-highlight"
                data-cursor="disable"
                aria-label="Download Daksh Mehra Official Resume PDF"
              >
                <FiDownload />
                <span>Download Official Resume (PDF)</span>
                <FiArrowUpRight />
              </a>
              <a
                href={PROFILE_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                data-cursor="disable"
              >
                <FaLinkedinIn />
                <span>LinkedIn — /in/daksh-mehra</span>
                <FiArrowUpRight />
              </a>
              <a
                href={PROFILE_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                data-cursor="disable"
              >
                <FaGithub />
                <span>GitHub — @daksh-mehra-12</span>
                <FiArrowUpRight />
              </a>
              <a
                href={PROFILE_INFO.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                data-cursor="disable"
              >
                <FiCode />
                <span>LeetCode — /u/CkddHtBNWB</span>
                <FiArrowUpRight />
              </a>
            </div>
          </div>

          {/* Interactive Contact Me Form with Email & Message Validation */}
          <div className="contact-form-panel">
            <h3>Send a Message</h3>
            <form
              onSubmit={handleSubmit}
              className="contact-form"
              noValidate
              data-testid="contact-me-form"
            >
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Recruiter or Engineering Lead"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">
                    Your Email <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={senderEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    aria-invalid={Boolean(touched.email && formErrors.email)}
                    aria-describedby={
                      touched.email && formErrors.email
                        ? "contact-email-error"
                        : undefined
                    }
                    className={
                      touched.email
                        ? formErrors.email
                          ? "input-error"
                          : senderEmail.trim()
                          ? "input-valid"
                          : ""
                        : ""
                    }
                  />
                  {touched.email && formErrors.email && (
                    <span
                      id="contact-email-error"
                      className="form-error-msg"
                      role="alert"
                      data-testid="contact-email-error"
                    >
                      <FiAlertCircle />
                      <span>{formErrors.email}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Internship Opportunity / Project Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="contact-message">
                    Message <span className="required-star">*</span>
                  </label>
                  <span
                    className={`form-char-hint ${
                      message.trim().length >= 10 ? "char-valid" : ""
                    }`}
                  >
                    {message.trim().length} / 10+ chars
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Hi Daksh, we would love to connect with you regarding..."
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  onBlur={() => handleBlur("message")}
                  aria-invalid={Boolean(touched.message && formErrors.message)}
                  aria-describedby={
                    touched.message && formErrors.message
                      ? "contact-message-error"
                      : undefined
                  }
                  className={
                    touched.message
                      ? formErrors.message
                        ? "input-error"
                        : message.trim()
                        ? "input-valid"
                        : ""
                      : ""
                  }
                />
                {touched.message && formErrors.message && (
                  <span
                    id="contact-message-error"
                    className="form-error-msg"
                    role="alert"
                    data-testid="contact-message-error"
                  >
                    <FiAlertCircle />
                    <span>{formErrors.message}</span>
                  </span>
                )}
              </div>

              {submittedSuccess && (
                <div
                  className="form-success-banner"
                  role="status"
                  data-testid="contact-form-success"
                >
                  <FiCheckCircle className="form-success-icon" />
                  <span>
                    Validation passed! Your message is ready and your email client has been launched.
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="contact-submit-btn"
                data-cursor="disable"
                data-testid="contact-submit-btn"
              >
                <span>Send Message</span>
                <FiSend />
              </button>
              <p className="form-note">
                Validates your email and message before launching your default email client.
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="portfolio-footer" data-testid="portfolio-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Daksh Mehra</h3>
              <p>AI &amp; Data Science Student | JECRC Foundation, Jaipur</p>
            </div>

            <div className="footer-links" aria-label="Footer navigation">
              <a href="#about" data-cursor="disable">About</a>
              <a href="#work" data-cursor="disable">Projects</a>
              <a href="#tech" data-cursor="disable">Skills</a>
              <a href="#career" data-cursor="disable">Experience</a>
              <a href="#contact" data-cursor="disable">Contact</a>
              <a
                href={RESUME_FILE.url}
                download={RESUME_FILE.filename}
                onClick={(e) => {
                  void triggerResumeDownload(e);
                }}
                data-cursor="disable"
              >
                Download CV
              </a>
            </div>

            <div
              className="footer-social-icons"
              data-testid="footer-social-icons"
              aria-label="Social media profiles"
            >
              <a
                href={PROFILE_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-link"
                aria-label="GitHub Profile"
                title="GitHub — @daksh-mehra-12"
                data-cursor="disable"
              >
                <FaGithub />
              </a>
              <a
                href={PROFILE_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-link"
                aria-label="LinkedIn Profile"
                title="LinkedIn — /in/daksh-mehra"
                data-cursor="disable"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={PROFILE_INFO.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon-link"
                aria-label="LeetCode Profile"
                title="LeetCode — /u/CkddHtBNWB"
                data-cursor="disable"
              >
                <FiCode />
              </a>
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="footer-social-icon-link"
                aria-label="Email Daksh Mehra"
                title={`Email — ${PROFILE_INFO.email}`}
                data-cursor="disable"
              >
                <FiMail />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Daksh Mehra. All verified information is authentic.</span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;

