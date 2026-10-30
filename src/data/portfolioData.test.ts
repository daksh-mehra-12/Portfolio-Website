import test from "node:test";
import assert from "node:assert/strict";
import {
  PROFILE_INFO,
  RESUME_FILE,
  PROJECTS,
  EXPERIENCES,
  EDUCATION,
  ACHIEVEMENTS,
  CERTIFICATIONS,
  TECH_CATEGORIES,
  FEATURED_TECH_TAGS,
  filterProjects,
  shouldLazyRenderCard,
  calculateScrollProgress,
  getRecruiterSocialLinks,
  computeCarouselWheelScroll,
  calculateCarouselScrollState,
  HERO_TERMINAL_STACK_SEQUENCES,
  getTerminalTypingFrame,
  AVATAR_THEME_PALETTE,
  classifyBomberTriangleGroup,
  getResponsiveAvatarCameraConfig,
  LOW_POLY_DESK_CONFIG,
  computeLowPolyDeskPlacement,
  LIVE_BACKGROUND_NODES,
  LIVE_BACKGROUND_EDGES,
  LIVE_BACKGROUND_PARTICLES,
  computeBackgroundParallax,
  SCENE_BLOOM_CONFIG,
  computeSceneBloomParams,
  SCENE_3D_NETWORK_NODES,
  SCENE_3D_NETWORK_EDGES,
  validateContactForm,
  getTopAiMlProjects,
  getTimelineMilestones,
  MARQUEE_SKILLS,
  getMarqueeSkillsTrack,
} from "./portfolioData";

test("getTerminalTypingFrame cycles through coding languages and tech stacks with typing, pause, and deleting phases", () => {
  assert.ok(HERO_TERMINAL_STACK_SEQUENCES.length >= 4);
  const firstSeq = HERO_TERMINAL_STACK_SEQUENCES[0];

  // Start of typing first sequence
  const f0 = getTerminalTypingFrame(0);
  assert.equal(f0.sequenceIndex, 0);
  assert.equal(f0.phase, "typing");
  assert.equal(f0.displayedText, firstSeq.stackText.slice(0, 1));

  // Mid-typing first sequence (after 10 chars * 42ms)
  const fMid = getTerminalTypingFrame(10 * 42);
  assert.equal(fMid.sequenceIndex, 0);
  assert.equal(fMid.phase, "typing");
  assert.equal(fMid.displayedText, firstSeq.stackText.slice(0, 11));

  // Hold pause phase when full stack string is visible
  const fullTypeTime = firstSeq.stackText.length * 42 + 200;
  const fHold = getTerminalTypingFrame(fullTypeTime);
  assert.equal(fHold.sequenceIndex, 0);
  assert.equal(fHold.phase, "pausing");
  assert.equal(fHold.displayedText, firstSeq.stackText);

  // Deleting phase
  const deleteTime = firstSeq.stackText.length * 42 + 1850 + 100;
  const fDel = getTerminalTypingFrame(deleteTime);
  assert.equal(fDel.sequenceIndex, 0);
  assert.equal(fDel.phase, "deleting");
  assert.ok(fDel.displayedText.length < firstSeq.stackText.length);
});

test("AVATAR_THEME_PALETTE and classifyBomberTriangleGroup separate inner charcoal shirt, midnight navy bomber jacket, matte black rib trim, and violet stitching", () => {
  assert.equal(AVATAR_THEME_PALETTE.innerShirtCharcoal, "#151722");
  assert.equal(AVATAR_THEME_PALETTE.bomberJacketNavy, "#101A2D");
  assert.equal(AVATAR_THEME_PALETTE.primaryViolet, "#A855F7");
  assert.equal(AVATAR_THEME_PALETTE.softLavender, "#C4A1FF");
  assert.equal(AVATAR_THEME_PALETTE.cyanAccent, "#35D6E7");

  // Center front chest -> inner charcoal crew-neck shirt opening
  assert.equal(classifyBomberTriangleGroup(0.0, 9.8, 0.35), "inner_open_front");
  // Front zipper placket edge -> restrained violet stitch trim
  assert.equal(classifyBomberTriangleGroup(0.44, 9.8, 0.35), "violet_stitch");
  // Stand-up bomber collar & wrist cuffs -> matte black rib trim
  assert.equal(classifyBomberTriangleGroup(0.65, 11.55, -0.2), "matte_black_rib");
  assert.equal(classifyBomberTriangleGroup(5.4, 9.5, 0.0), "matte_black_rib");
  // Outer chest / shoulder / sleeve -> midnight navy bomber shell
  assert.equal(classifyBomberTriangleGroup(1.05, 9.8, 0.28), "midnight_navy_shell");
});

