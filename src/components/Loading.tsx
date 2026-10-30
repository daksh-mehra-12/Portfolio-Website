import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import { initialFX } from "./utils/initialFX";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Check for autostart query param
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("autostart=1")) {
      initialFX();
      setIsLoading(false);
    }
  }, [setIsLoading]);

  // Fast automatic unveil so user never waits on artificial timers
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoaded(true);
      setIsLoaded(true);
    }, 220);

    return () => clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
      setIsLoaded(true);
    }
  }, [percent, loaded]);

  const handleEnterImmediately = () => {
    setLoaded(true);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (isLoaded) {
      setClicked(true);
      const finishTimer = setTimeout(() => {
        initialFX();
        setIsLoading(false);
      }, 140);
      return () => clearTimeout(finishTimer);
    }
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          Daksh Mehra
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>

      <div className="loading-screen">
        <div className="loading-marquee">
          <div className="loading-marquee-inner">
            <span>AI &amp; Data Science Student</span>
            <span>Python Developer</span>
            <span>Machine Learning Enthusiast</span>
            <span>Software Engineer</span>
            <span>AI &amp; Data Science Student</span>
            <span>Python Developer</span>
            <span>Machine Learning Enthusiast</span>
            <span>Software Engineer</span>
          </div>
        </div>

        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
          onClick={handleEnterImmediately}
          role="button"
          tabIndex={0}
          title="Click to enter immediately"
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  <span className="loading-label">Loading</span>
                  <span className="loading-percent">{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let interval = setInterval(() => {
    if (percent <= 60) {
      let rand = Math.round(Math.random() * 8 + 4);
      percent = Math.min(100, percent + rand);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = Math.min(100, percent + 5);
        setLoading(percent);
        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 50);
    }
  }, 60);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent = Math.min(100, percent + 10);
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 20);
    });
  }

  return { loaded, percent, clear };
};
