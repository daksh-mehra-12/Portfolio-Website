import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function splitElementIntoSpans(
  element: HTMLElement,
  mode: "chars" | "words" = "chars"
): HTMLSpanElement[] {
  if (element.dataset.splitDone === "true") {
    return Array.from(element.querySelectorAll(".split-unit"));
  }
  const originalText = element.innerText || element.textContent || "";
  element.dataset.splitDone = "true";
  element.innerHTML = "";

  const spans: HTMLSpanElement[] = [];

  if (mode === "chars") {
    const chars = originalText.split("");
    chars.forEach((c) => {
      if (c === "\n") {
        element.appendChild(document.createElement("br"));
        return;
      }
      const span = document.createElement("span");
      span.className = "split-unit split-char";
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.innerHTML = c === " " ? "&nbsp;" : c;
      element.appendChild(span);
      spans.push(span);
    });
  } else {
    const words = originalText.split(/\s+/).filter(Boolean);
    words.forEach((w, idx) => {
      const span = document.createElement("span");
      span.className = "split-unit split-word";
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.textContent = w;
      element.appendChild(span);
      spans.push(span);
      if (idx < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
  }

  return spans;
}

export default function setSplitText() {
  if (typeof window === "undefined") return;

  const paras = document.querySelectorAll<HTMLElement>(".para");
  const titles = document.querySelectorAll<HTMLElement>(".title");

  paras.forEach((para) => {
    para.classList.add("visible");
    para.style.opacity = "1";
    para.style.visibility = "visible";
    const words = splitElementIntoSpans(para, "words");
    if (words.length > 0) {
      gsap.set(words, { autoAlpha: 1, y: 0 });
    }
  });

  titles.forEach((title) => {
    title.style.opacity = "1";
    title.style.visibility = "visible";
    const chars = splitElementIntoSpans(title, "chars");
    if (chars.length > 0) {
      gsap.set(chars, { autoAlpha: 1, y: 0, rotate: 0 });
    }
  });
}