test("Profile info contains authentic Daksh Mehra details and resume download config", () => {
  assert.equal(PROFILE_INFO.name, "Daksh Mehra");
  assert.equal(PROFILE_INFO.email, "dakshmehra817@gmail.com");
  assert.equal(PROFILE_INFO.phone, "+91-9268903379");
  assert.equal(PROFILE_INFO.degree, "B.Tech in Artificial Intelligence & Data Science");
  assert.equal(PROFILE_INFO.cgpa, "8.47 / 10");
  assert.equal(PROFILE_INFO.socials.github, "https://github.com/daksh-mehra-12");
  assert.equal(PROFILE_INFO.socials.linkedin, "https://www.linkedin.com/in/daksh-mehra/");
  assert.equal(PROFILE_INFO.socials.leetcode, "https://leetcode.com/u/CkddHtBNWB/");
  assert.equal(RESUME_FILE.url, "/Daksh_Mehra_Resume.pdf");
  assert.equal(RESUME_FILE.filename, "Daksh_Mehra_Resume.pdf");

  const socials = getRecruiterSocialLinks();
  assert.equal(socials.length, 3);
  assert.equal(socials[0].id, "linkedin");
  assert.equal(socials[1].id, "github");
  assert.equal(socials[2].id, "leetcode");
  assert.equal(socials[2].url, "https://leetcode.com/u/CkddHtBNWB/");
});

test("calculateScrollProgress computes bounded 0-100 scroll depth percentage", () => {
  assert.equal(calculateScrollProgress(0, 5000, 1000), 0);
  assert.equal(calculateScrollProgress(2000, 5000, 1000), 50);
  assert.equal(calculateScrollProgress(4000, 5000, 1000), 100);
  assert.equal(calculateScrollProgress(5500, 5000, 1000), 100);
  assert.equal(calculateScrollProgress(-50, 5000, 1000), 0);
  assert.equal(calculateScrollProgress(100, 1000, 1000), 0);
});

test("computeCarouselWheelScroll translates vertical and horizontal wheel deltas to left/right carousel movement until boundary", () => {
  // Scrolling right from the very start (scrollLeft = 0) with vertical wheel down (deltaY > 0)
  const fromStartRight = computeCarouselWheelScroll(0, 1200, 0, 120);
  assert.equal(fromStartRight.shouldIntercept, true);
  assert.equal(fromStartRight.nextScrollLeft, 150);

  const rightScroll = computeCarouselWheelScroll(100, 1200, 0, 100);
  assert.equal(rightScroll.shouldIntercept, true);
  assert.equal(rightScroll.nextScrollLeft, 225);

  const atRightEdge = computeCarouselWheelScroll(1200, 1200, 0, 100);
  assert.equal(atRightEdge.shouldIntercept, false);

  // Scrolling left from right edge (scrollLeft = 1200) with vertical wheel up (deltaY < 0)
  const fromRightEdgeLeft = computeCarouselWheelScroll(1200, 1200, 0, -120);
  assert.equal(fromRightEdgeLeft.shouldIntercept, true);
  assert.equal(fromRightEdgeLeft.nextScrollLeft, 1050);

  const atLeftEdge = computeCarouselWheelScroll(0, 1200, 0, -100);
  assert.equal(atLeftEdge.shouldIntercept, false);

  const leftScroll = computeCarouselWheelScroll(400, 1200, 0, -100);
  assert.equal(leftScroll.shouldIntercept, true);
  assert.equal(leftScroll.nextScrollLeft, 275);

  // Supports horizontal trackpad/tilt wheel deltaX and line deltaMode (deltaMode = 1)
  const horizontalWheel = computeCarouselWheelScroll(200, 1200, 80, 10);
  assert.equal(horizontalWheel.shouldIntercept, true);
  assert.equal(horizontalWheel.nextScrollLeft, 300);

  const lineModeWheel = computeCarouselWheelScroll(0, 1200, 0, 3, 1);
  assert.equal(lineModeWheel.shouldIntercept, true);
  assert.equal(lineModeWheel.nextScrollLeft, 135);
});

