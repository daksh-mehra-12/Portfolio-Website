import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let intensityIntervalId: ReturnType<typeof setInterval> | null = null;

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (intensityIntervalId) {
    clearInterval(intensityIntervalId);
    intensityIntervalId = null;
  }

  const isDesktopLandscape =
    window.innerWidth > 1024 && window.innerHeight <= 1100;

  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0;
          if (child.material.name === "Material.027") {
            monitor = child;
            child.material.color.set("#FFFFFF");
          } else {
            child.visible = false;
          }
        }
      });
    }
    if (object.name === "screenlight" && object.material) {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#94a3b8");
      object.material.emissiveIntensity = 0.45;
      screenLight = object;
    }
  });
  let neckBone = character?.getObjectByName("spine005");

  if (isDesktopLandscape) {
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "center 55%",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.48, duration: 1 }, 0)
        .to(camera.position, { z: 38.5, y: 11.15 }, 0)
        .fromTo(".character-model", { x: "0%" }, { x: "-54%", duration: 1 }, 0)
        .fromTo(
          [".landing-intro", ".landing-info"],
          { opacity: 1, y: "0%" },
          { opacity: 0, y: "18%", duration: 0.6, immediateRender: false },
          0
        )
        .fromTo(
          ".about-me",
          { y: "10%" },
          { y: "0%", immediateRender: false },
          0
        );

      tl2
        .to(
          camera.position,
          { z: 68, y: 9.2, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .fromTo(
          ".about-section",
          { y: "0%" },
          { y: "16%", duration: 6, immediateRender: false },
          0
        )
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-46%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .fromTo(
          ".what-box-in",
          { opacity: 0.2 },
          { opacity: 1, duration: 1.5, delay: 3.5 },
          0
        );

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }
      if (monitor?.material && monitor?.position) {
        tl2.to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
        tl2.fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        );
      }
      if (screenLight?.material) {
        tl2.to(
          screenLight.material,
          { opacity: 0.65, duration: 0.8, delay: 4.5 },
          0
        );
      }

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-115%", duration: 4, ease: "none", delay: 0.6 },
          0
        )
        .fromTo(
          ".whatIDO",
          { y: 0, opacity: 1 },
          { y: "-14%", opacity: 0, duration: 2.4, delay: 1.2 },
          0
        )
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    gsap.set(
      [
        ".landing-container",
        ".landing-intro",
        ".landing-info",
        ".about-section",
        ".character-model",
        ".whatIDO",
      ],
      {
        clearProps: "opacity,transform",
      }
    );
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 85%",
      end: "bottom center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0.85, y: 16 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );
}
