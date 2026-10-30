import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import {
  computeSceneBloomParams,
  getResponsiveAvatarCameraConfig,
} from "../../../data/portfolioData";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D,
  composer?: EffectComposer,
  bloomPass?: UnrealBloomPass,
  isSoftwareGl: boolean = false
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width || window.innerWidth;
  const height = canvas3d.height || window.innerHeight;
  const camConfig = getResponsiveAvatarCameraConfig(window.innerWidth);
  renderer.setSize(width, height);
  if (composer) {
    composer.setSize(width, height);
  }
  if (bloomPass) {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bloomParams = computeSceneBloomParams(
      window.innerWidth,
      isSoftwareGl,
      prefersReducedMotion
    );
    bloomPass.strength = bloomParams.strength;
    bloomPass.radius = bloomParams.radius;
    bloomPass.threshold = bloomParams.threshold;
    bloomPass.setSize(
      Math.max(128, Math.round(width * bloomParams.resolutionScale)),
      Math.max(128, Math.round(height * bloomParams.resolutionScale))
    );
  }
  camera.fov = camConfig.fov;
  camera.position.set(0, camConfig.positionY, camConfig.positionZ);
  camera.zoom = camConfig.zoom;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
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
  setCharTimeline(character, camera);
  setAllTimeline();
}