test("calculateCarouselScrollState maps scrollLeft across 0..maxScrollLeft to 20%..100% and 0..totalSlides-1", () => {
  const start = calculateCarouselScrollState(0, 1000, 5);
  assert.equal(start.progressPercent, 20);
  assert.equal(start.activeIndex, 0);

  const middle = calculateCarouselScrollState(500, 1000, 5);
  assert.equal(middle.progressPercent, 60);
  assert.equal(middle.activeIndex, 2);

  const end = calculateCarouselScrollState(1000, 1000, 5);
  assert.equal(end.progressPercent, 100);
  assert.equal(end.activeIndex, 4);
});

test("shouldLazyRenderCard gates project card visuals until observed by IntersectionObserver", () => {
  const observed: Record<string, boolean> = { "aarogya-x": true };
  assert.equal(shouldLazyRenderCard("aarogya-x", observed, true), true);
  assert.equal(shouldLazyRenderCard("hirelogix", observed, true), false);
  assert.equal(shouldLazyRenderCard("hirelogix", observed, false), true);
});

test("Projects contains verified 3 primary projects and 2 secondary projects", () => {
  assert.equal(PROJECTS.length, 5);
  const primary = PROJECTS.filter((p) => p.type === "primary");
  assert.equal(primary.length, 3);

  const aarogya = PROJECTS.find((p) => p.id === "aarogya-x");
  assert.ok(aarogya, "Aarogya X must be present");
  assert.match(aarogya.disclaimer || "", /Academic healthcare research prototype/i);
  assert.ok(aarogya.technologies.includes("Python"));
  assert.ok(aarogya.technologies.includes("Scikit-learn"));

  const hirelogix = PROJECTS.find((p) => p.id === "hirelogix");
  assert.ok(hirelogix, "HireLogix must be present");
  assert.ok(hirelogix.technologies.includes("FastAPI"));

  const nova = PROJECTS.find((p) => p.id === "nova-ai");
  assert.ok(nova, "NOVA AI must be present");
  assert.ok(nova.technologies.includes("pyttsx3"));
});

test("filterProjects filters by category and technology tags accurately", () => {
  assert.equal(filterProjects(PROJECTS, "all", "All").length, 5);
  assert.equal(filterProjects(PROJECTS, "ai-python", "All").length, 3);
  assert.equal(filterProjects(PROJECTS, "secondary", "All").length, 2);

  const scikitProjects = filterProjects(PROJECTS, "all", "Scikit-learn");
  assert.equal(scikitProjects.length, 1);
  assert.equal(scikitProjects[0].id, "aarogya-x");

  const fastApiProjects = filterProjects(PROJECTS, "all", "FastAPI");
  assert.equal(fastApiProjects.length, 1);
  assert.equal(fastApiProjects[0].id, "hirelogix");

  const pythonProjects = filterProjects(PROJECTS, "all", "Python");
  assert.equal(pythonProjects.length, 5);

  assert.ok(FEATURED_TECH_TAGS.includes("Python"));
  assert.ok(FEATURED_TECH_TAGS.includes("Scikit-learn"));
  assert.ok(FEATURED_TECH_TAGS.includes("FastAPI"));
});

