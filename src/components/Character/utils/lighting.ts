import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";

const setLighting = (
  scene: THREE.Scene,
  renderer?: THREE.WebGLRenderer,
  isSoftwareGl: boolean = false
) => {
  // 1. Studio Hemisphere Fill: cool slate sky + #070810 near-black ground
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x070810, 0.88);
  hemiLight.position.set(0, 22, 0);
  scene.add(hemiLight);

  // 2. Primary Soft Studio Key Light: warm-neutral for natural balanced human skin tone
  const directionalLight = new THREE.DirectionalLight(0xfff8f0, 1.22);
  directionalLight.position.set(2.2, 14.2, 10.5);
  directionalLight.castShadow = false;
  scene.add(directionalLight);

  // 3. Front Torso & Jacket Contour Fill: soft lavender (#C4A1FF) + cool studio fill
  // Ensures midnight-navy bomber jacket (#101A2D) and charcoal shirt (#151722) stay clearly visible against #070810
  const torsoFillLight = new THREE.DirectionalLight(0xc4a1ff, 0.58);
  torsoFillLight.position.set(0, 9.2, 12.0);
  scene.add(torsoFillLight);

  // 4. Left Subtle Cool-Cyan Rim Light (#35D6E7): gentle edge separation without harsh glare
  const rimLight = new THREE.DirectionalLight(0x35d6e7, 0.35);
  rimLight.position.set(-6.5, 13.8, -4.2);
  scene.add(rimLight);

  // 5. Right Subtle Violet Rim Light (#A855F7): gentle edge separation on opposite side
  const violetRim = new THREE.DirectionalLight(0xa855f7, 0.32);
  violetRim.position.set(6.5, 13.2, -4.0);
  scene.add(violetRim);

  const pointLight = new THREE.PointLight(0x35d6e7, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = false;
  scene.add(pointLight);

  // Use neutral procedural studio RoomEnvironment on hardware GPUs
  if (renderer && !isSoftwareGl) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.28;
    pmremGenerator.dispose();
  }

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = Math.min(1.2, screenLight.material.emissiveIntensity * 1.5);
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 0.35;
  const ease = "power2.out";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.32,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1.26,
      duration: duration,
      ease: ease,
    });
    gsap.to(torsoFillLight, {
      intensity: 0.58,
      duration: duration,
      ease: ease,
    });
    gsap.to(rimLight, {
      intensity: 0.42,
      duration: duration,
      ease: ease,
    });
    gsap.to(violetRim, {
      intensity: 0.38,
      duration: duration,
      ease: ease,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;

