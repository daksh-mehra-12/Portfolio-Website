import * as THREE from "three";
import Scene from "./Scene";
import {
  BoundingBoxSummary,
  LOW_POLY_DESK_CONFIG,
  LowPolyDeskPlacement,
  SCENE_3D_NETWORK_EDGES,
  SCENE_3D_NETWORK_NODES,
  SCENE_BLOOM_CONFIG,
  computeLowPolyDeskPlacement,
} from "../../data/portfolioData";

function markLowPolyDeskHierarchy(root: THREE.Object3D) {
  root.traverse((node) => {
    node.userData.isLowPolyDesk = true;
    if ((node as THREE.Mesh).isMesh) {
      node.castShadow = false;
      node.receiveShadow = false;
    }
  });
}

function measureLocalBounds(
  character: THREE.Object3D,
  predicate: (mesh: THREE.Mesh, nodeName: string, parentName: string) => boolean
): BoundingBoxSummary | null {
  const box = new THREE.Box3();
  let found = false;

  character.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && !child.userData.isLowPolyDesk) {
      const mesh = child as THREE.Mesh;
      const nodeName = (mesh.name || "").toLowerCase();
      const parentName = (mesh.parent?.name || "").toLowerCase();
      if (predicate(mesh, nodeName, parentName)) {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        if (!meshBox.isEmpty()) {
          box.union(meshBox);
          found = true;
        }
      }
    }
  });

  if (!found || box.isEmpty()) {
    return null;
  }

  return {
    minX: box.min.x,
    maxX: box.max.x,
    minY: box.min.y,
    maxY: box.max.y,
    minZ: box.min.z,
    maxZ: box.max.z,
  };
}