test("Experience has HireLogix / JECRC internship with verified technologies", () => {
  assert.equal(EXPERIENCES.length, 1);
  const intern = EXPERIENCES[0];
  assert.equal(intern.role, "AI Project Intern");
  assert.match(intern.company, /HireLogix/);
  assert.match(intern.period, /February 2024/);
  assert.ok(intern.technologies.includes("FastAPI"));
  assert.ok(intern.technologies.includes("SQLAlchemy"));
});

test("Education records match verified academic credentials", () => {
  assert.equal(EDUCATION.length, 3);
  assert.match(EDUCATION[0].score, /8.47/);
  assert.match(EDUCATION[1].institution, /Bharat National Public School/);
  assert.match(EDUCATION[2].institution, /Happy English School/);
});

test("Achievements and Certifications are properly separated and verified", () => {
  assert.equal(ACHIEVEMENTS.length, 3);
  assert.ok(ACHIEVEMENTS.some((a) => a.title.includes("Aayu '26") && a.title.includes("LabLens")));
  assert.ok(ACHIEVEMENTS.some((a) => a.organization.includes("Jodhpur")));
  assert.ok(ACHIEVEMENTS.some((a) => a.title.includes("Smart India Hackathon")));
  assert.ok(ACHIEVEMENTS.some((a) => a.title.includes("National Healthcare Hackathon")));

  assert.equal(CERTIFICATIONS.length, 4);
  assert.ok(CERTIFICATIONS.some((c) => c.issuer.includes("Simplilearn")));
  assert.ok(CERTIFICATIONS.some((c) => c.issuer.includes("GeeksforGeeks")));
});

test("Tech categories cover all 6 required skill groups", () => {
  const categoryNames = TECH_CATEGORIES.map((c) => c.name);
  assert.ok(categoryNames.includes("Programming"));
  assert.ok(categoryNames.includes("Backend"));
  assert.ok(categoryNames.includes("Frontend"));
  assert.ok(categoryNames.includes("AI & Data"));
  assert.ok(categoryNames.includes("Tools"));
  assert.ok(categoryNames.includes("Core Computer Science"));
});

test("No placeholder or previous owner text exists in data", () => {
  const rawData = JSON.stringify({
    PROFILE_INFO,
    PROJECTS,
    EXPERIENCES,
    EDUCATION,
    ACHIEVEMENTS,
    CERTIFICATIONS,
    TECH_CATEGORIES,
  });

  assert.ok(!rawData.includes("Moncy"), "Should not contain 'Moncy'");
  assert.ok(!rawData.includes("Yohannan"), "Should not contain 'Yohannan'");
  assert.ok(!rawData.includes("Lorem ipsum"), "Should not contain 'Lorem ipsum'");
  assert.ok(!rawData.includes("example@mail.com"), "Should not contain 'example@mail.com'");
  assert.ok(!rawData.includes("99999999"), "Should not contain dummy phone");
});

test("getResponsiveAvatarCameraConfig returns balanced framing across desktop, tablet, and mobile", () => {
  const desktop = getResponsiveAvatarCameraConfig(1440);
  assert.equal(desktop.fov, 14.5);
  assert.equal(desktop.positionY, 10.85);
  assert.equal(desktop.positionZ, 43.5);
  assert.equal(desktop.zoom, 1.0);

  const tablet = getResponsiveAvatarCameraConfig(768);
  assert.equal(tablet.fov, 14.5);
  assert.equal(tablet.positionY, 10.9);
  assert.equal(tablet.positionZ, 39.0);

  const mobile = getResponsiveAvatarCameraConfig(390);
  assert.equal(mobile.fov, 15.0);
  assert.equal(mobile.positionY, 10.9);
  assert.equal(mobile.positionZ, 37.5);
});

