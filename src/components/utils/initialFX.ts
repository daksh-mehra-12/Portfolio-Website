import gsap from "gsap";

let initialFXRun = false;

export function initialFX() {
  if (typeof document === "undefined") return;

  const landingEl = document.querySelector(".landing-section");
  if (!landingEl) {
    requestAnimationFrame(() => initialFX());
    return;
  }

  document.body.style.overflowY = "auto";
  const mainEl = document.getElementsByTagName("main")[0];
  if (mainEl) {
    mainEl.classList.add("main-active");
  }

  if (initialFXRun) return;
  initialFXRun = true;

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 0.2,
  });

  // Reveal Header and Controls
  const headerTargets = document.querySelectorAll(".header, .icons-section, .nav-fade");
  if (headerTargets.length > 0) {
    gsap.fromTo(
      headerTargets,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.15,
        stagger: 0.08,
      }
    );
  }

  // Animate Landing intro & specialization headings while preserving HTML markup
  const introElements = document.querySelectorAll<HTMLElement>(
    ".landing-intro h2, .landing-intro h1, .landing-info h3, .landing-info-h2, .landing-info-role"
  );
  if (introElements.length > 0) {
    gsap.fromTo(
      introElements,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.1,
      }
    );
  }

  // Animate landing bio card
  const bioCard = document.querySelector(".landing-bio-card");
  if (bioCard) {
    gsap.fromTo(
      bioCard,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        duration: 0.85,
        ease: "power2.out",
        y: 0,
        delay: 0.25,
      }
    );
  }

  // Setup loop for rotating specialization badges without destroying inner text DOM
  const text1 = document.querySelector<HTMLElement>(".landing-h2-info");
  const text2 = document.querySelector<HTMLElement>(".landing-h2-info-1");
  if (text1 && text2) {
    animateElementPairLoop(text1, text2);
  }

  const badge1 = document.querySelector<HTMLElement>(".landing-h2-1");
  const badge2 = document.querySelector<HTMLElement>(".landing-h2-2");
  if (badge1 && badge2) {
    animateElementPairLoop(badge1, badge2);
  }
}

function animateElementPairLoop(el1: HTMLElement, el2: HTMLElement) {
  gsap.killTweensOf([el1, el2]);
  gsap.set(el1, { opacity: 1, y: 0 });
  gsap.set(el2, { opacity: 0, y: 14 });

  const tl = gsap.timeline({ repeat: -1 });
  tl.to(
    el1,
    { y: -14, opacity: 0, duration: 0.45, ease: "power2.inOut" },
    "+=4.2"
  )
    .to(
      el2,
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      "<0.15"
    )
    .to(
      el2,
      { y: -14, opacity: 0, duration: 0.45, ease: "power2.inOut" },
      "+=4.2"
    )
    .to(
      el1,
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      "<0.15"
    );
}
