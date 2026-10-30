import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { attachAndSyncLowPolyDesk } from "../Character";
import {
  AVATAR_THEME_PALETTE,
  SCENE_BLOOM_CONFIG,
  classifyBomberTriangleGroup,
  getBomberFrontOpeningHalfWidth,
} from "../../../data/portfolioData";

interface StudioClothingTextures {
  bomberTwillAlbedo: THREE.CanvasTexture;
  crewJerseyAlbedo: THREE.CanvasTexture;
  ribbedKnitAlbedo: THREE.CanvasTexture;
}

function createStudioClothingTextures(maxAnisotropy: number): StudioClothingTextures {
  // 1. Matte Midnight-Navy Bomber Fabric Micro-Weave (#101A2D — uniform fine weave, zero stripes)
  const twillAlbedoCanvas = document.createElement("canvas");
  twillAlbedoCanvas.width = 128;
  twillAlbedoCanvas.height = 128;
  const twillCtx = twillAlbedoCanvas.getContext("2d")!;
  twillCtx.fillStyle = AVATAR_THEME_PALETTE.bomberJacketNavy;
  twillCtx.fillRect(0, 0, 128, 128);

  for (let y = 0; y < 128; y += 2) {
    for (let x = 0; x < 128; x += 2) {
      if ((x + y) % 4 === 0) {
        twillCtx.fillStyle = "rgba(32, 48, 78, 0.16)";
        twillCtx.fillRect(x, y, 1, 1);
      } else if ((x - y + 128) % 6 === 0) {
        twillCtx.fillStyle = "rgba(8, 12, 22, 0.18)";
        twillCtx.fillRect(x, y, 1, 1);
      }
    }
  }
  const bomberTwillAlbedo = new THREE.CanvasTexture(twillAlbedoCanvas);
  bomberTwillAlbedo.colorSpace = THREE.SRGBColorSpace;
  bomberTwillAlbedo.wrapS = THREE.RepeatWrapping;
  bomberTwillAlbedo.wrapT = THREE.RepeatWrapping;
  bomberTwillAlbedo.repeat.set(14, 14);
  bomberTwillAlbedo.anisotropy = maxAnisotropy;

  // 2. Inner Crew-Neck Shirt Charcoal Cotton Jersey Albedo (#151722)
  const jerseyAlbedoCanvas = document.createElement("canvas");
  jerseyAlbedoCanvas.width = 128;
  jerseyAlbedoCanvas.height = 128;
  const jerseyCtx = jerseyAlbedoCanvas.getContext("2d")!;
  jerseyCtx.fillStyle = AVATAR_THEME_PALETTE.innerShirtCharcoal;
  jerseyCtx.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 2) {
    jerseyCtx.fillStyle =
      y % 4 === 0 ? "rgba(34, 38, 54, 0.18)" : "rgba(10, 12, 20, 0.18)";
    jerseyCtx.fillRect(0, y, 128, 1);
  }
  const crewJerseyAlbedo = new THREE.CanvasTexture(jerseyAlbedoCanvas);
  crewJerseyAlbedo.colorSpace = THREE.SRGBColorSpace;
  crewJerseyAlbedo.wrapS = THREE.RepeatWrapping;
  crewJerseyAlbedo.wrapT = THREE.RepeatWrapping;
  crewJerseyAlbedo.repeat.set(14, 14);
  crewJerseyAlbedo.anisotropy = maxAnisotropy;

  // 3. Ribbed Knit Albedo for Matte-Black Bomber Collar, Cuffs & Hem (#0B0D15)
  const ribCanvas = document.createElement("canvas");
  ribCanvas.width = 128;
  ribCanvas.height = 128;
  const ribCtx = ribCanvas.getContext("2d")!;
  ribCtx.fillStyle = AVATAR_THEME_PALETTE.bomberRibMatteBlack;
  ribCtx.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 2) {
    ribCtx.fillStyle =
      x % 4 === 0 ? "rgba(26, 30, 46, 0.22)" : "rgba(5, 6, 12, 0.28)";
    ribCtx.fillRect(x, 0, 1, 128);
  }
  const ribbedKnitAlbedo = new THREE.CanvasTexture(ribCanvas);
  ribbedKnitAlbedo.colorSpace = THREE.SRGBColorSpace;
  ribbedKnitAlbedo.wrapS = THREE.RepeatWrapping;
  ribbedKnitAlbedo.wrapT = THREE.RepeatWrapping;
  ribbedKnitAlbedo.repeat.set(14, 6);

  return {
    bomberTwillAlbedo,
    crewJerseyAlbedo,
    ribbedKnitAlbedo,
  };
}

