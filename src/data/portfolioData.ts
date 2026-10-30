export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type: "primary" | "secondary";
  description: string;
  disclaimer?: string;
  features: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  githubUrl?: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  score: string;
  details?: string;
}

export interface AchievementItem {
  title: string;
  organization: string;
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
}

export interface TechCategory {
  name: string;
  skills: string[];
}

export const PROFILE_INFO = {
  name: "Daksh Mehra",
  title: "AI & Data Science Student",
  headline: "AI & Data Science Student | Python Developer | Machine Learning Enthusiast",
  intro:
    "I build practical applications across artificial intelligence, machine learning, backend development, career technology, and desktop automation.",
  aboutPara:
    "I am an Artificial Intelligence & Data Science student at JECRC, Jaipur (CGPA: 8.47/10). Driven by a passion for software engineering, Python, and machine learning, I engineer complete applications that bridge intelligent algorithms, robust backend APIs, and responsive user interfaces. I love solving complex computational problems and continuously pushing the boundaries of what practical software can achieve.",
  email: "dakshmehra817@gmail.com",
  phone: "+91-9268903379",
  location: "Jaipur, Rajasthan, India",
  college: "Jaipur Engineering College & Research Centre (JECRC), Jaipur",
  degree: "B.Tech in Artificial Intelligence & Data Science",
  graduation: "2027",
  cgpa: "8.47 / 10",
  socials: {
    github: "https://github.com/daksh-mehra-12",
    linkedin: "https://www.linkedin.com/in/daksh-mehra/",
    leetcode: "https://leetcode.com/u/CkddHtBNWB/",
  },
  resumeUrl: "/Daksh_Mehra_Resume.pdf",
  resumeFilename: "Daksh_Mehra_Resume.pdf",
};

export const RESUME_FILE = {
  url: "/Daksh_Mehra_Resume.pdf",
  filename: "Daksh_Mehra_Resume.pdf",
  label: "Download CV",
};

