import * as THREE from "three";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 2000);
};

let smoothedHeadRotX = -0.58;
let smoothedHeadRotY = 0;

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number,
  scrollY: number = typeof window !== "undefined" ? window.scrollY : 0,
  viewportWidth: number = typeof window !== "undefined" ? window.innerWidth : 1440,
  delta: number = 0.016
) => {
  if (!headBone) return;
  const dtFactor = Math.min(1, delta * 60);
  if (scrollY < 200) {
    const maxRotation = Math.PI / 7;
    const alphaY = Math.min(1, interpolationY * dtFactor);
    const alphaX = Math.min(1, interpolationX * dtFactor);
    smoothedHeadRotY = lerp(
      smoothedHeadRotY,
      mouseX * maxRotation,
      alphaY
    );
    const minRotationX = -0.28;
    const maxRotationX = 0.35;
    // Counteract spine005 (+0.49 rad) forward neck tilt so head faces directly forward
    const baseUprightPitch = -0.58;
    const clampedMouseY = Math.max(minRotationX, Math.min(maxRotationX, mouseY));
    const targetPitch = baseUprightPitch - clampedMouseY * 0.38;
    smoothedHeadRotX = lerp(smoothedHeadRotX, targetPitch, alphaX);

    headBone.rotation.x = smoothedHeadRotX;
    headBone.rotation.y = smoothedHeadRotY;
  } else {
    if (viewportWidth > 1024) {
      const scrollAlpha = Math.min(1, 0.06 * dtFactor);
      smoothedHeadRotX = lerp(smoothedHeadRotX, -0.38, scrollAlpha);
      smoothedHeadRotY = lerp(smoothedHeadRotY, -0.26, scrollAlpha);
      headBone.rotation.x = smoothedHeadRotX;
      headBone.rotation.y = smoothedHeadRotY;
    }
  }
};