test("computeLowPolyDeskPlacement calculates sleek low-poly desk position beneath the avatar keyboard and table", () => {
  assert.equal(LOW_POLY_DESK_CONFIG.name, "LowPolyDeveloperDesk");
  assert.equal(LOW_POLY_DESK_CONFIG.colors.tabletopSlate, "#141D33");
  assert.equal(LOW_POLY_DESK_CONFIG.colors.violetAccent, "#A855F7");
  assert.equal(LOW_POLY_DESK_CONFIG.colors.cyanAccent, "#35D6E7");

  const fallback = computeLowPolyDeskPlacement(null, null);
  assert.equal(fallback.topY, 8.48);
  assert.equal(fallback.centerX, 0);
  assert.equal(fallback.centerZ, 2.18);
  assert.ok(fallback.legHeight > 4.5);

  const aligned = computeLowPolyDeskPlacement(
    { minX: -1.1, maxX: 1.1, minY: 8.52, maxY: 8.72, minZ: 1.4, maxZ: 2.4 },
    { minX: -2.8, maxX: 2.8, minY: 8.2, maxY: 8.5, minZ: 0.9, maxZ: 3.3 }
  );
  assert.equal(aligned.topY, 8.5);
  assert.equal(aligned.centerX, 0);
  assert.equal(aligned.centerZ, 2.18);
  assert.equal(aligned.legHeight, 4.92);
});

test("Live background configuration defines staggered nodes, signal edges, and sparse particles", () => {
  assert.equal(LIVE_BACKGROUND_NODES.length, 16);
  assert.ok(LIVE_BACKGROUND_NODES.some((n) => n.tone === "violet"));
  assert.ok(LIVE_BACKGROUND_NODES.some((n) => n.tone === "cyan"));

  assert.equal(LIVE_BACKGROUND_EDGES.length, 20);
  const signalEdges = LIVE_BACKGROUND_EDGES.filter((e) => e.hasSignal);
  assert.equal(signalEdges.length, 8);
  assert.ok(signalEdges.every((e) => (e.signalDurationSec ?? 0) >= 6));

  assert.equal(LIVE_BACKGROUND_PARTICLES.length, 16);
  assert.ok(LIVE_BACKGROUND_PARTICLES.every((p) => p.opacity <= 0.45 && p.driftDurationSec >= 18));
});

test("computeBackgroundParallax computes restrained cursor parallax and respects prefers-reduced-motion and touch devices", () => {
  // Center of viewport -> 0 offset
  const center = computeBackgroundParallax(720, 450, 1440, 900, false, false);
  assert.equal(center.networkX, 0);
  assert.equal(center.networkY, 0);
  assert.equal(center.particlesX, 0);
  assert.equal(center.particlesY, 0);

  // Top-left corner -> positive network/particle shift, negative glow shift within bounds
  const topLeft = computeBackgroundParallax(0, 0, 1440, 900, false, false);
  assert.equal(topLeft.networkX, 10);
  assert.equal(topLeft.networkY, 8);
  assert.equal(topLeft.particlesX, 15);
  assert.equal(topLeft.particlesY, 12);
  assert.equal(topLeft.glowX, -8);
  assert.equal(topLeft.glowY, -6);

  // Reduced motion -> all zero
  const reduced = computeBackgroundParallax(100, 100, 1440, 900, true, false);
  assert.equal(reduced.networkX, 0);
  assert.equal(reduced.particlesX, 0);
  assert.equal(reduced.glowX, 0);

  // Coarse pointer (touch device) -> all zero
  const touch = computeBackgroundParallax(100, 100, 1440, 900, false, true);
  assert.equal(touch.networkX, 0);
  assert.equal(touch.particlesX, 0);
  assert.equal(touch.glowX, 0);
});

