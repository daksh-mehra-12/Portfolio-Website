import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Projects from "./Projects";
import Education from "./Education";
import ResumeModal from "./ResumeModal";
import GlobalBackground from "./GlobalBackground";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => {
      setSplitText();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="container-main">
      <GlobalBackground />
      <Cursor />
      <Navbar onOpenResume={() => setIsResumeOpen(true)} />
      <SocialIcons onOpenResume={() => setIsResumeOpen(true)} />
      <div id="smooth-wrapper" style={{ position: "relative", zIndex: 2 }}>
        <div id="smooth-content">
          <div className="container-main">
            <Landing onOpenResume={() => setIsResumeOpen(true)}>
              <div className="main-avatar-stage" data-testid="main-avatar-stage">
                {children}
              </div>
            </Landing>
            <About />
            <WhatIDo />
            <Career />
            <Projects />
            <Suspense fallback={<div style={{ textAlign: "center", padding: "60px", color: "#8c8591" }}>Loading skills...</div>}>
              <TechStack />
            </Suspense>
            <Education />
            <Contact />
          </div>
        </div>
      </div>
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default MainContainer;