export function createLowPolyDeskGroup(
  placement: LowPolyDeskPlacement = computeLowPolyDeskPlacement(null, null)
): THREE.Group {
  const deskGroup = new THREE.Group();
  deskGroup.name = LOW_POLY_DESK_CONFIG.name;

  const { width, depth, topThickness, bevelApronHeight, colors } =
    LOW_POLY_DESK_CONFIG;
  const { topY, centerX, centerZ, legHeight } = placement;

  // Position group anchor so local (0, 0, 0) corresponds to (centerX, topY, centerZ)
  deskGroup.position.set(centerX, topY, centerZ);

  // Materials matching the dark #070810 aesthetic with midnight-slate surfaces and subtle cyan/violet accents
  const tabletopMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_tabletop_slate",
    color: new THREE.Color(colors.tabletopSlate),
    emissive: new THREE.Color("#0d1528"),
    emissiveIntensity: 0.28,
    roughness: 0.42,
    metalness: 0.32,
    envMapIntensity: 0.6,
  });

  const bevelApronMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_bevel_apron",
    color: new THREE.Color(colors.bevelApronDark),
    emissive: new THREE.Color("#080c18"),
    emissiveIntensity: 0.22,
    roughness: 0.52,
    metalness: 0.38,
    envMapIntensity: 0.5,
  });

  const wingBumperMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_wing_bumper",
    color: new THREE.Color("#1E2B48"),
    emissive: new THREE.Color("#10192e"),
    emissiveIntensity: 0.26,
    roughness: 0.36,
    metalness: 0.48,
  });

  const deskMatSurfaceMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_mat_carbon",
    color: new THREE.Color(colors.deskMatCarbon),
    emissive: new THREE.Color("#060912"),
    emissiveIntensity: 0.15,
    roughness: 0.84,
    metalness: 0.08,
  });

  const deskMatBorderMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_mat_border",
    color: new THREE.Color(colors.deskMatBorder),
    emissive: new THREE.Color("#152036"),
    emissiveIntensity: 0.25,
    roughness: 0.48,
    metalness: 0.35,
  });

  const legTitaniumMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_leg_titanium",
    color: new THREE.Color(colors.legTitanium),
    emissive: new THREE.Color("#0e1629"),
    emissiveIntensity: 0.24,
    roughness: 0.36,
    metalness: 0.52,
    envMapIntensity: 0.55,
  });

  const crossbarMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_crossbar_slate",
    color: new THREE.Color(colors.crossbarSlate),
    emissive: new THREE.Color("#090e1c"),
    emissiveIntensity: 0.2,
    roughness: 0.5,
    metalness: 0.36,
  });

  const cyanTrimMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_cyan_led_trim",
    color: new THREE.Color("#67e8f9"),
    emissive: new THREE.Color(colors.cyanAccent),
    emissiveIntensity: SCENE_BLOOM_CONFIG.accentEmissiveIntensity.deskLedTrim,
    roughness: 0.2,
    metalness: 0.3,
  });

  const violetTrimMat = new THREE.MeshStandardMaterial({
    name: "lowpoly_desk_violet_led_trim",
    color: new THREE.Color("#d8b4fe"),
    emissive: new THREE.Color(colors.violetAccent),
    emissiveIntensity: SCENE_BLOOM_CONFIG.accentEmissiveIntensity.deskLedTrim,
    roughness: 0.2,
    metalness: 0.3,
  });

  // 1. Primary Chamfered Tabletop Slab
  const mainSlab = new THREE.Mesh(
    new THREE.BoxGeometry(width, topThickness, depth),
    tabletopMat
  );
  mainSlab.name = "desk_tabletop_slab";
  mainSlab.position.set(0, -topThickness * 0.5, 0);
  deskGroup.add(mainSlab);

  // 2. Stepped Low-Poly Lower Bevel Apron
  const lowerApron = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.28, bevelApronHeight, depth - 0.24),
    bevelApronMat
  );
  lowerApron.name = "desk_bevel_apron";
  lowerApron.position.set(0, -topThickness - bevelApronHeight * 0.5, 0);
  deskGroup.add(lowerApron);

  // 3. Left & Right Angled Low-Poly Wing Bumpers
  [-1, 1].forEach((side) => {
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, topThickness + 0.06, depth - 0.14),
      wingBumperMat
    );
    wing.name = side < 0 ? "desk_left_wing_chamfer" : "desk_right_wing_chamfer";
    wing.position.set(side * (width * 0.5 - 0.04), -topThickness * 0.5 - 0.01, 0);
    wing.rotation.z = side * 0.12;
    deskGroup.add(wing);
  });

  // 4. Extended Microfiber Developer Desk Mat + Recessed Border directly beneath Keyboard
  const matWidth = width * 0.7;
  const matDepth = depth * 0.64;
  const deskMatBorder = new THREE.Mesh(
    new THREE.BoxGeometry(matWidth + 0.08, 0.018, matDepth + 0.08),
    deskMatBorderMat
  );
  deskMatBorder.name = "desk_mat_border";
  deskMatBorder.position.set(0, 0.009, -0.06);
  deskGroup.add(deskMatBorder);

  const deskMat = new THREE.Mesh(
    new THREE.BoxGeometry(matWidth, 0.026, matDepth),
    deskMatSurfaceMat
  );
  deskMat.name = "desk_mat_surface";
  deskMat.position.set(0, 0.013, -0.06);
  deskGroup.add(deskMat);

  // 5. Sleek Dual-Tone Low-Poly Edge Accent Strips (Front + Rear + Side Chamfer Accents)
  const halfStripW = (width - 0.42) * 0.5;
  const stripY = -topThickness * 0.52;
  const frontZ = depth * 0.5 + 0.012;
  const rearZ = -depth * 0.5 - 0.012;

  const frontCyanStrip = new THREE.Mesh(
    new THREE.BoxGeometry(halfStripW, 0.036, 0.028),
    cyanTrimMat
  );
  frontCyanStrip.name = "desk_front_cyan_led";
  frontCyanStrip.position.set(-halfStripW * 0.5 - 0.04, stripY, frontZ);
  deskGroup.add(frontCyanStrip);

  const frontVioletStrip = new THREE.Mesh(
    new THREE.BoxGeometry(halfStripW, 0.036, 0.028),
    violetTrimMat
  );
  frontVioletStrip.name = "desk_front_violet_led";
  frontVioletStrip.position.set(halfStripW * 0.5 + 0.04, stripY, frontZ);
  deskGroup.add(frontVioletStrip);

  const rearCyanStrip = new THREE.Mesh(
    new THREE.BoxGeometry(halfStripW, 0.032, 0.024),
    cyanTrimMat
  );
  rearCyanStrip.name = "desk_rear_cyan_led";
  rearCyanStrip.position.set(-halfStripW * 0.5 - 0.04, stripY, rearZ);
  deskGroup.add(rearCyanStrip);

  const rearVioletStrip = new THREE.Mesh(
    new THREE.BoxGeometry(halfStripW, 0.032, 0.024),
    violetTrimMat
  );
  rearVioletStrip.name = "desk_rear_violet_led";
  rearVioletStrip.position.set(halfStripW * 0.5 + 0.04, stripY, rearZ);
  deskGroup.add(rearVioletStrip);

  // Side accent strips along left (-X cyan) and right (+X violet) wing bumpers
  const leftSideStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.026, 0.034, depth - 0.36),
    cyanTrimMat
  );
  leftSideStrip.name = "desk_side_cyan_led";
  leftSideStrip.position.set(-width * 0.5 - 0.04, stripY, 0);
  deskGroup.add(leftSideStrip);

  const rightSideStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.026, 0.034, depth - 0.36),
    violetTrimMat
  );
  rightSideStrip.name = "desk_side_violet_led";
  rightSideStrip.position.set(width * 0.5 + 0.04, stripY, 0);
  deskGroup.add(rightSideStrip);

  // 6. Left & Right Angled Low-Poly Sled Legs + Upper Structural Gussets + Grounded Skids
  const legOffsetX = width * 0.5 - 0.56;
  const legTopY = -topThickness - bevelApronHeight;
  const strutCenterY = legTopY - legHeight * 0.5;

  [-1, 1].forEach((side) => {
    const legAssembly = new THREE.Group();
    legAssembly.name = side < 0 ? "desk_left_leg_group" : "desk_right_leg_group";
    legAssembly.position.set(side * legOffsetX, 0, 0);

    // Upper low-poly corner gusset bracket
    const gusset = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.34, depth * 0.68),
      wingBumperMat
    );
    gusset.name = "desk_leg_gusset";
    gusset.position.set(0, legTopY - 0.15, 0);
    legAssembly.add(gusset);

    // Front angled low-poly strut
    const frontStrut = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, legHeight, 0.24),
      legTitaniumMat
    );
    frontStrut.name = "desk_leg_front_strut";
    frontStrut.position.set(0, strutCenterY, depth * 0.26);
    frontStrut.rotation.x = -0.04;
    frontStrut.rotation.z = side * -0.03;
    legAssembly.add(frontStrut);

    // Rear angled low-poly strut
    const rearStrut = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, legHeight, 0.24),
      legTitaniumMat
    );
    rearStrut.name = "desk_leg_rear_strut";
    rearStrut.position.set(0, strutCenterY, -depth * 0.26);
    rearStrut.rotation.x = 0.04;
    rearStrut.rotation.z = side * -0.03;
    legAssembly.add(rearStrut);

    // Diagonal knee brace between top crossbar and outer leg strut (visible in Hero & About)
    const kneeBrace = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.92, 0.18),
      legTitaniumMat
    );
    kneeBrace.name = "desk_leg_knee_brace";
    kneeBrace.position.set(-side * 0.32, legTopY - 0.5, 0);
    kneeBrace.rotation.z = side * 0.58;
    legAssembly.add(kneeBrace);

    // Grounded sled foot skid
    const sledFoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.14, depth * 0.76),
      bevelApronMat
    );
    sledFoot.name = "desk_leg_sled_foot";
    sledFoot.position.set(0, legTopY - legHeight + 0.07, 0);
    legAssembly.add(sledFoot);

    deskGroup.add(legAssembly);
  });

  // 7. Under-Desk Cable Management Modesty Tray / Crossbar
  const cableTray = new THREE.Mesh(
    new THREE.BoxGeometry(legOffsetX * 2 - 0.16, 0.24, 0.42),
    crossbarMat
  );
  cableTray.name = "desk_cable_tray";
  cableTray.position.set(0, legTopY - 0.38, -0.15);
  deskGroup.add(cableTray);

  markLowPolyDeskHierarchy(deskGroup);
  return deskGroup;
}