function applyBomberAndCrewShirtShader(material: THREE.MeshStandardMaterial) {
  material.customProgramCacheKey = () => "bomber_crew_shader_v1";
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vRestPos;
      varying vec3 vRestNorm;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      vRestPos = position;
      vRestNorm = normalize(objectNormal);`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vRestPos;
      varying vec3 vRestNorm;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      // 1. Smooth, anti-aliased tailored bomber & crew-neck masks in rest-pose space
      float ax = abs(vRestPos.x);
      float y = vRestPos.y;
      float z = vRestPos.z;
      vec3 n = normalize(vRestNorm);
      float frontMask = smoothstep(-0.06, 0.10, z);

      // Tapered open-front bomber jacket placket revealing the inner charcoal crew-neck shirt
      float halfOpen = mix(
        0.34 + max(0.0, (y - 8.2) * 0.040),
        0.65,
        smoothstep(11.45, 11.88, y)
      );
      float innerShirtMask = frontMask * (1.0 - smoothstep(halfOpen - 0.022, halfOpen + 0.022, ax)) * step(7.12, y);
      float innerCrewCollarMask = innerShirtMask * smoothstep(11.56, 11.68, y);

      // Matte-black ribbed bomber collar, wrist cuffs & bottom waistband
      float bomberCollarMask = (1.0 - innerShirtMask) * smoothstep(11.34, 11.44, y) * (1.0 - smoothstep(11.82, 11.92, y)) * (1.0 - smoothstep(0.95, 1.15, ax));
      float wristCuffMask = smoothstep(5.05, 5.18, ax);
      float hemBandMask = (1.0 - innerShirtMask) * (1.0 - smoothstep(7.35, 7.46, y)) * (1.0 - smoothstep(1.35, 1.52, ax));
      float ribTrimMask = clamp(bomberCollarMask + wristCuffMask + hemBandMask, 0.0, 1.0);

      // Minimal, ultra-clean violet piping along front zipper placket & raglan shoulder seam
      float zipperTrackDist = abs(ax - (halfOpen + 0.018));
      float zipperPiping = frontMask * (1.0 - smoothstep(0.004, 0.013, zipperTrackDist)) * step(7.38, y) * (1.0 - smoothstep(11.58, 11.68, y));
      float zipperMetalLine = frontMask * (1.0 - smoothstep(0.003, 0.009, abs(ax - halfOpen))) * step(7.38, y) * (1.0 - smoothstep(11.58, 11.68, y));

      float shoulderCurveDist = abs(ax - (1.28 + (11.5 - y) * 0.11));
      float shoulderSeamPiping = (1.0 - smoothstep(0.004, 0.012, shoulderCurveDist)) * smoothstep(10.2, 10.45, y) * (1.0 - smoothstep(11.42, 11.56, y));

      // Palette colors (matte midnight-navy bomber + charcoal crew-neck shirt, zero stripes)
      vec3 innerCharcoalCol = vec3(0.020, 0.023, 0.038);   // #151722 Matte Charcoal crew-neck shirt
      vec3 innerCollarCol   = vec3(0.014, 0.016, 0.028);   // #11131D Crew-neck ribbed collar
      vec3 bomberNavyBase   = vec3(0.015, 0.026, 0.054);   // #101A2D Matte Midnight-Navy bomber shell
      vec3 bomberNavyLift   = vec3(0.028, 0.048, 0.095);   // Soft matte normal-based form shading (not glossy)
      vec3 matteBlackRib    = vec3(0.011, 0.013, 0.022);   // #0B0D15 Matte-black bomber rib trim
      vec3 violetPipingCol  = vec3(0.36, 0.14, 0.74);      // #A855F7 Minimal tailored violet piping
      vec3 violetEdgeSheen  = vec3(0.38, 0.22, 0.72);      // Soft violet outer-edge reflection
      vec3 cyanEdgeSheen    = vec3(0.05, 0.48, 0.62);      // Soft cyan-blue outer-shoulder reflection

      // Fine isotropic matte fabric grain (no periodic stripes)
      float microWeave = sin(vRestPos.x * 165.0) * cos(vRestPos.y * 165.0) * 0.5 + 0.5;
      float ribGroove = sin(vRestPos.x * 120.0) * 0.5 + 0.5;

      // Natural anatomical form shading from 3D surface normals (no synthetic stripes)
      float upperChestForm = smoothstep(8.2, 11.3, y) * max(0.0, n.z) * 0.45;
      float outerEdgeGrazing = pow(1.0 - clamp(abs(n.z), 0.0, 1.0), 1.85) * smoothstep(8.0, 11.6, y);
      float topShoulderGrazing = clamp(n.y, 0.0, 1.0) * smoothstep(9.8, 11.6, y);

      // Compose Matte Midnight-Navy Bomber Jacket Shell
      vec3 jacketColor = mix(bomberNavyBase, bomberNavyLift, upperChestForm + topShoulderGrazing * 0.35 + microWeave * 0.04);
      // Very subtle studio edge sheen along outer shoulders
      float leftSideFactor = smoothstep(0.15, -0.45, vRestPos.x);
      float rightSideFactor = smoothstep(-0.15, 0.45, vRestPos.x);
      float rimGrazing = clamp(outerEdgeGrazing * 0.5 + topShoulderGrazing * 0.35, 0.0, 1.0);
      jacketColor = mix(jacketColor, cyanEdgeSheen, rimGrazing * 0.08 * leftSideFactor);
      jacketColor = mix(jacketColor, violetEdgeSheen, rimGrazing * 0.08 * rightSideFactor);

      // Compose Matte Charcoal Inner Crew-Neck Shirt
      float centerPlacketContour = smoothstep(0.0, 0.34, ax) * 0.12;
      vec3 shirtColor = innerCharcoalCol * (1.06 - centerPlacketContour + microWeave * 0.05);
      shirtColor = mix(shirtColor, innerCollarCol, innerCrewCollarMask);
      // Soft tailored lapel shadow where bomber jacket overlaps inner shirt
      float lapelShadow = frontMask * (1.0 - smoothstep(0.0, 0.05, halfOpen - ax)) * innerShirtMask;
      shirtColor *= (1.0 - lapelShadow * 0.36);

      // Compose Matte-Black Ribbed Trim (#0B0D15)
      vec3 ribColor = mix(matteBlackRib * 0.9, matteBlackRib * 1.2, ribGroove * 0.18);

      // Combine garment layers smoothly
      vec3 finalFabric = mix(jacketColor, ribColor, ribTrimMask);
      finalFabric = mix(finalFabric, shirtColor, innerShirtMask);

      // Subtle gunmetal zipper tooth line & minimal violet piping
      finalFabric = mix(finalFabric, vec3(0.12, 0.15, 0.22), zipperMetalLine * 0.70);
      float totalPiping = clamp(zipperPiping * 0.72 + shoulderSeamPiping * 0.55, 0.0, 1.0);
      finalFabric = mix(finalFabric, violetPipingCol, totalPiping * 0.75);

      diffuseColor.rgb = finalFabric;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      float axR = abs(vRestPos.x);
      float yR = vRestPos.y;
      float halfOpenR = mix(0.34 + max(0.0, (yR - 8.2) * 0.040), 0.65, smoothstep(11.45, 11.88, yR));
      float innerMaskR = smoothstep(-0.06, 0.10, vRestPos.z) * (1.0 - smoothstep(halfOpenR - 0.022, halfOpenR + 0.022, axR)) * step(7.12, yR);
      // True matte bomber jacket finish (0.72) and soft matte cotton inner shirt (0.84) — never glossy or plastic
      roughnessFactor = mix(0.72, 0.84, innerMaskR);`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
      // Restrained pinpoint emissive radiance only along the thin tailored zipper piping and shoulder seam
      float axE = abs(vRestPos.x);
      float yE = vRestPos.y;
      float zE = vRestPos.z;
      float frontMaskE = smoothstep(-0.06, 0.10, zE);
      float halfOpenE = mix(0.34 + max(0.0, (yE - 8.2) * 0.040), 0.65, smoothstep(11.45, 11.88, yE));
      float zipperPipingE = frontMaskE * (1.0 - smoothstep(0.004, 0.011, abs(axE - (halfOpenE + 0.018)))) * step(7.38, yE) * (1.0 - smoothstep(11.58, 11.68, yE));
      float shoulderPipingE = (1.0 - smoothstep(0.004, 0.010, abs(axE - (1.28 + (11.5 - yE) * 0.11)))) * smoothstep(10.2, 10.45, yE) * (1.0 - smoothstep(11.42, 11.56, yE));
      vec3 violetGlowE = vec3(0.66, 0.33, 0.97);
      totalEmissiveRadiance += violetGlowE * clamp(zipperPipingE * 0.36 + shoulderPipingE * 0.28, 0.0, 1.0);`
    );
  };
}

function buildBomberJacketAndCrewShirt(
  shirtMesh: THREE.SkinnedMesh,
  textures: StudioClothingTextures
) {
  const baseGeo = shirtMesh.geometry.clone();
  const posAttr = baseGeo.attributes.position;
  const indexAttr = baseGeo.index;
  if (!posAttr || !indexAttr) return;

  // Partition BODY.SHIRT triangles into named material groups for inspectability
  // while using our continuous rest-pose shader so all seams are 100% smooth and anti-aliased
  const triCount = indexAttr.count / 3;
  const shellIndices: number[] = [];
  const innerBodyIndices: number[] = [];
  const innerCollarIndices: number[] = [];
  const ribIndices: number[] = [];
  const stitchIndices: number[] = [];

  for (let t = 0; t < triCount; t++) {
    const i0 = indexAttr.getX(t * 3);
    const i1 = indexAttr.getX(t * 3 + 1);
    const i2 = indexAttr.getX(t * 3 + 2);
    const cx = (posAttr.getX(i0) + posAttr.getX(i1) + posAttr.getX(i2)) / 3;
    const cy = (posAttr.getY(i0) + posAttr.getY(i1) + posAttr.getY(i2)) / 3;
    const cz = (posAttr.getZ(i0) + posAttr.getZ(i1) + posAttr.getZ(i2)) / 3;

    const group = classifyBomberTriangleGroup(cx, cy, cz);
    if (group === "inner_open_front") {
      if (cy > 11.72 && Math.abs(cx) < 0.95) {
        innerCollarIndices.push(i0, i1, i2);
      } else {
        innerBodyIndices.push(i0, i1, i2);
      }
    } else if (group === "violet_stitch") {
      stitchIndices.push(i0, i1, i2);
    } else if (group === "matte_black_rib") {
      ribIndices.push(i0, i1, i2);
    } else {
      shellIndices.push(i0, i1, i2);
    }
  }

  const groupsData = [
    shellIndices,
    innerBodyIndices,
    innerCollarIndices,
    ribIndices,
    stitchIndices,
  ];
  const totalIndices = groupsData.reduce((acc, arr) => acc + arr.length, 0);
  const newIndexBuffer = new Uint16Array(totalIndices);

  baseGeo.clearGroups();
  let writeOffset = 0;
  groupsData.forEach((arr, matIndex) => {
    newIndexBuffer.set(arr, writeOffset);
    baseGeo.addGroup(writeOffset, arr.length, matIndex);
    writeOffset += arr.length;
  });
  baseGeo.setIndex(new THREE.BufferAttribute(newIndexBuffer, 1));

  const createGarmentMaterial = (
    name: string,
    hexColor: string,
    mapTex: THREE.CanvasTexture,
    roughness: number,
    metalness: number
  ) => {
    const mat = new THREE.MeshStandardMaterial({
      name,
      color: new THREE.Color(hexColor),
      map: mapTex,
      roughness,
      metalness,
      envMapIntensity: 0.30,
      vertexColors: false,
    });
    applyBomberAndCrewShirtShader(mat);
    return mat;
  };

  // [0] Matte Midnight Navy Bomber Jacket Shell (#101A2D)
  const bomberShellMat = createGarmentMaterial(
    "bomber_jacket_midnight_navy",
    AVATAR_THEME_PALETTE.bomberJacketNavy,
    textures.bomberTwillAlbedo,
    0.72,
    0.04
  );
  // [1] Matte Inner Crew-Neck Shirt Charcoal (#151722)
  const innerCrewShirtMat = createGarmentMaterial(
    "inner_crew_shirt_charcoal",
    AVATAR_THEME_PALETTE.innerShirtCharcoal,
    textures.bomberTwillAlbedo,
    0.84,
    0.04
  );
  // [2] Inner Crew-Neck Collar Rib (#11131D)
  const innerCrewCollarMat = createGarmentMaterial(
    "inner_crew_collar_rib",
    AVATAR_THEME_PALETTE.innerCollarRib,
    textures.bomberTwillAlbedo,
    0.84,
    0.04
  );
  // [3] Matte Black Bomber Ribbed Collar, Cuffs & Hem (#0B0D15)
  const bomberRibMat = createGarmentMaterial(
    "bomber_collar_cuffs_matte_black",
    AVATAR_THEME_PALETTE.bomberRibMatteBlack,
    textures.bomberTwillAlbedo,
    0.80,
    0.04
  );
  // [4] Minimal Restrained Violet Zipper Placket & Shoulder Seam Piping (#A855F7)
  const bomberVioletStitchMat = createGarmentMaterial(
    "bomber_violet_stitch_trim",
    AVATAR_THEME_PALETTE.primaryViolet,
    textures.bomberTwillAlbedo,
    0.68,
    0.06
  );

  shirtMesh.geometry = baseGeo;
  shirtMesh.material = [
    bomberShellMat,
    innerCrewShirtMat,
    innerCrewCollarMat,
    bomberRibMat,
    bomberVioletStitchMat,
  ];
}

function attachModernCoderGear(character: THREE.Object3D) {
  const headBone =
    character.getObjectByName("spine006") ||
    character.getObjectByName("spine.006");
  if (!headBone) return;

  // Refine head and hair proportions for a mature, balanced developer silhouette
  headBone.scale.set(0.93, 0.96, 0.94);
  const hairNode = character.getObjectByName("hair");
  if (hairNode) {
    hairNode.scale.set(10.25, 8.45, 10.45);
  }

  // Remove any previously attached gear
  const existing = headBone.getObjectByName("modernCoderHeadGear");
  if (existing) {
    headBone.remove(existing);
  }

  const gearGroup = new THREE.Group();
  gearGroup.name = "modernCoderHeadGear";

  // 1. Refined, Thin-Profile Matte Titanium Developer Glasses
  const frameMat = new THREE.MeshStandardMaterial({
    name: "glasses_matte_titanium",
    color: 0x101420,
    roughness: 0.28,
    metalness: 0.72,
  });
  const hingeAccentMat = new THREE.MeshStandardMaterial({
    name: "glasses_violet_hinge",
    color: new THREE.Color("#d8b4fe"),
    emissive: new THREE.Color(AVATAR_THEME_PALETTE.primaryViolet),
    emissiveIntensity: SCENE_BLOOM_CONFIG.accentEmissiveIntensity.glassesAccent,
    roughness: 0.2,
    metalness: 0.5,
  });
  const cyanBrowAccentMat = new THREE.MeshStandardMaterial({
    name: "glasses_cyan_brow_accent",
    color: new THREE.Color("#67e8f9"),
    emissive: new THREE.Color(AVATAR_THEME_PALETTE.cyanAccent),
    emissiveIntensity: SCENE_BLOOM_CONFIG.accentEmissiveIntensity.glassesAccent,
    roughness: 0.2,
    metalness: 0.5,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    name: "glasses_antiglare_lens",
    color: 0x35d6e7,
    emissive: new THREE.Color(AVATAR_THEME_PALETTE.cyanAccent),
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.06,
    roughness: 0.1,
    metalness: 0.2,
    depthWrite: false,
  });

  const glassesGroup = new THREE.Group();
  // Positioned so top brow bar sits cleanly above the pupils and eyes sit centered in the lenses
  glassesGroup.position.set(0, 1.18, 1.15);
  glassesGroup.rotation.x = 0.01;

  [-0.43, 0.43].forEach((xOffset) => {
    const lensFrame = new THREE.Group();
    lensFrame.position.set(xOffset, 0, 0);

    // Thin refined top brow bar
    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.028, 0.034),
      frameMat
    );
    topBar.position.set(0, 0.205, 0);
    lensFrame.add(topBar);

    // Paper-thin cyan optical brow accent line
    const browGlowLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.009, 0.036),
      cyanBrowAccentMat
    );
    browGlowLine.position.set(0, 0.218, 0.002);
    lensFrame.add(browGlowLine);

    // Ultrathin bottom rim
    const bottomBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.02, 0.028),
      frameMat
    );
    bottomBar.position.set(0, -0.195, 0);
    lensFrame.add(bottomBar);

    // Sleek vertical side rims
    const leftSide = new THREE.Mesh(
      new THREE.BoxGeometry(0.026, 0.39, 0.03),
      frameMat
    );
    leftSide.position.set(-0.295, 0, 0);
    lensFrame.add(leftSide);

    const rightSide = new THREE.Mesh(
      new THREE.BoxGeometry(0.026, 0.39, 0.03),
      frameMat
    );
    rightSide.position.set(0.295, 0, 0);
    lensFrame.add(rightSide);

    // Subtle anti-reflective optical lens
    const lensPane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.56, 0.35),
      lensMat
    );
    lensPane.position.set(0, 0, 0.008);
    lensFrame.add(lensPane);

    // Temple arm extending cleanly back to ear
    const temple = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, 0.026, 0.88),
      frameMat
    );
    temple.position.set(xOffset > 0 ? 0.305 : -0.305, 0.06, -0.44);
    lensFrame.add(temple);

    // Subtle metallic hinge pin with violet accent
    const hingeAccent = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.018, 0.038),
      hingeAccentMat
    );
    hingeAccent.position.set(xOffset > 0 ? 0.305 : -0.305, 0.15, 0.008);
    lensFrame.add(hingeAccent);

    glassesGroup.add(lensFrame);
  });

  // Refined nose bridge
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.026, 0.03),
    frameMat
  );
  bridge.position.set(0, 0.08, 0.008);
  glassesGroup.add(bridge);

  gearGroup.add(glassesGroup);

  // 2. Low-Profile Matte-Black / Deep-Navy Studio Headphones with Thin Restrained Violet Ring & Cyan Accent
  const cupOuterMat = new THREE.MeshStandardMaterial({
    name: "headphones_matte_black_shell",
    color: new THREE.Color(AVATAR_THEME_PALETTE.headphonesMatteBlack),
    roughness: 0.62,
    metalness: 0.26,
  });
  const cushionMat = new THREE.MeshStandardMaterial({
    name: "headphones_charcoal_cushion",
    color: new THREE.Color(AVATAR_THEME_PALETTE.headphonesCushion),
    roughness: 0.82,
    metalness: 0.05,
  });
  const restrainedVioletRingMat = new THREE.MeshStandardMaterial({
    name: "headphones_restrained_violet_ring",
    color: new THREE.Color("#d8b4fe"),
    emissive: new THREE.Color(AVATAR_THEME_PALETTE.primaryViolet),
    emissiveIntensity:
      SCENE_BLOOM_CONFIG.accentEmissiveIntensity.headphoneVioletRing,
    roughness: 0.22,
    metalness: 0.35,
  });
  const headphoneCyanNodeMat = new THREE.MeshStandardMaterial({
    name: "headphones_cyan_accent_node",
    color: new THREE.Color("#67e8f9"),
    emissive: new THREE.Color(AVATAR_THEME_PALETTE.cyanAccent),
    emissiveIntensity:
      SCENE_BLOOM_CONFIG.accentEmissiveIntensity.headphoneVioletRing,
    roughness: 0.2,
    metalness: 0.3,
  });

  const headphonesGroup = new THREE.Group();
  [-1, 1].forEach((dir) => {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(dir * 1.0, 1.02, 0.24);

    // Compact over-ear cushion flush against side of head
    const cushion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.41, 0.41, 0.16, 32),
      cushionMat
    );
    cushion.rotation.z = Math.PI / 2;
    cushion.scale.set(1.12, 1, 0.88);
    cupGroup.add(cushion);

    // Matte-black outer shell
    const outerCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.4, 0.18, 32),
      cupOuterMat
    );
    outerCup.rotation.z = Math.PI / 2;
    outerCup.scale.set(1.12, 1, 0.88);
    outerCup.position.x = dir * 0.11;
    cupGroup.add(outerCup);

    // Thin, restrained violet illuminated ring (tube radius 0.012)
    const ledRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.33, 0.012, 16, 40),
      restrainedVioletRingMat
    );
    ledRing.rotation.y = Math.PI / 2;
    ledRing.scale.set(0.88, 1.12, 1);
    ledRing.position.x = dir * 0.205;
    cupGroup.add(ledRing);

    // Subtle cyan status indicator node on lower front earcup bezel
    const cyanStatusNode = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 12, 12),
      headphoneCyanNodeMat
    );
    cyanStatusNode.position.set(dir * 0.208, -0.18, 0.24);
    cupGroup.add(cyanStatusNode);

    headphonesGroup.add(cupGroup);
  });

  // Low-profile matte-black headband
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(1.06, 0.058, 16, 48, Math.PI),
    cupOuterMat
  );
  headband.position.set(0, 1.08, 0.18);
  headband.scale.set(0.96, 1.18, 1);
  headphonesGroup.add(headband);

  gearGroup.add(headphonesGroup);
  headBone.add(gearGroup);
}

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            const maxAniso = renderer.capabilities.getMaxAnisotropy() || 4;
            const clothingTextures = createStudioClothingTextures(maxAniso);

            let shirtSkinnedMesh: THREE.SkinnedMesh | null = null;
            let keyIdx = 0;

            // Pre-create shared keycap materials so all ~60 keys share 3 GPU material states
            const keyCyanMat = new THREE.MeshStandardMaterial({
              name: "keyboard_key_cyan",
              color: new THREE.Color("#67e8f9"),
              emissive: new THREE.Color(AVATAR_THEME_PALETTE.cyanAccent),
              emissiveIntensity:
                SCENE_BLOOM_CONFIG.accentEmissiveIntensity.keyboardKeycaps,
              roughness: 0.36,
              metalness: 0.2,
            });
            const keyVioletMat = new THREE.MeshStandardMaterial({
              name: "keyboard_key_violet",
              color: new THREE.Color("#d8b4fe"),
              emissive: new THREE.Color(AVATAR_THEME_PALETTE.primaryViolet),
              emissiveIntensity:
                SCENE_BLOOM_CONFIG.accentEmissiveIntensity.keyboardKeycaps,
              roughness: 0.36,
              metalness: 0.2,
            });
            const keyDarkMat = new THREE.MeshStandardMaterial({
              name: "keyboard_key_dark",
              color: new THREE.Color("#1c2234"),
              roughness: 0.36,
              metalness: 0.2,
            });

            character.traverse((child: any) => {
              if (child.isLight) {
                child.intensity = 0;
                child.visible = false;
                return;
              }
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = false;
                child.receiveShadow = false;
                mesh.frustumCulled = true;

                const nodeName = (child.name || "").toLowerCase();
                const parentName = (child.parent?.name || "").toLowerCase();

                if (nodeName.includes("shirt") && (child as THREE.SkinnedMesh).isSkinnedMesh) {
                  shirtSkinnedMesh = child as THREE.SkinnedMesh;
                  return;
                }

                if (nodeName.startsWith("keys")) {
                  keyIdx++;
                  if (keyIdx % 7 === 0) {
                    mesh.material = keyCyanMat;
                  } else if (keyIdx % 5 === 0) {
                    mesh.material = keyVioletMat;
                  } else {
                    mesh.material = keyDarkMat;
                  }
                  return;
                }

                // Clone shared material per non-key mesh so skin, pants, and accessories have independent PBR properties
                if (mesh.material && !Array.isArray(mesh.material)) {
                  mesh.material = mesh.material.clone();
                }

                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat && mat.color) {
                  const matName = (mat.name || "").toLowerCase();

                  // 1. Hide only ears, floor (`ground`), and bulky chair backrest (`Cube.002`)
                  // Keep the computer desk/table (`Plane.002` & desk legs) visible and styled in dark slate-navy!
                  const isFaceMesh =
                    nodeName.includes("plane007") ||
                    nodeName.includes("plane.007") ||
                    parentName.includes("plane007") ||
                    parentName.includes("plane.007");
                  const isMonitorMesh =
                    nodeName.includes("plane004") ||
                    nodeName.includes("plane.004") ||
                    parentName.includes("plane004") ||
                    parentName.includes("plane.004") ||
                    nodeName.includes("screenlight");
                  const isChairMesh =
                    nodeName.includes("cube002") ||
                    nodeName.includes("cube.002") ||
                    parentName.includes("cube002") ||
                    parentName.includes("cube.002") ||
                    nodeName.includes("chair") ||
                    parentName.includes("chair");
                  const isDeskOrTableMesh =
                    !isFaceMesh &&
                    !isMonitorMesh &&
                    !isChairMesh &&
                    (nodeName.includes("plane") ||
                      parentName.includes("plane") ||
                      nodeName.includes("cube") ||
                      parentName.includes("cube") ||
                      nodeName.includes("cylinder") ||
                      parentName.includes("cylinder") ||
                      nodeName.includes("table") ||
                      nodeName.includes("desk"));

                  if (
                    nodeName.includes("ear") ||
                    nodeName.includes("ground") ||
                    isChairMesh ||
                    isDeskOrTableMesh
                  ) {
                    child.visible = false;
                  }
                  // 2. Face (`Plane.007`), Neck, Hands -> Natural, balanced human skin tone (#D8A483)
                  // Disable vertexColors so Plane.007's COLOR_0 attribute never tints the skin
                  else if (
                    nodeName.includes("plane007") ||
                    nodeName.includes("plane.007") ||
                    nodeName.includes("neck") ||
                    nodeName.includes("hand")
                  ) {
                    mat.name = "skin_natural_balanced";
                    mat.vertexColors = false;
                    mat.color.set(AVATAR_THEME_PALETTE.naturalSkin);
                    mat.roughness = 0.62;
                    mat.metalness = 0.02;
                    mat.envMapIntensity = 0.28;
                  }
                  // 3. Trousers / Pants (`Pant`) -> Deep Tailored Midnight-Charcoal
                  else if (nodeName.includes("pant")) {
                    mat.name = "trousers_midnight_charcoal";
                    mat.vertexColors = false;
                    mat.color.set("#0E1322");
                    mat.roughness = 0.72;
                    mat.metalness = 0.06;
                    mat.envMapIntensity = 0.30;
                  }
                  // 4. Sneakers & Soles (`Shoe`, `Sole`)
                  else if (nodeName.includes("shoe")) {
                    mat.name = "sneakers_matte_navy";
                    mat.vertexColors = false;
                    mat.color.set("#121729");
                    mat.roughness = 0.56;
                    mat.metalness = 0.12;
                  } else if (nodeName.includes("sole")) {
                    mat.name = "sneakers_sole_slate";
                    mat.vertexColors = false;
                    mat.color.set("#262D40");
                    mat.roughness = 0.62;
                  }
                  // 5. Hair & Eyebrows (`hair`, `Eyebrow`) -> Matte Espresso-Charcoal
                  else if (
                    nodeName.includes("hair") ||
                    nodeName.includes("eyebrow") ||
                    matName === "material.030" ||
                    matName === "material.014"
                  ) {
                    mat.name = "hair_matte_espresso";
                    mat.vertexColors = false;
                    mat.color.set("#11131C");
                    mat.roughness = 0.58;
                    mat.metalness = 0.06;
                    mat.envMapIntensity = 0.30;
                  }
                  // 7. Mechanical Keyboard Base & Keycaps
                  else if (nodeName.includes("keyboard")) {
                    mat.color.set("#0f131f");
                    mat.roughness = 0.35;
                    mat.metalness = 0.5;
                  } else if (nodeName.startsWith("keys")) {
                    keyIdx++;
                    if (keyIdx % 7 === 0) {
                      mat.color.set("#67e8f9");
                      mat.emissive = new THREE.Color(AVATAR_THEME_PALETTE.cyanAccent);
                      mat.emissiveIntensity =
                        SCENE_BLOOM_CONFIG.accentEmissiveIntensity.keyboardKeycaps;
                    } else if (keyIdx % 5 === 0) {
                      mat.color.set("#d8b4fe");
                      mat.emissive = new THREE.Color(AVATAR_THEME_PALETTE.primaryViolet);
                      mat.emissiveIntensity =
                        SCENE_BLOOM_CONFIG.accentEmissiveIntensity.keyboardKeycaps;
                    } else {
                      mat.color.set("#1c2234");
                    }
                    mat.roughness = 0.36;
                  }

                  mat.needsUpdate = true;
                }
              }
            });

            // Build genuine 3D two-layer Bomber Jacket (#101A2D) + Inner Crew-Neck Shirt (#151722)
            if (shirtSkinnedMesh) {
              buildBomberJacketAndCrewShirt(shirtSkinnedMesh, clothingTextures);
            }

            // Attach refined Developer Glasses & Matte-Black Headphones with thin violet ring
            attachModernCoderGear(character);

            // Attach sleek low-poly 3D desk model beneath the avatar's keyboard and hands
            attachAndSyncLowPolyDesk(character);

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;

