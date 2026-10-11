export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Creative UI" | "Micro-Tools" | "Visual Experiments";
  status: "Live Craft" | "Interactive" | "Experiment";
  tags: string[];
  gradient: {
    from: string;
    via?: string;
    to: string;
  };
  features: string[];
}

export const CATEGORIES = [
  "All",
  "Creative UI",
  "Micro-Tools",
  "Visual Experiments",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PROJECTS: Project[] = [
  {
    id: "mesh-gradient-studio",
    slug: "mesh-gradient-studio",
    title: "Mesh Gradient Studio",
    tagline: "Generate and tweak fluid, atmospheric CSS mesh backdrops in real-time.",
    description:
      "A tactile interactive playground allowing you to manipulate chromatic gradient points, adjust Gaussian blurs, and instantly copy clean CSS code for modern web interfaces.",
    category: "Creative UI",
    status: "Live Craft",
    tags: ["CSS Gradients", "Canvas", "React 19"],
    gradient: {
      from: "from-sky-400/90",
      via: "via-indigo-500/80",
      to: "to-blue-600/90",
    },
    features: [
      "Real-time interactive color nodes",
      "Dynamic blur & spread controls",
      "One-click CSS code export",
    ],
  },
  {
    id: "type-scale-visualizer",
    slug: "type-scale-visualizer",
    title: "TypeScale Visualizer",
    tagline: "Harmonious typographic hierarchy calculator with live preview testing.",
    description:
      "A modular ratio scale tester for web typography. Preview headings, body text, and line-heights dynamically using golden ratio, major third, and perfect fourth scales.",
    category: "Micro-Tools",
    status: "Interactive",
    tags: ["Typography", "Design System", "Next.js 16"],
    gradient: {
      from: "from-blue-500/90",
      via: "via-cyan-400/80",
      to: "to-teal-500/90",
    },
    features: [
      "Modular ratio presets (Golden Ratio, Major Third, etc.)",
      "Live sample text editor",
      "Tailwind font size config generator",
    ],
  },
  {
    id: "particle-wave",
    slug: "particle-wave",
    title: "Particle Wave Canvas",
    tagline: "Interactive mathematical wave simulation reacting to cursor physics.",
    description:
      "An ethereal 2D particle field simulating organic fluid dynamics and sinusoidal wave interferences in real-time. Move your mouse or touch the canvas to ripple the flow.",
    category: "Visual Experiments",
    status: "Live Craft",
    tags: ["HTML5 Canvas", "Physics Simulation", "Generative"],
    gradient: {
      from: "from-cyan-400/90",
      via: "via-blue-600/80",
      to: "to-slate-800/90",
    },
    features: [
      "Physics-based cursor turbulence",
      "Adjustable wave frequency & speed",
      "Silky 60FPS canvas renderer",
    ],
  },
  {
    id: "ambient-lofi-beats",
    slug: "ambient-lofi-beats",
    title: "Ambient Atmosphere Generator",
    tagline: "Soothing procedural soundscape generator for deep focus and coding.",
    description:
      "A minimalist in-browser sound synthesizer creating soothing ambient audio environments — layering soft rain, vinyl warmth, gentle cafe murmurs, and breeze frequencies.",
    category: "Micro-Tools",
    status: "Live Craft",
    tags: ["Web Audio API", "Synthesizer", "Sound Design"],
    gradient: {
      from: "from-indigo-400/90",
      via: "via-sky-500/80",
      to: "to-blue-700/90",
    },
    features: [
      "Layered multi-channel audio tracks",
      "Independent channel volume sliders",
      "Zero external audio assets (pure Web Audio nodes)",
    ],
  },
  {
    id: "glass-credit-card",
    slug: "glass-credit-card",
    title: "Glassmorphism 3D Tilt Card",
    tagline: "Tactile gyroscope and mouse-reactive 3D glass card with holographic sheen.",
    description:
      "A hyper-realistic glassmorphism card component with dynamic light reflections, specular highlight glare, and 3D gyroscope tilt effect on hover.",
    category: "Creative UI",
    status: "Interactive",
    tags: ["CSS 3D Transforms", "Glassmorphism", "Micro-Interactions"],
    gradient: {
      from: "from-sky-300/90",
      via: "via-blue-500/80",
      to: "to-cyan-600/90",
    },
    features: [
      "3D perspective cursor tracking",
      "Dynamic holographic glare sheen",
      "Flip card interaction",
    ],
  },
  {
    id: "svg-blob-generator",
    slug: "svg-blob-generator",
    title: "Organic SVG Blob Sculptor",
    tagline: "Sculpt customizable organic SVG shapes and fluid vector blobs.",
    description:
      "Generate silky organic vector shapes with smooth bezier curves. Adjust complexity, randomness, and gradients with live export to pure SVG and React JSX.",
    category: "Visual Experiments",
    status: "Interactive",
    tags: ["SVG Curves", "Vector Art", "Generative"],
    gradient: {
      from: "from-teal-400/90",
      via: "via-sky-500/80",
      to: "to-indigo-500/90",
    },
    features: [
      "Adjustable complexity and roundness",
      "Random seed generator with smooth transitions",
      "Instant SVG markup copy",
    ],
  },
];