test("computeSceneBloomParams configures subtle bloom threshold and emissive intensities for cyan and violet accents and 3D network nodes", () => {
  assert.equal(SCENE_BLOOM_CONFIG.tintCyan, "#35D6E7");
  assert.equal(SCENE_BLOOM_CONFIG.tintViolet, "#A855F7");
  assert.ok(SCENE_BLOOM_CONFIG.threshold >= 0.5 && SCENE_BLOOM_CONFIG.threshold <= 0.75);

  const desktopParams = computeSceneBloomParams(1440, false, false);
  assert.equal(desktopParams.strength, 0.22);
  assert.equal(desktopParams.radius, 0.42);
  assert.equal(desktopParams.threshold, 0.68);
  assert.equal(desktopParams.resolutionScale, 1.0);
  assert.ok(desktopParams.accentEmissiveIntensity.headphoneVioletRing > desktopParams.threshold);
  assert.ok(desktopParams.accentEmissiveIntensity.deskLedTrim > desktopParams.threshold);
  assert.ok(desktopParams.accentEmissiveIntensity.networkNodeCore > desktopParams.threshold);

  const mobileParams = computeSceneBloomParams(390, false, false);
  assert.equal(mobileParams.strength, 0.18);
  assert.equal(mobileParams.resolutionScale, 0.75);

  const softwareParams = computeSceneBloomParams(1440, true, true);
  assert.equal(softwareParams.strength, 0.14);
  assert.equal(softwareParams.resolutionScale, 0.5);

  assert.equal(SCENE_3D_NETWORK_NODES.length, 12);
  assert.ok(SCENE_3D_NETWORK_NODES.some((n) => n.tone === "cyan"));
  assert.ok(SCENE_3D_NETWORK_NODES.some((n) => n.tone === "violet"));
  assert.equal(SCENE_3D_NETWORK_EDGES.length, 13);
});

test("validateContactForm validates email and message fields accurately", () => {
  // Empty email and message
  const emptyResult = validateContactForm({ email: "", message: "" });
  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.email?.includes("required"));
  assert.ok(emptyResult.errors.message?.includes("empty"));

  // Invalid email format and too-short message
  const invalidResult = validateContactForm({
    email: "invalid-email",
    message: "Too short",
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.email?.includes("valid email"));
  assert.ok(invalidResult.errors.message?.includes("10 characters"));

  // Valid email and message
  const validResult = validateContactForm({
    name: "Recruiter",
    email: "recruiter@company.com",
    subject: "AI Engineer Role",
    message: "Hi Daksh, we would like to schedule an interview with you.",
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test("getTopAiMlProjects returns top AI/ML projects with descriptions, technology stacks, and GitHub links without liveUrl", () => {
  const topAiProjects = getTopAiMlProjects();
  assert.equal(topAiProjects.length, 3);
  for (const project of PROJECTS) {
    assert.ok(project.description.length > 20, `${project.title} must have a description`);
    assert.ok(project.technologies.length >= 4, `${project.title} must list its technology stack`);
    assert.equal(project.liveUrl, undefined, `${project.title} should not have a liveUrl since it is not deployed`);
    assert.ok(project.githubUrl && project.githubUrl.startsWith("https://"), `${project.title} must have a githubUrl`);
  }
});

test("getTimelineMilestones combines internship experiences and educational background for the vertical timeline", () => {
  const allMilestones = getTimelineMilestones("all");
  assert.equal(allMilestones.length, 4);

  const internships = getTimelineMilestones("internship");
  assert.equal(internships.length, 1);
  assert.equal(internships[0].category, "internship");
  assert.equal(internships[0].title, "AI Project Intern");
  assert.match(internships[0].organization, /HireLogix/);
  assert.ok(internships[0].technologies?.includes("FastAPI"));

  const educationItems = getTimelineMilestones("education");
  assert.equal(educationItems.length, 3);
  assert.equal(educationItems[0].category, "education");
  assert.match(educationItems[0].title, /Artificial Intelligence & Data Science/);
  assert.match(educationItems[0].score || "", /8.47/);
});

test("MARQUEE_SKILLS and getMarqueeSkillsTrack include Python, TensorFlow, PyTorch, and SQL and duplicate track seamlessly", () => {
  const names = MARQUEE_SKILLS.map((s) => s.name);
  assert.ok(names.includes("Python"));
  assert.ok(names.includes("TensorFlow"));
  assert.ok(names.includes("PyTorch"));
  assert.ok(names.includes("SQL"));

  const track = getMarqueeSkillsTrack(MARQUEE_SKILLS, 2);
  assert.equal(track.length, MARQUEE_SKILLS.length * 2);
  assert.equal(track[0].name, "Python");
  assert.equal(track[MARQUEE_SKILLS.length].name, "Python");
});