export async function triggerResumeDownload(
  event?: { preventDefault?: () => void; stopPropagation?: () => void }
): Promise<boolean> {
  if (event?.preventDefault) {
    event.preventDefault();
  }
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const response = await fetch(RESUME_FILE.url, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Failed to fetch resume PDF: ${response.status}`);
    }
    const rawBlob = await response.blob();
    const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = RESUME_FILE.filename;
    link.rel = "noopener";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 3000);
    return true;
  } catch {
    const fallbackLink = document.createElement("a");
    fallbackLink.href = RESUME_FILE.url;
    fallbackLink.download = RESUME_FILE.filename;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.style.display = "none";
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    return false;
  }
}


export const PROJECTS: Project[] = [
  {
    id: "aarogya-x",
    title: "Aarogya X",
    subtitle: "AI-Powered Antimicrobial Resistance Decision Support System",
    category: "AI in Healthcare / Decision Support",
    type: "primary",
    description:
      "An academic healthcare decision-support research prototype designed for antimicrobial resistance risk prediction, infection-case management, antimicrobial stewardship, adverse drug reaction monitoring, and clinical analytics.",
    disclaimer:
      "Academic healthcare research prototype. Not a clinically validated diagnostic or treatment system; accuracy reflects experimental benchmark results.",
    features: [
      "Machine-learning-based AMR risk prediction",
      "Patient and infection-case management",
      "Clinical dashboards and resistance analytics",
      "Antimicrobial stewardship workflows",
      "Adverse drug reaction (ADR) monitoring",
      "Role-based access control (RBAC) and authentication",
      "Automated clinical PDF reporting",
    ],
    technologies: [
      "Python",
      "Flask",
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "SQLite",
      "SQLAlchemy",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Joblib",
      "ReportLab",
    ],
    githubUrl: "https://github.com/daksh-mehra-12/AarogyaX",
    image: "/images/placeholder.webp",
  },
  {
    id: "hirelogix",
    title: "HireLogix",
    subtitle: "AI-Powered Job Discovery, Resume Intelligence & Career Management",
    category: "Career Tech / Machine Learning & Full Stack",
    type: "primary",
    description:
      "An end-to-end career intelligence platform integrating multi-source job discovery, resume parsing, ATS scoring, keyword gap analysis, personalized recruiter outreach generation, and full application pipeline tracking.",
    features: [
      "Multi-source job discovery and aggregation",
      "Resume parsing and ATS intelligence analysis",
      "Job matching and keyword gap analysis",
      "Resume tailoring and optimization suggestions",
      "Personalized recruiter outreach and cover letter generation",
      "Kanban application pipeline tracking",
      "JWT authentication and user-level data isolation",
      "Interactive analytics career dashboard",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "Vite",
      "Tailwind CSS",
      "SQLAlchemy",
      "SQLite/PostgreSQL",
      "JWT",
      "bcrypt",
      "JobSpy",
      "BeautifulSoup",
      "Requests",
      "pypdf",
      "pdfplumber",
    ],
    githubUrl: "https://github.com/daksh-mehra-12/Hirelogix-",
    image: "/images/placeholder.webp",
  },
  {
    id: "nova-ai",
    title: "NOVA AI",
    subtitle: "Advanced Modular Desktop Voice Assistant",
    category: "Voice Assistant & Desktop Automation",
    type: "primary",
    description:
      "A modular desktop voice assistant empowering users with speech-controlled computer automation, intelligent audio processing, hardware monitoring, and everyday productivity utilities.",
    features: [
      "Speech recognition and natural text-to-speech engine",
      "Operating system and file-management automation",
      "Real-time CPU/RAM hardware monitoring",
      "Browser, search, and application launch controls",
      "Weather, live news, and Wikipedia integrations",
      "Productivity notes, reminders, to-do lists, and Pomodoro timers",
      "Camera capture and audio recording modules",
      "Integrated QR-code generation and desktop utility tools",
    ],
    technologies: [
      "Python",
      "Speech Recognition",
      "pyttsx3",
      "OpenCV",
      "sounddevice",
      "REST APIs",
      "Threading",
      "Windows Integration",
    ],
    githubUrl: "https://github.com/daksh-mehra-12/NOVA-AI",
    image: "/images/placeholder.webp",
  },
  {
    id: "programming-fundamentals",
    title: "Programming Fundamentals",
    subtitle: "Algorithms, Core Principles & Problem Solving",
    category: "Computer Science Foundations",
    type: "secondary",
    description:
      "A structured repository of foundational algorithms, data structures, and computational implementations in Python and Java focusing on clean code, recursion, and object-oriented design.",
    features: [
      "Algorithmic implementations & asymptotic analysis",
      "Object-oriented programming patterns",
      "Searching, sorting, and recursion techniques",
      "Clean modular code structure",
    ],
    technologies: ["Python", "Java", "OOP", "Algorithms", "Data Structures"],
    githubUrl: "https://github.com/daksh-mehra-12/Programming-Fundamentals",
  },
  {
    id: "dsa-extra-questions",
    title: "DSA Extra Questions",
    subtitle: "Advanced Data Structures & Problem Solving",
    category: "Competitive Programming",
    type: "secondary",
    description:
      "Curated solutions to challenging DSA problems spanning dynamic programming, graphs, trees, two-pointer approaches, and backtracking with documented time/space complexity.",
    features: [
      "Tree and graph traversal algorithms",
      "Dynamic programming & memoization",
      "Stack, queue, and linked list manipulations",
      "Optimized complexity solutions",
    ],
    technologies: ["DSA", "Problem Solving", "Python", "Java", "Algorithms"],
    githubUrl: "https://github.com/daksh-mehra-12/DSA-Extra-Questions-",
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "AI Project Intern",
    company: "JECRC Foundation | HireLogix",
    period: "February 2024 – May 2024",
    location: "Jaipur, Rajasthan, India",
    githubUrl: "https://github.com/daksh-mehra-12/Hirelogix-",
    responsibilities: [
      "Engineered backend microservices for HireLogix career intelligence platform using Python, FastAPI, and SQLAlchemy.",
      "Developed multi-source job discovery modules integrating JobSpy, BeautifulSoup, and Requests.",
      "Built automated resume parsing and ATS analysis pipeline with pypdf and pdfplumber.",
      "Implemented secure JWT authentication, bcrypt password hashing, and user-isolated database queries.",
      "Collaborated on responsive React/Vite frontend components with modern Tailwind CSS styling.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "React",
      "Vite",
      "Tailwind CSS",
      "JWT",
      "bcrypt",
      "JobSpy",
      "BeautifulSoup",
      "pypdf",
      "pdfplumber",
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "B.Tech — Artificial Intelligence & Data Science",
    institution: "JECRC Foundation, Jaipur",
    period: "2023 – 2027",
    score: "CGPA: 8.47 / 10",
    details:
      "Core curriculum in Machine Learning, Deep Learning, Data Analytics, DBMS, Operating Systems, Data Structures & Algorithms.",
  },
  {
    degree: "Class XII — CBSE",
    institution: "Bharat National Public School, Delhi",
    period: "2023",
    score: "67.33%",
    details: "Senior Secondary Education with focus on Science and Mathematics.",
  },
  {
    degree: "Class X — CBSE",
    institution: "Happy English School, Delhi",
    period: "2021",
    score: "85.5%",
    details: "Secondary School Examination with Distinction in Mathematics and Science.",
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    title: "Aayu '26 Hackathon — LabLens (Medical Report Decoder)",
    organization: "Aayu '26 Hackathon, Jodhpur",
    description:
      "Traveled to Jodhpur to compete on-site at Aayu '26 and built LabLens, an AI-powered clinical and laboratory report decoder that translates complex medical test metrics into clear, actionable health insights.",
  },
  {
    title: "Smart India Hackathon (SIH) Prelims Qualifier",
    organization: "Ministry of Education, Govt. of India",
    description:
      "Qualified the preliminary institutional rounds of India's largest innovation hackathon for solving real-world technological challenges.",
  },
  {
    title: "Top 4 Finalist — National Healthcare Hackathon (NHH 2.0)",
    organization: "JECRC University",
    description:
      "Achieved Top 4 standing among nationwide collegiate teams for prototyping an innovative healthcare decision-support technology solution.",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: "Salesforce Administrator & App Builder",
    issuer: "Simplilearn SkillUp",
  },
  {
    title: "Python SkillUp",
    issuer: "GeeksforGeeks",
  },
  {
    title: "Programming with Python",
    issuer: "Internshala",
  },
  {
    title: "Java Programming Fundamentals",
    issuer: "Infosys Springboard",
  },
];

export const TECH_CATEGORIES: TechCategory[] = [
  {
    name: "Programming",
    skills: ["Python", "Java", "SQL"],
  },
  {
    name: "Backend",
    skills: ["FastAPI", "Flask", "REST APIs", "SQLAlchemy"],
  },
  {
    name: "Frontend",
    skills: ["React", "TypeScript", "JavaScript", "Vite", "Tailwind CSS"],
  },
  {
    name: "AI & Data",
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "Data Analytics",
    ],
  },
  {
    name: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Postman", "OpenCV"],
  },
  {
    name: "Core Computer Science",
    skills: ["DSA", "OOP", "DBMS", "Operating Systems"],
  },
];

export type ProjectFilterCategory = "all" | "ai-python" | "primary" | "secondary";

export const FEATURED_TECH_TAGS: string[] = [
  "All",
  "Python",
  "Scikit-learn",
  "FastAPI",
  "Flask",
  "React",
  "Pandas",
  "SQLAlchemy",
  "OpenCV",
  "DSA",
];

export function filterProjects(
  projects: Project[],
  category: ProjectFilterCategory = "all",
  techTag: string = "All"
): Project[] {
  return projects.filter((project) => {
    const matchesCategory =
      category === "all"
        ? true
        : category === "ai-python"
        ? project.technologies.includes("Python") && project.type === "primary"
        : project.type === category;

    const matchesTech =
      !techTag || techTag === "All"
        ? true
        : project.technologies.some(
            (t) => t.toLowerCase() === techTag.toLowerCase() || t.toLowerCase().includes(techTag.toLowerCase())
          );

    return matchesCategory && matchesTech;
  });
}

export function shouldLazyRenderCard(
  projectId: string,
  observedMap: Record<string, boolean>,
  hasIntersectionObserverSupport: boolean = true
): boolean {
  if (!hasIntersectionObserverSupport) {
    return true;
  }
  return Boolean(observedMap[projectId]);
}

export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0 || !Number.isFinite(scrollTop) || scrollTop <= 0) {
    return 0;
  }
  const ratio = (scrollTop / maxScroll) * 100;
  return Math.max(0, Math.min(100, Number(ratio.toFixed(2))));
}

export interface SocialLinkItem {
  id: "linkedin" | "github" | "leetcode";
  label: string;
  handle: string;
  url: string;
  badge: string;
}

export function getRecruiterSocialLinks(): SocialLinkItem[] {
  return [
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "linkedin.com/in/daksh-mehra",
      url: PROFILE_INFO.socials.linkedin,
      badge: "Connect",
    },
    {
      id: "github",
      label: "GitHub",
      handle: "github.com/daksh-mehra-12",
      url: PROFILE_INFO.socials.github,
      badge: "Repositories",
    },
    {
      id: "leetcode",
      label: "LeetCode",
      handle: "leetcode.com/u/CkddHtBNWB",
      url: PROFILE_INFO.socials.leetcode,
      badge: "DSA Profile",
    },
  ];
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text || typeof window === "undefined") {
    return false;
  }
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below for iframe clipboard permissions
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function computeCarouselWheelScroll(
  currentScrollLeft: number,
  maxScrollLeft: number,
  deltaX: number,
  deltaY: number,
  deltaMode: number = 0
): { shouldIntercept: boolean; nextScrollLeft: number } {
  if (maxScrollLeft <= 0) {
    return { shouldIntercept: false, nextScrollLeft: 0 };
  }
  const modeMultiplier = deltaMode === 1 ? 36 : deltaMode === 2 ? 360 : 1;
  const scaledDeltaX = deltaX * modeMultiplier;
  const scaledDeltaY = deltaY * modeMultiplier;
  const primaryDelta =
    Math.abs(scaledDeltaX) > Math.abs(scaledDeltaY)
      ? scaledDeltaX
      : scaledDeltaY;
  if (Math.abs(primaryDelta) < 0.5) {
    return { shouldIntercept: false, nextScrollLeft: currentScrollLeft };
  }
  const canScrollRight =
    primaryDelta > 0 && currentScrollLeft < maxScrollLeft - 0.5;
  const canScrollLeft = primaryDelta < 0 && currentScrollLeft > 0.5;
  if (!canScrollRight && !canScrollLeft) {
    return { shouldIntercept: false, nextScrollLeft: currentScrollLeft };
  }
  const nextScrollLeft = Math.max(
    0,
    Math.min(maxScrollLeft, currentScrollLeft + primaryDelta * 1.25)
  );
  return { shouldIntercept: true, nextScrollLeft };
}

export function calculateCarouselScrollState(
  scrollLeft: number,
  maxScrollLeft: number,
  totalSlides: number
): { progressPercent: number; activeIndex: number } {
  if (totalSlides <= 1 || maxScrollLeft <= 0) {
    return { progressPercent: 100, activeIndex: 0 };
  }
  const clampedScroll = Math.max(0, Math.min(maxScrollLeft, scrollLeft));
  const ratio = clampedScroll / maxScrollLeft;
  const minPercent = 100 / totalSlides;
  const progressPercent = Number(
    (minPercent + ratio * (100 - minPercent)).toFixed(2)
  );
  const activeIndex = Math.min(
    totalSlides - 1,
    Math.max(0, Math.round(ratio * (totalSlides - 1)))
  );
  return { progressPercent, activeIndex };
}

export interface TerminalStackSequence {
  id: string;
  command: string;
  stackText: string;
  badge: string;
}

export const HERO_TERMINAL_STACK_SEQUENCES: TerminalStackSequence[] = [
  {
    id: "ai-ml",
    command: "python3 ai_engineer.py --stack",
    stackText: "Python • FastAPI • Scikit-Learn • Machine Learning",
    badge: "AI / ML",
  },
  {
    id: "backend-api",
    command: "uvicorn main:app --tech",
    stackText: "FastAPI • Flask • SQLAlchemy • REST APIs • JWT",
    badge: "Backend",
  },
  {
    id: "data-analytics",
    command: "python3 analytics_pipeline.py",
    stackText: "Pandas • NumPy • SQL • Data Analytics • OpenCV",
    badge: "Data Science",
  },
  {
    id: "fullstack-cs",
    command: "npm run build && g++ dsa.cpp",
    stackText: "React • TypeScript • Tailwind CSS • Java • DSA",
    badge: "Full Stack & CS",
  },
];

export interface TerminalTypingFrame {
  sequenceIndex: number;
  command: string;
  badge: string;
  displayedText: string;
  fullText: string;
  phase: "typing" | "pausing" | "deleting";
}

export function getTerminalTypingFrame(
  elapsedMs: number,
  sequences: TerminalStackSequence[] = HERO_TERMINAL_STACK_SEQUENCES,
  charTypeMs: number = 42,
  holdPauseMs: number = 1850,
  charDeleteMs: number = 20,
  betweenPauseMs: number = 280
): TerminalTypingFrame {
  if (!sequences.length) {
    return {
      sequenceIndex: 0,
      command: "",
      badge: "",
      displayedText: "",
      fullText: "",
      phase: "pausing",
    };
  }

  const safeElapsed = Math.max(0, elapsedMs);
  const durations = sequences.map((seq) => {
    const len = seq.stackText.length;
    const typeDuration = len * charTypeMs;
    const deleteDuration = len * charDeleteMs;
    return {
      len,
      typeDuration,
      deleteDuration,
      total: typeDuration + holdPauseMs + deleteDuration + betweenPauseMs,
    };
  });

  const totalCycleMs = durations.reduce((acc, d) => acc + d.total, 0);
  let cursorMs = totalCycleMs > 0 ? safeElapsed % totalCycleMs : 0;

  for (let i = 0; i < sequences.length; i++) {
    const seq = sequences[i];
    const d = durations[i];
    if (cursorMs < d.total || i === sequences.length - 1) {
      if (cursorMs < d.typeDuration) {
        const chars = Math.max(1, Math.min(d.len, Math.floor(cursorMs / charTypeMs) + 1));
        return {
          sequenceIndex: i,
          command: seq.command,
          badge: seq.badge,
          displayedText: seq.stackText.slice(0, chars),
          fullText: seq.stackText,
          phase: "typing",
        };
      }
      const afterType = cursorMs - d.typeDuration;
      if (afterType < holdPauseMs) {
        return {
          sequenceIndex: i,
          command: seq.command,
          badge: seq.badge,
          displayedText: seq.stackText,
          fullText: seq.stackText,
          phase: "pausing",
        };
      }
      const afterHold = afterType - holdPauseMs;
      if (afterHold < d.deleteDuration) {
        const deletedChars = Math.floor(afterHold / charDeleteMs);
        const remaining = Math.max(0, d.len - deletedChars);
        return {
          sequenceIndex: i,
          command: seq.command,
          badge: seq.badge,
          displayedText: seq.stackText.slice(0, remaining),
          fullText: seq.stackText,
          phase: "deleting",
        };
      }
      return {
        sequenceIndex: i,
        command: seq.command,
        badge: seq.badge,
        displayedText: "",
        fullText: seq.stackText,
        phase: "deleting",
      };
    }
    cursorMs -= d.total;
  }

  const first = sequences[0];
  return {
    sequenceIndex: 0,
    command: first.command,
    badge: first.badge,
    displayedText: first.stackText,
    fullText: first.stackText,
    phase: "pausing",
  };
}

export const AVATAR_THEME_PALETTE = {
  background: "#070810",
  innerShirtCharcoal: "#151722",
  innerCollarRib: "#11131D",
  bomberJacketNavy: "#101A2D",
  bomberRibMatteBlack: "#0B0D15",
  primaryViolet: "#A855F7",
  softLavender: "#C4A1FF",
  cyanAccent: "#35D6E7",
  naturalSkin: "#D8A483",
  headphonesMatteBlack: "#0D101A",
  headphonesCushion: "#141722",
} as const;

export type BomberTriangleGroup =
  | "inner_open_front"
  | "violet_stitch"
  | "matte_black_rib"
  | "midnight_navy_shell";

export function getBomberFrontOpeningHalfWidth(y: number): number {
  if (y > 11.72) {
    return 0.78;
  }
  return 0.35 + Math.max(0, (y - 8.4) * 0.048);
}

export function classifyBomberTriangleGroup(
  cx: number,
  cy: number,
  cz: number
): BomberTriangleGroup {
  const halfOpen = getBomberFrontOpeningHalfWidth(cy);
  if ((cz > -0.04 && Math.abs(cx) < halfOpen && cy > 7.18) || cy > 11.84) {
    return "inner_open_front";
  }
  if (
    (cz > 0.02 &&
      Math.abs(cx) >= halfOpen &&
      Math.abs(cx) < halfOpen + 0.072 &&
      cy > 7.42 &&
      cy <= 11.72) ||
    (cy > 10.65 && Math.abs(Math.abs(cx) - 1.35) < 0.052)
  ) {
    return "violet_stitch";
  }
  if (
    (cy > 11.38 && cy <= 11.84 && Math.abs(cx) < 1.12) ||
    Math.abs(cx) > 5.18 ||
    (cy < 7.36 && Math.abs(cx) < 1.42)
  ) {
    return "matte_black_rib";
  }
  return "midnight_navy_shell";
}

export interface AvatarCameraConfig {
  fov: number;
  positionY: number;
  positionZ: number;
  zoom: number;
}

export function getResponsiveAvatarCameraConfig(
  viewportWidth: number
): AvatarCameraConfig {
  if (!Number.isFinite(viewportWidth) || viewportWidth > 1024) {
    // Desktop balanced framing: upper-torso, hands, keyboard, and sleek low-poly desk centered cleanly between left/right text columns
    return {
      fov: 14.5,
      positionY: 10.85,
      positionZ: 43.5,
      zoom: 1.0,
    };
  }
  if (viewportWidth >= 768) {
    // Tablet framing inside dedicated 360px hero slot
    return {
      fov: 14.5,
      positionY: 10.9,
      positionZ: 39.0,
      zoom: 1.0,
    };
  }
  // Mobile framing inside dedicated 230px hero slot
  return {
    fov: 15.0,
    positionY: 10.9,
    positionZ: 37.5,
    zoom: 1.0,
  };
}

export interface BoundingBoxSummary {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface LowPolyDeskPlacement {
  topY: number;
  centerX: number;
  centerZ: number;
  legHeight: number;
}

export const LOW_POLY_DESK_CONFIG = {
  name: "LowPolyDeveloperDesk",
  width: 6.1,
  depth: 2.95,
  topThickness: 0.22,
  bevelApronHeight: 0.15,
  floorY: 3.36,
  defaultTopY: 8.48,
  defaultCenterX: 0.0,
  defaultCenterZ: 2.18,
  colors: {
    tabletopSlate: "#141D33",
    bevelApronDark: "#0D1322",
    deskMatCarbon: "#090D18",
    deskMatBorder: "#1E293B",
    legTitanium: "#18233C",
    crossbarSlate: "#101729",
    violetAccent: "#A855F7",
    cyanAccent: "#35D6E7",
  },
} as const;

export function computeLowPolyDeskPlacement(
  keyboardBounds?: BoundingBoxSummary | null,
  tableBounds?: BoundingBoxSummary | null
): LowPolyDeskPlacement {
  let topY: number = LOW_POLY_DESK_CONFIG.defaultTopY;
  if (
    keyboardBounds &&
    Number.isFinite(keyboardBounds.minY) &&
    keyboardBounds.minY >= 6.0 &&
    keyboardBounds.minY <= 9.8
  ) {
    topY = Number((keyboardBounds.minY - 0.02).toFixed(3));
  } else if (
    tableBounds &&
    Number.isFinite(tableBounds.maxY) &&
    tableBounds.maxY >= 6.0 &&
    tableBounds.maxY <= 9.8
  ) {
    topY = Number(tableBounds.maxY.toFixed(3));
  }

  let centerX: number = LOW_POLY_DESK_CONFIG.defaultCenterX;
  if (keyboardBounds && Number.isFinite(keyboardBounds.minX) && Number.isFinite(keyboardBounds.maxX)) {
    const kbMidX = (keyboardBounds.minX + keyboardBounds.maxX) * 0.5;
    if (kbMidX >= -1.8 && kbMidX <= 1.8) {
      centerX = Number(kbMidX.toFixed(3));
    }
  } else if (tableBounds && Number.isFinite(tableBounds.minX) && Number.isFinite(tableBounds.maxX)) {
    const tblMidX = (tableBounds.minX + tableBounds.maxX) * 0.5;
    if (tblMidX >= -1.8 && tblMidX <= 1.8) {
      centerX = Number(tblMidX.toFixed(3));
    }
  }

  let centerZ: number = LOW_POLY_DESK_CONFIG.defaultCenterZ;
  if (keyboardBounds && Number.isFinite(keyboardBounds.minZ) && Number.isFinite(keyboardBounds.maxZ)) {
    const kbMidZ = (keyboardBounds.minZ + keyboardBounds.maxZ) * 0.5;
    if (kbMidZ >= 0.5 && kbMidZ <= 4.5) {
      // Shift desk center slightly forward (+0.28) from keyboard center so both keyboard and monitor base sit comfortably on the desk
      centerZ = Number((kbMidZ + 0.28).toFixed(3));
    }
  } else if (tableBounds && Number.isFinite(tableBounds.minZ) && Number.isFinite(tableBounds.maxZ)) {
    const tblMidZ = (tableBounds.minZ + tableBounds.maxZ) * 0.5;
    if (tblMidZ >= 0.5 && tblMidZ <= 4.5) {
      centerZ = Number(tblMidZ.toFixed(3));
    }
  }

  const legHeight = Math.max(
    2.2,
    Number(
      (
        topY -
        LOW_POLY_DESK_CONFIG.topThickness -
        LOW_POLY_DESK_CONFIG.floorY
      ).toFixed(3)
    )
  );

  return {
    topY,
    centerX,
    centerZ,
    legHeight,
  };
}

export interface LiveBackgroundNode {
  id: string;
  cx: number;
  cy: number;
  r: number;
  tone: "violet" | "cyan";
  pulseDurationSec: number;
  pulseDelaySec: number;
}

export interface LiveBackgroundEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tone: "violet" | "cyan";
  hasSignal: boolean;
  signalDurationSec?: number;
  signalDelaySec?: number;
}

export interface LiveBackgroundParticle {
  id: string;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  tone: "violet" | "cyan";
  opacity: number;
  driftDurationSec: number;
  driftDelaySec: number;
}

export const LIVE_BACKGROUND_NODES: LiveBackgroundNode[] = [
  // Left Wing Constellation Nodes
  { id: "ln-1", cx: 90, cy: 180, r: 3.2, tone: "violet", pulseDurationSec: 5.4, pulseDelaySec: 0.2 },
  { id: "ln-2", cx: 210, cy: 250, r: 3.8, tone: "cyan", pulseDurationSec: 6.2, pulseDelaySec: 1.4 },
  { id: "ln-3", cx: 155, cy: 390, r: 2.8, tone: "violet", pulseDurationSec: 4.8, pulseDelaySec: 2.7 },
  { id: "ln-4", cx: 310, cy: 320, r: 3.4, tone: "cyan", pulseDurationSec: 6.8, pulseDelaySec: 0.9 },
  { id: "ln-5", cx: 275, cy: 490, r: 3.8, tone: "violet", pulseDurationSec: 5.9, pulseDelaySec: 3.1 },
  { id: "ln-6", cx: 75, cy: 540, r: 2.8, tone: "cyan", pulseDurationSec: 7.1, pulseDelaySec: 1.8 },
  { id: "ln-7", cx: 195, cy: 670, r: 3.2, tone: "violet", pulseDurationSec: 5.2, pulseDelaySec: 4.0 },
  { id: "ln-8", cx: 385, cy: 195, r: 2.6, tone: "violet", pulseDurationSec: 6.5, pulseDelaySec: 2.2 },
  // Right Wing Constellation Nodes
  { id: "rn-1", cx: 1340, cy: 165, r: 3.2, tone: "cyan", pulseDurationSec: 5.7, pulseDelaySec: 0.6 },
  { id: "rn-2", cx: 1210, cy: 245, r: 3.8, tone: "violet", pulseDurationSec: 6.4, pulseDelaySec: 1.9 },
  { id: "rn-3", cx: 1285, cy: 385, r: 2.8, tone: "cyan", pulseDurationSec: 5.1, pulseDelaySec: 3.3 },
  { id: "rn-4", cx: 1120, cy: 335, r: 3.4, tone: "violet", pulseDurationSec: 7.0, pulseDelaySec: 1.1 },
  { id: "rn-5", cx: 1165, cy: 510, r: 3.8, tone: "cyan", pulseDurationSec: 5.6, pulseDelaySec: 2.5 },
  { id: "rn-6", cx: 1365, cy: 555, r: 2.8, tone: "violet", pulseDurationSec: 6.9, pulseDelaySec: 0.4 },
  { id: "rn-7", cx: 1255, cy: 685, r: 3.2, tone: "cyan", pulseDurationSec: 5.5, pulseDelaySec: 3.7 },
  { id: "rn-8", cx: 1045, cy: 190, r: 2.6, tone: "cyan", pulseDurationSec: 6.3, pulseDelaySec: 2.9 },
];

export const LIVE_BACKGROUND_EDGES: LiveBackgroundEdge[] = [
  // Left Wing Edges
  { id: "le-1", x1: 90, y1: 180, x2: 210, y2: 250, tone: "violet", hasSignal: true, signalDurationSec: 6.5, signalDelaySec: 0.4 },
  { id: "le-2", x1: 210, y1: 250, x2: 155, y2: 390, tone: "violet", hasSignal: false },
  { id: "le-3", x1: 210, y1: 250, x2: 310, y2: 320, tone: "cyan", hasSignal: true, signalDurationSec: 7.2, signalDelaySec: 2.1 },
  { id: "le-4", x1: 210, y1: 250, x2: 385, y2: 195, tone: "violet", hasSignal: false },
  { id: "le-5", x1: 385, y1: 195, x2: 310, y2: 320, tone: "cyan", hasSignal: false },
  { id: "le-6", x1: 155, y1: 390, x2: 275, y2: 490, tone: "violet", hasSignal: true, signalDurationSec: 8.0, signalDelaySec: 1.3 },
  { id: "le-7", x1: 310, y1: 320, x2: 275, y2: 490, tone: "violet", hasSignal: false },
  { id: "le-8", x1: 155, y1: 390, x2: 75, y2: 540, tone: "cyan", hasSignal: false },
  { id: "le-9", x1: 275, y1: 490, x2: 195, y2: 670, tone: "cyan", hasSignal: true, signalDurationSec: 7.6, signalDelaySec: 3.5 },
  { id: "le-10", x1: 75, y1: 540, x2: 195, y2: 670, tone: "violet", hasSignal: false },
  // Right Wing Edges
  { id: "re-1", x1: 1340, y1: 165, x2: 1210, y2: 245, tone: "cyan", hasSignal: true, signalDurationSec: 6.8, signalDelaySec: 1.0 },
  { id: "re-2", x1: 1210, y1: 245, x2: 1285, y2: 385, tone: "cyan", hasSignal: false },
  { id: "re-3", x1: 1210, y1: 245, x2: 1120, y2: 335, tone: "violet", hasSignal: true, signalDurationSec: 7.4, signalDelaySec: 2.8 },
  { id: "re-4", x1: 1210, y1: 245, x2: 1045, y2: 190, tone: "cyan", hasSignal: false },
  { id: "re-5", x1: 1045, y1: 190, x2: 1120, y2: 335, tone: "violet", hasSignal: false },
  { id: "re-6", x1: 1285, y1: 385, x2: 1165, y2: 510, tone: "cyan", hasSignal: true, signalDurationSec: 8.2, signalDelaySec: 0.7 },
  { id: "re-7", x1: 1120, y1: 335, x2: 1165, y2: 510, tone: "cyan", hasSignal: false },
  { id: "re-8", x1: 1285, y1: 385, x2: 1365, y2: 555, tone: "violet", hasSignal: false },
  { id: "re-9", x1: 1165, y1: 510, x2: 1255, y2: 685, tone: "violet", hasSignal: true, signalDurationSec: 7.1, signalDelaySec: 4.1 },
  { id: "re-10", x1: 1365, y1: 555, x2: 1255, y2: 685, tone: "cyan", hasSignal: false },
];

export const LIVE_BACKGROUND_PARTICLES: LiveBackgroundParticle[] = [
  { id: "p-1", leftPercent: 8, topPercent: 22, sizePx: 2.2, tone: "violet", opacity: 0.36, driftDurationSec: 19, driftDelaySec: 0 },
  { id: "p-2", leftPercent: 14, topPercent: 64, sizePx: 1.8, tone: "cyan", opacity: 0.32, driftDurationSec: 23, driftDelaySec: 3 },
  { id: "p-3", leftPercent: 22, topPercent: 38, sizePx: 2.5, tone: "violet", opacity: 0.42, driftDurationSec: 21, driftDelaySec: 6 },
  { id: "p-4", leftPercent: 29, topPercent: 16, sizePx: 1.6, tone: "cyan", opacity: 0.28, driftDurationSec: 25, driftDelaySec: 2 },
  { id: "p-5", leftPercent: 34, topPercent: 74, sizePx: 2.0, tone: "violet", opacity: 0.34, driftDurationSec: 20, driftDelaySec: 8 },
  { id: "p-6", leftPercent: 41, topPercent: 28, sizePx: 1.5, tone: "cyan", opacity: 0.24, driftDurationSec: 26, driftDelaySec: 4 },
  { id: "p-7", leftPercent: 46, topPercent: 14, sizePx: 2.0, tone: "violet", opacity: 0.3, driftDurationSec: 22, driftDelaySec: 11 },
  { id: "p-8", leftPercent: 54, topPercent: 18, sizePx: 1.8, tone: "cyan", opacity: 0.28, driftDurationSec: 24, driftDelaySec: 5 },
  { id: "p-9", leftPercent: 59, topPercent: 31, sizePx: 1.6, tone: "violet", opacity: 0.25, driftDurationSec: 27, driftDelaySec: 9 },
  { id: "p-10", leftPercent: 66, topPercent: 72, sizePx: 2.2, tone: "cyan", opacity: 0.35, driftDurationSec: 18, driftDelaySec: 1 },
  { id: "p-11", leftPercent: 72, topPercent: 19, sizePx: 2.4, tone: "violet", opacity: 0.38, driftDurationSec: 22, driftDelaySec: 7 },
  { id: "p-12", leftPercent: 78, topPercent: 44, sizePx: 1.8, tone: "cyan", opacity: 0.32, driftDurationSec: 20, driftDelaySec: 12 },
  { id: "p-13", leftPercent: 85, topPercent: 68, sizePx: 2.2, tone: "violet", opacity: 0.36, driftDurationSec: 23, driftDelaySec: 4 },
  { id: "p-14", leftPercent: 91, topPercent: 26, sizePx: 1.9, tone: "cyan", opacity: 0.3, driftDurationSec: 21, driftDelaySec: 10 },
  { id: "p-15", leftPercent: 18, topPercent: 84, sizePx: 2.0, tone: "cyan", opacity: 0.28, driftDurationSec: 25, driftDelaySec: 6 },
  { id: "p-16", leftPercent: 82, topPercent: 82, sizePx: 2.1, tone: "violet", opacity: 0.3, driftDurationSec: 24, driftDelaySec: 2 },
];

export interface BackgroundParallaxOffsets {
  networkX: number;
  networkY: number;
  particlesX: number;
  particlesY: number;
  glowX: number;
  glowY: number;
}

export function computeBackgroundParallax(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
  prefersReducedMotion: boolean = false,
  isCoarsePointer: boolean = false
): BackgroundParallaxOffsets {
  if (
    prefersReducedMotion ||
    isCoarsePointer ||
    !Number.isFinite(viewportWidth) ||
    !Number.isFinite(viewportHeight) ||
    viewportWidth <= 0 ||
    viewportHeight <= 0
  ) {
    return {
      networkX: 0,
      networkY: 0,
      particlesX: 0,
      particlesY: 0,
      glowX: 0,
      glowY: 0,
    };
  }

  // Normalized cursor offset in [-1, 1]
  const normX = Math.max(-1, Math.min(1, (clientX / viewportWidth - 0.5) * 2));
  const normY = Math.max(-1, Math.min(1, (clientY / viewportHeight - 0.5) * 2));

  return {
    networkX: Number((-normX * 10).toFixed(2)),
    networkY: Number((-normY * 8).toFixed(2)),
    particlesX: Number((-normX * 15).toFixed(2)),
    particlesY: Number((-normY * 12).toFixed(2)),
    glowX: Number((normX * 8).toFixed(2)),
    glowY: Number((normY * 6).toFixed(2)),
  };
}

export interface SceneBloomParams {
  strength: number;
  radius: number;
  threshold: number;
  resolutionScale: number;
  accentEmissiveIntensity: {
    headphoneVioletRing: number;
    glassesAccent: number;
    bomberPiping: number;
    keyboardKeycaps: number;
    deskLedTrim: number;
    networkNodeCore: number;
    networkNodeHalo: number;
  };
}

export const SCENE_BLOOM_CONFIG = {
  defaultStrength: 0.22,
  reducedMotionStrength: 0.14,
  mobileStrength: 0.18,
  radius: 0.42,
  threshold: 0.68,
  tintCyan: "#35D6E7",
  tintViolet: "#A855F7",
  accentEmissiveIntensity: {
    headphoneVioletRing: 0.78,
    glassesAccent: 0.72,
    bomberPiping: 0.70,
    keyboardKeycaps: 0.74,
    deskLedTrim: 0.76,
    networkNodeCore: 0.85,
    networkNodeHalo: 0.72,
  },
} as const;

export function computeSceneBloomParams(
  viewportWidth: number,
  isSoftwareGl: boolean = false,
  prefersReducedMotion: boolean = false
): SceneBloomParams {
  const isMobile = Number.isFinite(viewportWidth) && viewportWidth > 0 && viewportWidth < 768;
  let strength: number = SCENE_BLOOM_CONFIG.defaultStrength;

  if (prefersReducedMotion) {
    strength = SCENE_BLOOM_CONFIG.reducedMotionStrength;
  } else if (isMobile) {
    strength = SCENE_BLOOM_CONFIG.mobileStrength;
  }

  const resolutionScale = isSoftwareGl ? 0.5 : isMobile ? 0.75 : 1.0;

  return {
    strength,
    radius: SCENE_BLOOM_CONFIG.radius,
    threshold: SCENE_BLOOM_CONFIG.threshold,
    resolutionScale,
    accentEmissiveIntensity: { ...SCENE_BLOOM_CONFIG.accentEmissiveIntensity },
  };
}

export interface Scene3DNetworkNode {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  tone: "cyan" | "violet";
  pulseSpeed: number;
  phaseOffset: number;
}

export interface Scene3DNetworkEdge {
  id: string;
  fromId: string;
  toId: string;
  tone: "cyan" | "violet";
}

export const SCENE_3D_NETWORK_NODES: Scene3DNetworkNode[] = [
  // Left background constellation cluster
  { id: "s3d-l1", x: -3.45, y: 13.55, z: -4.2, radius: 0.052, tone: "violet", pulseSpeed: 1.35, phaseOffset: 0.2 },
  { id: "s3d-l2", x: -2.48, y: 12.65, z: -3.8, radius: 0.058, tone: "cyan", pulseSpeed: 1.15, phaseOffset: 1.1 },
  { id: "s3d-l3", x: -3.65, y: 11.45, z: -4.5, radius: 0.048, tone: "cyan", pulseSpeed: 1.45, phaseOffset: 2.3 },
  { id: "s3d-l4", x: -2.62, y: 10.35, z: -3.9, radius: 0.055, tone: "violet", pulseSpeed: 1.25, phaseOffset: 3.4 },
  { id: "s3d-l5", x: -3.38, y: 9.25, z: -4.3, radius: 0.05, tone: "cyan", pulseSpeed: 1.5, phaseOffset: 4.2 },
  // Right background constellation cluster
  { id: "s3d-r1", x: 3.42, y: 13.6, z: -4.2, radius: 0.052, tone: "cyan", pulseSpeed: 1.3, phaseOffset: 0.7 },
  { id: "s3d-r2", x: 2.46, y: 12.6, z: -3.8, radius: 0.058, tone: "violet", pulseSpeed: 1.2, phaseOffset: 1.8 },
  { id: "s3d-r3", x: 3.62, y: 11.4, z: -4.5, radius: 0.048, tone: "violet", pulseSpeed: 1.4, phaseOffset: 2.9 },
  { id: "s3d-r4", x: 2.6, y: 10.3, z: -3.9, radius: 0.055, tone: "cyan", pulseSpeed: 1.18, phaseOffset: 3.9 },
  { id: "s3d-r5", x: 3.35, y: 9.2, z: -4.3, radius: 0.05, tone: "violet", pulseSpeed: 1.48, phaseOffset: 4.8 },
  // Upper distant constellation nodes
  { id: "s3d-c1", x: -1.65, y: 14.05, z: -4.6, radius: 0.044, tone: "cyan", pulseSpeed: 1.22, phaseOffset: 1.5 },
  { id: "s3d-c2", x: 1.65, y: 14.05, z: -4.6, radius: 0.044, tone: "violet", pulseSpeed: 1.28, phaseOffset: 2.6 },
];

export const SCENE_3D_NETWORK_EDGES: Scene3DNetworkEdge[] = [
  { id: "s3d-el1", fromId: "s3d-l1", toId: "s3d-l2", tone: "violet" },
  { id: "s3d-el2", fromId: "s3d-l2", toId: "s3d-l3", tone: "cyan" },
  { id: "s3d-el3", fromId: "s3d-l2", toId: "s3d-l4", tone: "cyan" },
  { id: "s3d-el4", fromId: "s3d-l3", toId: "s3d-l4", tone: "violet" },
  { id: "s3d-el5", fromId: "s3d-l4", toId: "s3d-l5", tone: "cyan" },
  { id: "s3d-el6", fromId: "s3d-l2", toId: "s3d-c1", tone: "cyan" },
  { id: "s3d-er1", fromId: "s3d-r1", toId: "s3d-r2", tone: "cyan" },
  { id: "s3d-er2", fromId: "s3d-r2", toId: "s3d-r3", tone: "violet" },
  { id: "s3d-er3", fromId: "s3d-r2", toId: "s3d-r4", tone: "violet" },
  { id: "s3d-er4", fromId: "s3d-r3", toId: "s3d-r4", tone: "cyan" },
  { id: "s3d-er5", fromId: "s3d-r4", toId: "s3d-r5", tone: "violet" },
  { id: "s3d-er6", fromId: "s3d-r2", toId: "s3d-c2", tone: "violet" },
  { id: "s3d-ec1", fromId: "s3d-c1", toId: "s3d-c2", tone: "cyan" },
];

export interface ContactFormInput {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactFormValidationResult {
  isValid: boolean;
  errors: ContactFormErrors;
}

const SIMPLE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(
  input: ContactFormInput
): ContactFormValidationResult {
  const errors: ContactFormErrors = {};
  const trimmedEmail = (input.email ?? "").trim();
  const trimmedMessage = (input.message ?? "").trim();

  if (!trimmedEmail) {
    errors.email = "Email address is required.";
  } else if (!SIMPLE_EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address (e.g., name@domain.com).";
  }

  if (!trimmedMessage) {
    errors.message = "Message cannot be empty.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Please enter a message of at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export type TimelineFilterCategory = "all" | "internship" | "education";

export interface TimelineMilestone {
  id: string;
  category: "internship" | "education";
  badgeLabel: string;
  title: string;
  organization: string;
  period: string;
  location?: string;
  score?: string;
  highlights: string[];
  technologies?: string[];
  githubUrl?: string;
}

export function getTopAiMlProjects(projects: Project[] = PROJECTS): Project[] {
  return projects.filter((project) => project.type === "primary");
}

export function getTimelineMilestones(
  filter: TimelineFilterCategory = "all",
  experiences: ExperienceItem[] = EXPERIENCES,
  educationList: EducationItem[] = EDUCATION
): TimelineMilestone[] {
  const internshipMilestones: TimelineMilestone[] = experiences.map(
    (exp, index) => ({
      id: `internship-${index + 1}`,
      category: "internship",
      badgeLabel: "Internship Experience",
      title: exp.role,
      organization: exp.company,
      period: exp.period,
      location: exp.location,
      highlights: exp.responsibilities,
      technologies: exp.technologies,
      githubUrl: exp.githubUrl,
    })
  );

  const educationMilestones: TimelineMilestone[] = educationList.map(
    (edu, index) => ({
      id: `education-${index + 1}`,
      category: "education",
      badgeLabel: "Educational Background",
      title: edu.degree,
      organization: edu.institution,
      period: edu.period,
      score: edu.score,
      highlights: edu.details ? [edu.details] : [],
      technologies:
        index === 0
          ? [
              "Machine Learning",
              "Deep Learning",
              "Data Science",
              "DSA",
              "DBMS",
              "Operating Systems",
            ]
          : undefined,
    })
  );

  // Interleave in chronological/priority order: B.Tech (2023-2027) & AI Project Intern (2024), followed by Class XII (2023) and Class X (2021)
  const combined: TimelineMilestone[] = [];
  if (internshipMilestones.length > 0) {
    combined.push(...internshipMilestones);
  }
  if (educationMilestones.length > 0) {
    combined.push(...educationMilestones);
  }

  if (filter === "internship") {
    return combined.filter((item) => item.category === "internship");
  }
  if (filter === "education") {
    return combined.filter((item) => item.category === "education");
  }
  return combined;
}

export interface MarqueeSkillItem {
  id: string;
  name: string;
  category: string;
  accent: "violet" | "cyan";
}

export const MARQUEE_SKILLS: MarqueeSkillItem[] = [
  { id: "python", name: "Python", category: "Core Language", accent: "cyan" },
  { id: "tensorflow", name: "TensorFlow", category: "Deep Learning", accent: "violet" },
  { id: "pytorch", name: "PyTorch", category: "Neural Networks", accent: "cyan" },
  { id: "sql", name: "SQL", category: "Database Query", accent: "violet" },
  { id: "scikit-learn", name: "Scikit-learn", category: "Machine Learning", accent: "cyan" },
  { id: "fastapi", name: "FastAPI", category: "Backend API", accent: "violet" },
  { id: "flask", name: "Flask", category: "Microservices", accent: "cyan" },
  { id: "pandas", name: "Pandas", category: "Data Engineering", accent: "violet" },
  { id: "numpy", name: "NumPy", category: "Scientific Computing", accent: "cyan" },
  { id: "react", name: "React", category: "Frontend UI", accent: "violet" },
  { id: "typescript", name: "TypeScript", category: "Type-Safe Web", accent: "cyan" },
  { id: "sqlalchemy", name: "SQLAlchemy", category: "ORM & Persistence", accent: "violet" },
  { id: "opencv", name: "OpenCV", category: "Computer Vision", accent: "cyan" },
  { id: "dsa", name: "Data Structures & Algorithms", category: "Core CS", accent: "violet" },
];

export function getMarqueeSkillsTrack(
  skills: MarqueeSkillItem[] = MARQUEE_SKILLS,
  repeatCount: number = 2
): MarqueeSkillItem[] {
  const safeRepeat = Math.max(1, Math.min(4, Math.floor(repeatCount)));
  const track: MarqueeSkillItem[] = [];
  for (let r = 0; r < safeRepeat; r++) {
    for (const item of skills) {
      track.push({
        ...item,
        id: `${item.id}-copy-${r + 1}`,
      });
    }
  }
  return track;
}