export function attachAndSyncLowPolyDesk(character: THREE.Object3D): THREE.Group {
  // Save current character transform so bounds are measured in local character coordinate space
  const savedPos = character.position.clone();
  const savedRot = character.rotation.clone();
  const savedScale = character.scale.clone();

  character.position.set(0, 0, 0);
  character.rotation.set(0, 0, 0);
  character.scale.set(1, 1, 1);
  character.updateMatrixWorld(true);

  const keyboardBounds = measureLocalBounds(
    character,
    (_mesh, nodeName, parentName) =>
      nodeName.includes("keyboard") ||
      nodeName.startsWith("keys") ||
      parentName.includes("keyboard")
  );

  const tableBounds = measureLocalBounds(
    character,
    (_mesh, nodeName, parentName) =>
      nodeName.includes("plane002") ||
      nodeName.includes("plane.002") ||
      parentName.includes("plane002") ||
      parentName.includes("plane.002")
  );

  // Hide legacy flat table, chair armrests, and raw leg meshes so the sleek low-poly desk replaces them cleanly
  character.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && !child.userData.isLowPolyDesk) {
      const nodeName = (child.name || "").toLowerCase();
      const parentName = (child.parent?.name || "").toLowerCase();
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
      const isKeyboardMesh =
        nodeName.includes("keyboard") ||
        nodeName.startsWith("keys") ||
        parentName.includes("keyboard");
      const isLegacyDeskOrLeg =
        !isFaceMesh &&
        !isMonitorMesh &&
        !isKeyboardMesh &&
        (nodeName.includes("plane") ||
          parentName.includes("plane") ||
          nodeName.includes("cube") ||
          parentName.includes("cube") ||
          nodeName.includes("cylinder") ||
          parentName.includes("cylinder") ||
          nodeName.includes("table") ||
          nodeName.includes("desk"));
      if (isLegacyDeskOrLeg) {
        child.visible = false;
      }
    }
  });

  const placement = computeLowPolyDeskPlacement(keyboardBounds, tableBounds);

  const existingDesk = character.getObjectByName(LOW_POLY_DESK_CONFIG.name);
  if (existingDesk) {
    character.remove(existingDesk);
  }

  const deskGroup = createLowPolyDeskGroup(placement);
  character.add(deskGroup);

  // Restore character transform
  character.position.copy(savedPos);
  character.rotation.copy(savedRot);
  character.scale.copy(savedScale);
  character.updateMatrixWorld(true);

  character.userData.lowPolyDeskPlacement = placement;
  return deskGroup;
}

