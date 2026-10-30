import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { getResponsiveAvatarCameraConfig } from "../../data/portfolioData";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement>(null!);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    let isMounted = true;
    let animFrameId = 0;

    if (canvasDiv.current) {
      // Remove any stale canvas elements before mounting
      const existingCanvases = canvasDiv.current.querySelectorAll("canvas");
      existingCanvases.forEach((c) => c.remove());

      const rect = canvasDiv.current.getBoundingClientRect();
      const container = {
        width: rect.width || window.innerWidth,
        height: rect.height || window.innerHeight,
      };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;
      scene.clear();

      const isSoftwareGl = (() => {
        const probeGl = document.createElement("canvas").getContext("webgl2");
        if (!probeGl) return true;
        const debugExt = probeGl.getExtension("WEBGL_debug_renderer_info");
        const param = debugExt
          ? debugExt.UNMASKED_RENDERER_WEBGL
          : probeGl.RENDERER;
        const gpuName = String(probeGl.getParameter(param));
        probeGl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
          gpuName
        );
      })();

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      );
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      canvasDiv.current.appendChild(renderer.domElement);

      const camConfig = getResponsiveAvatarCameraConfig(window.innerWidth);
      const camera = new THREE.PerspectiveCamera(
        camConfig.fov,
        aspect,
        0.1,
        1000
      );
      camera.position.set(0, camConfig.positionY, camConfig.positionZ);
      camera.zoom = camConfig.zoom;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let activeCharacter: THREE.Object3D | null = null;
      let hoverCleanup: (() => void) | undefined;

      const clock = new THREE.Clock();

      const light = setLighting(scene, renderer, isSoftwareGl);
      const progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let cachedViewportHeight = window.innerHeight || 900;
      let cachedViewportWidth = window.innerWidth || 1440;
      let currentScrollY = window.scrollY || 0;

      const onScroll = () => {
        currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
      };

      const onResize = () => {
        cachedViewportHeight = window.innerHeight || 900;
        cachedViewportWidth = window.innerWidth || 1440;
        if (activeCharacter) {
          handleResize(renderer, camera, canvasDiv, activeCharacter);
        }
      };

      loadCharacter()
        .then((gltf) => {
          if (!isMounted) return;
          if (gltf) {
            const animations = setAnimations(gltf);
            if (hoverDivRef.current) {
              hoverCleanup = animations.hover(gltf, hoverDivRef.current);
            }
            mixer = animations.mixer;
            const loadedChar = gltf.scene;
            activeCharacter = loadedChar;
            setChar(loadedChar);
            scene.add(loadedChar);
            headBone =
              loadedChar.getObjectByName("spine006") ||
              loadedChar.getObjectByName("spine.006") ||
              null;
            screenLight = loadedChar.getObjectByName("screenlight") || null;
            light.turnOnLights();
            animations.startIntro();
            progress.loaded();
            window.addEventListener("resize", onResize, { passive: true });
          }
        })
        .catch((err) => {
          console.warn("Character model load fallback:", err);
          progress.clear();
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.12, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => {
          mouse.x = x;
          mouse.y = y;
        });
      };

      const onTouchMove = (event: TouchEvent) => {
        handleTouchMove(event, (x, y) => {
          mouse.x = x;
          mouse.y = y;
        });
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse.x = x;
          mouse.y = y;
          interpolation.x = interpolationX;
          interpolation.y = interpolationY;
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("mousemove", onMouseMove, { passive: true });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchmove", onTouchMove, { passive: true });
        landingDiv.addEventListener("touchend", onTouchEnd, { passive: true });
      }

      let timeoutId = 0;
      const scheduleNextFrame = () => {
        if (!isMounted) return;
        if (isSoftwareGl) {
          timeoutId = window.setTimeout(() => {
            animFrameId = requestAnimationFrame(animate);
          }, 50);
        } else {
          animFrameId = requestAnimationFrame(animate);
        }
      };

      const animate = () => {
        if (!isMounted) return;
        // Skip WebGL draw calls when the 3D character has scrolled completely off-screen
        if (currentScrollY > cachedViewportHeight * 2.6) {
          clock.getDelta();
          scheduleNextFrame();
          return;
        }
        const delta = Math.min(clock.getDelta(), 0.05);
        if (mixer) {
          mixer.update(delta);
        }
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp,
            currentScrollY,
            cachedViewportWidth,
            delta
          );
          light.setPointLight(screenLight);
        }
        renderer.render(scene, camera);
        scheduleNextFrame();
      };
      animate();
      return () => {
        isMounted = false;
        cancelAnimationFrame(animFrameId);
        clearTimeout(timeoutId);
        hoverCleanup?.();
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        if (
          canvasDiv.current &&
          renderer.domElement.parentNode === canvasDiv.current
        ) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchmove", onTouchMove);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

