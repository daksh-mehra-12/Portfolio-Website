import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiCpu, FiServer, FiTerminal } from "react-icons/fi";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          container.addEventListener("click", () => handleClick(container));
        }
      });
    }
    return () => {
      containerRef.current.forEach((container) => {
        if (container) {
          container.removeEventListener("click", () => handleClick(container));
        }
      });
    };
  }, []);

  return (
    <div className="whatIDO" id="what-i-do">
      <div className="what-box what-title-box">
        <h2 className="what-main-title">
          <span className="what-title-line">
            W<span className="hat-h2">HAT</span>{" "}
          </span>
          <span className="what-title-line">
            I <span className="do-h2">DO</span>
          </span>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          {/* Box 1: AI & Machine Learning */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
            data-cursor="disable"
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <div className="what-icon-header">
                <FiCpu className="what-icon" />
                <h3>ARTIFICIAL INTELLIGENCE &amp; ML</h3>
              </div>
              <h4>Predictive Modeling &amp; Healthcare AI</h4>
              <p>
                Designing machine learning pipelines for predictive decision support, such as antimicrobial resistance risk assessment, clinical analytics, and resume intelligence algorithms.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Scikit-learn</div>
                <div className="what-tags">Pandas</div>
                <div className="what-tags">NumPy</div>
                <div className="what-tags">Machine Learning</div>
                <div className="what-tags">Data Analytics</div>
                <div className="what-tags">OpenCV</div>
                <div className="what-tags">Speech Recognition</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          {/* Box 2: Backend & Full Stack Engineering */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
            data-cursor="disable"
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <div className="what-icon-header">
                <FiServer className="what-icon" />
                <h3>BACKEND &amp; FULL STACK</h3>
              </div>
              <h4>High-Performance Microservices &amp; UIs</h4>
              <p>
                Building reliable backend services with FastAPI and Flask, architecting relational databases with SQLAlchemy, enforcing JWT security, and delivering responsive React frontends.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Python</div>
                <div className="what-tags">FastAPI</div>
                <div className="what-tags">Flask</div>
                <div className="what-tags">SQLAlchemy</div>
                <div className="what-tags">React</div>
                <div className="what-tags">TypeScript</div>
                <div className="what-tags">Tailwind CSS</div>
                <div className="what-tags">REST APIs</div>
                <div className="what-tags">SQL</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          {/* Box 3: Automation & Systems */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 2)}
            data-cursor="disable"
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <div className="what-icon-header">
                <FiTerminal className="what-icon" />
                <h3>SYSTEMS &amp; AUTOMATION</h3>
              </div>
              <h4>Desktop Automation &amp; Web Intelligence</h4>
              <p>
                Developing automated workflows, desktop voice assistants, multi-source scrapers using JobSpy and BeautifulSoup, and multithreaded system integrations.
              </p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Python</div>
                <div className="what-tags">pyttsx3</div>
                <div className="what-tags">JobSpy</div>
                <div className="what-tags">BeautifulSoup</div>
                <div className="what-tags">pypdf</div>
                <div className="what-tags">Threading</div>
                <div className="what-tags">Git &amp; GitHub</div>
                <div className="what-tags">Postman</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);
    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