export function createSceneNetworkNodesGroup(): THREE.Group {
  const networkGroup = new THREE.Group();
  networkGroup.name = "SceneBackgroundNetworkNodes";

  const nodeMap = new Map<string, THREE.Vector3>();
  const animatedNodes: Array<{
    coreMesh: THREE.Mesh;
    haloMesh: THREE.Mesh;
    coreMat: THREE.MeshStandardMaterial;
    haloMat: THREE.MeshStandardMaterial;
    pulseSpeed: number;
    phaseOffset: number;
    baseY: number;
  }> = [];

  SCENE_3D_NETWORK_NODES.forEach((node) => {
    const pos = new THREE.Vector3(node.x, node.y, node.z);
    nodeMap.set(node.id, pos);

    const isCyan = node.tone === "cyan";
    const coreColor = isCyan ? "#67e8f9" : "#d8b4fe";
    const emissiveHex = isCyan
      ? SCENE_BLOOM_CONFIG.tintCyan
      : SCENE_BLOOM_CONFIG.tintViolet;

    const coreMat = new THREE.MeshStandardMaterial({
      name: `scene_network_node_core_${node.id}`,
      color: new THREE.Color(coreColor),
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity:
        SCENE_BLOOM_CONFIG.accentEmissiveIntensity.networkNodeCore,
      roughness: 0.18,
      metalness: 0.1,
    });

    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(node.radius, 16, 16),
      coreMat
    );
    coreMesh.name = node.id;
    coreMesh.position.copy(pos);
    networkGroup.add(coreMesh);

    const haloMat = new THREE.MeshStandardMaterial({
      name: `scene_network_node_halo_${node.id}`,
      color: new THREE.Color(coreColor),
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity:
        SCENE_BLOOM_CONFIG.accentEmissiveIntensity.networkNodeHalo,
      transparent: true,
      opacity: 0.24,
      roughness: 0.3,
      metalness: 0.0,
      depthWrite: false,
    });

    const haloMesh = new THREE.Mesh(
      new THREE.SphereGeometry(node.radius * 2.1, 16, 16),
      haloMat
    );
    haloMesh.name = `${node.id}_halo`;
    haloMesh.position.copy(pos);
    networkGroup.add(haloMesh);

    animatedNodes.push({
      coreMesh,
      haloMesh,
      coreMat,
      haloMat,
      pulseSpeed: node.pulseSpeed,
      phaseOffset: node.phaseOffset,
      baseY: node.y,
    });
  });

  const animatedPulses: Array<{
    pulseMesh: THREE.Mesh;
    from: THREE.Vector3;
    to: THREE.Vector3;
    speed: number;
    offset: number;
  }> = [];

  SCENE_3D_NETWORK_EDGES.forEach((edge, idx) => {
    const from = nodeMap.get(edge.fromId);
    const to = nodeMap.get(edge.toId);
    if (!from || !to) return;

    const isCyan = edge.tone === "cyan";
    const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(
        isCyan ? SCENE_BLOOM_CONFIG.tintCyan : SCENE_BLOOM_CONFIG.tintViolet
      ),
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.name = edge.id;
    networkGroup.add(line);

    // Subtle traveling signal pulse on every second edge
    if (idx % 2 === 0) {
      const pulseMat = new THREE.MeshStandardMaterial({
        name: `scene_network_signal_${edge.id}`,
        color: new THREE.Color(isCyan ? "#a5f3fc" : "#e9d5ff"),
        emissive: new THREE.Color(
          isCyan ? SCENE_BLOOM_CONFIG.tintCyan : SCENE_BLOOM_CONFIG.tintViolet
        ),
        emissiveIntensity:
          SCENE_BLOOM_CONFIG.accentEmissiveIntensity.networkNodeCore,
        roughness: 0.15,
        metalness: 0.1,
      });
      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 10, 10),
        pulseMat
      );
      pulseMesh.name = `${edge.id}_pulse`;
      pulseMesh.position.copy(from);
      networkGroup.add(pulseMesh);

      animatedPulses.push({
        pulseMesh,
        from: from.clone(),
        to: to.clone(),
        speed: 0.18 + (idx % 3) * 0.04,
        offset: idx * 0.31,
      });
    }
  });

  networkGroup.userData.animatedNodes = animatedNodes;
  networkGroup.userData.animatedPulses = animatedPulses;
  return networkGroup;
}

