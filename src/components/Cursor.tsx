import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) return;

    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: -100, y: -100 };
    const cursorPos = { x: -100, y: -100 };
    let animId = 0;
    let isRunning = false;

    const loop = () => {
      if (!hover) {
        const dx = mousePos.x - cursorPos.x;
        const dy = mousePos.y - cursorPos.y;
        cursorPos.x += dx / 5;
        cursorPos.y += dy / 5;
        cursor.style.transform = `translate3d(${cursorPos.x.toFixed(1)}px, ${cursorPos.y.toFixed(1)}px, 0)`;

        if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
          animId = requestAnimationFrame(loop);
          return;
        }
      }
      isRunning = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (!isRunning && !hover) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });

    const cursorElements = document.querySelectorAll("[data-cursor]");
    const handleMouseOver = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      if (target.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        cursor.style.transform = `translate3d(${rect.left.toFixed(1)}px, ${rect.top.toFixed(1)}px, 0)`;
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (target.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    cursorElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      cursorElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} aria-hidden="true"></div>;
};

export default Cursor;

