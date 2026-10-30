import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { FiMail, FiDownload, FiCode } from "react-icons/fi";
import "./styles/SocialIcons.css";
import HoverLinks from "./HoverLinks";
import { PROFILE_INFO, RESUME_FILE, triggerResumeDownload } from "../data/portfolioData";

interface SocialIconsProps {
  onOpenResume?: () => void;
}

const SocialIcons = (_props: SocialIconsProps) => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href={PROFILE_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Daksh Mehra GitHub Profile"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href={PROFILE_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Daksh Mehra LinkedIn Profile"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href={PROFILE_INFO.socials.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Daksh Mehra LeetCode Profile"
          >
            <FiCode />
          </a>
        </span>
        <span>
          <a
            href={`mailto:${PROFILE_INFO.email}`}
            aria-label="Email Daksh Mehra"
          >
            <FiMail />
          </a>
        </span>
      </div>

      <a
        href={RESUME_FILE.url}
        download={RESUME_FILE.filename}
        className="resume-button"
        onClick={(e) => {
          void triggerResumeDownload(e);
        }}
        aria-label="Download Daksh Mehra Resume PDF"
        data-cursor="disable"
      >
        <HoverLinks text="RESUME" />
        <span>
          <FiDownload />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;