export function updateSceneNetworkNodes(
  networkGroup: THREE.Group | null,
  elapsedSec: number,
  prefersReducedMotion: boolean = false
) {
  if (!networkGroup || prefersReducedMotion) return;

  const animatedNodes = networkGroup.userData.animatedNodes as
    | Array<{
        coreMesh: THREE.Mesh;
        haloMesh: THREE.Mesh;
        coreMat: THREE.MeshStandardMaterial;
        haloMat: THREE.MeshStandardMaterial;
        pulseSpeed: number;
        phaseOffset: number;
        baseY: number;
      }>
    | undefined;

  if (animatedNodes) {
    for (let i = 0; i < animatedNodes.length; i++) {
      const item = animatedNodes[i];
      const wave =
        0.5 + 0.5 * Math.sin(elapsedSec * item.pulseSpeed + item.phaseOffset);
      const scale = 0.88 + wave * 0.28;
      const driftY =
        Math.sin(elapsedSec * 0.55 + item.phaseOffset) * 0.045;

      item.coreMesh.scale.setScalar(scale);
      item.coreMesh.position.y = item.baseY + driftY;
      item.haloMesh.scale.setScalar(0.92 + wave * 0.34);
      item.haloMesh.position.y = item.baseY + driftY;

      item.coreMat.emissiveIntensity =
        SCENE_BLOOM_CONFIG.accentEmissiveIntensity.networkNodeCore *
        (0.84 + wave * 0.32);
      item.haloMat.opacity = 0.32 + wave * 0.36;
    }
  }

  const animatedPulses = networkGroup.userData.animatedPulses as
    | Array<{
        pulseMesh: THREE.Mesh;
        from: THREE.Vector3;
        to: THREE.Vector3;
        speed: number;
        offset: number;
      }>
    | undefined;

  if (animatedPulses) {
    for (let i = 0; i < animatedPulses.length; i++) {
      const pulse = animatedPulses[i];
      const t = (elapsedSec * pulse.speed + pulse.offset) % 1;
      pulse.pulseMesh.position.lerpVectors(pulse.from, pulse.to, t);
      const fade = Math.sin(t * Math.PI);
      pulse.pulseMesh.scale.setScalar(0.65 + fade * 0.55);
    }
  }
}

const CharacterModel = () => {
  return <Scene />;
};

export default CharacterModel;
